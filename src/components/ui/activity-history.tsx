import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  History, 
  Clock, 
  User, 
  FileText, 
  ArrowRight, 
  Search, 
  Filter,
  Download,
  Eye,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Upload,
  UserCheck,
  Settings,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { 
  ActivityHistoryEntry, 
  GrievanceHistory, 
  DataPrincipalRequestHistory 
} from '@/types/dpdp';

interface ActivityHistoryProps {
  entityType: 'GRIEVANCE' | 'DATA_REQUEST';
  entityId: string;
  referenceNumber: string;
  isOpen: boolean;
  onClose: () => void;
  userRole: 'DATA_PRINCIPAL' | 'DPO' | 'DATA_FIDUCIARY' | 'DATA_PROCESSOR' | 'SYSTEM_ADMIN';
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({
  entityType,
  entityId,
  referenceNumber,
  isOpen,
  onClose,
  userRole
}) => {
  const [history, setHistory] = useState<GrievanceHistory | DataPrincipalRequestHistory | null>(null);
  const [filteredActivities, setFilteredActivities] = useState<ActivityHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>('ALL');
  const [actorFilter, setActorFilter] = useState<string>('ALL');
  const [selectedActivity, setSelectedActivity] = useState<ActivityHistoryEntry | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Mock history data - in real app, this would come from API
  useEffect(() => {
    if (!isOpen) return;
    
    const loadHistory = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockActivities: ActivityHistoryEntry[] = [
        {
          id: 'activity_001',
          timestamp: new Date('2024-01-15T10:30:00Z'),
          activityType: 'STATUS_CHANGE',
          actor: {
            id: 'system',
            name: 'System',
            role: 'SYSTEM'
          },
          changes: [
            {
              field: 'status',
              oldValue: null,
              newValue: 'SUBMITTED'
            }
          ],
          description: `${entityType === 'GRIEVANCE' ? 'Grievance' : 'Data request'} submitted successfully`,
          metadata: {
            source: 'WEB_UI',
            automaticAction: true,
            ipAddress: '192.168.1.100',
            sessionId: 'session_123'
          },
          visibility: 'PUBLIC'
        },
        {
          id: 'activity_002',
          timestamp: new Date('2024-01-15T11:15:00Z'),
          activityType: 'ASSIGNMENT_CHANGE',
          actor: {
            id: 'dpo_001',
            name: 'John Smith',
            role: 'DPO',
            email: 'john.smith@company.com'
          },
          changes: [
            {
              field: 'assignedTo',
              oldValue: null,
              newValue: 'john.smith@company.com'
            }
          ],
          description: 'Request assigned to DPO for review',
          notes: 'High priority case - requires immediate attention',
          metadata: {
            source: 'WEB_UI',
            automaticAction: false,
            ipAddress: '10.0.0.50',
            sessionId: 'session_456'
          },
          visibility: 'INTERNAL'
        },
        {
          id: 'activity_003',
          timestamp: new Date('2024-01-16T09:30:00Z'),
          activityType: 'STATUS_CHANGE',
          actor: {
            id: 'dpo_001',
            name: 'John Smith',
            role: 'DPO',
            email: 'john.smith@company.com'
          },
          changes: [
            {
              field: 'status',
              oldValue: 'SUBMITTED',
              newValue: 'IN_PROGRESS'
            }
          ],
          description: 'Review started - validating request details',
          notes: 'Initial assessment completed. Proceeding with detailed review.',
          metadata: {
            source: 'WEB_UI',
            automaticAction: false,
            ipAddress: '10.0.0.50',
            sessionId: 'session_789'
          },
          visibility: 'PUBLIC'
        },
        {
          id: 'activity_004',
          timestamp: new Date('2024-01-16T14:20:00Z'),
          activityType: 'COMMUNICATION',
          actor: {
            id: 'dpo_001',
            name: 'John Smith',
            role: 'DPO',
            email: 'john.smith@company.com'
          },
          changes: [],
          description: 'Email sent to data principal requesting additional information',
          notes: 'Requested clarification on specific data categories for access request',
          metadata: {
            source: 'EMAIL',
            automaticAction: false,
            ipAddress: '10.0.0.50',
            sessionId: 'session_abc'
          },
          visibility: 'PUBLIC'
        },
        {
          id: 'activity_005',
          timestamp: new Date('2024-01-17T10:45:00Z'),
          activityType: 'DOCUMENT_UPLOAD',
          actor: {
            id: 'user_001',
            name: 'Alice Johnson',
            role: 'DATA_PRINCIPAL',
            email: 'alice.johnson@email.com'
          },
          changes: [],
          description: 'Additional documentation provided',
          attachments: [
            {
              fileName: 'identity_verification.pdf',
              fileSize: 1024000,
              uploadedAt: new Date('2024-01-17T10:45:00Z'),
              uploadedBy: 'Alice Johnson'
            }
          ],
          metadata: {
            source: 'WEB_UI',
            automaticAction: false,
            ipAddress: '192.168.1.100',
            sessionId: 'session_def'
          },
          visibility: 'PUBLIC'
        },
        {
          id: 'activity_006',
          timestamp: new Date('2024-01-18T16:30:00Z'),
          activityType: 'PRIORITY_CHANGE',
          actor: {
            id: 'dpo_001',
            name: 'John Smith',
            role: 'DPO',
            email: 'john.smith@company.com'
          },
          changes: [
            {
              field: 'priority',
              oldValue: 'MEDIUM',
              newValue: 'HIGH'
            }
          ],
          description: 'Priority escalated due to regulatory timeline',
          notes: 'SLA approaching - expediting processing',
          metadata: {
            source: 'WEB_UI',
            automaticAction: false,
            ipAddress: '10.0.0.50',
            sessionId: 'session_ghi'
          },
          visibility: 'INTERNAL'
        }
      ];

      const mockHistory: GrievanceHistory | DataPrincipalRequestHistory = {
        grievanceId: entityType === 'GRIEVANCE' ? entityId : undefined,
        requestId: entityType === 'DATA_REQUEST' ? entityId : undefined,
        referenceNumber,
        requestType: entityType === 'DATA_REQUEST' ? 'ACCESS' : undefined,
        activities: mockActivities,
        createdAt: new Date('2024-01-15T10:30:00Z'),
        lastUpdated: new Date('2024-01-18T16:30:00Z'),
        totalActivities: mockActivities.length,
        statusChangeCount: mockActivities.filter(a => a.activityType === 'STATUS_CHANGE').length,
        assignmentChangeCount: mockActivities.filter(a => a.activityType === 'ASSIGNMENT_CHANGE').length,
        communicationCount: mockActivities.filter(a => a.activityType === 'COMMUNICATION').length,
        escalationCount: mockActivities.filter(a => a.activityType === 'ESCALATION').length,
        slaBreachCount: entityType === 'DATA_REQUEST' ? 0 : undefined,
        processingMilestones: entityType === 'DATA_REQUEST' ? {
          received: new Date('2024-01-15T10:30:00Z'),
          inProgress: new Date('2024-01-16T09:30:00Z')
        } : undefined
      } as GrievanceHistory | DataPrincipalRequestHistory;

      setHistory(mockHistory);
      setFilteredActivities(mockActivities);
      setLoading(false);
    };

    loadHistory();
  }, [isOpen, entityId, entityType, referenceNumber]);

  // Filter activities based on search and filters
  useEffect(() => {
    if (!history) return;

    let filtered = history.activities;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply activity type filter
    if (activityTypeFilter !== 'ALL') {
      filtered = filtered.filter(activity => activity.activityType === activityTypeFilter);
    }

    // Apply actor filter
    if (actorFilter !== 'ALL') {
      filtered = filtered.filter(activity => activity.actor.role === actorFilter);
    }

    // Apply visibility filter based on user role
    filtered = filtered.filter(activity => {
      switch (activity.visibility) {
        case 'PUBLIC':
          return true;
        case 'INTERNAL':
          return ['DPO', 'DATA_FIDUCIARY', 'DATA_PROCESSOR', 'SYSTEM_ADMIN'].includes(userRole);
        case 'DPO_ONLY':
          return userRole === 'DPO';
        case 'SYSTEM_ONLY':
          return userRole === 'SYSTEM_ADMIN';
        default:
          return true;
      }
    });

    setFilteredActivities(filtered);
  }, [history, searchTerm, activityTypeFilter, actorFilter, userRole]);

  const getActivityIcon = (activityType: ActivityHistoryEntry['activityType']) => {
    switch (activityType) {
      case 'STATUS_CHANGE':
        return <ArrowRight className="h-4 w-4" />;
      case 'ASSIGNMENT_CHANGE':
        return <UserCheck className="h-4 w-4" />;
      case 'PRIORITY_CHANGE':
        return <AlertTriangle className="h-4 w-4" />;
      case 'UPDATE':
        return <Settings className="h-4 w-4" />;
      case 'COMMENT':
        return <MessageSquare className="h-4 w-4" />;
      case 'DOCUMENT_UPLOAD':
        return <Upload className="h-4 w-4" />;
      case 'ESCALATION':
        return <AlertTriangle className="h-4 w-4" />;
      case 'RESOLUTION':
        return <CheckCircle className="h-4 w-4" />;
      case 'COMMUNICATION':
        return <Mail className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityBadgeColor = (activityType: ActivityHistoryEntry['activityType']) => {
    switch (activityType) {
      case 'STATUS_CHANGE':
        return 'bg-blue-100 text-blue-800';
      case 'ASSIGNMENT_CHANGE':
        return 'bg-purple-100 text-purple-800';
      case 'PRIORITY_CHANGE':
        return 'bg-orange-100 text-orange-800';
      case 'ESCALATION':
        return 'bg-red-100 text-red-800';
      case 'RESOLUTION':
        return 'bg-green-100 text-green-800';
      case 'COMMUNICATION':
        return 'bg-cyan-100 text-cyan-800';
      case 'DOCUMENT_UPLOAD':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'DPO':
        return 'bg-red-100 text-red-800';
      case 'DATA_FIDUCIARY':
        return 'bg-blue-100 text-blue-800';
      case 'DATA_PROCESSOR':
        return 'bg-green-100 text-green-800';
      case 'DATA_PRINCIPAL':
        return 'bg-purple-100 text-purple-800';
      case 'SYSTEM_ADMIN':
        return 'bg-orange-100 text-orange-800';
      case 'SYSTEM':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleActivityClick = (activity: ActivityHistoryEntry) => {
    setSelectedActivity(activity);
    setDetailDialogOpen(true);
  };

  const exportHistory = () => {
    if (!history) return;

    const csvContent = [
      ['Timestamp', 'Activity Type', 'Actor', 'Description', 'Changes', 'Notes'],
      ...filteredActivities.map(activity => [
        activity.timestamp.toLocaleString(),
        activity.activityType,
        activity.actor.name,
        activity.description,
        activity.changes.map(c => `${c.field}: ${c.oldValue} → ${c.newValue}`).join('; '),
        activity.notes || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entityType.toLowerCase()}_history_${referenceNumber}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Activity History - {referenceNumber}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Summary Cards */}
            {history && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{history.totalActivities}</div>
                    <div className="text-sm text-gray-600">Total Activities</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{history.statusChangeCount}</div>
                    <div className="text-sm text-gray-600">Status Changes</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{history.communicationCount}</div>
                    <div className="text-sm text-gray-600">Communications</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">
                      {Math.ceil((new Date().getTime() - history.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-gray-600">Days Active</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              
              <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Activity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="STATUS_CHANGE">Status Changes</SelectItem>
                  <SelectItem value="ASSIGNMENT_CHANGE">Assignments</SelectItem>
                  <SelectItem value="COMMUNICATION">Communications</SelectItem>
                  <SelectItem value="DOCUMENT_UPLOAD">Document Uploads</SelectItem>
                  <SelectItem value="ESCALATION">Escalations</SelectItem>
                </SelectContent>
              </Select>

              <Select value={actorFilter} onValueChange={setActorFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Actor Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="DATA_PRINCIPAL">Data Principal</SelectItem>
                  <SelectItem value="DPO">DPO</SelectItem>
                  <SelectItem value="DATA_FIDUCIARY">Data Fiduciary</SelectItem>
                  <SelectItem value="DATA_PROCESSOR">Data Processor</SelectItem>
                  <SelectItem value="SYSTEM">System</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={exportHistory}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading history...</div>
                  ) : filteredActivities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No activities found</div>
                  ) : (
                    <div className="space-y-4">
                      {filteredActivities.map((activity, index) => (
                        <div key={activity.id} className="relative">
                          {index < filteredActivities.length - 1 && (
                            <div className="absolute left-6 top-12 w-px h-8 bg-gray-200" />
                          )}
                          
                          <div 
                            className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleActivityClick(activity)}
                          >
                            <div className={`p-2 rounded-full ${getActivityBadgeColor(activity.activityType)}`}>
                              {getActivityIcon(activity.activityType)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge className={getActivityBadgeColor(activity.activityType)}>
                                      {activity.activityType.replace('_', ' ')}
                                    </Badge>
                                    <Badge variant="outline" className={getRoleBadgeColor(activity.actor.role)}>
                                      {activity.actor.name}
                                    </Badge>
                                  </div>
                                  
                                  <p className="text-sm font-medium text-gray-900 mb-1">
                                    {activity.description}
                                  </p>
                                  
                                  {activity.changes.length > 0 && (
                                    <div className="text-xs text-gray-600 mb-2">
                                      {activity.changes.map((change, idx) => (
                                        <span key={idx} className="inline-block mr-4">
                                          <strong>{change.field}:</strong> {change.oldValue || 'None'} → {change.newValue}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  
                                  {activity.notes && (
                                    <p className="text-xs text-gray-600 italic">
                                      {activity.notes}
                                    </p>
                                  )}
                                  
                                  {activity.attachments && activity.attachments.length > 0 && (
                                    <div className="mt-2">
                                      {activity.attachments.map((attachment, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs text-blue-600">
                                          <FileText className="h-3 w-3" />
                                          {attachment.fileName}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="text-xs text-gray-500 flex flex-col items-end">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {activity.timestamp.toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {activity.timestamp.toLocaleTimeString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity Detail Dialog */}
      {selectedActivity && (
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getActivityIcon(selectedActivity.activityType)}
                Activity Details
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Activity Type</label>
                  <Badge className={`${getActivityBadgeColor(selectedActivity.activityType)} mt-1`}>
                    {selectedActivity.activityType.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Timestamp</label>
                  <p className="text-sm mt-1">{selectedActivity.timestamp.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Actor</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getRoleBadgeColor(selectedActivity.actor.role)}>
                    {selectedActivity.actor.name}
                  </Badge>
                  <span className="text-sm text-gray-500">({selectedActivity.actor.role})</span>
                  {selectedActivity.actor.email && (
                    <span className="text-sm text-gray-500">- {selectedActivity.actor.email}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-sm mt-1">{selectedActivity.description}</p>
              </div>

              {selectedActivity.changes.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Changes Made</label>
                  <div className="mt-1 space-y-2">
                    {selectedActivity.changes.map((change, idx) => (
                      <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                        <strong>{change.field}:</strong> {change.oldValue || 'None'} → {change.newValue}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedActivity.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notes</label>
                  <p className="text-sm mt-1 bg-blue-50 p-3 rounded">{selectedActivity.notes}</p>
                </div>
              )}

              {selectedActivity.metadata && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Technical Details</label>
                  <div className="mt-1 text-xs text-gray-500 space-y-1">
                    <div>Source: {selectedActivity.metadata.source}</div>
                    {selectedActivity.metadata.ipAddress && (
                      <div>IP Address: {selectedActivity.metadata.ipAddress}</div>
                    )}
                    {selectedActivity.metadata.sessionId && (
                      <div>Session ID: {selectedActivity.metadata.sessionId}</div>
                    )}
                    <div>Automatic: {selectedActivity.metadata.automaticAction ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ActivityHistory; 