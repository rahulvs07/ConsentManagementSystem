import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Search, 
  Download, 
  Shield, 
  Hash, 
  Clock, 
  User, 
  Filter,
  FileText,
  Eye,
  CheckCircle,
  AlertTriangle,
  Lock,
  Database,
  Activity,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Settings,
  Calendar,
  Globe,
  Zap,
  AlertCircle,
  PieChart
} from 'lucide-react';
import { AuditEntry, AuditAction } from '@/types/dpdp';

interface AuditLogViewerProps {
  userRole: string;
  userId: string;
}

interface AuditFilters {
  userId?: string;
  action?: AuditAction | 'all';
  resource?: string;
  startDate?: string;
  endDate?: string;
  ipAddress?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  sessionId?: string;
}

interface AuditAnalytics {
  totalEntries: number;
  uniqueUsers: number;
  integrityScore: number;
  topActions: { action: AuditAction; count: number }[];
  riskEvents: number;
  dailyActivity: { date: string; count: number }[];
  geographicDistribution: { region: string; count: number }[];
  complianceScore: number;
}

interface SecurityAlert {
  id: string;
  type: 'MULTIPLE_FAILED_LOGINS' | 'SUSPICIOUS_IP' | 'INTEGRITY_VIOLATION' | 'UNUSUAL_ACTIVITY';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  relatedLogIds: string[];
  isResolved: boolean;
}

interface ComplianceReport {
  id: string;
  name: string;
  type: 'DPDP_COMPLIANCE' | 'SECURITY_AUDIT' | 'DATA_BREACH_REPORT';
  period: { start: Date; end: Date };
  status: 'GENERATING' | 'COMPLETED' | 'FAILED';
  downloadUrl?: string;
  generatedAt?: Date;
}

const AuditLogViewer = ({ userRole, userId }: AuditLogViewerProps) => {
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditEntry[]>([]);
  const [filters, setFilters] = useState<AuditFilters>({});
  const [selectedLog, setSelectedLog] = useState<AuditEntry | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(50);
  const [analytics, setAnalytics] = useState<AuditAnalytics | null>(null);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('24h');

  // Mock audit data representing immutable blockchain-style logs as per BRD 4.7.1
  useEffect(() => {
    loadAuditLogs();
    loadAnalytics();
    loadSecurityAlerts();
    loadComplianceReports();
  }, []);

  // Real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRealTimeEnabled) {
      interval = setInterval(() => {
        loadAuditLogs();
        loadAnalytics();
        loadSecurityAlerts();
      }, 5000); // Update every 5 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRealTimeEnabled]);

  const loadAuditLogs = () => {
    const mockLogs: AuditEntry[] = [
      {
        id: 'audit_001',
        userId: 'user_001',
        action: AuditAction.CONSENT_GRANTED,
        resource: 'consent_artifact_001',
        timestamp: new Date('2024-01-15T10:30:00Z'),
        ipAddress: '192.168.1.100',
        sessionId: 'session_abc123',
        details: {
          purposeId: 'marketing_001',
          categoryId: 'personal_data',
          consentMethod: 'click',
          userAgent: 'Mozilla/5.0...'
        },
        hash: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
        blockIndex: 1
      },
      {
        id: 'audit_002',
        userId: 'user_001',
        action: AuditAction.CONSENT_WITHDRAWN,
        resource: 'consent_artifact_001',
        timestamp: new Date('2024-01-16T14:15:00Z'),
        ipAddress: '192.168.1.100',
        sessionId: 'session_def456',
        details: {
          purposeId: 'marketing_001',
          withdrawalReason: 'user_request',
          confirmationMethod: 'email_verification'
        },
        hash: '7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730',
        previousHash: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
        blockIndex: 2
      },
      {
        id: 'audit_003',
        userId: 'admin_001',
        action: AuditAction.NOTICE_CREATED,
        resource: 'notice_001',
        timestamp: new Date('2024-01-17T09:00:00Z'),
        ipAddress: '10.0.0.50',
        sessionId: 'session_ghi789',
        details: {
          noticeTitle: 'Data Processing Notice v2.0',
          purposeCount: 5,
          languageCount: 3,
          createdBy: 'data_fiduciary_001'
        },
        hash: 'c6ea41b23c3b5bfc41c50e12d7a0a0a43b4a0c8d4d9d6b6e6e9e0e0e0e0e0e0e',
        previousHash: '7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730',
        blockIndex: 3
      },
      {
        id: 'audit_004',
        userId: 'user_002',
        action: AuditAction.GRIEVANCE_SUBMITTED,
        resource: 'grievance_001',
        timestamp: new Date('2024-01-18T16:45:00Z'),
        ipAddress: '203.0.113.10',
        sessionId: 'session_jkl012',
        details: {
          grievanceCategory: 'consent_violation',
          referenceNumber: 'GRV-20240118-001',
          priority: 'high',
          description: 'Unauthorized use of personal data'
        },
        hash: 'f8b5ac2d9e21df3bc7e8c1f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4',
        previousHash: 'c6ea41b23c3b5bfc41c50e12d7a0a0a43b4a0c8d4d9d6b6e6e9e0e0e0e0e0e0e',
        blockIndex: 4
      },
      {
        id: 'audit_005',
        userId: 'dpo_001',
        action: AuditAction.DATA_EXPORTED,
        resource: 'user_data_001',
        timestamp: new Date('2024-01-19T11:20:00Z'),
        ipAddress: '10.0.0.75',
        sessionId: 'session_mno345',
        details: {
          exportType: 'dpdp_request',
          dataCategories: ['personal', 'behavioral'],
          requestId: 'export_req_001',
          fileFormat: 'JSON'
        },
        hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
        previousHash: 'f8b5ac2d9e21df3bc7e8c1f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4',
        blockIndex: 5
      }
    ];
    setAuditLogs(mockLogs);
    setFilteredLogs(mockLogs);
  };

  const loadAnalytics = () => {
    // Mock analytics data
    const mockAnalytics: AuditAnalytics = {
      totalEntries: auditLogs.length,
      uniqueUsers: new Set(auditLogs.map(log => log.userId)).size,
      integrityScore: 100,
      topActions: [
        { action: AuditAction.CONSENT_GRANTED, count: 45 },
        { action: AuditAction.USER_LOGIN, count: 32 },
        { action: AuditAction.DATA_ACCESSED, count: 28 },
        { action: AuditAction.CONSENT_WITHDRAWN, count: 12 },
        { action: AuditAction.GRIEVANCE_SUBMITTED, count: 8 }
      ],
      riskEvents: 3,
      dailyActivity: [
        { date: '2024-01-15', count: 25 },
        { date: '2024-01-16', count: 32 },
        { date: '2024-01-17', count: 18 },
        { date: '2024-01-18', count: 41 },
        { date: '2024-01-19', count: 29 }
      ],
      geographicDistribution: [
        { region: 'Maharashtra', count: 89 },
        { region: 'Karnataka', count: 23 },
        { region: 'Tamil Nadu', count: 12 },
        { region: 'Delhi', count: 8 }
      ],
      complianceScore: 98.5
    };
    setAnalytics(mockAnalytics);
  };

  const loadSecurityAlerts = () => {
    const mockAlerts: SecurityAlert[] = [
      {
        id: 'alert_001',
        type: 'SUSPICIOUS_IP',
        severity: 'high',
        message: 'Multiple login attempts from suspicious IP address 203.0.113.10',
        timestamp: new Date('2024-01-19T15:30:00Z'),
        relatedLogIds: ['audit_004'],
        isResolved: false
      },
      {
        id: 'alert_002',
        type: 'UNUSUAL_ACTIVITY',
        severity: 'medium',
        message: 'Unusual data export activity detected outside business hours',
        timestamp: new Date('2024-01-19T02:15:00Z'),
        relatedLogIds: ['audit_005'],
        isResolved: false
      },
      {
        id: 'alert_003',
        type: 'MULTIPLE_FAILED_LOGINS',
        severity: 'low',
        message: 'Multiple failed login attempts for user_003',
        timestamp: new Date('2024-01-18T14:45:00Z'),
        relatedLogIds: [],
        isResolved: true
      }
    ];
    setSecurityAlerts(mockAlerts);
  };

  const loadComplianceReports = () => {
    const mockReports: ComplianceReport[] = [
      {
        id: 'report_001',
        name: 'DPDP Act Compliance Report - January 2024',
        type: 'DPDP_COMPLIANCE',
        period: { start: new Date('2024-01-01'), end: new Date('2024-01-31') },
        status: 'COMPLETED',
        downloadUrl: '/reports/dpdp_jan_2024.pdf',
        generatedAt: new Date('2024-01-20T10:00:00Z')
      },
      {
        id: 'report_002',
        name: 'Security Audit Report - Q4 2023',
        type: 'SECURITY_AUDIT',
        period: { start: new Date('2023-10-01'), end: new Date('2023-12-31') },
        status: 'COMPLETED',
        downloadUrl: '/reports/security_q4_2023.pdf',
        generatedAt: new Date('2024-01-15T16:30:00Z')
      },
      {
        id: 'report_003',
        name: 'Weekly Compliance Summary',
        type: 'DPDP_COMPLIANCE',
        period: { start: new Date('2024-01-15'), end: new Date('2024-01-21') },
        status: 'GENERATING',
        generatedAt: undefined
      }
    ];
    setComplianceReports(mockReports);
  };

  const generateComplianceReport = (type: ComplianceReport['type']) => {
    const newReport: ComplianceReport = {
      id: `report_${Date.now()}`,
      name: `${type.replace('_', ' ')} Report - ${new Date().toLocaleDateString()}`,
      type,
      period: { 
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
        end: new Date() 
      },
      status: 'GENERATING'
    };
    
    setComplianceReports(prev => [newReport, ...prev]);
    
    // Simulate report generation
    setTimeout(() => {
      setComplianceReports(prev => 
        prev.map(report => 
          report.id === newReport.id 
            ? { 
                ...report, 
                status: 'COMPLETED' as const, 
                downloadUrl: `/reports/${report.id}.pdf`,
                generatedAt: new Date()
              }
            : report
        )
      );
    }, 3000);
  };

  const resolveSecurityAlert = (alertId: string) => {
    setSecurityAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, isResolved: true }
          : alert
      )
    );
  };

  const getSecurityAlertBadge = (severity: SecurityAlert['severity']) => {
    const config = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return config[severity];
  };

  const applyFilters = () => {
    let filtered = [...auditLogs];

    if (filters.userId) {
      filtered = filtered.filter(log => log.userId.toLowerCase().includes(filters.userId!.toLowerCase()));
    }
    if (filters.action) {
      filtered = filtered.filter(log => log.action === filters.action);
    }
    if (filters.resource) {
      filtered = filtered.filter(log => log.resource.toLowerCase().includes(filters.resource!.toLowerCase()));
    }
    if (filters.startDate) {
      filtered = filtered.filter(log => log.timestamp >= new Date(filters.startDate!));
    }
    if (filters.endDate) {
      filtered = filtered.filter(log => log.timestamp <= new Date(filters.endDate!));
    }
    if (filters.ipAddress) {
      filtered = filtered.filter(log => log.ipAddress.includes(filters.ipAddress!));
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setFilteredLogs(auditLogs);
    setCurrentPage(1);
  };

  const exportAuditLogs = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      const csvContent = generateCSVContent();
      downloadCSV(csvContent, `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
      setIsExporting(false);
    }, 2000);
  };

  const generateCSVContent = () => {
    const headers = ['ID', 'User ID', 'Action', 'Resource', 'Timestamp', 'IP Address', 'Hash', 'Block Index'];
    const rows = filteredLogs.map(log => [
      log.id,
      log.userId,
      log.action,
      log.resource,
      log.timestamp.toISOString(),
      log.ipAddress,
      log.hash,
      log.blockIndex.toString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
  };

  const getActionBadge = (action: AuditAction) => {
    const config = {
      [AuditAction.CONSENT_GRANTED]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [AuditAction.CONSENT_WITHDRAWN]: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      [AuditAction.CONSENT_UPDATED]: { color: 'bg-blue-100 text-blue-800', icon: FileText },
      [AuditAction.CONSENT_RENEWED]: { color: 'bg-purple-100 text-purple-800', icon: Clock },
      [AuditAction.DATA_ACCESSED]: { color: 'bg-yellow-100 text-yellow-800', icon: Eye },
      [AuditAction.DATA_EXPORTED]: { color: 'bg-orange-100 text-orange-800', icon: Download },
      [AuditAction.DATA_DELETED]: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      [AuditAction.GRIEVANCE_SUBMITTED]: { color: 'bg-pink-100 text-pink-800', icon: FileText },
      [AuditAction.USER_LOGIN]: { color: 'bg-gray-100 text-gray-800', icon: User },
      [AuditAction.SYSTEM_CONFIG_CHANGED]: { color: 'bg-indigo-100 text-indigo-800', icon: Shield }
    };

    const { color, icon: Icon } = config[action] || { color: 'bg-gray-100 text-gray-800', icon: FileText };
    
    return (
      <Badge className={`${color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {action.replace('_', ' ')}
      </Badge>
    );
  };

  const verifyLogIntegrity = (log: AuditEntry, prevLog?: AuditEntry) => {
    // In a real implementation, this would verify the cryptographic hash
    if (prevLog && log.previousHash !== prevLog.hash) {
      return false;
    }
    // Simulate hash verification
    return log.hash.length === 64; // SHA-256 hash length
  };

  const LogDetailsDialog = () => (
    <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Database className="h-5 w-5" />
            <span>Audit Log Details</span>
            <Badge className="bg-green-100 text-green-800">
              <Lock className="w-3 h-3 mr-1" />
              Immutable
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Cryptographically secured audit entry with blockchain-style integrity verification
          </DialogDescription>
        </DialogHeader>

        {selectedLog && (
          <div className="space-y-6 mt-6">
            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                <strong>Integrity Status:</strong> {verifyLogIntegrity(selectedLog) ? 'Verified ✓' : 'Compromised ✗'}
                <br />
                <strong>Block #{selectedLog.blockIndex}</strong> in the immutable audit chain
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <strong>Log ID:</strong>
                      <p className="font-mono">{selectedLog.id}</p>
                    </div>
                    <div>
                      <strong>User ID:</strong>
                      <p className="font-mono">{selectedLog.userId}</p>
                    </div>
                    <div>
                      <strong>Action:</strong>
                      <div className="mt-1">{getActionBadge(selectedLog.action)}</div>
                    </div>
                    <div>
                      <strong>Resource:</strong>
                      <p className="font-mono">{selectedLog.resource}</p>
                    </div>
                    <div>
                      <strong>Timestamp:</strong>
                      <p>{selectedLog.timestamp.toLocaleString()}</p>
                    </div>
                    <div>
                      <strong>IP Address:</strong>
                      <p className="font-mono">{selectedLog.ipAddress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cryptographic Integrity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Current Hash (SHA-256):</strong>
                      <p className="font-mono text-xs break-all bg-gray-100 p-2 rounded">
                        {selectedLog.hash}
                      </p>
                    </div>
                    <div>
                      <strong>Previous Hash:</strong>
                      <p className="font-mono text-xs break-all bg-gray-100 p-2 rounded">
                        {selectedLog.previousHash || 'Genesis Block'}
                      </p>
                    </div>
                    <div>
                      <strong>Block Index:</strong>
                      <p className="font-mono">{selectedLog.blockIndex}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Action Details</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + logsPerPage);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Database className="h-6 w-6 text-blue-600" />
            <span>Immutable Audit Logs</span>
            <Badge className="bg-green-100 text-green-800">
              <Lock className="w-3 h-3 mr-1" />
              Blockchain-Style Integrity
            </Badge>
          </CardTitle>
          <CardDescription>
            Tamper-proof audit trail with cryptographic hashing as per DPDP Act 2023 Section 4.7.1
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="logs" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="logs">Audit Logs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="integrity">Integrity</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={isRealTimeEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
            >
              <Activity className="h-4 w-4 mr-2" />
              {isRealTimeEnabled ? 'Live' : 'Static'}
            </Button>
            <Select value={selectedTimeRange} onValueChange={(value: any) => setSelectedTimeRange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="logs" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filter Audit Logs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <Label htmlFor="userFilter">User ID</Label>
                  <Input
                    id="userFilter"
                    placeholder="Search user..."
                    value={filters.userId || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="actionFilter">Action</Label>
                  <Select
                    value={filters.action || 'all'}
                    onValueChange={(value) => {
                      if (value === 'all') {
                        setFilters(prev => ({ ...prev, action: undefined }));
                      } else {
                        setFilters(prev => ({ ...prev, action: value as AuditAction }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      {Object.values(AuditAction).map((action) => (
                        <SelectItem key={action} value={action}>
                          {action.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="resourceFilter">Resource</Label>
                  <Input
                    id="resourceFilter"
                    placeholder="Search resource..."
                    value={filters.resource || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, resource: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <Button onClick={applyFilters} className="flex-1">
                    <Search className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(startIndex + logsPerPage, filteredLogs.length)} of {filteredLogs.length} audit entries
            </div>
            <Button
              onClick={exportAuditLogs}
              disabled={isExporting}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Button>
          </div>

          {/* Audit Logs Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Block #</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Integrity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.map((log, index) => {
                    const prevLog = index > 0 ? paginatedLogs[index - 1] : undefined;
                    const isIntegrityValid = verifyLogIntegrity(log, prevLog);
                    
                    return (
                      <TableRow key={log.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono">{log.blockIndex}</TableCell>
                        <TableCell className="text-sm">
                          {log.timestamp.toLocaleDateString()}<br />
                          <span className="text-gray-500">{log.timestamp.toLocaleTimeString()}</span>
                        </TableCell>
                        <TableCell className="font-mono">{log.userId}</TableCell>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell className="font-mono text-sm">{log.resource}</TableCell>
                        <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                        <TableCell>
                          <Badge className={isIntegrityValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {isIntegrityValid ? '✓ Valid' : '✗ Invalid'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="integrity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Integrity Verification</CardTitle>
              <CardDescription>
                Verify the cryptographic integrity of the entire audit log chain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800">
                  <strong>Chain Integrity: VERIFIED</strong><br />
                  All {auditLogs.length} blocks in the audit chain have been cryptographically verified.
                  No tampering detected.
                </AlertDescription>
              </Alert>
              
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Chain Verification Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Genesis Block</div>
                    <div className="font-mono text-xs break-all">
                      {auditLogs.length > 0 ? auditLogs[0].hash : 'No blocks found'}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Latest Block</div>
                    <div className="font-mono text-xs break-all">
                      {auditLogs.length > 0 ? auditLogs[auditLogs.length - 1].hash : 'No blocks found'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <>
              {/* Analytics Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">{analytics.totalEntries.toLocaleString()}</div>
                        <p className="text-sm text-gray-600">Total Audit Entries</p>
                      </div>
                      <Database className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">{analytics.uniqueUsers}</div>
                        <p className="text-sm text-gray-600">Unique Users</p>
                      </div>
                      <User className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">{analytics.integrityScore}%</div>
                        <p className="text-sm text-gray-600">Integrity Score</p>
                      </div>
                      <Shield className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">{analytics.complianceScore}%</div>
                        <p className="text-sm text-gray-600">Compliance Score</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Actions Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Top Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topActions.map((item, index) => (
                        <div key={item.action} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-800">
                              {index + 1}
                            </div>
                            <span className="text-sm font-medium">
                              {item.action.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                          <Badge variant="secondary">{item.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Geographic Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.geographicDistribution.map((item, index) => (
                        <div key={item.region} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-medium text-green-800">
                              {index + 1}
                            </div>
                            <span className="text-sm font-medium">{item.region}</span>
                          </div>
                          <Badge variant="secondary">{item.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Daily Activity Trend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.dailyActivity.map((item) => (
                      <div key={item.date} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.date}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(item.count / Math.max(...analytics.dailyActivity.map(d => d.count))) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {securityAlerts.filter(a => !a.isResolved).length}
                    </div>
                    <p className="text-sm text-gray-600">Active Alerts</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {securityAlerts.filter(a => a.severity === 'high' || a.severity === 'critical').length}
                    </div>
                    <p className="text-sm text-gray-600">High Risk Events</p>
                  </div>
                  <Zap className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {securityAlerts.filter(a => a.isResolved).length}
                    </div>
                    <p className="text-sm text-gray-600">Resolved Alerts</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Security Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${alert.isResolved ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getSecurityAlertBadge(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant={alert.isResolved ? "secondary" : "destructive"}>
                            {alert.isResolved ? 'Resolved' : 'Active'}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-1">{alert.message}</p>
                        <p className="text-xs text-gray-500">
                          {alert.timestamp.toLocaleString()} • Type: {alert.type.replace('_', ' ')}
                        </p>
                        {alert.relatedLogIds.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Related logs: {alert.relatedLogIds.join(', ')}
                          </p>
                        )}
                      </div>
                      {!alert.isResolved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveSecurityAlert(alert.id)}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* Compliance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">98.5%</div>
                    <p className="text-sm text-gray-600">DPDP Compliance</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">100%</div>
                    <p className="text-sm text-gray-600">Audit Coverage</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {complianceReports.filter(r => r.status === 'COMPLETED').length}
                    </div>
                    <p className="text-sm text-gray-600">Reports Generated</p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generate New Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Compliance Reports</CardTitle>
              <CardDescription>
                Generate comprehensive compliance reports for regulatory requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  onClick={() => generateComplianceReport('DPDP_COMPLIANCE')}
                  className="flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>DPDP Report</span>
                </Button>
                <Button
                  onClick={() => generateComplianceReport('SECURITY_AUDIT')}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Security Audit</span>
                </Button>
                <Button
                  onClick={() => generateComplianceReport('DATA_BREACH_REPORT')}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Breach Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Compliance Reports</span>
              </CardTitle>
              <CardDescription>
                Download and manage compliance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{report.name}</h4>
                      <p className="text-sm text-gray-600">
                        {report.period.start.toLocaleDateString()} - {report.period.end.toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant={
                          report.status === 'COMPLETED' ? 'default' : 
                          report.status === 'GENERATING' ? 'secondary' : 'destructive'
                        }>
                          {report.status}
                        </Badge>
                        <Badge variant="outline">{report.type.replace('_', ' ')}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {report.status === 'COMPLETED' && report.downloadUrl && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      {report.status === 'GENERATING' && (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-gray-600">Generating...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <LogDetailsDialog />
    </div>
  );
};

export default AuditLogViewer; 