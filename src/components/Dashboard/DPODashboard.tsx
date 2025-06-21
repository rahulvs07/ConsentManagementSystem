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
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  Clock,
  BarChart3,
  Bell,
  Settings,
  Download,
  Upload,
  Search,
  Filter,
  Eye,
  Edit,
  MessageSquare,
  UserCheck,
  Database,
  Globe,
  Zap,
  XCircle,
  AlertCircle,
  Info,
  BookOpen,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  FileCheck,
  Target,
  Gauge,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Plus,
  Minus,
  MoreHorizontal,
  Send,
  FileUp,
  CheckCircle,
  Flag,
  UserX,
  Building,
  Calendar as CalendarIcon,
  History as HistoryIcon
} from 'lucide-react';

// Import types from dpdp.ts
import { GrievanceTicket, GrievanceStatus, GrievancePriority, GrievanceCategory, DataPrincipalRequestWithHistory } from '@/types/dpdp';
import ActivityHistory from '@/components/ui/activity-history';

interface ComplianceMetric {
  id: string;
  label: string;
  value: string | number;
  trend: string;
  status: 'compliant' | 'warning' | 'critical';
  target: number;
  actual: number;
}

interface ConsentOverview {
  totalActive: number;
  totalWithdrawn: number;
  pendingUpdates: number;
  expiringConsents: number;
  validationFailures: number;
  processingExceptions: number;
}

interface Incident {
  id: string;
  type: 'breach' | 'non_compliance' | 'processing_failure' | 'consent_violation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  reportedAt: Date;
  assignedTo: string;
  dueDate: Date;
  affectedUsers: number;
  regulatoryNotification: boolean;
}

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  actor: string;
  actorRole: string;
  resource: string;
  details: string;
  ipAddress: string;
  result: 'success' | 'failure' | 'partial';
  riskLevel: 'low' | 'medium' | 'high';
}

interface Policy {
  id: string;
  name: string;
  version: string;
  type: 'data_retention' | 'consent_management' | 'breach_response' | 'privacy_policy';
  status: 'active' | 'draft' | 'archived';
  lastUpdated: Date;
  nextReview: Date;
  owner: string;
  approvalRequired: boolean;
}

interface TrainingRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  course: string;
  status: 'completed' | 'in_progress' | 'overdue' | 'not_started';
  completedDate?: Date;
  dueDate: Date;
  score?: number;
}

// New interfaces for enhanced DPO functionality
interface EscalatedGrievance extends GrievanceTicket {
  escalationReason: string;
  originalAssignee: string;
  escalatedBy: string;
  escalatedAt: Date;
  slaBreached: boolean;
  regulatoryRisk: 'low' | 'medium' | 'high';
  businessImpact: string;
}

interface EscalatedDataPrincipalRequest extends DataPrincipalRequestWithHistory {
  escalationReason: string;
  originalAssignee: string;
  escalatedBy: string;
  escalatedAt: Date;
  slaBreached: boolean;
  regulatoryRisk: 'low' | 'medium' | 'high';
  businessImpact: string;
  communicationLog: Array<{
    timestamp: Date;
    type: 'EMAIL' | 'PHONE' | 'SYSTEM';
    message: string;
    sentBy: string;
  }>;
}

interface IncidentCreationForm {
  type: 'breach' | 'non_compliance' | 'processing_failure' | 'consent_violation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedUsers: number;
  reportedBy: string;
  department: string;
  immediateActions: string;
  regulatoryNotificationRequired: boolean;
  estimatedResolutionTime: number;
}

interface DetailedIncident extends Incident {
  timeline: Array<{
    timestamp: Date;
    action: string;
    actor: string;
    notes: string;
  }>;
  evidenceFiles: string[];
  rootCause?: string;
  preventiveMeasures?: string;
  regulatoryCorrespondence?: string[];
  businessImpactAssessment?: string;
  postMortemNotes?: string;
}

interface ParentConsentRequest {
  id: string;
  requestId: string;
  childId: string;
  childName: string;
  childEmail: string;
  childAge: number;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  relationship: string;
  submittedAt: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  method: 'DIGILOCKER' | 'MANUAL';
  idProofFileName?: string;
  consentFormFileName?: string;
  dpoNotes?: string;
  processedAt?: Date;
  processedBy?: string;
  reviewNotes: Array<{
    timestamp: Date;
    action: string;
    notes: string;
  }>;
}

const DPODashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [consentOverview, setConsentOverview] = useState<ConsentOverview>({
    totalActive: 2847,
    totalWithdrawn: 156,
    pendingUpdates: 23,
    expiringConsents: 45,
    validationFailures: 3,
    processingExceptions: 1
  });
  
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetric[]>([
    {
      id: 'consent_compliance',
      label: 'Consent Compliance Rate',
      value: '98.5%',
      trend: '+0.5%',
      status: 'compliant',
      target: 95,
      actual: 98.5
    },
    {
      id: 'response_time',
      label: 'Avg Response Time (hrs)',
      value: '18.2',
      trend: '-2.3',
      status: 'compliant',
      target: 72,
      actual: 18.2
    },
    {
      id: 'breach_incidents',
      label: 'Open Incidents',
      value: '2',
      trend: '-1',
      status: 'warning',
      target: 0,
      actual: 2
    },
    {
      id: 'training_completion',
      label: 'Training Completion',
      value: '94%',
      trend: '+3%',
      status: 'compliant',
      target: 90,
      actual: 94
    }
  ]);

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'INC-001',
      type: 'consent_violation',
      title: 'Unauthorized Marketing Processing',
      description: 'Processing detected for withdrawn marketing consent',
      severity: 'high',
      status: 'investigating',
      reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      assignedTo: 'dpo@company.com',
      dueDate: new Date(Date.now() + 22 * 60 * 60 * 1000),
      affectedUsers: 1,
      regulatoryNotification: false
    },
    {
      id: 'INC-002',
      type: 'processing_failure',
      title: 'Data Export Request Timeout',
      description: 'User data export request failed to complete within SLA',
      severity: 'medium',
      status: 'open',
      reportedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      assignedTo: 'tech-lead@company.com',
      dueDate: new Date(Date.now() + 42 * 60 * 60 * 1000),
      affectedUsers: 1,
      regulatoryNotification: false
    }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'AUDIT-001',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      action: 'Consent Withdrawn',
      actor: 'user@example.com',
      actorRole: 'Data Principal',
      resource: 'Consent P-001',
      details: 'Marketing consent withdrawn via user portal',
      ipAddress: '192.168.1.100',
      result: 'success',
      riskLevel: 'medium'
    },
    {
      id: 'AUDIT-002',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      action: 'Policy Updated',
      actor: 'admin@company.com',
      actorRole: 'Administrator',
      resource: 'Data Retention Policy v2.1',
      details: 'Updated retention period for analytics data',
      ipAddress: '10.0.0.50',
      result: 'success',
      riskLevel: 'low'
    }
  ]);

  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: 'POL-001',
      name: 'Data Retention Policy',
      version: '2.1',
      type: 'data_retention',
      status: 'active',
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      owner: 'dpo@company.com',
      approvalRequired: false
    },
    {
      id: 'POL-002',
      name: 'Consent Management Guidelines',
      version: '1.3',
      type: 'consent_management',
      status: 'active',
      lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      nextReview: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      owner: 'legal@company.com',
      approvalRequired: true
    }
  ]);

  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([
    {
      id: 'TR-001',
      employeeId: 'EMP-001',
      employeeName: 'John Smith',
      department: 'Engineering',
      course: 'DPDP Act 2023 Compliance',
      status: 'completed',
      completedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000),
      score: 95
    },
    {
      id: 'TR-002',
      employeeId: 'EMP-002',
      employeeName: 'Sarah Johnson',
      department: 'Marketing',
      course: 'Data Protection Fundamentals',
      status: 'overdue',
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ]);

  // New state for enhanced DPO functionality
  const [escalatedGrievances, setEscalatedGrievances] = useState<EscalatedGrievance[]>([
    {
      id: 'GRV-ESC-001',
      referenceNumber: 'GRV-240120001',
      userId: 'user123',
      category: GrievanceCategory.CONSENT_VIOLATION,
      subject: 'Unauthorized Data Processing After Consent Withdrawal',
      description: 'User reported continued marketing emails after withdrawing consent',
      status: GrievanceStatus.ESCALATED,
      priority: GrievancePriority.HIGH,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      contactEmail: 'user@example.com',
      escalationReason: 'SLA breach - 48 hours exceeded without resolution',
      originalAssignee: 'support@company.com',
      escalatedBy: 'system-auto',
      escalatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      slaBreached: true,
      regulatoryRisk: 'high',
      businessImpact: 'Potential DPDP Act violation, regulatory penalties possible',
      assignedTo: 'dpo@company.com',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  ]);

  const [escalatedDataPrincipalRequests, setEscalatedDataPrincipalRequests] = useState<EscalatedDataPrincipalRequest[]>([
    {
      id: 'DPR-ESC-001',
      referenceNumber: 'GRV-20251105-007',
      userId: 'UID1234',
      userEmail: 'jane.doe@example.com',
      userName: 'Jane Doe',
      requestType: 'ACCESS',
      status: 'ESCALATED',
      priority: 'HIGH',
      submittedAt: new Date(Date.now() - 54 * 60 * 60 * 1000), // 54 hours ago
      dueDate: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours from now
      description: 'Request for all personal data processed by the organization including marketing preferences and analytics data.',
      relatedConsents: ['P-002'],
      assignedTo: 'dpo@company.com',
      documents: ['screenshot_unsub.png'],
      escalationReason: 'SLA breach - 48 hours exceeded without resolution',
      originalAssignee: 'data-team@company.com',
      escalatedBy: 'system-auto',
      escalatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      slaBreached: true,
      regulatoryRisk: 'high',
      businessImpact: 'Potential DPDP Act Section 11 violation, regulatory penalties possible',
      communicationLog: [
        {
          timestamp: new Date(Date.now() - 54 * 60 * 60 * 1000),
          type: 'SYSTEM',
          message: 'Data access request received and acknowledged',
          sentBy: 'System'
        },
        {
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
          type: 'EMAIL',
          message: 'Initial assessment completed - complex request requiring manual review',
          sentBy: 'data-team@company.com'
        },
        {
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          type: 'SYSTEM',
          message: 'Request escalated to DPO due to SLA breach',
          sentBy: 'System'
        }
      ],
      history: {
        requestId: 'DPR-ESC-001',
        referenceNumber: 'GRV-20251105-007',
        requestType: 'ACCESS',
        activities: [],
        createdAt: new Date(Date.now() - 54 * 60 * 60 * 1000),
        lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000),
        totalActivities: 5,
        statusChangeCount: 2,
        assignmentChangeCount: 1,
        communicationCount: 3,
        slaBreachCount: 1,
        processingMilestones: {
          received: new Date(Date.now() - 54 * 60 * 60 * 1000),
          validated: new Date(Date.now() - 50 * 60 * 60 * 1000),
          inProgress: new Date(Date.now() - 48 * 60 * 60 * 1000)
        }
      },
      lastActivityAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      activitySummary: {
        totalActivities: 5,
        recentActivity: 'Escalated to DPO due to SLA breach',
        nextAction: 'DPO review and decision required',
        daysActive: 3,
        slaStatus: 'BREACHED'
      }
    }
  ]);

  const [selectedIncident, setSelectedIncident] = useState<DetailedIncident | null>(null);
  const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);
  const [createIncidentDialogOpen, setCreateIncidentDialogOpen] = useState(false);
  const [grievanceEscalationDialogOpen, setGrievanceEscalationDialogOpen] = useState(false);
  const [selectedEscalatedGrievance, setSelectedEscalatedGrievance] = useState<EscalatedGrievance | null>(null);
  
  // History dialog states
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyEntityType, setHistoryEntityType] = useState<'GRIEVANCE' | 'DATA_REQUEST'>('GRIEVANCE');
  const [historyEntityId, setHistoryEntityId] = useState<string>('');
  const [historyReferenceNumber, setHistoryReferenceNumber] = useState<string>('');
  
  const [newIncident, setNewIncident] = useState<IncidentCreationForm>({
    type: 'consent_violation',
    title: '',
    description: '',
    severity: 'medium',
    affectedUsers: 0,
    reportedBy: '',
    department: '',
    immediateActions: '',
    regulatoryNotificationRequired: false,
    estimatedResolutionTime: 24
  });

  // Parental Consent Requests State
  const [parentalConsentRequests, setParentalConsentRequests] = useState<ParentConsentRequest[]>([
    {
      id: 'PCR-001',
      requestId: 'MINOR-20251102-1',
      childId: 'C-1001',
      childName: 'Arjun Sharma',
      childEmail: 'arjun.sharma@student.edu',
      childAge: 16,
      parentName: 'Rajesh Sharma',
      parentEmail: 'rajesh.sharma@example.com',
      parentPhone: '+91-9876543210',
      relationship: 'Father',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'PENDING',
      method: 'MANUAL',
      idProofFileName: 'Passport_RSharma.pdf',
      consentFormFileName: 'Signed_Consent_RSharma.pdf',
      reviewNotes: [
        {
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000),
          action: 'Auto-Acknowledgment',
          notes: 'Auto-Ack sent to parent email'
        },
        {
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
          action: 'Document Validation',
          notes: 'Documents complete; ready for DPO approval'
        }
      ]
    },
    {
      id: 'PCR-002',
      requestId: 'MINOR-20251103-4',
      childId: 'C-1002',
      childName: 'Priya Mukherjee',
      childEmail: 'priya.m@student.edu',
      childAge: 15,
      parentName: 'Pallavi Mukherjee',
      parentEmail: 'pallavi.m@example.com',
      parentPhone: '+91-9876543211',
      relationship: 'Mother',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'PENDING',
      method: 'MANUAL',
      idProofFileName: 'Aadhaar_PMukherjee.pdf',
      consentFormFileName: 'Signed_Consent_PMukherjee.pdf',
      reviewNotes: [
        {
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
          action: 'Auto-Acknowledgment',
          notes: 'Auto-Ack sent to parent email'
        }
      ]
    }
  ]);

  const [selectedParentalRequest, setSelectedParentalRequest] = useState<ParentConsentRequest | null>(null);
  const [parentalConsentDialogOpen, setParentalConsentDialogOpen] = useState(false);
  const [parentalConsentDecision, setParentalConsentDecision] = useState<'APPROVED' | 'REJECTED' | ''>('');
  const [parentalConsentComments, setParentalConsentComments] = useState('');

  // New state for escalated requests functionality
  const [escalatedRequestsActiveTab, setEscalatedRequestsActiveTab] = useState('grievances');
  const [selectedEscalatedDPR, setSelectedEscalatedDPR] = useState<EscalatedDataPrincipalRequest | null>(null);
  const [dprEscalationDialogOpen, setDprEscalationDialogOpen] = useState(false);
  const [dpoDecision, setDpoDecision] = useState<'APPROVE' | 'REQUEST_INFO' | ''>('');
  const [dpoComments, setDpoComments] = useState('');

  const getStatusBadge = (status: string, type: 'compliance' | 'incident' | 'policy' | 'training' = 'compliance') => {
    const variants = {
      compliance: {
        compliant: <Badge className="bg-green-100 text-green-800">Compliant</Badge>,
        warning: <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>,
        critical: <Badge className="bg-red-100 text-red-800">Critical</Badge>
      },
      incident: {
        open: <Badge className="bg-blue-100 text-blue-800">Open</Badge>,
        investigating: <Badge className="bg-orange-100 text-orange-800">Investigating</Badge>,
        resolved: <Badge className="bg-green-100 text-green-800">Resolved</Badge>,
        escalated: <Badge className="bg-red-100 text-red-800">Escalated</Badge>
      },
      policy: {
        active: <Badge className="bg-green-100 text-green-800">Active</Badge>,
        draft: <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>,
        archived: <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
      },
      training: {
        completed: <Badge className="bg-green-100 text-green-800">Completed</Badge>,
        in_progress: <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>,
        overdue: <Badge className="bg-red-100 text-red-800">Overdue</Badge>,
        not_started: <Badge className="bg-gray-100 text-gray-800">Not Started</Badge>
      }
    };
    
    return variants[type][status as keyof typeof variants[typeof type]] || <Badge variant="outline">Unknown</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low': return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const calculateRiskScore = () => {
    const weights = {
      openIncidents: incidents.filter(i => i.status === 'open').length * 10,
      criticalIncidents: incidents.filter(i => i.severity === 'critical').length * 25,
      complianceRate: (100 - parseFloat(String(complianceMetrics[0]?.value).replace('%', '') || '0')) * 2,
      overdueTraining: trainingRecords.filter(t => t.status === 'overdue').length * 5
    };
    
    const totalRisk = Object.values(weights).reduce((sum, val) => sum + val, 0);
    return Math.min(100, Math.max(0, 100 - totalRisk));
  };

  const riskScore = calculateRiskScore();

  // New functions for enhanced DPO functionality
  const handleCreateIncident = async () => {
    if (!newIncident.title || !newIncident.description) {
      alert('Please fill in all required fields');
      return;
    }

    const incident: Incident = {
      id: `INC-${Date.now()}`,
      type: newIncident.type,
      title: newIncident.title,
      description: newIncident.description,
      severity: newIncident.severity,
      status: 'open',
      reportedAt: new Date(),
      assignedTo: 'dpo@company.com',
      dueDate: new Date(Date.now() + newIncident.estimatedResolutionTime * 60 * 60 * 1000),
      affectedUsers: newIncident.affectedUsers,
      regulatoryNotification: newIncident.regulatoryNotificationRequired
    };

    setIncidents(prev => [...prev, incident]);
    setCreateIncidentDialogOpen(false);
    
    // Reset form
    setNewIncident({
      type: 'consent_violation',
      title: '',
      description: '',
      severity: 'medium',
      affectedUsers: 0,
      reportedBy: '',
      department: '',
      immediateActions: '',
      regulatoryNotificationRequired: false,
      estimatedResolutionTime: 24
    });
  };

  const handleGrievanceEscalationReview = (grievance: EscalatedGrievance) => {
    setSelectedEscalatedGrievance(grievance);
    setGrievanceEscalationDialogOpen(true);
  };

  const handleIncidentDetails = (incident: Incident) => {
    // Create detailed incident with mock timeline
    const detailedIncident: DetailedIncident = {
      ...incident,
      timeline: [
        {
          timestamp: incident.reportedAt,
          action: 'Incident Reported',
          actor: 'System',
          notes: 'Initial incident report created'
        },
        {
          timestamp: new Date(incident.reportedAt.getTime() + 30 * 60 * 1000),
          action: 'Assigned to DPO',
          actor: 'Auto-Assignment',
          notes: 'High severity incident auto-assigned to DPO'
        }
      ],
      evidenceFiles: ['incident_log.pdf', 'system_screenshot.png'],
      rootCause: 'Pending investigation',
      preventiveMeasures: 'To be determined post-investigation'
    };
    
    setSelectedIncident(detailedIncident);
    setIncidentDialogOpen(true);
  };

  const resolveEscalatedGrievance = async (grievanceId: string, resolution: string) => {
    setEscalatedGrievances(prev => 
      prev.map(g => g.id === grievanceId 
        ? { ...g, status: GrievanceStatus.RESOLVED, resolutionNotes: resolution, resolvedAt: new Date() }
        : g
      )
    );
    setGrievanceEscalationDialogOpen(false);
  };

  // Parental Consent Handler Functions
  const handleParentalConsentReview = (request: ParentConsentRequest) => {
    setSelectedParentalRequest(request);
    setParentalConsentDialogOpen(true);
    setParentalConsentDecision('');
    setParentalConsentComments('');
  };

  const handleParentalConsentDecision = async () => {
    if (!selectedParentalRequest || !parentalConsentDecision) {
      alert('Please select a decision (Approve/Reject)');
      return;
    }

    const updatedRequest: ParentConsentRequest = {
      ...selectedParentalRequest,
      status: parentalConsentDecision,
      processedAt: new Date(),
      processedBy: 'dpo@company.com',
      dpoNotes: parentalConsentComments,
      reviewNotes: [
        ...selectedParentalRequest.reviewNotes,
        {
          timestamp: new Date(),
          action: `DPO ${parentalConsentDecision}`,
          notes: parentalConsentComments || `Request ${parentalConsentDecision.toLowerCase()} by DPO`
        }
      ]
    };

    setParentalConsentRequests(prev => 
      prev.map(req => req.id === selectedParentalRequest.id ? updatedRequest : req)
    );

    setParentalConsentDialogOpen(false);
    setSelectedParentalRequest(null);
    setParentalConsentDecision('');
    setParentalConsentComments('');

    // Simulate sending notification to parent and minor
    alert(`Decision recorded. Notifications sent to parent (${selectedParentalRequest.parentEmail}) and minor (${selectedParentalRequest.childEmail})`);
  };

  const getParentalConsentStatusBadge = (status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // New handler functions for escalated DPR requests
  const handleDPREscalationReview = (request: EscalatedDataPrincipalRequest) => {
    setSelectedEscalatedDPR(request);
    setDprEscalationDialogOpen(true);
  };

  const handleShowDPRHistory = (request: EscalatedDataPrincipalRequest) => {
    setHistoryEntityType('DATA_REQUEST');
    setHistoryEntityId(request.id);
    setHistoryReferenceNumber(request.referenceNumber);
    setHistoryDialogOpen(true);
  };

  const handleDPODecision = async () => {
    if (!selectedEscalatedDPR || !dpoDecision || !dpoComments) {
      alert('Please provide all required information for the decision');
      return;
    }

    // Update the request based on DPO decision
    const updatedRequest: EscalatedDataPrincipalRequest = {
      ...selectedEscalatedDPR,
      status: dpoDecision === 'APPROVE' ? 'IN_PROGRESS' : 'SUBMITTED',
      communicationLog: [
        ...selectedEscalatedDPR.communicationLog,
        {
          timestamp: new Date(),
          type: 'SYSTEM' as const,
          message: `DPO Decision: ${dpoDecision}. Comments: ${dpoComments}`,
          sentBy: 'DPO'
        }
      ]
    };

    setEscalatedDataPrincipalRequests(prev => 
      prev.map(req => req.id === selectedEscalatedDPR.id ? updatedRequest : req)
    );

    setDprEscalationDialogOpen(false);
    setSelectedEscalatedDPR(null);
    setDpoDecision('');
    setDpoComments('');

    // Simulate sending notification
    alert(`Decision recorded. Notification sent to data principal (${selectedEscalatedDPR.userEmail}) and assigned team.`);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8" />
              Data Protection Officer Control Center
            </h2>
            <p className="text-purple-100 text-lg">
              DPDP Act 2023 Compliance Monitoring & Risk Management
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              <span className="text-sm">Risk Score: {riskScore}%</span>
            </div>
            <Badge className={`${riskScore >= 80 ? 'bg-green-500' : riskScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
              {riskScore >= 80 ? 'Low Risk' : riskScore >= 60 ? 'Medium Risk' : 'High Risk'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {incidents.filter(i => i.severity === 'critical' || i.severity === 'high').length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{incidents.filter(i => i.severity === 'critical' || i.severity === 'high').length} high-priority incidents</strong> require immediate DPO attention. 
            Regulatory notification may be required.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1 h-auto p-1 bg-muted/50 rounded-lg">
          <NavigationTab 
            value="dashboard" 
            icon={<BarChart3 className="h-4 w-4" />}
            isCompact={true}
          >
            Dashboard
          </NavigationTab>
          
          <NavigationTab 
            value="compliance" 
            icon={<Shield className="h-4 w-4" />}
            isCompact={true}
          >
            Compliance
          </NavigationTab>
          
          <NavigationTab 
            value="incidents" 
            icon={<AlertTriangle className="h-4 w-4" />}
            notificationCount={incidents.filter(i => i.status === 'open').length}
            notificationVariant="destructive"
            isCompact={true}
          >
            Incidents
          </NavigationTab>
          
          <NavigationTab 
            value="grievances" 
            icon={<Flag className="h-4 w-4" />}
            notificationCount={escalatedGrievances.filter(g => g.status === GrievanceStatus.ESCALATED).length + escalatedDataPrincipalRequests.filter(r => r.status === 'ESCALATED').length}
            notificationVariant="destructive"
            isCompact={true}
          >
            Escalated Requests
          </NavigationTab>
          
          <NavigationTab 
            value="parental-consent" 
            icon={<UserCheck className="h-4 w-4" />}
            notificationCount={parentalConsentRequests.filter(r => r.status === 'PENDING').length}
            notificationVariant="destructive"
            isCompact={true}
          >
            Parental Consent
          </NavigationTab>
          
          <NavigationTab 
            value="audit" 
            icon={<FileText className="h-4 w-4" />}
            isCompact={true}
          >
            Audit Logs
          </NavigationTab>
          
          <NavigationTab 
            value="policy" 
            icon={<BookOpen className="h-4 w-4" />}
            notificationCount={policies.filter(p => new Date(p.nextReview) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}
            notificationVariant="secondary"
            isCompact={true}
          >
            Policy & Training
          </NavigationTab>
          
          <NavigationTab 
            value="notifications" 
            icon={<Bell className="h-4 w-4" />}
            notificationCount={3}
            notificationVariant="default"
            isCompact={true}
          >
            Notifications
          </NavigationTab>
        </TabsList>

        {/* Dashboard Overview */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {complianceMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        metric.status === 'compliant' ? 'bg-green-500' : 
                        metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-600">{metric.label}</span>
                    </div>
                    </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span className={`text-sm ${metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.trend}
                    </span>
                  </div>
                  {typeof metric.actual === 'number' && (
                    <Progress value={(metric.actual / metric.target) * 100} className="mt-2" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Consent Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Consent Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Consents</span>
                    <span className="font-semibold text-green-600">{consentOverview.totalActive.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Withdrawn</span>
                    <span className="font-semibold text-red-600">{consentOverview.totalWithdrawn.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending Updates</span>
                    <span className="font-semibold text-yellow-600">{consentOverview.pendingUpdates}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expiring Soon</span>
                    <span className="font-semibold text-orange-600">{consentOverview.expiringConsents}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Validation Failures</span>
                    <span className="font-semibold text-red-600">{consentOverview.validationFailures}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Overall Risk Score</span>
                    <div className="flex items-center gap-2">
                      <Progress value={riskScore} className="w-20" />
                      <span className="font-semibold">{riskScore}%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Open Incidents</span>
                      <span className="text-red-600">{incidents.filter(i => i.status === 'open').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Overdue Training</span>
                      <span className="text-orange-600">{trainingRecords.filter(t => t.status === 'overdue').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Policy Reviews Due</span>
                      <span className="text-yellow-600">{policies.filter(p => new Date(p.nextReview) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
      </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Privacy Activities
            </CardTitle>
          </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        log.riskLevel === 'high' ? 'bg-red-500' : 
                        log.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <p className="font-medium text-sm">{log.action}</p>
                        <p className="text-xs text-gray-500">{log.actor} • {log.actorRole}</p>
              </div>
              </div>
                    <span className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Monitoring */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Compliance Monitoring</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">DPDP Act Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Consent Collection (F.S.I.U.A)</span>
                    {getStatusBadge('compliant')}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Rights Implementation</span>
                    {getStatusBadge('compliant')}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Breach Notification</span>
                    {getStatusBadge('compliant')}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Grievance Handling</span>
                    {getStatusBadge('warning')}
              </div>
            </div>
          </CardContent>
        </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Processing Activities</CardTitle>
          </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Lawful Basis</span>
                    {getStatusBadge('compliant')}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Purpose Limitation</span>
                    {getStatusBadge('compliant')}
                </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Minimization</span>
                    {getStatusBadge('warning')}
              </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Storage Limitation</span>
                    {getStatusBadge('compliant')}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Technical Safeguards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Encryption</span>
                    {getStatusBadge('compliant')}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Access Controls</span>
                    {getStatusBadge('compliant')}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Audit Logging</span>
                    {getStatusBadge('compliant')}
              </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Backup</span>
                    {getStatusBadge('compliant')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Consent Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Consent Analytics</CardTitle>
              <CardDescription>Detailed breakdown of consent statuses and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{consentOverview.totalActive}</div>
                  <div className="text-sm text-gray-600">Active Consents</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{consentOverview.totalWithdrawn}</div>
                  <div className="text-sm text-gray-600">Withdrawn</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{consentOverview.expiringConsents}</div>
                  <div className="text-sm text-gray-600">Expiring Soon</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{consentOverview.validationFailures}</div>
                  <div className="text-sm text-gray-600">Validation Failures</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Incident Management */}
        <TabsContent value="incidents" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Incident Management</h3>
            <div className="flex items-center space-x-2">
              <Dialog open={createIncidentDialogOpen} onOpenChange={setCreateIncidentDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Incident
                  </Button>
                </DialogTrigger>
              </Dialog>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

            <div className="space-y-4">
            {incidents.map((incident) => (
              <Card key={incident.id} className={`${incident.severity === 'critical' || incident.severity === 'high' ? 'border-red-200 bg-red-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">{incident.title}</h4>
                        {getSeverityBadge(incident.severity)}
                        {getStatusBadge(incident.status, 'incident')}
                        <Badge variant="outline" className="text-xs">{incident.type.replace('_', ' ')}</Badge>
                        {incident.regulatoryNotification && (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            <Bell className="h-3 w-3 mr-1" />
                            Regulatory Alert
                          </Badge>
                        )}
              </div>
                      <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>ID: {incident.id}</span>
                        <span>Reported: {new Date(incident.reportedAt).toLocaleString()}</span>
                        <span>Assigned: {incident.assignedTo}</span>
                        <span>Affected Users: {incident.affectedUsers}</span>
                        <span>Due: {new Date(incident.dueDate).toLocaleDateString()}</span>
              </div>
              </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleIncidentDetails(incident)}>
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Update
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Notes
                      </Button>
              </div>
            </div>
          </CardContent>
        </Card>
            ))}
          </div>
        </TabsContent>

        {/* Escalated Requests Tab - BRD Section 4.5 Compliant */}
        <TabsContent value="grievances" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Escalated Requests Management</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                SLA: 48 hours resolution
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Escalated Requests Alert */}
          {(escalatedGrievances.filter(g => g.slaBreached).length > 0 || escalatedDataPrincipalRequests.filter(r => r.slaBreached).length > 0) && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>{escalatedGrievances.filter(g => g.slaBreached).length + escalatedDataPrincipalRequests.filter(r => r.slaBreached).length} requests</strong> have breached SLA requirements. 
                Immediate DPO intervention required to prevent regulatory non-compliance.
              </AlertDescription>
            </Alert>
          )}

          {/* Sub-tabs for Grievances and Data Principal Requests */}
          <Tabs value={escalatedRequestsActiveTab} onValueChange={setEscalatedRequestsActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <NavigationTab 
                value="grievances"
                icon={<Flag className="h-4 w-4" />}
                notificationCount={escalatedGrievances.filter(g => g.status === GrievanceStatus.ESCALATED).length}
                notificationVariant="destructive"
                isCompact={true}
              >
                Escalated Grievances ({escalatedGrievances.length})
              </NavigationTab>
              <NavigationTab 
                value="data-requests"
                icon={<FileText className="h-4 w-4" />}
                notificationCount={escalatedDataPrincipalRequests.filter(r => r.status === 'ESCALATED').length}
                notificationVariant="destructive"
                isCompact={true}
              >
                Escalated DPR ({escalatedDataPrincipalRequests.length})
              </NavigationTab>
            </TabsList>

            {/* Escalated Grievances Sub-tab */}
            <TabsContent value="grievances" className="space-y-4 mt-4">
              {escalatedGrievances.map((grievance) => (
                <Card key={grievance.id} className={`${grievance.slaBreached ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{grievance.subject}</h4>
                          <Badge className={`${grievance.priority === GrievancePriority.HIGH ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {grievance.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {grievance.category.replace('_', ' ')}
                          </Badge>
                          <Badge className={`${grievance.regulatoryRisk === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {grievance.regulatoryRisk} risk
                          </Badge>
                          {grievance.slaBreached && (
                            <Badge variant="destructive" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              SLA Breached
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{grievance.description}</p>
                        <div className="text-sm text-gray-700 mb-2">
                          <strong>Escalation Reason:</strong> {grievance.escalationReason}
                        </div>
                        <div className="text-sm text-gray-700 mb-2">
                          <strong>Business Impact:</strong> {grievance.businessImpact}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Ref: {grievance.referenceNumber}</span>
                          <span>Escalated: {new Date(grievance.escalatedAt).toLocaleString()}</span>
                          <span>Original Assignee: {grievance.originalAssignee}</span>
                          <span>Due: {grievance.dueDate && new Date(grievance.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleGrievanceEscalationReview(grievance)}>
                          <Eye className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolve
                        </Button>
                        <Button size="sm" variant="outline">
                          <Send className="h-3 w-3 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Escalated Data Principal Requests Sub-tab */}
            <TabsContent value="data-requests" className="space-y-4 mt-4">
              {escalatedDataPrincipalRequests.map((request) => (
                <Card key={request.id} className={`${request.slaBreached ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">Data {request.requestType} Request</h4>
                          <Badge className={`${request.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {request.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {request.requestType}
                          </Badge>
                          <Badge className={`${request.regulatoryRisk === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {request.regulatoryRisk} risk
                          </Badge>
                          {request.slaBreached && (
                            <Badge variant="destructive" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              SLA Breached
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                        <div className="text-sm text-gray-700 mb-2">
                          <strong>Principal:</strong> {request.userName} ({request.userId})
                        </div>
                        <div className="text-sm text-gray-700 mb-2">
                          <strong>Escalation Reason:</strong> {request.escalationReason}
                        </div>
                        <div className="text-sm text-gray-700 mb-2">
                          <strong>Business Impact:</strong> {request.businessImpact}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Ref: {request.referenceNumber}</span>
                          <span>Submitted: {new Date(request.submittedAt).toLocaleString()}</span>
                          <span>Escalated: {new Date(request.escalatedAt).toLocaleString()}</span>
                          <span>Due: {new Date(request.dueDate).toLocaleDateString()}</span>
                        </div>
                        {request.documents.length > 0 && (
                          <div className="text-sm text-gray-700 mt-2">
                            <strong>Attachments:</strong>
                            <div className="flex items-center space-x-2 mt-1">
                              {request.documents.map((doc, index) => (
                                <div key={index} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs">
                                  <FileText className="h-3 w-3" />
                                  <span>{doc}</span>
                                  <Button size="sm" variant="ghost" className="h-4 w-4 p-0">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-4 w-4 p-0">
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleDPREscalationReview(request)}>
                          <Eye className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleShowDPRHistory(request)}>
                          <HistoryIcon className="h-3 w-3 mr-1" />
                          History
                        </Button>
                        <Button size="sm" variant="outline">
                          <Send className="h-3 w-3 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Parental Consent Approvals */}
        <TabsContent value="parental-consent" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Parental Consent Approvals</h3>
            <div className="flex items-center space-x-2">
              <Select defaultValue="PENDING">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Alert className="border-orange-200 bg-orange-50">
            <UserCheck className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Minor Consent Review:</strong> {parentalConsentRequests.filter(r => r.status === 'PENDING').length} parental consent requests require DPO approval for DPDP Act compliance.
            </AlertDescription>
          </Alert>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Request ID</TableHead>
                <TableHead>Child Details</TableHead>
                <TableHead>Parent Name</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parentalConsentRequests.map((request, index) => (
                <TableRow key={request.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-mono text-sm">{request.requestId}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.childName}</div>
                      <div className="text-sm text-gray-500">{request.childEmail}</div>
                      <div className="text-xs text-gray-400">Age: {request.childAge}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.parentName}</div>
                      <div className="text-sm text-gray-500">{request.relationship}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={request.method === 'DIGILOCKER' ? 'default' : 'secondary'}>
                      {request.method}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(request.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>{getParentalConsentStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleParentalConsentReview(request)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Audit Logs */}
        <TabsContent value="audit" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Audit Logs & Reports</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.actor}</TableCell>
                  <TableCell>{log.actorRole}</TableCell>
                  <TableCell>{log.resource}</TableCell>
                  <TableCell>
                    <Badge variant={log.riskLevel === 'high' ? 'destructive' : log.riskLevel === 'medium' ? 'secondary' : 'default'}>
                      {log.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={log.result === 'success' ? 'default' : 'destructive'}>
                      {log.result}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Policy & Training */}
        <TabsContent value="policy" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Policy Management
            </CardTitle>
          </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {policies.map((policy) => (
                    <div key={policy.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{policy.name}</span>
                          {getStatusBadge(policy.status, 'policy')}
                          <Badge variant="outline" className="text-xs">v{policy.version}</Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          Review due: {new Date(policy.nextReview).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Training Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trainingRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{record.employeeName}</span>
                          {getStatusBadge(record.status, 'training')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {record.course} • {record.department}
                          {record.score && ` • Score: ${record.score}%`}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        Due: {new Date(record.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Center
              </CardTitle>
              <CardDescription>Configure DPO alert preferences and escalation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                  <h4 className="font-medium">Alert Channels</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-alerts">Email Alerts</Label>
                      <input type="checkbox" id="email-alerts" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-alerts">SMS Alerts</Label>
                      <input type="checkbox" id="sms-alerts" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dashboard-alerts">Dashboard Notifications</Label>
                      <input type="checkbox" id="dashboard-alerts" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Escalation Settings</h4>
                  <div className="space-y-3">
                  <div>
                      <Label htmlFor="breach-threshold">Breach Notification (hours)</Label>
                      <Input id="breach-threshold" type="number" defaultValue="2" className="mt-1" />
                  </div>
                    <div>
                      <Label htmlFor="incident-threshold">Incident Escalation (hours)</Label>
                      <Input id="incident-threshold" type="number" defaultValue="24" className="mt-1" />
                </div>
                    <div>
                      <Label htmlFor="compliance-threshold">Compliance Review (days)</Label>
                      <Input id="compliance-threshold" type="number" defaultValue="7" className="mt-1" />
              </div>
                  </div>
                </div>
              </div>
              
              <Button className="w-full">
                Save Notification Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Incident Creation Dialog - BRD Section 4.5 Compliant */}
      <Dialog open={createIncidentDialogOpen} onOpenChange={setCreateIncidentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Incident</DialogTitle>
            <DialogDescription>
              Record a new incident for DPO investigation and tracking
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
                  <div>
                <Label htmlFor="incident-type">Incident Type</Label>
                <Select value={newIncident.type} onValueChange={(value: any) => setNewIncident(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breach">Data Breach</SelectItem>
                    <SelectItem value="non_compliance">Non-Compliance</SelectItem>
                    <SelectItem value="processing_failure">Processing Failure</SelectItem>
                    <SelectItem value="consent_violation">Consent Violation</SelectItem>
                  </SelectContent>
                </Select>
                  </div>
              
              <div>
                <Label htmlFor="incident-title">Incident Title</Label>
                <Input 
                  id="incident-title"
                  value={newIncident.title}
                  onChange={(e) => setNewIncident(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the incident"
                />
                </div>
              
              <div>
                <Label htmlFor="incident-severity">Severity Level</Label>
                <Select value={newIncident.severity} onValueChange={(value: any) => setNewIncident(prev => ({ ...prev, severity: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
                  <div>
                <Label htmlFor="affected-users">Affected Users Count</Label>
                <Input 
                  id="affected-users"
                  type="number"
                  value={newIncident.affectedUsers}
                  onChange={(e) => setNewIncident(prev => ({ ...prev, affectedUsers: parseInt(e.target.value) || 0 }))}
                  placeholder="Number of affected users"
                />
                  </div>
                </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="reported-by">Reported By</Label>
                <Input 
                  id="reported-by"
                  value={newIncident.reportedBy}
                  onChange={(e) => setNewIncident(prev => ({ ...prev, reportedBy: e.target.value }))}
                  placeholder="Reporter name/email"
                />
              </div>
              
              <div>
                <Label htmlFor="department">Department</Label>
                <Input 
                  id="department"
                  value={newIncident.department}
                  onChange={(e) => setNewIncident(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Affected department"
                />
            </div>
              
              <div>
                <Label htmlFor="resolution-time">Est. Resolution Time (hours)</Label>
                <Input 
                  id="resolution-time"
                  type="number"
                  value={newIncident.estimatedResolutionTime}
                  onChange={(e) => setNewIncident(prev => ({ ...prev, estimatedResolutionTime: parseInt(e.target.value) || 24 }))}
                  placeholder="24"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="regulatory-notification"
                  checked={newIncident.regulatoryNotificationRequired}
                  onChange={(e) => setNewIncident(prev => ({ ...prev, regulatoryNotificationRequired: e.target.checked }))}
                />
                <Label htmlFor="regulatory-notification">Regulatory Notification Required</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="incident-description">Detailed Description</Label>
              <Textarea 
                id="incident-description"
                value={newIncident.description}
                onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed description of the incident..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="immediate-actions">Immediate Actions Taken</Label>
              <Textarea 
                id="immediate-actions"
                value={newIncident.immediateActions}
                onChange={(e) => setNewIncident(prev => ({ ...prev, immediateActions: e.target.value }))}
                placeholder="Describe any immediate containment or mitigation actions..."
                rows={2}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setCreateIncidentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateIncident} className="bg-red-600 hover:bg-red-700 text-white">
              Create Incident
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Incident Details Dialog */}
      <Dialog open={incidentDialogOpen} onOpenChange={setIncidentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Incident Details: {selectedIncident?.title}</DialogTitle>
            <DialogDescription>
              Comprehensive incident information and timeline
            </DialogDescription>
          </DialogHeader>
          
          {selectedIncident && (
            <div className="space-y-6">
              {/* Incident Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-gray-500">Status</div>
                    <div className="mt-1">{getStatusBadge(selectedIncident.status, 'incident')}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-gray-500">Severity</div>
                    <div className="mt-1">{getSeverityBadge(selectedIncident.severity)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-gray-500">Affected Users</div>
                    <div className="mt-1 text-lg font-semibold">{selectedIncident.affectedUsers}</div>
          </CardContent>
        </Card>
      </div>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Incident Timeline</CardTitle>
        </CardHeader>
                <CardContent>
          <div className="space-y-4">
                    {selectedIncident.timeline.map((event, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{event.action}</span>
                            <span className="text-sm text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                          <div className="text-sm text-gray-600">By: {event.actor}</div>
                          <div className="text-sm text-gray-700 mt-1">{event.notes}</div>
                  </div>
                </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Evidence Files */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Evidence & Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedIncident.evidenceFiles.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <FileUp className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{file}</span>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
              
              {/* Investigation Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Investigation Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-medium">Root Cause Analysis</Label>
                    <p className="text-sm text-gray-700 mt-1">{selectedIncident.rootCause}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Preventive Measures</Label>
                    <p className="text-sm text-gray-700 mt-1">{selectedIncident.preventiveMeasures}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIncidentDialogOpen(false)}>Close</Button>
            <Button>Update Status</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Grievance Escalation Review Dialog */}
      <Dialog open={grievanceEscalationDialogOpen} onOpenChange={setGrievanceEscalationDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Escalated Grievance Review</DialogTitle>
            <DialogDescription>
              DPO review and resolution for escalated grievance
            </DialogDescription>
          </DialogHeader>
          
          {selectedEscalatedGrievance && (
            <div className="space-y-6">
              {/* Grievance Summary */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-medium">Reference Number</Label>
                      <p className="text-sm">{selectedEscalatedGrievance.referenceNumber}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Priority Level</Label>
                      <div className="mt-1">
                        <Badge className={`${selectedEscalatedGrievance.priority === GrievancePriority.HIGH ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {selectedEscalatedGrievance.priority}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="font-medium">Escalation Reason</Label>
                      <p className="text-sm">{selectedEscalatedGrievance.escalationReason}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Regulatory Risk</Label>
                      <div className="mt-1">
                        <Badge className={`${selectedEscalatedGrievance.regulatoryRisk === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {selectedEscalatedGrievance.regulatoryRisk} risk
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Business Impact */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Impact Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{selectedEscalatedGrievance.businessImpact}</p>
                </CardContent>
              </Card>
              
              {/* DPO Resolution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">DPO Resolution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="resolution-notes">Resolution Notes</Label>
                    <Textarea 
                      id="resolution-notes"
                      placeholder="Provide detailed resolution and corrective actions taken..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="regulatory-follow-up" />
                      <Label htmlFor="regulatory-follow-up">Regulatory Follow-up Required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="policy-update" />
                      <Label htmlFor="policy-update">Policy Update Required</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                if (selectedEscalatedGrievance) {
                  setHistoryDialogOpen(true);
                  setHistoryEntityType('GRIEVANCE');
                  setHistoryEntityId(selectedEscalatedGrievance.id);
                  setHistoryReferenceNumber(selectedEscalatedGrievance.referenceNumber);
                }
              }}
            >
              <HistoryIcon className="h-4 w-4 mr-2" />
              History
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setGrievanceEscalationDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => resolveEscalatedGrievance(selectedEscalatedGrievance?.id || '', 'DPO Resolution provided')} className="bg-green-600 hover:bg-green-700 text-white">
                Mark as Resolved
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Parental Consent Review Dialog */}
      <Dialog open={parentalConsentDialogOpen} onOpenChange={setParentalConsentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Parental Consent Review: {selectedParentalRequest?.requestId}</DialogTitle>
            <DialogDescription>
              DPO review and approval for minor consent request
            </DialogDescription>
          </DialogHeader>
          
          {selectedParentalRequest && (
            <div className="space-y-6">
              {/* Request Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-gray-500">Status</div>
                    <div className="mt-1">{getParentalConsentStatusBadge(selectedParentalRequest.status)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-gray-500">Method</div>
                    <div className="mt-1">
                      <Badge variant={selectedParentalRequest.method === 'DIGILOCKER' ? 'default' : 'secondary'}>
                        {selectedParentalRequest.method}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-gray-500">Submitted</div>
                    <div className="mt-1 text-sm">{new Date(selectedParentalRequest.submittedAt).toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Child and Parent Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Child Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="font-medium">Name</Label>
                      <p className="text-sm">{selectedParentalRequest.childName}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Email</Label>
                      <p className="text-sm">{selectedParentalRequest.childEmail}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Age</Label>
                      <p className="text-sm">{selectedParentalRequest.childAge} years</p>
                    </div>
                    <div>
                      <Label className="font-medium">Child ID</Label>
                      <p className="text-sm font-mono">{selectedParentalRequest.childId}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Parent/Guardian Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="font-medium">Name</Label>
                      <p className="text-sm">{selectedParentalRequest.parentName}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Relationship</Label>
                      <p className="text-sm">{selectedParentalRequest.relationship}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Email</Label>
                      <p className="text-sm">{selectedParentalRequest.parentEmail}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Phone</Label>
                      <p className="text-sm">{selectedParentalRequest.parentPhone}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Uploaded Documents (Manual Method Only) */}
              {selectedParentalRequest.method === 'MANUAL' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Uploaded Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">ID Proof</p>
                          <p className="text-xs text-gray-500">{selectedParentalRequest.idProofFileName}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Consent Form</p>
                          <p className="text-xs text-gray-500">{selectedParentalRequest.consentFormFileName}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Review Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedParentalRequest.reviewNotes.map((note, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{note.action}</span>
                            <span className="text-xs text-gray-500">{new Date(note.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{note.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* DPO Decision Section */}
              {selectedParentalRequest.status === 'PENDING' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">DPO Decision</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="font-medium">Decision</Label>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="approve" 
                            name="decision" 
                            value="APPROVED"
                            checked={parentalConsentDecision === 'APPROVED'}
                            onChange={(e) => setParentalConsentDecision(e.target.value as 'APPROVED' | 'REJECTED')}
                          />
                          <Label htmlFor="approve" className="text-green-700">Approve</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="reject" 
                            name="decision" 
                            value="REJECTED"
                            checked={parentalConsentDecision === 'REJECTED'}
                            onChange={(e) => setParentalConsentDecision(e.target.value as 'APPROVED' | 'REJECTED')}
                          />
                          <Label htmlFor="reject" className="text-red-700">Reject</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="dpo-comments">Comments</Label>
                      <Textarea 
                        id="dpo-comments"
                        value={parentalConsentComments}
                        onChange={(e) => setParentalConsentComments(e.target.value)}
                        placeholder="Provide reason for decision and any additional notes..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Existing Decision (for approved/rejected requests) */}
              {selectedParentalRequest.status !== 'PENDING' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">DPO Decision</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="font-medium">Decision</Label>
                      <div className="mt-1">{getParentalConsentStatusBadge(selectedParentalRequest.status)}</div>
                    </div>
                    <div>
                      <Label className="font-medium">Processed By</Label>
                      <p className="text-sm">{selectedParentalRequest.processedBy}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Processed At</Label>
                      <p className="text-sm">{selectedParentalRequest.processedAt ? new Date(selectedParentalRequest.processedAt).toLocaleString() : 'N/A'}</p>
                    </div>
                    {selectedParentalRequest.dpoNotes && (
                      <div>
                        <Label className="font-medium">DPO Notes</Label>
                        <p className="text-sm text-gray-700">{selectedParentalRequest.dpoNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setParentalConsentDialogOpen(false)}>Close</Button>
            {selectedParentalRequest?.status === 'PENDING' && (
              <Button 
                onClick={handleParentalConsentDecision}
                disabled={!parentalConsentDecision}
                className={parentalConsentDecision === 'APPROVED' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                Submit Decision
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Parental Consent Review Dialog */}
      <Dialog open={parentalConsentDialogOpen} onOpenChange={setParentalConsentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Parental Consent Review: {selectedParentalRequest?.requestId}</DialogTitle>
            <DialogDescription>
              DPO review and approval for minor consent request
            </DialogDescription>
          </DialogHeader>
          
          {selectedParentalRequest && (
            <div className="space-y-6">
              {/* Request Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-gray-500">Status</div>
                    <div className="mt-1">{getParentalConsentStatusBadge(selectedParentalRequest.status)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-gray-500">Method</div>
                    <div className="mt-1">
                      <Badge variant={selectedParentalRequest.method === 'DIGILOCKER' ? 'default' : 'secondary'}>
                        {selectedParentalRequest.method}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-gray-500">Submitted</div>
                    <div className="mt-1 text-sm">{new Date(selectedParentalRequest.submittedAt).toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Child and Parent Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Child Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="font-medium">Name</Label>
                      <p className="text-sm">{selectedParentalRequest.childName}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Email</Label>
                      <p className="text-sm">{selectedParentalRequest.childEmail}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Age</Label>
                      <p className="text-sm">{selectedParentalRequest.childAge} years</p>
                    </div>
                    <div>
                      <Label className="font-medium">Child ID</Label>
                      <p className="text-sm font-mono">{selectedParentalRequest.childId}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Parent/Guardian Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="font-medium">Name</Label>
                      <p className="text-sm">{selectedParentalRequest.parentName}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Relationship</Label>
                      <p className="text-sm">{selectedParentalRequest.relationship}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Email</Label>
                      <p className="text-sm">{selectedParentalRequest.parentEmail}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Phone</Label>
                      <p className="text-sm">{selectedParentalRequest.parentPhone}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Uploaded Documents (Manual Method Only) */}
              {selectedParentalRequest.method === 'MANUAL' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Uploaded Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">ID Proof</p>
                          <p className="text-xs text-gray-500">{selectedParentalRequest.idProofFileName}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Consent Form</p>
                          <p className="text-xs text-gray-500">{selectedParentalRequest.consentFormFileName}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Review Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedParentalRequest.reviewNotes.map((note, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{note.action}</span>
                            <span className="text-xs text-gray-500">{new Date(note.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{note.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* DPO Decision Section */}
              {selectedParentalRequest.status === 'PENDING' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">DPO Decision</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="font-medium">Decision</Label>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="approve" 
                            name="decision" 
                            value="APPROVED"
                            checked={parentalConsentDecision === 'APPROVED'}
                            onChange={(e) => setParentalConsentDecision(e.target.value as 'APPROVED' | 'REJECTED')}
                          />
                          <Label htmlFor="approve" className="text-green-700">Approve</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="reject" 
                            name="decision" 
                            value="REJECTED"
                            checked={parentalConsentDecision === 'REJECTED'}
                            onChange={(e) => setParentalConsentDecision(e.target.value as 'APPROVED' | 'REJECTED')}
                          />
                          <Label htmlFor="reject" className="text-red-700">Reject</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="dpo-comments">Comments</Label>
                      <Textarea 
                        id="dpo-comments"
                        value={parentalConsentComments}
                        onChange={(e) => setParentalConsentComments(e.target.value)}
                        placeholder="Provide reason for decision and any additional notes..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Existing Decision (for approved/rejected requests) */}
              {selectedParentalRequest.status !== 'PENDING' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">DPO Decision</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="font-medium">Decision</Label>
                      <div className="mt-1">{getParentalConsentStatusBadge(selectedParentalRequest.status)}</div>
                    </div>
                    <div>
                      <Label className="font-medium">Processed By</Label>
                      <p className="text-sm">{selectedParentalRequest.processedBy}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Processed At</Label>
                      <p className="text-sm">{selectedParentalRequest.processedAt ? new Date(selectedParentalRequest.processedAt).toLocaleString() : 'N/A'}</p>
                    </div>
                    {selectedParentalRequest.dpoNotes && (
                      <div>
                        <Label className="font-medium">DPO Notes</Label>
                        <p className="text-sm text-gray-700">{selectedParentalRequest.dpoNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setParentalConsentDialogOpen(false)}>Close</Button>
            {selectedParentalRequest?.status === 'PENDING' && (
              <Button 
                onClick={handleParentalConsentDecision}
                disabled={!parentalConsentDecision}
                className={parentalConsentDecision === 'APPROVED' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                Submit Decision
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity History Dialog */}
      <ActivityHistory
        entityType={historyEntityType}
        entityId={historyEntityId}
        referenceNumber={historyReferenceNumber}
        isOpen={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        userRole="DPO"
      />
    </div>
  );
};

export default DPODashboard;
