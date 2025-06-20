import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { NavigationTab } from '@/components/ui/navigation-tab';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Bell, 
  AlertTriangle, 
  Activity, 
  User, 
  Settings, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  Pause, 
  RefreshCw,
  Filter,
  Download,
  Upload,
  Search,
  BarChart3,
  History,
  Globe,
  Zap,
  AlertCircle,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  Info,
  Trash2,
  Edit,
  Plus,
  Minus,
  MoreHorizontal,
  Send,
  ArrowRight,
  ArrowLeft,
  Copy,
  Share,
  Star,
  Flag,
  Target,
  TrendingUp,
  TrendingDown,
  Users,
  Database,
  Server,
  Wifi,
  WifiOff,
  Link,
  Unlink,
  Power,
  PowerOff,
  MessageSquare
} from 'lucide-react';

interface ConsentAlert {
  id: string;
  userId: string;
  purposeId: string;
  purposeName: string;
  category: string;
  eventType: 'consent_granted' | 'consent_withdrawn' | 'consent_updated' | 'consent_expired' | 'consent_renewal_required';
  timestamp: Date;
  status: 'pending' | 'acknowledged' | 'resolved' | 'escalated';
  priority: 'high' | 'medium' | 'low';
  fiduciaryName: string;
  affectedRecords: number;
  details: string;
}

interface ProcessingActivity {
  id: string;
  userId: string;
  purposeId: string;
  purposeName: string;
  category: string;
  status: 'active' | 'suspended' | 'completed' | 'failed';
  fiduciaryName: string;
  recordsProcessed: number;
  startTime: Date;
  lastActivity: Date;
  consentStatus: 'valid' | 'expired' | 'withdrawn' | 'pending';
}

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  userId: string;
  purposeId: string;
  details: string;
  processorId: string;
  ipAddress: string;
  result: 'success' | 'failed' | 'partial';
}

interface IntegrationStatus {
  service: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: Date;
  responseTime: number;
  errorCount: number;
}

// New interfaces for Data Principal Request handling
interface DataPrincipalRequest {
  id: string;
  referenceNumber: string;
  userId: string;
  userEmail: string;
  requestType: 'ACCESS' | 'CORRECTION' | 'ERASURE' | 'NOMINATION';
  purposeId: string;
  purposeName: string;
  category: string;
  status: 'RECEIVED' | 'VALIDATING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'ESCALATED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  submittedAt: Date;
  dueDate: Date;
  fiduciaryName: string;
  description: string;
  processingNotes?: string;
  dataFields?: string[];
  correctionData?: Record<string, any>;
  nomineeDetails?: {
    name: string;
    email: string;
    relationship: string;
    verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  };
  consentStatus: 'VALID' | 'EXPIRED' | 'WITHDRAWN' | 'PENDING';
  slaStatus: 'ON_TIME' | 'AT_RISK' | 'BREACHED';
  processedBy?: string;
  completedAt?: Date;
  auditTrail: {
    action: string;
    timestamp: Date;
    actor: string;
    notes: string;
  }[];
}

const DataProcessorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [consentAlerts, setConsentAlerts] = useState<ConsentAlert[]>([]);
  const [processingActivities, setProcessingActivities] = useState<ProcessingActivity[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [integrationStatuses, setIntegrationStatuses] = useState<IntegrationStatus[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<ConsentAlert | null>(null);
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    sms: false,
    inApp: true,
    escalationThreshold: 15
  });

  // New state for Data Principal requests
  const [dataPrincipalRequests, setDataPrincipalRequests] = useState<DataPrincipalRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<DataPrincipalRequest | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [processingDialogOpen, setProcessingDialogOpen] = useState(false);
  const [processingNotes, setProcessingNotes] = useState('');

  // Mock data initialization
  useEffect(() => {
    // Initialize mock consent alerts
    setConsentAlerts([
      {
        id: 'ALERT-001',
        userId: 'user_12345',
        purposeId: 'P-001',
        purposeName: 'Marketing Communications',
        category: 'Marketing',
        eventType: 'consent_withdrawn',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'pending',
        priority: 'high',
        fiduciaryName: 'TechCorp Ltd',
        affectedRecords: 1247,
        details: 'User has withdrawn consent for marketing communications. All related processing must be halted immediately.'
      },
      {
        id: 'ALERT-002',
        userId: 'user_67890',
        purposeId: 'P-003',
        purposeName: 'Analytics Processing',
        category: 'Analytics',
        eventType: 'consent_expired',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: 'acknowledged',
        priority: 'medium',
        fiduciaryName: 'DataFlow Inc',
        affectedRecords: 856,
        details: 'Consent has expired. Processing suspended pending renewal.'
      }
    ]);

    // Initialize processing activities
    setProcessingActivities([
      {
        id: 'PROC-001',
        userId: 'user_12345',
        purposeId: 'P-001',
        purposeName: 'Marketing Communications',
        category: 'Marketing',
        status: 'suspended',
        fiduciaryName: 'TechCorp Ltd',
        recordsProcessed: 1247,
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 5 * 60 * 1000),
        consentStatus: 'withdrawn'
      },
      {
        id: 'PROC-002',
        userId: 'user_67890',
        purposeId: 'P-002',
        purposeName: 'Service Analytics',
        category: 'Analytics',
        status: 'active',
        fiduciaryName: 'ServiceHub',
        recordsProcessed: 2100,
        startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 30 * 1000),
        consentStatus: 'valid'
      }
    ]);

    // Initialize audit logs
    setAuditLogs([
      {
        id: 'AUDIT-001',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        action: 'Processing Suspended',
        userId: 'user_12345',
        purposeId: 'P-001',
        details: 'Suspended marketing processing due to consent withdrawal',
        processorId: 'processor_001',
        ipAddress: '192.168.1.100',
        result: 'success'
      }
    ]);

    // Initialize integration statuses
    setIntegrationStatuses([
      {
        service: 'Consent Management System',
        status: 'connected',
        lastSync: new Date(Date.now() - 30 * 1000),
        responseTime: 120,
        errorCount: 0
      },
      {
        service: 'Data Fiduciary API',
        status: 'connected',
        lastSync: new Date(Date.now() - 2 * 60 * 1000),
        responseTime: 250,
        errorCount: 2
      }
    ]);

    // Initialize Data Principal requests with comprehensive sample data
    setDataPrincipalRequests([
      {
        id: 'DPR-001',
        referenceNumber: 'GRV-20241105001',
        userId: 'user_alice123',
        userEmail: 'alice.smith@email.com',
        requestType: 'ACCESS',
        purposeId: 'P-001',
        purposeName: 'Account Management',
        category: 'Essential',
        status: 'RECEIVED',
        priority: 'MEDIUM',
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 30 days for access
        fiduciaryName: 'TechCorp Services',
        description: 'Request for all personal data processed under account management purpose',
        dataFields: ['email', 'name', 'phone', 'address', 'account_history'],
        consentStatus: 'VALID',
        slaStatus: 'ON_TIME',
        auditTrail: [
          {
            action: 'Request Received',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            actor: 'system',
            notes: 'Request automatically received from Data Fiduciary'
          }
        ]
      },
      {
        id: 'DPR-002',
        referenceNumber: 'GRV-20241104002',
        userId: 'user_bob456',
        userEmail: 'bob.johnson@email.com',
        requestType: 'CORRECTION',
        purposeId: 'P-002',
        purposeName: 'Marketing Communications',
        category: 'Marketing',
        status: 'PROCESSING',
        priority: 'HIGH',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 15 days for correction
        fiduciaryName: 'Marketing Analytics Ltd',
        description: 'Correct email address and marketing preferences',
        correctionData: {
          email: 'bob.johnson.new@email.com',
          marketing_preferences: {
            newsletters: false,
            promotions: true,
            product_updates: true
          }
        },
        consentStatus: 'VALID',
        slaStatus: 'ON_TIME',
        processedBy: 'processor_002',
        auditTrail: [
          {
            action: 'Request Received',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            actor: 'system',
            notes: 'Request received from Data Fiduciary'
          },
          {
            action: 'Processing Started',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            actor: 'processor_002',
            notes: 'Validation completed, correction process initiated'
          }
        ]
      },
      {
        id: 'DPR-003',
        referenceNumber: 'GRV-20241103003',
        userId: 'user_carol789',
        userEmail: 'carol.davis@email.com',
        requestType: 'ERASURE',
        purposeId: 'P-003',
        purposeName: 'Analytics Processing',
        category: 'Analytics',
        status: 'COMPLETED',
        priority: 'URGENT',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 15 days for erasure
        fiduciaryName: 'DataFlow Inc',
        description: 'Complete erasure of all analytics data',
        dataFields: ['usage_analytics', 'behavior_data', 'performance_metrics'],
        consentStatus: 'WITHDRAWN',
        slaStatus: 'ON_TIME',
        processedBy: 'processor_001',
        completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        processingNotes: 'All analytics data successfully erased. Retention policies applied.',
        auditTrail: [
          {
            action: 'Request Received',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            actor: 'system',
            notes: 'Erasure request received due to consent withdrawal'
          },
          {
            action: 'Processing Started',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            actor: 'processor_001',
            notes: 'Consent validation completed, erasure process initiated'
          },
          {
            action: 'Erasure Completed',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            actor: 'processor_001',
            notes: 'All data successfully erased and verified'
          }
        ]
      },
      {
        id: 'DPR-004',
        referenceNumber: 'GRV-20241102004',
        userId: 'user_david012',
        userEmail: 'david.wilson@email.com',
        requestType: 'NOMINATION',
        purposeId: 'P-001',
        purposeName: 'Account Management',
        category: 'Essential',
        status: 'VALIDATING',
        priority: 'LOW',
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 30 days for nomination
        fiduciaryName: 'TechCorp Services',
        description: 'Nominate legal heir for data inheritance',
        nomineeDetails: {
          name: 'Sarah Wilson',
          email: 'sarah.wilson@email.com',
          relationship: 'spouse',
          verificationStatus: 'PENDING'
        },
        consentStatus: 'VALID',
        slaStatus: 'ON_TIME',
        auditTrail: [
          {
            action: 'Request Received',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            actor: 'system',
            notes: 'Nomination request received with nominee details'
          },
          {
            action: 'Identity Verification Started',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            actor: 'verification_service',
            notes: 'Nominee identity verification process initiated'
          }
        ]
      }
    ]);
  }, []);

  const handleAcknowledgeAlert = (alertId: string) => {
    setConsentAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'acknowledged' }
          : alert
      )
    );
  };

  const handleResolveAlert = (alertId: string) => {
    setConsentAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'resolved' }
          : alert
      )
    );
  };

  const handleSuspendProcessing = (activityId: string) => {
    setProcessingActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, status: 'suspended' }
          : activity
      )
    );
  };

  const handleResumeProcessing = (activityId: string) => {
    setProcessingActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, status: 'active' }
          : activity
      )
    );
  };

  const getAlertIcon = (eventType: string) => {
    switch (eventType) {
      case 'consent_withdrawn': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'consent_expired': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'consent_updated': return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case 'consent_renewal_required': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="destructive">Pending</Badge>;
      case 'acknowledged': return <Badge className="bg-yellow-100 text-yellow-800">Acknowledged</Badge>;
      case 'resolved': return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'escalated': return <Badge variant="destructive">Escalated</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getProcessingStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended': return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      case 'completed': return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getIntegrationStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Wifi className="h-4 w-4 text-green-500" />;
      case 'disconnected': return <WifiOff className="h-4 w-4 text-red-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  // New handler functions for Data Principal requests
  const handleViewRequest = (request: DataPrincipalRequest) => {
    setSelectedRequest(request);
    setRequestDialogOpen(true);
  };

  const handleStartProcessing = (requestId: string) => {
    setDataPrincipalRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: 'PROCESSING',
              processedBy: 'current_processor',
              auditTrail: [
                ...req.auditTrail,
                {
                  action: 'Processing Started',
                  timestamp: new Date(),
                  actor: 'current_processor',
                  notes: 'Request processing initiated by data processor'
                }
              ]
            }
          : req
      )
    );
  };

  const handleCompleteRequest = (requestId: string, notes: string) => {
    setDataPrincipalRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: 'COMPLETED',
              completedAt: new Date(),
              processingNotes: notes,
              auditTrail: [
                ...req.auditTrail,
                {
                  action: 'Request Completed',
                  timestamp: new Date(),
                  actor: 'current_processor',
                  notes: notes || 'Request processing completed successfully'
                }
              ]
            }
          : req
      )
    );
    setProcessingDialogOpen(false);
    setProcessingNotes('');
  };

  const handleRejectRequest = (requestId: string, reason: string) => {
    setDataPrincipalRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: 'REJECTED',
              processingNotes: reason,
              auditTrail: [
                ...req.auditTrail,
                {
                  action: 'Request Rejected',
                  timestamp: new Date(),
                  actor: 'current_processor',
                  notes: reason
                }
              ]
            }
          : req
      )
    );
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'ACCESS': return <Eye className="h-4 w-4 text-blue-500" />;
      case 'CORRECTION': return <Edit className="h-4 w-4 text-green-500" />;
      case 'ERASURE': return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'NOMINATION': return <CheckCircle2 className="h-4 w-4 text-purple-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case 'RECEIVED': return <Badge className="bg-blue-100 text-blue-800">Received</Badge>;
      case 'VALIDATING': return <Badge className="bg-yellow-100 text-yellow-800">Validating</Badge>;
      case 'PROCESSING': return <Badge className="bg-orange-100 text-orange-800">Processing</Badge>;
      case 'COMPLETED': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'REJECTED': return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'ESCALATED': return <Badge variant="destructive">Escalated</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'LOW': return <Badge variant="outline" className="text-gray-600">Low</Badge>;
      case 'MEDIUM': return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>;
      case 'HIGH': return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'URGENT': return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getSLAStatusBadge = (slaStatus: string) => {
    switch (slaStatus) {
      case 'ON_TIME': return <Badge className="bg-green-100 text-green-800">On Time</Badge>;
      case 'AT_RISK': return <Badge className="bg-yellow-100 text-yellow-800">At Risk</Badge>;
      case 'BREACHED': return <Badge className="bg-red-100 text-red-800">Breached</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const pendingAlerts = consentAlerts.filter(alert => alert.status === 'pending');
  const acknowledgedAlerts = consentAlerts.filter(alert => alert.status === 'acknowledged');
  const activeProcessing = processingActivities.filter(activity => activity.status === 'active');
  const suspendedProcessing = processingActivities.filter(activity => activity.status === 'suspended');

  // Data Principal request statistics
  const pendingRequests = dataPrincipalRequests.filter(req => ['RECEIVED', 'VALIDATING'].includes(req.status));
  const processingRequests = dataPrincipalRequests.filter(req => req.status === 'PROCESSING');
  const completedRequests = dataPrincipalRequests.filter(req => req.status === 'COMPLETED');
  const urgentRequests = dataPrincipalRequests.filter(req => req.priority === 'URGENT' && req.status !== 'COMPLETED');

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Server className="h-8 w-8" />
              Data Processor Control Center
            </h2>
            <p className="text-cyan-100 text-lg">
              Real-time consent monitoring and processing control for CMS compliance
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-white text-cyan-600 font-semibold">
              🔒 Secure Session
            </Badge>
            <div className="text-sm text-cyan-200">
              Last sync: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Alerts Banner */}
      {pendingAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{pendingAlerts.length} urgent consent alerts</strong> require immediate attention. 
            Processing may be impacted for affected data principals.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-1 h-auto p-1 bg-muted/50 rounded-lg">
          <NavigationTab 
            value="dashboard" 
            icon={<BarChart3 className="h-4 w-4" />}
            isCompact={true}
          >
            Dashboard
          </NavigationTab>
          
          <NavigationTab 
            value="consent-alerts" 
            icon={<Bell className="h-4 w-4" />}
            notificationCount={pendingAlerts.length}
            notificationVariant="destructive"
            isCompact={true}
          >
            Consent Alerts
          </NavigationTab>
          
          <NavigationTab 
            value="data-requests" 
            icon={<User className="h-4 w-4" />}
            notificationCount={urgentRequests.length}
            notificationVariant="destructive"
            isCompact={true}
          >
            Data Principal Requests
          </NavigationTab>
          
          <NavigationTab 
            value="processing-control" 
            icon={<Activity className="h-4 w-4" />}
            isCompact={true}
          >
            Processing Control
          </NavigationTab>
          
          <NavigationTab 
            value="audit-logs" 
            icon={<History className="h-4 w-4" />}
            isCompact={true}
          >
            Audit Logs
          </NavigationTab>
          
          <NavigationTab 
            value="integration-status" 
            icon={<Globe className="h-4 w-4" />}
            notificationCount={integrationStatuses.filter(s => s.status === 'error' || s.status === 'disconnected').length}
            notificationVariant="secondary"
            isCompact={true}
          >
            Integration Status
          </NavigationTab>
          
          <NavigationTab 
            value="settings" 
            icon={<Settings className="h-4 w-4" />}
            isCompact={true}
          >
            Settings
          </NavigationTab>
        </TabsList>

        {/* Dashboard Overview */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Alerts</p>
                    <p className="text-2xl font-bold text-red-600">{pendingAlerts.length}</p>
                    <p className="text-xs text-red-500">Requires action</p>
                  </div>
                  <Bell className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Processing</p>
                    <p className="text-2xl font-bold text-green-600">{activeProcessing.length}</p>
                    <p className="text-xs text-green-500">Running normally</p>
                  </div>
                  <Play className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Suspended</p>
                    <p className="text-2xl font-bold text-orange-600">{suspendedProcessing.length}</p>
                    <p className="text-xs text-orange-500">Awaiting consent</p>
                  </div>
                  <Pause className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                    <p className="text-2xl font-bold text-blue-600">98.5%</p>
                    <p className="text-xs text-blue-500">+0.5% today</p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
      </div>

          {/* Recent Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
                <CardTitle>Recent Consent Events</CardTitle>
                <CardDescription>Latest consent status changes affecting processing</CardDescription>
          </CardHeader>
          <CardContent>
                <div className="space-y-3">
                  {consentAlerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {getAlertIcon(alert.eventType)}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.purposeName}</p>
                        <p className="text-xs text-gray-500">{alert.fiduciaryName} • {alert.affectedRecords} records</p>
                    </div>
                      <div className="text-xs text-gray-400">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
                <CardTitle>Processing Status Overview</CardTitle>
                <CardDescription>Current state of data processing activities</CardDescription>
          </CardHeader>
          <CardContent>
                <div className="space-y-3">
                  {processingActivities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.purposeName}</p>
                        <p className="text-xs text-gray-500">{activity.fiduciaryName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getProcessingStatusBadge(activity.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Consent Alerts Tab */}
        <TabsContent value="consent-alerts" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Consent Alerts</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

            <div className="space-y-4">
            {consentAlerts.map((alert) => (
              <Card key={alert.id} className={`${alert.status === 'pending' ? 'border-red-200 bg-red-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.eventType)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{alert.purposeName}</h4>
                          <Badge variant="outline" className="text-xs">{alert.category}</Badge>
                          <Badge variant="outline" className="text-xs">{alert.priority}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{alert.details}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>User: {alert.userId}</span>
                          <span>Fiduciary: {alert.fiduciaryName}</span>
                          <span>Records: {alert.affectedRecords.toLocaleString()}</span>
                          <span>Time: {new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(alert.status)}
                      {alert.status === 'pending' && (
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" onClick={() => handleAcknowledgeAlert(alert.id)}>
                            Acknowledge
                          </Button>
                          <Button size="sm" onClick={() => handleResolveAlert(alert.id)}>
                            Resolve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Data Principal Requests Tab */}
        <TabsContent value="data-requests" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Data Principal Requests Processing</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                BRD Section 4.3.3 & 4.5 Compliance
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Request Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                    <p className="text-2xl font-bold text-blue-600">{pendingRequests.length}</p>
                    <p className="text-xs text-blue-500">Awaiting processing</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-orange-600">{processingRequests.length}</p>
                    <p className="text-xs text-orange-500">Currently processing</p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{completedRequests.length}</p>
                    <p className="text-xs text-green-500">Successfully processed</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Urgent</p>
                    <p className="text-2xl font-bold text-red-600">{urgentRequests.length}</p>
                    <p className="text-xs text-red-500">High priority</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Urgent Requests Alert */}
          {urgentRequests.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>{urgentRequests.length} urgent requests</strong> require immediate processing to meet SLA requirements.
              </AlertDescription>
            </Alert>
          )}

          {/* Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Data Principal Requests Queue
              </CardTitle>
              <CardDescription>
                Process access, correction, erasure, and nomination requests according to DPDP Act 2023 requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>SLA Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataPrincipalRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-sm">{request.referenceNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRequestTypeIcon(request.requestType)}
                          <span className="text-sm">{request.requestType}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.userEmail}</div>
                          <div className="text-sm text-gray-500">{request.userId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.purposeName}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {request.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{getRequestStatusBadge(request.status)}</TableCell>
                      <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                      <TableCell>{getSLAStatusBadge(request.slaStatus)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(request.dueDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.ceil((request.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleViewRequest(request)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {request.status === 'RECEIVED' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleStartProcessing(request.id)}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                          )}
                          {request.status === 'PROCESSING' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedRequest(request);
                                setProcessingDialogOpen(true);
                              }}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Request Details Dialog */}
          <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedRequest && getRequestTypeIcon(selectedRequest.requestType)}
                  Request Details: {selectedRequest?.referenceNumber}
                </DialogTitle>
                <DialogDescription>
                  Complete request information and processing history
                </DialogDescription>
              </DialogHeader>
              
              {selectedRequest && (
                <div className="space-y-6">
                  {/* Request Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Request Type</Label>
                      <div className="flex items-center gap-2 mt-1">
                        {getRequestTypeIcon(selectedRequest.requestType)}
                        <span>{selectedRequest.requestType}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="mt-1">{getRequestStatusBadge(selectedRequest.status)}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">User Email</Label>
                      <div className="mt-1">{selectedRequest.userEmail}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Purpose</Label>
                      <div className="mt-1">{selectedRequest.purposeName}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Priority</Label>
                      <div className="mt-1">{getPriorityBadge(selectedRequest.priority)}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">SLA Status</Label>
                      <div className="mt-1">{getSLAStatusBadge(selectedRequest.slaStatus)}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                      {selectedRequest.description}
                    </div>
                  </div>

                  {/* Specific Request Data */}
                  {selectedRequest.requestType === 'ACCESS' && selectedRequest.dataFields && (
                    <div>
                      <Label className="text-sm font-medium">Requested Data Fields</Label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedRequest.dataFields.map((field, index) => (
                          <Badge key={index} variant="outline">{field}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedRequest.requestType === 'CORRECTION' && selectedRequest.correctionData && (
                    <div>
                      <Label className="text-sm font-medium">Correction Data</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                        <pre>{JSON.stringify(selectedRequest.correctionData, null, 2)}</pre>
                      </div>
                    </div>
                  )}

                  {selectedRequest.requestType === 'NOMINATION' && selectedRequest.nomineeDetails && (
                    <div>
                      <Label className="text-sm font-medium">Nominee Details</Label>
                      <div className="mt-1 grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-md">
                        <div>
                          <span className="font-medium">Name:</span> {selectedRequest.nomineeDetails.name}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {selectedRequest.nomineeDetails.email}
                        </div>
                        <div>
                          <span className="font-medium">Relationship:</span> {selectedRequest.nomineeDetails.relationship}
                        </div>
                        <div>
                          <span className="font-medium">Verification:</span> 
                          <Badge variant={selectedRequest.nomineeDetails.verificationStatus === 'VERIFIED' ? 'default' : 'outline'} className="ml-2">
                            {selectedRequest.nomineeDetails.verificationStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Processing Notes */}
                  {selectedRequest.processingNotes && (
                    <div>
                      <Label className="text-sm font-medium">Processing Notes</Label>
                      <div className="mt-1 p-3 bg-blue-50 rounded-md text-sm">
                        {selectedRequest.processingNotes}
                      </div>
                    </div>
                  )}

                  {/* Audit Trail */}
                  <div>
                    <Label className="text-sm font-medium">Audit Trail</Label>
                    <div className="mt-1 space-y-2">
                      {selectedRequest.auditTrail.map((entry, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{entry.action}</span>
                              <Badge variant="outline" className="text-xs">{entry.actor}</Badge>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{entry.notes}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(entry.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Processing Completion Dialog */}
          <Dialog open={processingDialogOpen} onOpenChange={setProcessingDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Complete Request Processing</DialogTitle>
                <DialogDescription>
                  Add processing notes and mark the request as completed
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="processing-notes">Processing Notes</Label>
                  <Textarea
                    id="processing-notes"
                    placeholder="Enter details about the processing completion..."
                    value={processingNotes}
                    onChange={(e) => setProcessingNotes(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setProcessingDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => selectedRequest && handleCompleteRequest(selectedRequest.id, processingNotes)}
                    disabled={!processingNotes.trim()}
                  >
                    Complete Request
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Processing Control Tab */}
        <TabsContent value="processing-control" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Processing Control Panel</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
                    <Button variant="outline" size="sm">
                Batch Actions
                    </Button>
                  </div>
                </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purpose</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Fiduciary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Consent Status</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processingActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.purposeName}</TableCell>
                  <TableCell>{activity.userId}</TableCell>
                  <TableCell>{activity.fiduciaryName}</TableCell>
                  <TableCell>{getProcessingStatusBadge(activity.status)}</TableCell>
                  <TableCell>
                    <Badge variant={activity.consentStatus === 'valid' ? 'default' : 'destructive'}>
                      {activity.consentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{activity.recordsProcessed.toLocaleString()}</TableCell>
                  <TableCell>{new Date(activity.lastActivity).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {activity.status === 'active' ? (
                        <Button size="sm" variant="outline" onClick={() => handleSuspendProcessing(activity.id)}>
                          <Pause className="h-3 w-3 mr-1" />
                          Suspend
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleResumeProcessing(activity.id)}>
                          <Play className="h-3 w-3 mr-1" />
                          Resume
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit-logs" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Audit Logs</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
      </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Purpose ID</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Processor</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.userId}</TableCell>
                  <TableCell>{log.purposeId}</TableCell>
                  <TableCell>{log.details}</TableCell>
                  <TableCell>{log.processorId}</TableCell>
                  <TableCell>{log.ipAddress}</TableCell>
                  <TableCell>
                    <Badge variant={log.result === 'success' ? 'default' : 'destructive'}>
                      {log.result}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Integration Status Tab */}
        <TabsContent value="integration-status" className="space-y-6">
          <h3 className="text-lg font-medium">System Integration Health</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrationStatuses.map((integration, index) => (
              <Card key={index}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
                    {getIntegrationStatusIcon(integration.status)}
                    <span>{integration.service}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge variant={integration.status === 'connected' ? 'default' : 'destructive'}>
                        {integration.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Sync</span>
                      <span className="text-sm">{new Date(integration.lastSync).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Response Time</span>
                      <span className="text-sm">{integration.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Error Count</span>
                      <span className="text-sm">{integration.errorCount}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Test Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <h3 className="text-lg font-medium">Notification Preferences</h3>
          
          <Card>
            <CardHeader>
              <CardTitle>Alert Channels</CardTitle>
              <CardDescription>Configure how you receive consent alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                </div>
                <Switch 
                  id="email-notifications"
                  checked={notificationPreferences.email}
                  onCheckedChange={(checked) => 
                    setNotificationPreferences(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                </div>
                <Switch 
                  id="sms-notifications"
                  checked={notificationPreferences.sms}
                  onCheckedChange={(checked) => 
                    setNotificationPreferences(prev => ({ ...prev, sms: checked }))
                  }
                />
            </div>
            
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <Label htmlFor="inapp-notifications">In-App Notifications</Label>
              </div>
                <Switch 
                  id="inapp-notifications"
                  checked={notificationPreferences.inApp}
                  onCheckedChange={(checked) => 
                    setNotificationPreferences(prev => ({ ...prev, inApp: checked }))
                  }
                />
            </div>
            
              <div className="space-y-2">
                <Label htmlFor="escalation-threshold">Escalation Threshold (minutes)</Label>
                <Input 
                  id="escalation-threshold"
                  type="number"
                  value={notificationPreferences.escalationThreshold}
                  onChange={(e) => 
                    setNotificationPreferences(prev => ({ 
                      ...prev, 
                      escalationThreshold: parseInt(e.target.value) 
                    }))
                  }
                />
              </div>
              
              <Button className="w-full">
                Save Preferences
              </Button>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataProcessorDashboard;
