import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Database, 
  Trash2, 
  Shield, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Play,
  Pause,
  Calendar,
  FileText
} from 'lucide-react';

interface RetentionPolicy {
  id: string;
  name: string;
  description: string;
  dataCategory: string;
  retentionPeriod: number;
  retentionUnit: 'days' | 'months' | 'years';
  triggerEvent: 'consent_withdrawal' | 'account_closure' | 'service_termination' | 'data_creation' | 'last_activity';
  autoDelete: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastExecuted?: Date;
  recordsAffected: number;
  exemptions: string[];
}

interface RetentionExemption {
  id: string;
  name: string;
  description: string;
  legalBasis: string;
  dataCategories: string[];
  exemptionPeriod?: number;
  exemptionUnit?: 'days' | 'months' | 'years';
  isActive: boolean;
  createdAt: Date;
}

interface DeletionLog {
  id: string;
  policyId: string;
  policyName: string;
  recordsDeleted: number;
  dataCategory: string;
  deletionDate: Date;
  triggerReason: string;
  executedBy: string;
  status: 'completed' | 'failed' | 'partial';
  errorDetails?: string;
}

interface PendingDeletion {
  id: string;
  policyId: string;
  policyName: string;
  recordCount: number;
  scheduledDate: Date;
  dataCategory: string;
  triggerEvent: string;
  canCancel: boolean;
}

const DATA_CATEGORIES = [
  'personal_identifiers',
  'contact_information',
  'financial_data',
  'behavioral_data',
  'technical_data',
  'consent_records',
  'audit_logs',
  'communication_logs'
];

const TRIGGER_EVENTS = [
  { value: 'consent_withdrawal', label: 'Consent Withdrawal', description: 'When user withdraws consent' },
  { value: 'account_closure', label: 'Account Closure', description: 'When user closes their account' },
  { value: 'service_termination', label: 'Service Termination', description: 'When service is terminated' },
  { value: 'data_creation', label: 'Data Creation', description: 'From the date data was created' },
  { value: 'last_activity', label: 'Last Activity', description: 'From the last user activity' }
];

export const DataRetentionPolicies: React.FC = () => {
  const [policies, setPolicies] = useState<RetentionPolicy[]>([
    {
      id: 'policy_1',
      name: 'Consent Records Retention',
      description: 'Retention policy for consent records after withdrawal',
      dataCategory: 'consent_records',
      retentionPeriod: 3,
      retentionUnit: 'years',
      triggerEvent: 'consent_withdrawal',
      autoDelete: true,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      lastExecuted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      recordsAffected: 1247,
      exemptions: ['legal_hold_1']
    },
    {
      id: 'policy_2',
      name: 'Personal Data Cleanup',
      description: 'Delete personal identifiers after account closure',
      dataCategory: 'personal_identifiers',
      retentionPeriod: 30,
      retentionUnit: 'days',
      triggerEvent: 'account_closure',
      autoDelete: false,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      recordsAffected: 856,
      exemptions: []
    }
  ]);

  const [exemptions, setExemptions] = useState<RetentionExemption[]>([
    {
      id: 'legal_hold_1',
      name: 'Legal Investigation Hold',
      description: 'Data retention for ongoing legal investigation',
      legalBasis: 'Legal obligation under investigation',
      dataCategories: ['consent_records', 'audit_logs'],
      exemptionPeriod: 5,
      exemptionUnit: 'years',
      isActive: true,
      createdAt: new Date('2024-01-01')
    }
  ]);

  const [deletionLogs, setDeletionLogs] = useState<DeletionLog[]>([
    {
      id: 'log_1',
      policyId: 'policy_1',
      policyName: 'Consent Records Retention',
      recordsDeleted: 156,
      dataCategory: 'consent_records',
      deletionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      triggerReason: 'Scheduled deletion after retention period',
      executedBy: 'system',
      status: 'completed'
    }
  ]);

  const [pendingDeletions, setPendingDeletions] = useState<PendingDeletion[]>([
    {
      id: 'pending_1',
      policyId: 'policy_2',
      policyName: 'Personal Data Cleanup',
      recordCount: 23,
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      dataCategory: 'personal_identifiers',
      triggerEvent: 'account_closure',
      canCancel: true
    }
  ]);

  const [activeTab, setActiveTab] = useState('policies');
  const [isCreatePolicyOpen, setIsCreatePolicyOpen] = useState(false);
  const [isCreateExemptionOpen, setIsCreateExemptionOpen] = useState(false);

  const [newPolicy, setNewPolicy] = useState({
    name: '',
    description: '',
    dataCategory: '',
    retentionPeriod: 1,
    retentionUnit: 'years' as const,
    triggerEvent: 'consent_withdrawal' as const,
    autoDelete: false
  });

  const [newExemption, setNewExemption] = useState({
    name: '',
    description: '',
    legalBasis: '',
    dataCategories: [] as string[],
    exemptionPeriod: 1,
    exemptionUnit: 'years' as const
  });

  const handleCreatePolicy = () => {
    if (!newPolicy.name.trim()) return;

    const policy: RetentionPolicy = {
      id: `policy_${Date.now()}`,
      name: newPolicy.name,
      description: newPolicy.description,
      dataCategory: newPolicy.dataCategory,
      retentionPeriod: newPolicy.retentionPeriod,
      retentionUnit: newPolicy.retentionUnit,
      triggerEvent: newPolicy.triggerEvent,
      autoDelete: newPolicy.autoDelete,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      recordsAffected: 0,
      exemptions: []
    };

    setPolicies([...policies, policy]);
    setNewPolicy({
      name: '',
      description: '',
      dataCategory: '',
      retentionPeriod: 1,
      retentionUnit: 'years',
      triggerEvent: 'consent_withdrawal',
      autoDelete: false
    });
    setIsCreatePolicyOpen(false);
  };

  const handleCreateExemption = () => {
    if (!newExemption.name.trim()) return;

    const exemption: RetentionExemption = {
      id: `exemption_${Date.now()}`,
      name: newExemption.name,
      description: newExemption.description,
      legalBasis: newExemption.legalBasis,
      dataCategories: newExemption.dataCategories,
      exemptionPeriod: newExemption.exemptionPeriod,
      exemptionUnit: newExemption.exemptionUnit,
      isActive: true,
      createdAt: new Date()
    };

    setExemptions([...exemptions, exemption]);
    setNewExemption({
      name: '',
      description: '',
      legalBasis: '',
      dataCategories: [],
      exemptionPeriod: 1,
      exemptionUnit: 'years'
    });
    setIsCreateExemptionOpen(false);
  };

  const handleTogglePolicy = (policyId: string) => {
    setPolicies(policies.map(p => 
      p.id === policyId 
        ? { ...p, isActive: !p.isActive, updatedAt: new Date() }
        : p
    ));
  };

  const handleExecutePolicy = (policyId: string) => {
    const policy = policies.find(p => p.id === policyId);
    if (!policy) return;

    // Simulate policy execution
    const recordsDeleted = Math.floor(Math.random() * 100) + 10;
    
    const logEntry: DeletionLog = {
      id: `log_${Date.now()}`,
      policyId: policy.id,
      policyName: policy.name,
      recordsDeleted,
      dataCategory: policy.dataCategory,
      deletionDate: new Date(),
      triggerReason: 'Manual execution',
      executedBy: 'admin@company.com',
      status: 'completed'
    };

    setDeletionLogs([logEntry, ...deletionLogs]);
    
    // Update policy
    setPolicies(policies.map(p => 
      p.id === policyId 
        ? { ...p, lastExecuted: new Date(), recordsAffected: p.recordsAffected + recordsDeleted }
        : p
    ));

    alert(`Policy executed successfully. ${recordsDeleted} records deleted.`);
  };

  const handleCancelPendingDeletion = (pendingId: string) => {
    setPendingDeletions(pendingDeletions.filter(p => p.id !== pendingId));
    alert('Pending deletion cancelled successfully.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRetentionPeriod = (period: number, unit: string) => {
    return `${period} ${unit}${period !== 1 ? '' : unit.slice(0, -1)}`;
  };

  const formatNextExecution = (policy: RetentionPolicy) => {
    if (!policy.lastExecuted) return 'Not scheduled';
    
    const nextExecution = new Date(policy.lastExecuted);
    nextExecution.setDate(nextExecution.getDate() + 1); // Daily check for demo
    
    return nextExecution > new Date() 
      ? nextExecution.toLocaleDateString()
      : 'Due now';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Retention Policies</h2>
          <p className="text-gray-600">Manage automated data deletion and retention schedules</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateExemptionOpen} onOpenChange={setIsCreateExemptionOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Add Exemption
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Retention Exemption</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="exemptionName">Exemption Name</Label>
                  <Input
                    id="exemptionName"
                    value={newExemption.name}
                    onChange={(e) => setNewExemption({ ...newExemption, name: e.target.value })}
                    placeholder="Enter exemption name"
                  />
                </div>
                <div>
                  <Label htmlFor="exemptionDescription">Description</Label>
                  <Textarea
                    id="exemptionDescription"
                    value={newExemption.description}
                    onChange={(e) => setNewExemption({ ...newExemption, description: e.target.value })}
                    placeholder="Describe the exemption"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="legalBasis">Legal Basis</Label>
                  <Input
                    id="legalBasis"
                    value={newExemption.legalBasis}
                    onChange={(e) => setNewExemption({ ...newExemption, legalBasis: e.target.value })}
                    placeholder="Legal justification for exemption"
                  />
                </div>
                <div>
                  <Label>Data Categories</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {DATA_CATEGORIES.map(category => (
                      <Badge
                        key={category}
                        variant={newExemption.dataCategories.includes(category) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const isSelected = newExemption.dataCategories.includes(category);
                          setNewExemption({
                            ...newExemption,
                            dataCategories: isSelected
                              ? newExemption.dataCategories.filter(c => c !== category)
                              : [...newExemption.dataCategories, category]
                          });
                        }}
                      >
                        {category.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exemptionPeriod">Exemption Period</Label>
                    <Input
                      id="exemptionPeriod"
                      type="number"
                      value={newExemption.exemptionPeriod}
                      onChange={(e) => setNewExemption({ ...newExemption, exemptionPeriod: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="exemptionUnit">Unit</Label>
                    <Select 
                      value={newExemption.exemptionUnit} 
                      onValueChange={(value: any) => setNewExemption({ ...newExemption, exemptionUnit: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateExemptionOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateExemption}>
                  Create Exemption
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isCreatePolicyOpen} onOpenChange={setIsCreatePolicyOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Retention Policy</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="policyName">Policy Name</Label>
                    <Input
                      id="policyName"
                      value={newPolicy.name}
                      onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                      placeholder="Enter policy name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataCategory">Data Category</Label>
                    <Select 
                      value={newPolicy.dataCategory} 
                      onValueChange={(value) => setNewPolicy({ ...newPolicy, dataCategory: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {DATA_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="policyDescription">Description</Label>
                  <Textarea
                    id="policyDescription"
                    value={newPolicy.description}
                    onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                    placeholder="Describe the retention policy"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="retentionPeriod">Retention Period</Label>
                    <Input
                      id="retentionPeriod"
                      type="number"
                      value={newPolicy.retentionPeriod}
                      onChange={(e) => setNewPolicy({ ...newPolicy, retentionPeriod: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="retentionUnit">Unit</Label>
                    <Select 
                      value={newPolicy.retentionUnit} 
                      onValueChange={(value: any) => setNewPolicy({ ...newPolicy, retentionUnit: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="triggerEvent">Trigger Event</Label>
                    <Select 
                      value={newPolicy.triggerEvent} 
                      onValueChange={(value: any) => setNewPolicy({ ...newPolicy, triggerEvent: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TRIGGER_EVENTS.map(event => (
                          <SelectItem key={event.value} value={event.value}>
                            <div>
                              <div className="font-medium">{event.label}</div>
                              <div className="text-xs text-gray-500">{event.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoDelete"
                    checked={newPolicy.autoDelete}
                    onCheckedChange={(checked) => setNewPolicy({ ...newPolicy, autoDelete: checked })}
                  />
                  <Label htmlFor="autoDelete">Enable Automatic Deletion</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreatePolicyOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePolicy}>
                  Create Policy
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="policies">Retention Policies</TabsTrigger>
          <TabsTrigger value="exemptions">Exemptions</TabsTrigger>
          <TabsTrigger value="pending">Pending Deletions</TabsTrigger>
          <TabsTrigger value="logs">Deletion Logs</TabsTrigger>
        </TabsList>

        {/* Retention Policies Tab */}
        <TabsContent value="policies">
          <div className="space-y-4">
            {policies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        {policy.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{policy.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(policy.isActive ? 'active' : 'inactive')}>
                        {policy.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      {policy.autoDelete && (
                        <Badge variant="outline">Auto-Delete</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Data Category</p>
                      <p className="font-medium">{policy.dataCategory.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Retention Period</p>
                      <p className="font-medium">{formatRetentionPeriod(policy.retentionPeriod, policy.retentionUnit)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Trigger Event</p>
                      <p className="font-medium">
                        {TRIGGER_EVENTS.find(e => e.value === policy.triggerEvent)?.label}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Records Affected</p>
                      <p className="font-medium">{policy.recordsAffected.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Last Executed</p>
                      <p className="font-medium">
                        {policy.lastExecuted ? policy.lastExecuted.toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Next Execution</p>
                      <p className="font-medium">{formatNextExecution(policy)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Exemptions</p>
                      <p className="font-medium">{policy.exemptions.length}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTogglePolicy(policy.id)}
                    >
                      {policy.isActive ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                      {policy.isActive ? 'Disable' : 'Enable'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExecutePolicy(policy.id)}
                      disabled={!policy.isActive}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Execute Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Exemptions Tab */}
        <TabsContent value="exemptions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exemptions.map((exemption) => (
              <Card key={exemption.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {exemption.name}
                    </CardTitle>
                    <Badge className={getStatusColor(exemption.isActive ? 'active' : 'inactive')}>
                      {exemption.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{exemption.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Legal Basis</p>
                    <p className="font-medium">{exemption.legalBasis}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Data Categories</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {exemption.dataCategories.map(category => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {exemption.exemptionPeriod && (
                    <div>
                      <p className="text-sm text-gray-500">Exemption Period</p>
                      <p className="font-medium">
                        {formatRetentionPeriod(exemption.exemptionPeriod, exemption.exemptionUnit || 'years')}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pending Deletions Tab */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Deletions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy</TableHead>
                    <TableHead>Data Category</TableHead>
                    <TableHead>Record Count</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Trigger Event</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDeletions.map((pending) => (
                    <TableRow key={pending.id}>
                      <TableCell>
                        <span className="font-medium">{pending.policyName}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{pending.dataCategory.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{pending.recordCount.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{pending.scheduledDate.toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{pending.triggerEvent.replace('_', ' ')}</span>
                      </TableCell>
                      <TableCell>
                        {pending.canCancel && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleCancelPendingDeletion(pending.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deletion Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Deletion Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy</TableHead>
                    <TableHead>Data Category</TableHead>
                    <TableHead>Records Deleted</TableHead>
                    <TableHead>Deletion Date</TableHead>
                    <TableHead>Executed By</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletionLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <span className="font-medium">{log.policyName}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.dataCategory.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{log.recordsDeleted.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {log.deletionDate.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{log.executedBy}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {log.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          <Badge className={getStatusColor(log.status)}>
                            {log.status.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
