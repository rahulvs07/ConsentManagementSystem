import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  Building, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  Database, 
  Shield,
  Search,
  Bell,
  Settings,
  Eye,
  Play,
  Pause,
  XCircle,
  Clock,
  Download,
  Upload,
  RefreshCw,
  Activity,
  BarChart3,
  Globe,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  User,
  Mail,
  Phone,
  Calendar,
  Filter,
  ChevronRight,
  Zap,
  Target,
  Scale,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  History,
  UserPlus,
  Send,
  Archive,
  Edit3,
  Edit,
  Trash2,
  Plus,
  Link,
  Unlink,
  Languages,
  ShieldCheck
} from 'lucide-react';
import { ConsentStatus, ProcessingPurpose, AuditAction, User as UserType, ConsentRecord, GrievanceTicket, GrievanceCategory, GrievanceStatus, GrievancePriority } from '@/types/dpdp';
import ActivityHistory from '@/components/ui/activity-history';

// Enhanced interfaces for BRD compliance
interface DataProcessingRequest {
  id: string;
  userId: string;
  userEmail: string;
  purposeId: string;
  purposeName: string;
  requestType: 'MARKETING' | 'ANALYTICS' | 'SERVICE_DELIVERY' | 'ACCOUNT_MANAGEMENT';
  status: 'PENDING_VALIDATION' | 'VALIDATED' | 'REJECTED' | 'PROCESSING' | 'COMPLETED';
  requestedAt: Date;
  validatedAt?: Date;
  consentStatus: ConsentStatus;
  consentId: string; // Link to specific consent
  metadata: {
    campaignId?: string;
    dataTypes: string[];
    processingBasis: string;
    retentionPeriod: string;
    legalBasis: string;
    dataCategories: string[];
  };
}

interface ConsentValidationRequest {
  id: string;
  userId: string;
  userEmail: string;
  purposeIds: string[];
  requestContext: string;
  status: 'VALID' | 'INVALID' | 'EXPIRED' | 'MISSING';
  validatedAt: Date;
  expiresAt?: Date;
  validationResult: {
    isValid: boolean;
    reasons: string[];
    recommendations: string[];
  };
}

interface ConsentCollectionFlow {
  id: string;
  name: string;
  description: string;
  purposeIds: string[];
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  collectionMethod: 'BANNER' | 'MODAL' | 'FORM' | 'API';
  languages: string[];
  templateId: string;
  linkedNoticeId?: string; // ID of the linked notice
  linkedNoticeName?: string; // Name of the linked notice
  createdAt: Date;
  lastUpdated: Date;
  metrics: {
    totalShown: number;
    totalAccepted: number;
    totalDeclined: number;
    conversionRate: number;
  };
}

interface DataPrincipalRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  requestType: 'ACCESS' | 'CORRECTION' | 'ERASURE' | 'PORTABILITY' | 'OBJECTION';
  status: 'SUBMITTED' | 'IN_PROGRESS' | 'FULFILLED' | 'REJECTED' | 'ESCALATED';
  submittedAt: Date;
  dueDate: Date;
  fulfilledAt?: Date;
  description: string;
  relatedConsents: string[]; // Array of consent IDs
  assignedTo?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  documents: string[];
  communicationLog: Array<{
    timestamp: Date;
    type: 'EMAIL' | 'PHONE' | 'SYSTEM';
    message: string;
    sentBy: string;
  }>;
}

interface ThirdPartyProcessor {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
  contractId: string;
  dataCategories: string[];
  purposeIds: string[];
  location: string;
  certifications: string[];
  lastAudit: Date;
  nextAudit: Date;
  complianceScore: number;
  processingAgreement: {
    signedDate: Date;
    expiryDate: Date;
    version: string;
    clauses: string[];
  };
}

interface ConsentLinkedGrievance extends GrievanceTicket {
  relatedConsentIds: string[]; // Array of related consent IDs
  consentDetails: Array<{
    consentId: string;
    purposeName: string;
    grantedAt: Date;
    status: ConsentStatus;
    issueDescription: string;
  }>;
  impactAssessment: {
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    affectedUsers: number;
    potentialRisk: string;
    mitigationSteps: string[];
  };
}

interface BulkValidationBatch {
  id: string;
  name: string;
  purposeId: string;
  purposeName: string;
  dataPrincipals: Array<{
    userId: string;
    email: string;
    name: string;
    consentStatus: ConsentStatus;
    lastValidated?: Date;
  }>;
  totalCount: number;
  validCount: number;
  invalidCount: number;
  pendingCount: number;
  createdAt: Date;
  lastValidated?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}

const DataFiduciaryDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [processingRequests, setProcessingRequests] = useState<DataProcessingRequest[]>([]);
  const [validationRequests, setValidationRequests] = useState<ConsentValidationRequest[]>([]);
  const [consentFlows, setConsentFlows] = useState<ConsentCollectionFlow[]>([]);
  const [dataPrincipalRequests, setDataPrincipalRequests] = useState<DataPrincipalRequest[]>([]);
  const [thirdPartyProcessors, setThirdPartyProcessors] = useState<ThirdPartyProcessor[]>([]);
  const [grievances, setGrievances] = useState<ConsentLinkedGrievance[]>([]);
  const [notifications, setNotifications] = useState<Array<{id: string, type: 'success' | 'warning' | 'error', message: string, timestamp: Date}>>([]);
  const [selectedRequest, setSelectedRequest] = useState<DataProcessingRequest | null>(null);
  const [selectedGrievance, setSelectedGrievance] = useState<ConsentLinkedGrievance | null>(null);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [grievanceDialogOpen, setGrievanceDialogOpen] = useState(false);
  const [newFlowDialogOpen, setNewFlowDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // History dialog states
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyEntityType, setHistoryEntityType] = useState<'GRIEVANCE' | 'DATA_REQUEST'>('GRIEVANCE');
  const [historyEntityId, setHistoryEntityId] = useState<string>('');
  const [historyReferenceNumber, setHistoryReferenceNumber] = useState<string>('');
  
  // Data Principal Request dialog states
  const [requestDetailDialogOpen, setRequestDetailDialogOpen] = useState(false);
  const [selectedDataPrincipalRequest, setSelectedDataPrincipalRequest] = useState<DataPrincipalRequest | null>(null);
  
  // New state for status change functionality - BRD Section 4.3.3 & 4.5 Compliance
  const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);
  const [selectedRequestForStatusChange, setSelectedRequestForStatusChange] = useState<DataPrincipalRequest | null>(null);
  const [selectedGrievanceForStatusChange, setSelectedGrievanceForStatusChange] = useState<ConsentLinkedGrievance | null>(null);
  const [statusChangeReason, setStatusChangeReason] = useState('');
  const [statusChangeNotes, setStatusChangeNotes] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');

  // Notice Management States
  const [selectedDataFiduciary, setSelectedDataFiduciary] = useState('df_ecommerce');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [generatedNotices, setGeneratedNotices] = useState<Array<{
    id: string;
    title: string;
    language: string;
    purposes: string[];
    createdAt: Date;
    version: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    content: string;
  }>>([
    {
      id: 'NOT-001',
      title: 'E-commerce Data Processing Notice',
      language: 'English',
      purposes: ['Account Management', 'Marketing Communications'],
      createdAt: new Date('2024-01-15'),
      version: '2.0',
      status: 'PUBLISHED',
      content: 'Complete notice content...'
    },
    {
      id: 'NOT-002', 
      title: 'बैंकिंग डेटा प्रसंस्करण सूचना',
      language: 'हिन्दी (Hindi)',
      purposes: ['Account Management', 'Security Monitoring'],
      createdAt: new Date('2024-01-10'),
      version: '1.5',
      status: 'PUBLISHED',
      content: 'Complete notice content in Hindi...'
    }
  ]);
  const [selectedNotice, setSelectedNotice] = useState<typeof generatedNotices[0] | null>(null);
  const [viewNoticeDialogOpen, setViewNoticeDialogOpen] = useState(false);

  // Notice Linking States
  const [noticeLinkingDialogOpen, setNoticeLinkingDialogOpen] = useState(false);
  const [selectedFlowForLinking, setSelectedFlowForLinking] = useState<ConsentCollectionFlow | null>(null);
  const [selectedNoticeForLinking, setSelectedNoticeForLinking] = useState('');

  // Bulk Validation States
  const [bulkValidationDialogOpen, setBulkValidationDialogOpen] = useState(false);
  const [bulkValidationBatches, setBulkValidationBatches] = useState<BulkValidationBatch[]>([
    {
      id: 'BULK-001',
      name: 'Marketing Campaign Validation',
      purposeId: 'marketing_001',
      purposeName: 'Marketing Campaign',
      dataPrincipals: [
        { userId: 'DP001', email: 'user1@example.com', name: 'John Doe', consentStatus: 'GRANTED', lastValidated: new Date('2024-01-10') },
        { userId: 'DP002', email: 'user2@example.com', name: 'Jane Smith', consentStatus: 'PENDING', lastValidated: undefined },
        { userId: 'DP003', email: 'user3@example.com', name: 'Bob Johnson', consentStatus: 'EXPIRED', lastValidated: new Date('2023-12-15') },
        { userId: 'DP004', email: 'user4@example.com', name: 'Alice Brown', consentStatus: 'GRANTED', lastValidated: new Date('2024-01-08') },
        { userId: 'DP005', email: 'user5@example.com', name: 'Charlie Wilson', consentStatus: 'REVOKED', lastValidated: new Date('2024-01-05') }
      ],
      totalCount: 5,
      validCount: 2,
      invalidCount: 2,
      pendingCount: 1,
      createdAt: new Date('2024-01-01'),
      lastValidated: new Date('2024-01-10'),
      status: 'COMPLETED'
    },
    {
      id: 'BULK-002',
      name: 'Analytics Data Validation',
      purposeId: 'analytics_001',
      purposeName: 'User Analytics',
      dataPrincipals: [
        { userId: 'DP006', email: 'user6@example.com', name: 'David Lee', consentStatus: 'GRANTED', lastValidated: new Date('2024-01-12') },
        { userId: 'DP007', email: 'user7@example.com', name: 'Emma Davis', consentStatus: 'GRANTED', lastValidated: new Date('2024-01-11') },
        { userId: 'DP008', email: 'user8@example.com', name: 'Frank Miller', consentStatus: 'PENDING', lastValidated: undefined }
      ],
      totalCount: 3,
      validCount: 2,
      invalidCount: 0,
      pendingCount: 1,
      createdAt: new Date('2024-01-05'),
      lastValidated: new Date('2024-01-12'),
      status: 'COMPLETED'
    }
  ]);
  const [selectedBatchForValidation, setSelectedBatchForValidation] = useState<BulkValidationBatch | null>(null);
  const [bulkValidationResultsDialogOpen, setBulkValidationResultsDialogOpen] = useState(false);

  // All 22 official Indian languages as per DPDP Act 2023
  const indianLanguages = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'हिन्दी (Hindi)' },
    { value: 'bengali', label: 'বাংলা (Bengali)' },
    { value: 'tamil', label: 'தமிழ் (Tamil)' },
    { value: 'telugu', label: 'తెలుగు (Telugu)' },
    { value: 'marathi', label: 'मराठी (Marathi)' },
    { value: 'gujarati', label: 'ગુજરાતી (Gujarati)' },
    { value: 'kannada', label: 'ಕನ್ನಡ (Kannada)' },
    { value: 'malayalam', label: 'മലയാളം (Malayalam)' },
    { value: 'punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { value: 'assamese', label: 'অসমীয়া (Assamese)' },
    { value: 'oriya', label: 'ଓଡ଼ିଆ (Oriya)' },
    { value: 'urdu', label: 'اردو (Urdu)' },
    { value: 'kashmiri', label: 'कॉशुर (Kashmiri)' },
    { value: 'sindhi', label: 'सिन्धी (Sindhi)' },
    { value: 'nepali', label: 'नेपाली (Nepali)' },
    { value: 'konkani', label: 'कोंकणी (Konkani)' },
    { value: 'manipuri', label: 'মৈতৈলোন্ (Manipuri)' },
    { value: 'bodo', label: 'बर\' (Bodo)' },
    { value: 'dogri', label: 'डोगरी (Dogri)' },
    { value: 'maithili', label: 'मैथिली (Maithili)' },
    { value: 'santhali', label: 'ᱥᱟᱱᱛᱟᱲᱤ (Santhali)' },
    { value: 'sanskrit', label: 'संस्कृत (Sanskrit)' }
  ];

  // Enhanced mock data initialization for BRD compliance
  useEffect(() => {
    const mockProcessingRequests: DataProcessingRequest[] = [
      {
        id: 'req_001',
        userId: 'dp_001',
        userEmail: 'alice.smith@email.com',
        purposeId: 'marketing_001',
        purposeName: 'Email Marketing Campaign',
        requestType: 'MARKETING',
        status: 'PENDING_VALIDATION',
        requestedAt: new Date('2024-01-20T10:30:00Z'),
        consentStatus: ConsentStatus.GRANTED,
        consentId: 'consent_001',
        metadata: {
          campaignId: 'camp_winter_2024',
          dataTypes: ['Email Address', 'Purchase History', 'Preferences'],
          processingBasis: 'Consent',
          retentionPeriod: '2 years',
          legalBasis: 'Section 7 DPDP Act 2023',
          dataCategories: ['Contact Data', 'Behavioral Data']
        }
      },
      {
        id: 'req_002',
        userId: 'dp_002',
        userEmail: 'john.doe@email.com',
        purposeId: 'analytics_001',
        purposeName: 'User Behavior Analytics',
        requestType: 'ANALYTICS',
        status: 'VALIDATED',
        requestedAt: new Date('2024-01-20T09:15:00Z'),
        validatedAt: new Date('2024-01-20T09:16:00Z'),
        consentStatus: ConsentStatus.GRANTED,
        consentId: 'consent_002',
        metadata: {
          dataTypes: ['Usage Data', 'Device Information', 'Session Data'],
          processingBasis: 'Consent',
          retentionPeriod: '1 year',
          legalBasis: 'Section 7 DPDP Act 2023',
          dataCategories: ['Technical Data', 'Usage Data']
        }
      },
      {
        id: 'req_003',
        userId: 'dp_003',
        userEmail: 'jane.wilson@email.com',
        purposeId: 'service_001',
        purposeName: 'Customer Service Enhancement',
        requestType: 'SERVICE_DELIVERY',
        status: 'PROCESSING',
        requestedAt: new Date('2024-01-20T08:45:00Z'),
        validatedAt: new Date('2024-01-20T08:46:00Z'),
        consentStatus: ConsentStatus.GRANTED,
        consentId: 'consent_003',
        metadata: {
          dataTypes: ['Contact Information', 'Service History', 'Preferences'],
          processingBasis: 'Consent',
          retentionPeriod: '3 years',
          legalBasis: 'Section 7 DPDP Act 2023',
          dataCategories: ['Contact Data', 'Service Data']
        }
      }
    ];

    const mockValidationRequests: ConsentValidationRequest[] = [
      {
        id: 'val_001',
        userId: 'dp_001',
        userEmail: 'alice.smith@email.com',
        purposeIds: ['marketing_001', 'analytics_001'],
        requestContext: 'Marketing Campaign Launch',
        status: 'VALID',
        validatedAt: new Date('2024-01-20T10:30:00Z'),
        expiresAt: new Date('2024-07-20T10:30:00Z'),
        validationResult: {
          isValid: true,
          reasons: ['Active consent found', 'Purpose matches', 'Not expired'],
          recommendations: []
        }
      },
      {
        id: 'val_002',
        userId: 'dp_003',
        userEmail: 'jane.wilson@email.com',
        purposeIds: ['marketing_002'],
        requestContext: 'Newsletter Subscription',
        status: 'EXPIRED',
        validatedAt: new Date('2024-01-20T11:00:00Z'),
        validationResult: {
          isValid: false,
          reasons: ['Consent has expired'],
          recommendations: ['Request consent renewal', 'Halt processing until renewed']
        }
      }
    ];

    // Mock Consent Collection Flows
    const mockConsentFlows: ConsentCollectionFlow[] = [
      {
        id: 'flow_001',
        name: 'Registration Consent Flow',
        description: 'Consent collection during user registration',
        purposeIds: ['account_001', 'service_001'],
        status: 'ACTIVE',
        collectionMethod: 'FORM',
        languages: ['en', 'hi', 'mr', 'bn', 'ml'],
        templateId: 'template_reg_001',
        linkedNoticeId: 'NOT-001',
        linkedNoticeName: 'E-commerce Data Processing Notice',
        createdAt: new Date('2024-01-01'),
        lastUpdated: new Date('2024-01-15'),
        metrics: {
          totalShown: 1250,
          totalAccepted: 1187,
          totalDeclined: 63,
          conversionRate: 94.96
        }
      },
      {
        id: 'flow_002',
        name: 'Marketing Consent Banner',
        description: 'Cookie and marketing consent banner',
        purposeIds: ['marketing_001', 'analytics_001'],
        status: 'ACTIVE',
        collectionMethod: 'BANNER',
        languages: ['en', 'hi'],
        templateId: 'template_banner_001',
        linkedNoticeId: 'NOT-002',
        linkedNoticeName: 'बैंकिंग डेटा प्रसंस्करण सूचना',
        createdAt: new Date('2024-01-10'),
        lastUpdated: new Date('2024-01-18'),
        metrics: {
          totalShown: 5420,
          totalAccepted: 3251,
          totalDeclined: 2169,
          conversionRate: 59.98
        }
      }
    ];

    // Mock Data Principal Requests
    const mockDataPrincipalRequests: DataPrincipalRequest[] = [
      {
        id: 'dsr_001',
        userId: 'dp_001',
        userEmail: 'alice.smith@email.com',
        userName: 'Alice Smith',
        requestType: 'ACCESS',
        status: 'IN_PROGRESS',
        submittedAt: new Date('2024-01-18T14:30:00Z'),
        dueDate: new Date('2024-02-17T14:30:00Z'), // 30 days as per DPDP Act
        description: 'Request for all personal data processed by the organization',
        relatedConsents: ['consent_001', 'consent_002'],
        assignedTo: 'dpo@company.com',
        priority: 'MEDIUM',
        documents: ['access_request_form.pdf'],
        communicationLog: [
          {
            timestamp: new Date('2024-01-18T14:35:00Z'),
            type: 'EMAIL',
            message: 'Access request received and being processed',
            sentBy: 'system'
          }
        ]
      },
      {
        id: 'dsr_002',
        userId: 'dp_003',
        userEmail: 'jane.wilson@email.com',
        userName: 'Jane Wilson',
        requestType: 'ERASURE',
        status: 'SUBMITTED',
        submittedAt: new Date('2024-01-19T16:15:00Z'),
        dueDate: new Date('2024-02-18T16:15:00Z'),
        description: 'Request to delete all personal data due to withdrawal of consent',
        relatedConsents: ['consent_003'],
        priority: 'HIGH',
        documents: [],
        communicationLog: []
      }
    ];

    // Mock Third Party Processors
    const mockThirdPartyProcessors: ThirdPartyProcessor[] = [
      {
        id: 'processor_001',
        name: 'CloudAnalytics Pro',
        email: 'compliance@cloudanalytics.com',
        status: 'ACTIVE',
        contractId: 'DPA_2024_001',
        dataCategories: ['Usage Data', 'Device Information'],
        purposeIds: ['analytics_001'],
        location: 'India',
        certifications: ['ISO 27001', 'SOC 2 Type II'],
        lastAudit: new Date('2023-12-15'),
        nextAudit: new Date('2024-06-15'),
        complianceScore: 96,
        processingAgreement: {
          signedDate: new Date('2024-01-01'),
          expiryDate: new Date('2025-12-31'),
          version: '2.1',
          clauses: ['Data Minimization', 'Purpose Limitation', 'Security Measures']
        }
      },
      {
        id: 'processor_002',
        name: 'EmailMarketing Solutions',
        email: 'legal@emailmarketing.com',
        status: 'ACTIVE',
        contractId: 'DPA_2024_002',
        dataCategories: ['Contact Data', 'Preference Data'],
        purposeIds: ['marketing_001'],
        location: 'India',
        certifications: ['ISO 27001'],
        lastAudit: new Date('2024-01-10'),
        nextAudit: new Date('2024-07-10'),
        complianceScore: 92,
        processingAgreement: {
          signedDate: new Date('2024-01-05'),
          expiryDate: new Date('2024-12-31'),
          version: '1.8',
          clauses: ['Data Retention', 'Breach Notification', 'Sub-processor Management']
        }
      }
    ];

    // Mock Consent-Linked Grievances (BRD 4.5 Compliance)
    const mockGrievances: ConsentLinkedGrievance[] = [
      {
        id: 'grv_001',
        referenceNumber: 'GRV-2024-001',
        userId: 'dp_001',
        category: GrievanceCategory.CONSENT_VIOLATION,
        subject: 'Unauthorized Marketing Emails',
        description: 'Receiving marketing emails despite withdrawing consent',
        status: GrievanceStatus.IN_PROGRESS,
        priority: GrievancePriority.HIGH,
        createdAt: new Date('2024-01-19T10:00:00Z'),
        updatedAt: new Date('2024-01-19T15:30:00Z'),
        assignedTo: 'grievance.officer@company.com',
        contactEmail: 'alice.smith@email.com',
        contactPhone: '+91-9876543210',
        evidence: ['email_screenshot.png', 'consent_withdrawal_proof.pdf'],
        relatedConsentIds: ['consent_001'],
        consentDetails: [
          {
            consentId: 'consent_001',
            purposeName: 'Email Marketing Campaign',
            grantedAt: new Date('2023-12-01T09:00:00Z'),
            status: ConsentStatus.WITHDRAWN,
            issueDescription: 'Consent withdrawn but emails continue'
          }
        ],
        impactAssessment: {
          severity: 'HIGH',
          affectedUsers: 1,
          potentialRisk: 'Regulatory non-compliance, user trust erosion',
          mitigationSteps: [
            'Immediate halt of marketing emails',
            'System audit for consent processing',
            'User notification and apology'
          ]
        }
      },
      {
        id: 'grv_002',
        referenceNumber: 'GRV-2024-002',
        userId: 'dp_002',
        category: GrievanceCategory.PROCESSING_ERROR,
        subject: 'Data Processing Beyond Consent Scope',
        description: 'Personal data being used for purposes not consented to',
        status: GrievanceStatus.SUBMITTED,
        priority: GrievancePriority.CRITICAL,
        createdAt: new Date('2024-01-20T08:30:00Z'),
        updatedAt: new Date('2024-01-20T08:30:00Z'),
        contactEmail: 'john.doe@email.com',
        evidence: ['data_usage_report.pdf'],
        relatedConsentIds: ['consent_002'],
        consentDetails: [
          {
            consentId: 'consent_002',
            purposeName: 'User Behavior Analytics',
            grantedAt: new Date('2023-11-15T14:20:00Z'),
            status: ConsentStatus.GRANTED,
            issueDescription: 'Data used for marketing without explicit consent'
          }
        ],
        impactAssessment: {
          severity: 'CRITICAL',
          affectedUsers: 1,
          potentialRisk: 'DPDP Act violation, potential penalty',
          mitigationSteps: [
            'Immediate cessation of unauthorized processing',
            'Legal review of processing activities',
            'Enhanced consent validation procedures'
          ]
        }
      }
    ];

    setProcessingRequests(mockProcessingRequests);
    setValidationRequests(mockValidationRequests);
    setConsentFlows(mockConsentFlows);
    setDataPrincipalRequests(mockDataPrincipalRequests);
    setThirdPartyProcessors(mockThirdPartyProcessors);
    setGrievances(mockGrievances);
  }, []);

  const processingMetrics = [
    { 
      label: 'Active Consents', 
      value: '1,247', 
      trend: '+15%', 
      icon: CheckCircle, 
      color: 'emerald',
      description: 'Valid consents across all purposes'
    },
    { 
      label: 'Processing Requests', 
      value: processingRequests.length.toString(), 
      trend: '+8%', 
      icon: Activity,
      color: 'blue',
      description: 'Data processing validation requests'
    },
    { 
              label: 'Data Principal Requests',
        value: dataPrincipalRequests.length.toString(), 
      trend: '+12%', 
      icon: Users,
      color: 'purple',
      description: 'Access, correction, erasure requests'
    },
    { 
      label: 'Consent-Linked Grievances', 
      value: grievances.length.toString(), 
      trend: '-5%', 
      icon: MessageSquare,
      color: 'orange',
      description: 'Grievances related to consent violations'
    },
    { 
      label: 'Consent Collection Flows', 
      value: consentFlows.length.toString(), 
      trend: '+3%', 
      icon: Target,
      color: 'teal',
      description: 'Active consent collection mechanisms'
    },
    { 
      label: 'Third-Party Processors', 
      value: thirdPartyProcessors.length.toString(), 
      trend: '0%', 
      icon: Building,
      color: 'gray',
      description: 'Active data processing partners'
    },
    { 
      label: 'Validation Success', 
      value: '94.2%', 
      trend: '+2.1%', 
      icon: Target, 
      color: 'purple',
      description: 'Successful consent validations'
    },
    { 
      label: 'Compliance Score', 
      value: '98.7%', 
      trend: '+1.2%', 
      icon: Scale, 
      color: 'indigo',
      description: 'Overall DPDP compliance rating'
    },
  ];

  // Utility functions
  const addNotification = (type: 'success' | 'warning' | 'error', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message, timestamp: new Date() }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const validateConsent = async (request: DataProcessingRequest) => {
    setSelectedRequest(request);
    
    // Mock validation logic - simulate API call to CMS
    const isValid = request.consentStatus === ConsentStatus.GRANTED;
    const validationResult = {
      isValid,
      reasons: isValid 
        ? ['Active consent found', 'Purpose matches request', 'Consent not expired']
        : ['No valid consent found', 'Purpose mismatch', 'Consent expired'],
      recommendations: isValid 
        ? ['Processing can proceed']
        : ['Request new consent', 'Halt processing', 'Contact data principal']
    };

    const newValidation: ConsentValidationRequest = {
      id: `val_${Date.now()}`,
      userId: request.userId,
      userEmail: request.userEmail,
      purposeIds: [request.purposeId],
      requestContext: request.purposeName,
      status: isValid ? 'VALID' : 'INVALID',
      validatedAt: new Date(),
      expiresAt: isValid ? new Date(Date.now() + (6 * 30 * 24 * 60 * 60 * 1000)) : undefined,
      validationResult
    };

    setValidationRequests(prev => [...prev, newValidation]);
    
    // Update processing request status
    setProcessingRequests(prev => prev.map(req => 
      req.id === request.id 
        ? { ...req, status: isValid ? 'VALIDATED' : 'REJECTED', validatedAt: new Date() }
        : req
    ));

    addNotification(
      isValid ? 'success' : 'error',
      `Consent validation ${isValid ? 'successful' : 'failed'} for ${request.userEmail}`
    );

    setValidationDialogOpen(false);
  };

  const initiateProcessing = (request: DataProcessingRequest) => {
    if (request.status !== 'VALIDATED') {
      addNotification('error', 'Cannot process without valid consent validation');
      return;
    }

    setProcessingRequests(prev => prev.map(req => 
      req.id === request.id 
        ? { ...req, status: 'PROCESSING' }
        : req
    ));

    addNotification('success', `Data processing initiated for ${request.purposeName}`);
    
    // Simulate processing completion after 3 seconds
    setTimeout(() => {
      setProcessingRequests(prev => prev.map(req => 
        req.id === request.id 
          ? { ...req, status: 'COMPLETED' }
          : req
      ));
      addNotification('success', `Data processing completed for ${request.purposeName}`);
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_VALIDATION':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pending Validation</Badge>;
      case 'VALIDATED':
        return <Badge className="bg-green-100 text-green-800">Validated</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'PROCESSING':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-emerald-100 text-emerald-800">Completed</Badge>;
      case 'VALID':
        return <Badge className="bg-green-100 text-green-800">Valid</Badge>;
      case 'INVALID':
        return <Badge variant="destructive">Invalid</Badge>;
      case 'EXPIRED':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">Expired</Badge>;
      case 'MISSING':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">Missing</Badge>;
      // Grievance Status Badges - BRD Section 4.5 Compliant
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Submitted</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'pending_info':
        return <Badge variant="destructive" className="bg-orange-100 text-orange-800">Pending Info</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Closed</Badge>;
      case 'escalated':
        return <Badge variant="destructive">Escalated</Badge>;
      // Data Principal Request Statuses - BRD Section 4.3.3 Compliant
      case 'SUBMITTED':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Submitted</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'FULFILLED':
        return <Badge className="bg-green-100 text-green-800">Fulfilled</Badge>;
      case 'ESCALATED':
        return <Badge variant="destructive">Escalated</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // BRD Section 4.3.3 & 4.5 Compliant Status Change Functions
  const handleRequestStatusChange = (request: DataPrincipalRequest) => {
    setSelectedRequestForStatusChange(request);
    setSelectedGrievanceForStatusChange(null);
    setNewStatus(request.status);
    setStatusChangeReason('');
    setStatusChangeNotes('');
    setStatusChangeDialogOpen(true);
  };

  const handleGrievanceStatusChange = (grievance: ConsentLinkedGrievance) => {
    setSelectedGrievanceForStatusChange(grievance);
    setSelectedRequestForStatusChange(null);
    setNewStatus(grievance.status);
    setStatusChangeReason('');
    setStatusChangeNotes('');
    setStatusChangeDialogOpen(true);
  };

  const handleViewRequest = (request: DataPrincipalRequest) => {
    setSelectedDataPrincipalRequest(request);
    setRequestDetailDialogOpen(true);
  };

  const handleShowRequestHistory = (request: DataPrincipalRequest) => {
    setHistoryEntityType('DATA_REQUEST');
    setHistoryEntityId(request.id);
    setHistoryReferenceNumber(request.id);
    setHistoryDialogOpen(true);
  };

  const updateRequestStatus = async () => {
    if (!selectedRequestForStatusChange || !newStatus || !statusChangeReason) {
      addNotification('error', 'Please provide all required information for status change');
      return;
    }

    const updatedRequest = {
      ...selectedRequestForStatusChange,
      status: newStatus as DataPrincipalRequest['status'],
      ...(newStatus === 'FULFILLED' && { fulfilledAt: new Date() }),
      communicationLog: [
        ...selectedRequestForStatusChange.communicationLog,
        {
          timestamp: new Date(),
          type: 'SYSTEM' as const,
          message: `Status changed to ${newStatus}. Reason: ${statusChangeReason}${statusChangeNotes ? `. Notes: ${statusChangeNotes}` : ''}`,
          sentBy: 'Data Fiduciary'
        }
      ]
    };

    setDataPrincipalRequests(prev => 
      prev.map(req => req.id === selectedRequestForStatusChange.id ? updatedRequest : req)
    );

    // Create audit log entry - BRD Section 4.7.1 Compliance
    const auditEntry = {
      logId: `audit_${Date.now()}`,
      userId: selectedRequestForStatusChange.userId,
      purposeId: selectedRequestForStatusChange.relatedConsents[0] || 'N/A',
      actionType: 'DATA_REQUEST_STATUS_UPDATED',
      timestamp: new Date(),
      consentStatus: 'ACTIVE',
      initiator: 'Data Fiduciary',
      sourceIP: '192.168.1.1', // In real implementation, get actual IP
      auditHash: `hash_${Date.now()}`,
      metadata: {
        requestId: selectedRequestForStatusChange.id,
        oldStatus: selectedRequestForStatusChange.status,
        newStatus: newStatus,
        reason: statusChangeReason,
        notes: statusChangeNotes
      }
    };

    console.log('Audit Log Entry:', auditEntry); // In real implementation, send to audit service

    addNotification('success', `Request status updated to ${newStatus} for ${selectedRequestForStatusChange.userName}`);
    
    // Send notification to Data Principal - BRD Section 4.4.1 Compliance
    const notificationMessage = `Your data request (${selectedRequestForStatusChange.requestType}) status has been updated to ${newStatus}`;
    console.log('Sending notification to:', selectedRequestForStatusChange.userEmail, notificationMessage);
    
    setStatusChangeDialogOpen(false);
    setSelectedRequestForStatusChange(null);
    setStatusChangeReason('');
    setStatusChangeNotes('');
  };

  const updateGrievanceStatus = async () => {
    if (!selectedGrievanceForStatusChange || !newStatus || !statusChangeReason) {
      addNotification('error', 'Please provide all required information for status change');
      return;
    }

    const updatedGrievance = {
      ...selectedGrievanceForStatusChange,
      status: newStatus as GrievanceStatus,
      ...(newStatus === GrievanceStatus.RESOLVED && { resolvedAt: new Date() }),
      ...(newStatus === GrievanceStatus.CLOSED && { closedAt: new Date() }),
      resolutionNotes: statusChangeNotes || selectedGrievanceForStatusChange.resolutionNotes
    };

    setGrievances(prev => 
      prev.map(grievance => grievance.id === selectedGrievanceForStatusChange.id ? updatedGrievance : grievance)
    );

    // Create audit log entry - BRD Section 4.7.1 Compliance
    const auditEntry = {
      logId: `audit_${Date.now()}`,
      userId: selectedGrievanceForStatusChange.userId,
      purposeId: selectedGrievanceForStatusChange.relatedConsentIds[0] || 'N/A',
      actionType: 'GRIEVANCE_STATUS_UPDATED',
      timestamp: new Date(),
      consentStatus: 'ACTIVE',
      initiator: 'Data Fiduciary',
      sourceIP: '192.168.1.1', // In real implementation, get actual IP
      auditHash: `hash_${Date.now()}`,
      metadata: {
        grievanceId: selectedGrievanceForStatusChange.id,
        oldStatus: selectedGrievanceForStatusChange.status,
        newStatus: newStatus,
        reason: statusChangeReason,
        notes: statusChangeNotes
      }
    };

    console.log('Audit Log Entry:', auditEntry); // In real implementation, send to audit service

    addNotification('success', `Grievance status updated to ${newStatus} for ${selectedGrievanceForStatusChange.referenceNumber}`);
    
    // Send notification to Data Principal - BRD Section 4.4.1 Compliance
    const notificationMessage = `Your grievance (${selectedGrievanceForStatusChange.referenceNumber}) status has been updated to ${newStatus}`;
    console.log('Sending notification to:', selectedGrievanceForStatusChange.contactEmail, notificationMessage);
    
    setStatusChangeDialogOpen(false);
    setSelectedGrievanceForStatusChange(null);
    setStatusChangeReason('');
    setStatusChangeNotes('');
  };

  const getAvailableStatuses = () => {
    if (selectedRequestForStatusChange) {
      const currentStatus = selectedRequestForStatusChange.status;
      // BRD Section 4.3.3 - Valid status transitions for Data Principal Requests
      const statusTransitions = {
        'SUBMITTED': ['IN_PROGRESS', 'REJECTED'],
        'IN_PROGRESS': ['FULFILLED', 'REJECTED', 'ESCALATED'],
        'FULFILLED': ['CLOSED'],
        'REJECTED': ['IN_PROGRESS'],
        'ESCALATED': ['IN_PROGRESS', 'FULFILLED', 'REJECTED']
      };
      return statusTransitions[currentStatus] || [];
    }
    
    if (selectedGrievanceForStatusChange) {
      const currentStatus = selectedGrievanceForStatusChange.status;
      // BRD Section 4.5.2 - Valid status transitions for Grievances
      const statusTransitions = {
        [GrievanceStatus.SUBMITTED]: [GrievanceStatus.IN_PROGRESS, GrievanceStatus.PENDING_INFO],
        [GrievanceStatus.IN_PROGRESS]: [GrievanceStatus.RESOLVED, GrievanceStatus.PENDING_INFO, GrievanceStatus.ESCALATED],
        [GrievanceStatus.PENDING_INFO]: [GrievanceStatus.IN_PROGRESS, GrievanceStatus.ESCALATED],
        [GrievanceStatus.RESOLVED]: [GrievanceStatus.CLOSED],
        [GrievanceStatus.ESCALATED]: [GrievanceStatus.IN_PROGRESS, GrievanceStatus.RESOLVED],
        [GrievanceStatus.CLOSED]: [] // No transitions from closed
      };
      return statusTransitions[currentStatus] || [];
    }
    
    return [];
  };

  // Notice Management Handlers
  const handlePurposeToggle = (purpose: string) => {
    setSelectedPurposes(prev => 
      prev.includes(purpose) 
        ? prev.filter(p => p !== purpose)
        : [...prev, purpose]
    );
  };

  const handleGenerateNotice = () => {
    const newNotice = {
      id: `NOT-${String(generatedNotices.length + 1).padStart(3, '0')}`,
      title: `${selectedDataFiduciary === 'df_ecommerce' ? 'E-commerce' : selectedDataFiduciary === 'df_fintech' ? 'Banking' : 'Healthcare'} Data Processing Notice`,
      language: indianLanguages.find(lang => lang.value === selectedLanguage)?.label || 'English',
      purposes: selectedPurposes,
      createdAt: new Date(),
      version: '1.0',
      status: 'DRAFT' as const,
      content: 'Generated notice content based on selected purposes and language...'
    };
    
    setGeneratedNotices(prev => [newNotice, ...prev]);
    addNotification('success', `Notice generated successfully in ${newNotice.language}`);
  };

  const handleSaveNotice = () => {
    addNotification('success', 'Notice saved successfully');
  };

  const handleDownloadNotice = (format: 'pdf' | 'docx') => {
    addNotification('success', `Notice downloaded as ${format.toUpperCase()}`);
  };

  const handleViewNotice = (notice: typeof generatedNotices[0]) => {
    setSelectedNotice(notice);
    setViewNoticeDialogOpen(true);
  };

  const getStatusBadgeVariantForNotice = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'default';
      case 'DRAFT': return 'secondary';
      case 'ARCHIVED': return 'outline';
      default: return 'secondary';
    }
  };

  // Notice Linking Handlers  
  const handleManageNoticeLink = (flow: ConsentCollectionFlow) => {
    setSelectedFlowForLinking(flow);
    setSelectedNoticeForLinking(flow.linkedNoticeId || '');
    setNoticeLinkingDialogOpen(true);
  };

  const handleLinkNoticeToFlow = () => {
    if (selectedFlowForLinking && selectedNoticeForLinking) {
      const selectedNotice = generatedNotices.find(n => n.id === selectedNoticeForLinking);
      if (selectedNotice) {
        // Update the flow with linked notice
        setConsentFlows(prevFlows => 
          prevFlows.map(flow => 
            flow.id === selectedFlowForLinking.id 
              ? { 
                  ...flow, 
                  linkedNoticeId: selectedNotice.id,
                  linkedNoticeName: `${selectedNotice.language === 'english' ? 'E-commerce' : 'बैंकिंग'} Data Processing Notice`,
                  lastUpdated: new Date()
                }
              : flow
          )
        );
        addNotification('success', `Notice linked to ${selectedFlowForLinking.name} successfully`);
        setNoticeLinkingDialogOpen(false);
        setSelectedFlowForLinking(null);
        setSelectedNoticeForLinking('');
      }
    }
  };

  // Bulk Validation Handlers
  const handleCreateBulkValidation = () => {
    setBulkValidationDialogOpen(true);
  };

  const handleRunBulkValidation = (batch: BulkValidationBatch) => {
    // Simulate running bulk validation
    setBulkValidationBatches(prevBatches =>
      prevBatches.map(b =>
        b.id === batch.id
          ? { ...b, status: 'IN_PROGRESS' as const }
          : b
      )
    );
    
    addNotification('success', `Bulk validation started for ${batch.name}`);
    
    // Simulate completion after 3 seconds
    setTimeout(() => {
      setBulkValidationBatches(prevBatches =>
        prevBatches.map(b =>
          b.id === batch.id
            ? { 
                ...b, 
                status: 'COMPLETED' as const,
                lastValidated: new Date(),
                validCount: Math.floor(b.totalCount * 0.8),
                invalidCount: Math.floor(b.totalCount * 0.15),
                pendingCount: b.totalCount - Math.floor(b.totalCount * 0.8) - Math.floor(b.totalCount * 0.15)
              }
            : b
        )
      );
      addNotification('success', `Bulk validation completed for ${batch.name}`);
    }, 3000);
  };

  const handleViewBulkValidationResults = (batch: BulkValidationBatch) => {
    setSelectedBatchForValidation(batch);
    setBulkValidationResultsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <Alert key={notification.id} className={`w-96 ${
            notification.type === 'success' ? 'border-green-500 bg-green-50' :
            notification.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
            'border-red-500 bg-red-50'
          }`}>
            <AlertDescription className="flex items-center gap-2">
              {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
              {notification.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
              {notification.type === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
              {notification.message}
            </AlertDescription>
          </Alert>
        ))}
          </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Building className="h-8 w-8 text-emerald-600" />
                Data Fiduciary Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive consent management and data processing validation for DPDP Act 2023 compliance
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">
                <Shield className="h-3 w-3 mr-1" />
                DPDP Compliant
              </Badge>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications ({notifications.length})
              </Button>
            </div>
        </div>
      </div>

      {/* Processing Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {processingMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-${metric.color}-100`}>
                      <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                    </div>
                    </div>
                  <div className="mt-4">
                    <span className={`text-sm font-medium text-${metric.color}-600`}>
                      {metric.trend} from last period
                    </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 h-auto">
            <TabsTrigger value="overview" className="text-xs px-2 py-3">Overview</TabsTrigger>
            <TabsTrigger value="notices" className="text-xs px-2 py-3">Notice Management</TabsTrigger>
            <TabsTrigger value="consent-collection" className="text-xs px-2 py-3">Consent Collection</TabsTrigger>
            <TabsTrigger value="validation" className="text-xs px-2 py-3">Consent Validation</TabsTrigger>
            <TabsTrigger value="data-principal" className="text-xs px-2 py-3">Data Principal Requests</TabsTrigger>
            <TabsTrigger value="grievances" className="text-xs px-2 py-3">Grievance Management</TabsTrigger>
            <TabsTrigger value="third-party" className="text-xs px-2 py-3">Third-Party Management</TabsTrigger>
            <TabsTrigger value="processing" className="text-xs px-2 py-3">Data Processing</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Processing Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Recent Processing Requests
            </CardTitle>
                  <CardDescription>
                    Latest data processing requests requiring validation
                  </CardDescription>
          </CardHeader>
                <CardContent>
            <div className="space-y-4">
                    {processingRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{request.purposeName}</h4>
                            <p className="text-sm text-gray-600">{request.userEmail}</p>
                  </div>
                          {getStatusBadge(request.status)}
                  </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{request.requestType}</span>
                          <span>{request.requestedAt.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

              {/* Validation Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Validation Results
            </CardTitle>
                  <CardDescription>
                    Recent consent validation outcomes
                  </CardDescription>
          </CardHeader>
                <CardContent>
            <div className="space-y-4">
                    {validationRequests.slice(0, 3).map((validation) => (
                      <div key={validation.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                    <div>
                            <h4 className="font-medium text-gray-900">{validation.requestContext}</h4>
                            <p className="text-sm text-gray-600">{validation.userEmail}</p>
                          </div>
                          {getStatusBadge(validation.status)}
                    </div>
                        <div className="text-xs text-gray-500">
                          {validation.validationResult.reasons.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common Data Fiduciary operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20 flex-col gap-2" variant="outline">
                    <Search className="h-6 w-6" />
                    <span>Validate Consent</span>
                  </Button>
                  <Button className="h-20 flex-col gap-2" variant="outline">
                    <Database className="h-6 w-6" />
                    <span>Process Data</span>
                  </Button>
                  <Button className="h-20 flex-col gap-2" variant="outline">
                    <FileText className="h-6 w-6" />
                    <span>Generate Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consent Validation Tab */}
          <TabsContent value="validation" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Consent Validation Console</h2>
                <p className="text-gray-600">Validate consent before initiating data processing activities</p>
              </div>
              <Button onClick={handleCreateBulkValidation}>
                <Users className="w-4 h-4 mr-2" />
                Create Bulk Validation
              </Button>
            </div>

            {/* Individual Validation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-purple-600" />
                  Individual Consent Validation
          </CardTitle>
                <CardDescription>
                  Validate consent for individual data principals
                </CardDescription>
        </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="user-email">User Email</Label>
                      <Input id="user-email" placeholder="user@example.com" />
                    </div>
              <div>
                      <Label htmlFor="purpose-id">Purpose ID</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="marketing_001">Marketing Campaign</SelectItem>
                          <SelectItem value="analytics_001">User Analytics</SelectItem>
                          <SelectItem value="service_001">Service Delivery</SelectItem>
                        </SelectContent>
                      </Select>
              </div>
                    <div className="flex items-end">
                      <Button className="w-full">
                        <Search className="h-4 w-4 mr-2" />
                        Validate Consent
              </Button>
            </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Validation Batches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Bulk Validation Batches
                </CardTitle>
                <CardDescription>
                  Manage and monitor bulk consent validation for multiple data principals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bulkValidationBatches.map((batch) => (
                    <div key={batch.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">{batch.name}</h4>
                            <Badge variant={
                              batch.status === 'COMPLETED' ? 'default' :
                              batch.status === 'IN_PROGRESS' ? 'secondary' :
                              batch.status === 'FAILED' ? 'destructive' : 'outline'
                            }>
                              {batch.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Purpose: {batch.purposeName}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Total Principals</p>
                              <p className="font-medium text-lg">{batch.totalCount}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Valid</p>
                              <p className="font-medium text-lg text-green-600">{batch.validCount}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Invalid</p>
                              <p className="font-medium text-lg text-red-600">{batch.invalidCount}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Pending</p>
                              <p className="font-medium text-lg text-orange-600">{batch.pendingCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Validation Progress</span>
                          <span>{Math.round(((batch.validCount + batch.invalidCount) / batch.totalCount) * 100)}%</span>
                        </div>
                        <Progress 
                          value={((batch.validCount + batch.invalidCount) / batch.totalCount) * 100} 
                          className="h-2" 
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          {batch.lastValidated ? `Last validated: ${batch.lastValidated.toLocaleString()}` : 'Not validated yet'}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRunBulkValidation(batch)}
                            disabled={batch.status === 'IN_PROGRESS'}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            {batch.status === 'IN_PROGRESS' ? 'Running...' : 'Run Validation'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewBulkValidationResults(batch)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Results
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Validation History */}
            <Card>
              <CardHeader>
                <CardTitle>Validation History</CardTitle>
                <CardDescription>
                  Complete log of consent validation requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {validationRequests.map((validation) => (
                    <div key={validation.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                          <h4 className="font-medium text-gray-900">{validation.requestContext}</h4>
                          <p className="text-sm text-gray-600">{validation.userEmail}</p>
                          <p className="text-xs text-gray-500">Purposes: {validation.purposeIds.join(', ')}</p>
                    </div>
                        {getStatusBadge(validation.status)}
                  </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Validation Details</h5>
                        <div className="text-sm space-y-1">
                          <p><strong>Reasons:</strong> {validation.validationResult.reasons.join(', ')}</p>
                          {validation.validationResult.recommendations.length > 0 && (
                            <p><strong>Recommendations:</strong> {validation.validationResult.recommendations.join(', ')}</p>
                          )}
                          <p><strong>Validated:</strong> {validation.validatedAt.toLocaleString()}</p>
                          {validation.expiresAt && (
                            <p><strong>Expires:</strong> {validation.expiresAt.toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          {/* Consent Collection Tab - BRD Compliant */}
          <TabsContent value="consent-collection" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Consent Collection Management</h2>
                <p className="text-gray-600">Configure and monitor consent collection flows as per BRD 4.1.1</p>
              </div>
              <Dialog open={newFlowDialogOpen} onOpenChange={setNewFlowDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Collection Flow
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Consent Collection Flow</DialogTitle>
                    <DialogDescription>
                      Configure a new consent collection mechanism compliant with DPDP Act 2023
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="flow-name">Flow Name</Label>
                        <Input id="flow-name" placeholder="e.g., Registration Consent" />
                      </div>
                      <div>
                        <Label htmlFor="collection-method">Collection Method</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BANNER">Banner</SelectItem>
                            <SelectItem value="MODAL">Modal</SelectItem>
                            <SelectItem value="FORM">Form</SelectItem>
                            <SelectItem value="API">API</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="flow-description">Description</Label>
                      <Textarea id="flow-description" placeholder="Describe the consent collection purpose and context" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setNewFlowDialogOpen(false)}>Cancel</Button>
                      <Button onClick={() => {
                        addNotification('success', 'Consent collection flow created successfully');
                        setNewFlowDialogOpen(false);
                      }}>Create Flow</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
      </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {consentFlows.map((flow) => (
                <Card key={flow.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-blue-600" />
                          {flow.name}
          </CardTitle>
                        <CardDescription>{flow.description}</CardDescription>
                      </div>
                      <Badge variant={flow.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {flow.status}
                      </Badge>
                    </div>
        </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                          <p className="text-gray-600">Method</p>
                          <p className="font-medium">{flow.collectionMethod}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Languages</p>
                          <p className="font-medium">{flow.languages.length} supported</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Conversion Rate</p>
                          <p className="font-medium text-green-600">{flow.metrics.conversionRate.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Shown</p>
                          <p className="font-medium">{flow.metrics.totalShown.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Accepted: {flow.metrics.totalAccepted}</span>
                          <span>Declined: {flow.metrics.totalDeclined}</span>
                        </div>
                        <Progress value={flow.metrics.conversionRate} className="h-2" />
                      </div>

                      {/* Linked Notice Information */}
                      {flow.linkedNoticeId && (
                        <div className="bg-green-50 p-3 rounded-md border border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Linked Notice</span>
                          </div>
                          <p className="text-sm text-green-700">{flow.linkedNoticeName}</p>
                          <p className="text-xs text-green-600">ID: {flow.linkedNoticeId}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <div className="text-xs text-gray-500">
                          Updated: {flow.lastUpdated.toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleManageNoticeLink(flow)}>
                            <Link className="w-3 h-3 mr-1" />
                            {flow.linkedNoticeId ? 'Manage Notice' : 'Link Notice'}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit3 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <BarChart3 className="w-3 h-3 mr-1" />
                            Analytics
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Data Principal Requests Tab - BRD 4.3.3 Compliant */}
          <TabsContent value="data-principal" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Data Principal Requests</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Requests</p>
                      <p className="text-2xl font-bold text-gray-900">{dataPrincipalRequests.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">In Progress</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {dataPrincipalRequests.filter(r => r.status === 'IN_PROGRESS').length}
                </p>
              </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Fulfilled</p>
                      <p className="text-2xl font-bold text-green-600">
                        {dataPrincipalRequests.filter(r => r.status === 'FULFILLED').length}
                      </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Response Time</p>
                      <p className="text-2xl font-bold text-purple-600">12.5 days</p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Data Principal Requests</CardTitle>
                <CardDescription>
                  All requests with linked consent information for compliance tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataPrincipalRequests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">{request.userName}</h4>
                            <Badge variant={
                              request.requestType === 'ERASURE' ? 'destructive' :
                              request.requestType === 'ACCESS' ? 'default' :
                              'secondary'
                            }>
                              {request.requestType}
                            </Badge>
                            <Badge variant={
                              request.priority === 'HIGH' || request.priority === 'URGENT' ? 'destructive' :
                              request.priority === 'MEDIUM' ? 'default' : 'secondary'
                            }>
                              {request.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{request.userEmail}</p>
                          <p className="text-sm text-gray-700 mb-2">{request.description}</p>
                          
                          {/* Linked Consents */}
                          <div className="bg-blue-50 p-3 rounded-md mb-2">
                            <div className="flex items-center gap-2 mb-2">
                              <Link className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-900">Linked Consents</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {request.relatedConsents.map((consentId) => (
                                <Badge key={consentId} variant="outline" className="text-xs">
                                  {consentId}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Submitted: {request.submittedAt.toLocaleDateString()}</span>
                            <span>Due: {request.dueDate.toLocaleDateString()}</span>
                            {request.assignedTo && <span>Assigned: {request.assignedTo}</span>}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getStatusBadge(request.status)}
                          <Button size="sm" variant="outline" onClick={() => handleViewRequest(request)}>
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRequestStatusChange(request)}>
                            <Edit className="w-3 h-3 mr-1" />
                            Update Status
                          </Button>
                          <Button size="sm">
                            <Send className="w-3 h-3 mr-1" />
                            Respond
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grievance Management Tab - BRD 4.5 Compliant with Consent Linking */}
          <TabsContent value="grievances" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Consent-Linked Grievance Management</h2>
                <p className="text-gray-600">Handle grievances related to consent violations as per BRD 4.5 and DPDP Act Section 18</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter by Consent
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Grievances</p>
                      <p className="text-2xl font-bold text-gray-900">{grievances.length}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                      <p className="text-2xl font-bold text-red-600">
                        {grievances.filter(g => g.impactAssessment.severity === 'CRITICAL').length}
                </p>
              </div>
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Consent Violations</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {grievances.filter(g => g.category === GrievanceCategory.CONSENT_VIOLATION).length}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Resolution</p>
                      <p className="text-2xl font-bold text-blue-600">4.2 days</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Grievances with Consent Links</CardTitle>
                <CardDescription>
                  Comprehensive grievance tracking with detailed consent relationship mapping
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {grievances.map((grievance) => (
                    <div key={grievance.id} className="p-6 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">{grievance.subject}</h4>
                            <Badge variant="outline" className="text-xs">
                              {grievance.referenceNumber}
                            </Badge>
                            <Badge variant={
                              grievance.priority === GrievancePriority.CRITICAL ? 'destructive' :
                              grievance.priority === GrievancePriority.HIGH ? 'destructive' :
                              grievance.priority === GrievancePriority.MEDIUM ? 'default' : 'secondary'
                            }>
                              {grievance.priority}
                            </Badge>
                            <Badge variant={
                              grievance.impactAssessment.severity === 'CRITICAL' ? 'destructive' :
                              grievance.impactAssessment.severity === 'HIGH' ? 'destructive' :
                              'default'
                            }>
                              {grievance.impactAssessment.severity} IMPACT
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{grievance.description}</p>
                          
                          {/* Consent Details Section */}
                          <div className="bg-red-50 p-4 rounded-md mb-3">
                            <div className="flex items-center gap-2 mb-3">
                              <Link className="w-4 h-4 text-red-600" />
                              <span className="text-sm font-medium text-red-900">Related Consent Issues</span>
                            </div>
                            <div className="space-y-2">
                              {grievance.consentDetails.map((consent, index) => (
                                <div key={index} className="bg-white p-3 rounded border">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <p className="font-medium text-sm">{consent.purposeName}</p>
                                      <p className="text-xs text-gray-600">Consent ID: {consent.consentId}</p>
                                    </div>
                                    <Badge variant={consent.status === ConsentStatus.WITHDRAWN ? 'destructive' : 'default'}>
                                      {consent.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-red-700">{consent.issueDescription}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Granted: {consent.grantedAt.toLocaleDateString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Impact Assessment */}
                          <div className="bg-yellow-50 p-4 rounded-md mb-3">
                            <h5 className="font-medium text-sm text-yellow-900 mb-2">Impact Assessment</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-gray-600">Affected Users</p>
                                <p className="font-medium">{grievance.impactAssessment.affectedUsers}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Potential Risk</p>
                                <p className="font-medium">{grievance.impactAssessment.potentialRisk}</p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <p className="text-gray-600 text-sm mb-1">Mitigation Steps</p>
                              <ul className="text-sm space-y-1">
                                {grievance.impactAssessment.mitigationSteps.map((step, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                    {step}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Created: {grievance.createdAt.toLocaleDateString()}</span>
                            <span>Updated: {grievance.updatedAt.toLocaleDateString()}</span>
                            <span>Contact: {grievance.contactEmail}</span>
                            {grievance.assignedTo && <span>Assigned: {grievance.assignedTo}</span>}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getStatusBadge(grievance.status)}
                          <Button size="sm" variant="outline" onClick={() => handleGrievanceStatusChange(grievance)}>
                            <Edit className="w-3 h-3 mr-1" />
                            Update Status
              </Button>
                          <Dialog open={grievanceDialogOpen} onOpenChange={setGrievanceDialogOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedGrievance(grievance)}>
                                <Eye className="w-3 h-3 mr-1" />
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Grievance Details - {selectedGrievance?.referenceNumber}</DialogTitle>
                                <DialogDescription>
                                  Comprehensive view of consent-related grievance with impact assessment
                                </DialogDescription>
                              </DialogHeader>
                              {selectedGrievance && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Subject</Label>
                                      <p className="text-sm font-medium">{selectedGrievance.subject}</p>
                                    </div>
                                    <div>
                                      <Label>Category</Label>
                                      <p className="text-sm font-medium">{selectedGrievance.category}</p>
                                    </div>
            </div>
            
              <div>
                                    <Label>Description</Label>
                                    <p className="text-sm">{selectedGrievance.description}</p>
                                  </div>

                                  <div>
                                    <Label>Related Consents</Label>
                                    <div className="space-y-2 mt-2">
                                      {selectedGrievance.consentDetails.map((consent, index) => (
                                        <div key={index} className="p-3 bg-gray-50 rounded">
                                          <div className="flex justify-between items-center">
                                            <div>
                                              <p className="font-medium">{consent.purposeName}</p>
                                              <p className="text-sm text-gray-600">{consent.issueDescription}</p>
                                            </div>
                                            <Badge>{consent.status}</Badge>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex justify-between">
                                    <Button 
                                      variant="outline"
                                      onClick={() => {
                                        if (selectedGrievance) {
                                          setHistoryDialogOpen(true);
                                          setHistoryEntityType('GRIEVANCE');
                                          setHistoryEntityId(selectedGrievance.id);
                                          setHistoryReferenceNumber(selectedGrievance.referenceNumber);
                                        }
                                      }}
                                    >
                                      <History className="h-4 w-4 mr-2" />
                                      History
                                    </Button>
                                    <div className="flex gap-2">
                                      <Button variant="outline" onClick={() => setGrievanceDialogOpen(false)}>
                                        Close
                                      </Button>
                                      <Button onClick={() => {
                                        addNotification('success', 'Grievance response sent successfully');
                                        setGrievanceDialogOpen(false);
                                      }}>
                                        Send Response
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button size="sm">
                            <Send className="w-3 h-3 mr-1" />
                            Respond
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Third-Party Management Tab - BRD Compliant */}
          <TabsContent value="third-party" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Third-Party Processor Management</h2>
                <p className="text-gray-600">Manage data processing agreements and compliance monitoring</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Processor
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {thirdPartyProcessors.map((processor) => (
                <Card key={processor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building className="w-5 h-5 text-gray-600" />
                          {processor.name}
                        </CardTitle>
                        <CardDescription>{processor.email}</CardDescription>
                      </div>
                      <Badge variant={processor.status === 'ACTIVE' ? 'default' : 'destructive'}>
                        {processor.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Compliance Score</p>
                          <div className="flex items-center gap-2">
                            <Progress value={processor.complianceScore} className="h-2 flex-1" />
                            <span className="font-medium text-green-600">{processor.complianceScore}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600">Location</p>
                          <p className="font-medium">{processor.location}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Contract</p>
                          <p className="font-medium">{processor.contractId}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Next Audit</p>
                          <p className="font-medium">{processor.nextAudit.toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-gray-600 text-sm mb-2">Data Categories</p>
                        <div className="flex flex-wrap gap-1">
                          {processor.dataCategories.map((category) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-600 text-sm mb-2">Certifications</p>
                        <div className="flex flex-wrap gap-1">
                          {processor.certifications.map((cert) => (
                            <Badge key={cert} variant="secondary" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div className="text-xs text-gray-500">
                          Agreement v{processor.processingAgreement.version}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit3 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="w-3 h-3 mr-1" />
                            Agreement
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Data Processing Tab */}
          <TabsContent value="processing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Data Processing Requests
                </CardTitle>
                <CardDescription>
                  Manage and monitor data processing activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {processingRequests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
              <div>
                          <h4 className="font-medium text-gray-900">{request.purposeName}</h4>
                          <p className="text-sm text-gray-600">{request.userEmail}</p>
                          <p className="text-xs text-gray-500">
                            {request.requestType} • Requested: {request.requestedAt.toLocaleString()}
                </p>
              </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(request.status)}
                          <Dialog open={validationDialogOpen} onOpenChange={setValidationDialogOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                disabled={request.status !== 'PENDING_VALIDATION'}
                                onClick={() => setSelectedRequest(request)}
                              >
                                <Search className="h-4 w-4 mr-1" />
                                Validate
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Validate Consent</DialogTitle>
                                <DialogDescription>
                                  Validate consent for {selectedRequest?.userEmail} - {selectedRequest?.purposeName}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-md">
                                  <h4 className="font-medium mb-2">Request Details</h4>
                                  <div className="text-sm space-y-1">
                                    <p><strong>User:</strong> {selectedRequest?.userEmail}</p>
                                    <p><strong>Purpose:</strong> {selectedRequest?.purposeName}</p>
                                    <p><strong>Data Types:</strong> {selectedRequest?.metadata.dataTypes.join(', ')}</p>
                                    <p><strong>Retention:</strong> {selectedRequest?.metadata.retentionPeriod}</p>
            </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setValidationDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={() => selectedRequest && validateConsent(selectedRequest)}>
                                    Validate Consent
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            size="sm" 
                            disabled={request.status !== 'VALIDATED'}
                            onClick={() => initiateProcessing(request)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Process
              </Button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Campaign ID</p>
                            <p className="font-medium">{request.metadata.campaignId || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Processing Basis</p>
                            <p className="font-medium">{request.metadata.processingBasis}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Retention Period</p>
                            <p className="font-medium">{request.metadata.retentionPeriod}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Data Types</p>
                            <p className="font-medium">{request.metadata.dataTypes.length} types</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
          </div>
        </CardContent>
      </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Audit Trail
                </CardTitle>
                <CardDescription>
                  Immutable log of all consent and processing activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-gray-500">#001</div>
                      <div className="flex-1">
                        <p className="font-medium">Consent Validation Requested</p>
                        <p className="text-sm text-gray-600">Marketing consent validated for alice.smith@email.com</p>
                        <p className="text-xs text-gray-500">{new Date().toLocaleString()}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        Hash: abc123...
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-gray-500">#002</div>
                      <div className="flex-1">
                        <p className="font-medium">Data Processing Initiated</p>
                        <p className="text-sm text-gray-600">User behavior analytics processing started</p>
                        <p className="text-xs text-gray-500">{new Date().toLocaleString()}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        Hash: def456...
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Administration Tab */}
          <TabsContent value="administration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  System Administration
                </CardTitle>
                <CardDescription>
                  Configure system settings and manage user roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">API Integration Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">CMS API Connection</p>
                          <p className="text-sm text-gray-600">Real-time consent validation service</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Audit Log Service</p>
                          <p className="text-sm text-gray-600">Immutable blockchain logging</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Data Retention Policies</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Marketing Data</p>
                          <p className="text-sm text-gray-600">Retention period: 2 years</p>
                        </div>
                        <Button size="sm" variant="outline">Configure</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Analytics Data</p>
                          <p className="text-sm text-gray-600">Retention period: 1 year</p>
                        </div>
                        <Button size="sm" variant="outline">Configure</Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">User Role Management</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Data Processing Team</p>
                          <p className="text-sm text-gray-600">Can initiate and monitor processing requests</p>
                        </div>
                        <Button size="sm" variant="outline">Manage</Button>
            </div>
            
                      <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                          <p className="font-medium">Compliance Officers</p>
                          <p className="text-sm text-gray-600">Full access to audit logs and compliance reports</p>
                        </div>
                        <Button size="sm" variant="outline">Manage</Button>
                      </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
          </TabsContent>

          {/* Notice Management Tab */}
          <TabsContent value="notices" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Consent Notice Management</h2>
                <p className="text-gray-600">Create and manage consent notices for data principals</p>
              </div>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Configure Notice Templates
              </Button>
            </div>

            <div className="grid gap-6">
              {/* Dynamic Notice Generation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Dynamic Notice Generation
                  </CardTitle>
                  <CardDescription>
                    Create consent notices dynamically based on purposes and language for data principals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Data Fiduciary</Label>
                        <Select value={selectedDataFiduciary} onValueChange={setSelectedDataFiduciary}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="df_ecommerce">ShopEasy E-commerce</SelectItem>
                            <SelectItem value="df_fintech">SecureBank Digital</SelectItem>
                            <SelectItem value="df_healthcare">HealthCare Plus</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Notice Language</Label>
                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {indianLanguages.map(lang => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Select Processing Purposes</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                        {[
                          'Account Management',
                          'Service Delivery', 
                          'Marketing Communications',
                          'Usage Analytics',
                          'Personalization',
                          'Security Monitoring',
                          'Customer Support',
                          'Legal Compliance'
                        ].map(purpose => (
                          <div key={purpose} className="flex items-center space-x-2">
                            <Switch 
                              id={purpose} 
                              checked={selectedPurposes.includes(purpose)}
                              onCheckedChange={() => handlePurposeToggle(purpose)}
                            />
                            <Label htmlFor={purpose} className="text-sm">{purpose}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={handleGenerateNotice} className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Generate Dynamic Notice
                      </Button>
                      <Button onClick={handleSaveNotice} variant="outline">
                        <Archive className="h-4 w-4 mr-2" />
                        Save Notice
                      </Button>
                      <Button onClick={() => handleDownloadNotice('pdf')} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button onClick={() => handleDownloadNotice('docx')} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        DOCX
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sample Generated Notice */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    Sample Generated Notice
                  </CardTitle>
                  <CardDescription>
                    Example of a dynamically generated consent notice with purpose mapping
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="space-y-6">
                      {/* Notice Header */}
                      <div className="text-center border-b pb-4">
                        <h3 className="text-xl font-bold text-gray-900">Data Processing Notice</h3>
                        <p className="text-sm text-gray-600 mt-1">Your Privacy Rights Under DPDP Act 2023</p>
                        <div className="flex justify-center gap-2 mt-2">
                          <Badge variant="outline">ShopEasy E-commerce</Badge>
                          <Badge variant="outline">English</Badge>
                          <Badge variant="outline">Version 2.0</Badge>
                        </div>
                      </div>

                      {/* Purpose Sections */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Purposes of Data Processing
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <ShieldCheck className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-blue-900">Account Management (Essential)</span>
                              <Badge className="text-xs bg-blue-100 text-blue-800">Purpose ID: ACC_MGMT_001</Badge>
                            </div>
                            <p className="text-sm text-blue-800">Creating and managing your account, authentication, and basic service delivery</p>
                            <p className="text-xs text-blue-600 mt-1">Data Types: Name, Email, Phone • Retention: Until account deletion</p>
                          </div>

                          <div className="bg-purple-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Mail className="h-4 w-4 text-purple-600" />
                              <span className="font-medium text-purple-900">Marketing Communications (Optional)</span>
                              <Badge className="text-xs bg-purple-100 text-purple-800">Purpose ID: MKT_COMM_002</Badge>
                            </div>
                            <p className="text-sm text-purple-800">Sending promotional emails, SMS, and personalized offers</p>
                            <p className="text-xs text-purple-600 mt-1">Data Types: Email, Preferences • Retention: 3 years or until withdrawal</p>
                          </div>
                        </div>
                      </div>

                      {/* Rights Section */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Scale className="h-4 w-4" />
                          Your Rights Under DPDP Act 2023
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Right to access your data
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Right to correct data
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Right to erase data
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Right to data portability
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                        <div className="text-sm text-gray-700 space-y-1">
                          <p>Data Protection Officer: dpo@shopeasy.com</p>
                          <p>Grievance Officer: grievance@shopeasy.com</p>
                        </div>
                      </div>

                      {/* Translation Indicator */}
                      <Alert className="bg-green-50 border-green-200">
                        <Globe className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          <strong>Multi-language Support:</strong> This notice is available in 22 Indian languages. 
                          Language preference is automatically detected and can be changed anytime.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generated Notices Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Generated Notices
                  </CardTitle>
                  <CardDescription>
                    View and manage all generated consent notices with version control
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Notice ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Language</TableHead>
                          <TableHead>Tagged Consent</TableHead>
                          <TableHead>Created Time</TableHead>
                          <TableHead>Version</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {generatedNotices.map((notice) => (
                          <TableRow key={notice.id}>
                            <TableCell className="font-mono text-sm">{notice.id}</TableCell>
                            <TableCell className="font-medium">{notice.title}</TableCell>
                            <TableCell>{notice.language}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {notice.purposes.slice(0, 2).map((purpose) => (
                                  <Badge key={purpose} variant="outline" className="text-xs">
                                    {purpose}
                                  </Badge>
                                ))}
                                {notice.purposes.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{notice.purposes.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {notice.createdAt.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">v{notice.version}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariantForNotice(notice.status)}>
                                {notice.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewNotice(notice)}
                                className="h-8"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Status Change Dialog - BRD Section 4.3.3 & 4.5 Compliant */}
        <Dialog open={statusChangeDialogOpen} onOpenChange={setStatusChangeDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Update {selectedRequestForStatusChange ? 'Request' : 'Grievance'} Status
              </DialogTitle>
              <DialogDescription>
                Change the status according to BRD workflow requirements with proper audit trail
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Current Status</Label>
                <p className="text-sm font-medium">
                  {selectedRequestForStatusChange?.status || selectedGrievanceForStatusChange?.status}
                </p>
              </div>

              <div>
                <Label htmlFor="newStatus">New Status</Label>
                <select
                  id="newStatus"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select new status</option>
                  {getAvailableStatuses().map((status) => (
                    <option key={status} value={status}>
                      {status.replace(/_/g, ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="statusChangeReason">Reason for Change *</Label>
                <select
                  id="statusChangeReason"
                  value={statusChangeReason}
                  onChange={(e) => setStatusChangeReason(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select reason</option>
                  <option value="Information received">Information received from Data Principal</option>
                  <option value="Investigation completed">Investigation completed</option>
                  <option value="Issue resolved">Issue resolved satisfactorily</option>
                  <option value="Request fulfilled">Request fulfilled as per DPDP Act</option>
                  <option value="Escalation required">Escalation to higher authority required</option>
                  <option value="Additional information needed">Additional information needed from Data Principal</option>
                  <option value="Compliance review">Compliance review completed</option>
                  <option value="Processing halted">Data processing halted as requested</option>
                  <option value="Legal review">Legal review required</option>
                  <option value="Technical implementation">Technical implementation completed</option>
                </select>
              </div>

              <div>
                <Label htmlFor="statusChangeNotes">Additional Notes (Optional)</Label>
                <textarea
                  id="statusChangeNotes"
                  value={statusChangeNotes}
                  onChange={(e) => setStatusChangeNotes(e.target.value)}
                  placeholder="Add any additional notes or comments..."
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This status change will be logged in the audit trail and the Data Principal will be automatically notified as per BRD Section 4.4.1 requirements.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setStatusChangeDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={selectedRequestForStatusChange ? updateRequestStatus : updateGrievanceStatus}
                disabled={!newStatus || !statusChangeReason}
              >
                Update Status
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Data Principal Request Detail Dialog */}
        <Dialog open={requestDetailDialogOpen} onOpenChange={setRequestDetailDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Data Principal Request Details
              </DialogTitle>
              <DialogDescription>
                Complete request information with linked consent data and communication history
              </DialogDescription>
            </DialogHeader>
            
            {selectedDataPrincipalRequest && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Requester</Label>
                    <p className="text-sm font-semibold">{selectedDataPrincipalRequest.userName}</p>
                    <p className="text-sm text-gray-600">{selectedDataPrincipalRequest.userEmail}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Request Type</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={
                        selectedDataPrincipalRequest.requestType === 'ERASURE' ? 'destructive' :
                        selectedDataPrincipalRequest.requestType === 'ACCESS' ? 'default' :
                        'secondary'
                      }>
                        {selectedDataPrincipalRequest.requestType}
                      </Badge>
                      <Badge variant={
                        selectedDataPrincipalRequest.priority === 'HIGH' || selectedDataPrincipalRequest.priority === 'URGENT' ? 'destructive' :
                        selectedDataPrincipalRequest.priority === 'MEDIUM' ? 'default' : 'secondary'
                      }>
                        {selectedDataPrincipalRequest.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Status and Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Status</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedDataPrincipalRequest.status)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Submitted</Label>
                    <p className="text-sm">{selectedDataPrincipalRequest.submittedAt.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Due Date</Label>
                    <p className="text-sm">{selectedDataPrincipalRequest.dueDate.toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                    {selectedDataPrincipalRequest.description}
                  </p>
                </div>

                {/* Linked Consents */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Linked Consents</Label>
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-3">
                      <Link className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Related Consent Records</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedDataPrincipalRequest.relatedConsents.map((consentId) => (
                        <Badge key={consentId} variant="outline" className="text-xs">
                          {consentId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Assignment */}
                {selectedDataPrincipalRequest.assignedTo && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Assigned To</Label>
                    <p className="text-sm">{selectedDataPrincipalRequest.assignedTo}</p>
                  </div>
                )}

                {/* Documents */}
                {selectedDataPrincipalRequest.documents.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Documents</Label>
                    <div className="mt-2 space-y-2">
                      {selectedDataPrincipalRequest.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Communication Log */}
                {selectedDataPrincipalRequest.communicationLog.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Communication History</Label>
                    <div className="mt-2 space-y-3 max-h-40 overflow-y-auto">
                      {selectedDataPrincipalRequest.communicationLog.map((comm, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between items-start mb-1">
                            <Badge variant="outline" className="text-xs">
                              {comm.type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {comm.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900">{comm.message}</p>
                          <p className="text-xs text-gray-600 mt-1">By: {comm.sentBy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleShowRequestHistory(selectedDataPrincipalRequest)}
                    className="flex items-center gap-2"
                  >
                    <History className="w-4 h-4" />
                    View History
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setRequestDetailDialogOpen(false)}>
                      Close
                    </Button>
                    <Button onClick={() => {
                      setRequestDetailDialogOpen(false);
                      handleRequestStatusChange(selectedDataPrincipalRequest);
                    }}>
                      Update Status
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Activity History Dialog */}
        <ActivityHistory
          entityType={historyEntityType}
          entityId={historyEntityId}
          referenceNumber={historyReferenceNumber}
          isOpen={historyDialogOpen}
          onClose={() => setHistoryDialogOpen(false)}
          userRole="DATA_FIDUCIARY"
        />

        {/* View Notice Dialog */}
        <Dialog open={viewNoticeDialogOpen} onOpenChange={setViewNoticeDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Notice Details - {selectedNotice?.id}
              </DialogTitle>
              <DialogDescription>
                Complete consent notice with DPDP Act 2023 compliance details
              </DialogDescription>
            </DialogHeader>
            
            {selectedNotice && (
              <div className="space-y-6">
                {/* Notice Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Notice ID</Label>
                    <p className="text-sm font-mono">{selectedNotice.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Language</Label>
                    <p className="text-sm">{selectedNotice.language}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Version</Label>
                    <Badge variant="outline">v{selectedNotice.version}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Created</Label>
                    <p className="text-sm">{selectedNotice.createdAt.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Status</Label>
                    <Badge variant={getStatusBadgeVariantForNotice(selectedNotice.status)}>
                      {selectedNotice.status}
                    </Badge>
                  </div>
                </div>

                {/* Tagged Purposes */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Tagged Consent Purposes</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedNotice.purposes.map((purpose) => (
                      <Badge key={purpose} variant="outline" className="text-sm">
                        {purpose}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Full Notice Content */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Full Notice Content</Label>
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="space-y-6">
                      {/* Notice Header */}
                      <div className="text-center border-b pb-4">
                        <h3 className="text-xl font-bold text-gray-900">{selectedNotice.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">Your Privacy Rights Under DPDP Act 2023</p>
                        <div className="flex justify-center gap-2 mt-2">
                          <Badge variant="outline">ShopEasy E-commerce</Badge>
                          <Badge variant="outline">{selectedNotice.language}</Badge>
                          <Badge variant="outline">Version {selectedNotice.version}</Badge>
                        </div>
                      </div>

                      {/* Purpose Sections */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Purposes of Data Processing
                        </h4>
                        <div className="space-y-3">
                          {selectedNotice.purposes.map((purpose, index) => (
                            <div key={purpose} className={`p-3 rounded-lg ${
                              index % 2 === 0 ? 'bg-blue-50' : 'bg-purple-50'
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck className={`h-4 w-4 ${
                                  index % 2 === 0 ? 'text-blue-600' : 'text-purple-600'
                                }`} />
                                <span className={`font-medium ${
                                  index % 2 === 0 ? 'text-blue-900' : 'text-purple-900'
                                }`}>{purpose}</span>
                                <Badge className={`text-xs ${
                                  index % 2 === 0 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                }`}>
                                  Purpose ID: {purpose.replace(/\s+/g, '_').toUpperCase()}_00{index + 1}
                                </Badge>
                              </div>
                              <p className={`text-sm ${
                                index % 2 === 0 ? 'text-blue-800' : 'text-purple-800'
                              }`}>
                                Processing for {purpose.toLowerCase()} as per your consent
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Rights Section */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Scale className="h-4 w-4" />
                          Your Rights Under DPDP Act 2023
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Right to access your data
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Right to correct data
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Right to erase data
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Right to data portability
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                        <div className="text-sm text-gray-700 space-y-1">
                          <p>Data Protection Officer: dpo@shopeasy.com</p>
                          <p>Grievance Officer: grievance@shopeasy.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleDownloadNotice('pdf')}>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" onClick={() => handleDownloadNotice('docx')}>
                      <Download className="w-4 h-4 mr-2" />
                      Download DOCX
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setViewNoticeDialogOpen(false)}>
                      Close
                    </Button>
                    <Button onClick={handleSaveNotice}>
                      <Archive className="w-4 h-4 mr-2" />
                      Save Notice
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Notice Linking Dialog */}
        <Dialog open={noticeLinkingDialogOpen} onOpenChange={setNoticeLinkingDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manage Notice Link</DialogTitle>
              <DialogDescription>
                Link or update the notice associated with this consent collection flow
              </DialogDescription>
            </DialogHeader>
            
            {selectedFlowForLinking && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Consent Collection Flow</Label>
                  <p className="text-lg font-medium text-gray-900">{selectedFlowForLinking.name}</p>
                  <p className="text-sm text-gray-600">{selectedFlowForLinking.description}</p>
                </div>

                <div>
                  <Label htmlFor="notice-selection">Select Notice to Link</Label>
                  <Select value={selectedNoticeForLinking} onValueChange={setSelectedNoticeForLinking}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a notice to link" />
                    </SelectTrigger>
                    <SelectContent>
                      {generatedNotices.map((notice) => (
                        <SelectItem key={notice.id} value={notice.id}>
                          {notice.id} - {notice.language === 'english' ? 'E-commerce' : 'बैंकिंग'} Data Processing Notice
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedFlowForLinking.linkedNoticeId && (
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Currently Linked Notice</span>
                    </div>
                    <p className="text-sm text-blue-700">{selectedFlowForLinking.linkedNoticeName}</p>
                    <p className="text-xs text-blue-600">ID: {selectedFlowForLinking.linkedNoticeId}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setNoticeLinkingDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleLinkNoticeToFlow} disabled={!selectedNoticeForLinking}>
                    <Link className="h-4 w-4 mr-2" />
                    {selectedFlowForLinking.linkedNoticeId ? 'Update Link' : 'Link Notice'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Bulk Validation Creation Dialog */}
        <Dialog open={bulkValidationDialogOpen} onOpenChange={setBulkValidationDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Bulk Validation Batch</DialogTitle>
              <DialogDescription>
                Set up a new bulk consent validation for multiple data principals
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="batch-name">Batch Name</Label>
                <Input id="batch-name" placeholder="e.g., Q1 2024 Marketing Validation" />
              </div>

              <div>
                <Label htmlFor="purpose-selection">Processing Purpose</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select processing purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing_001">Marketing Campaign</SelectItem>
                    <SelectItem value="analytics_001">User Analytics</SelectItem>
                    <SelectItem value="service_001">Service Delivery</SelectItem>
                    <SelectItem value="account_001">Account Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="data-principals">Data Principals (Upload CSV or Enter Manually)</Label>
                <Textarea 
                  id="data-principals" 
                  placeholder="Enter email addresses separated by commas or upload a CSV file"
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setBulkValidationDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  addNotification('success', 'Bulk validation batch created successfully');
                  setBulkValidationDialogOpen(false);
                }}>
                  <Users className="h-4 w-4 mr-2" />
                  Create Batch
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Bulk Validation Results Dialog */}
        <Dialog open={bulkValidationResultsDialogOpen} onOpenChange={setBulkValidationResultsDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Bulk Validation Results - {selectedBatchForValidation?.name}</DialogTitle>
              <DialogDescription>
                Detailed results of the bulk consent validation process
              </DialogDescription>
            </DialogHeader>
            
            {selectedBatchForValidation && (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{selectedBatchForValidation.totalCount}</p>
                        <p className="text-sm text-gray-600">Total Principals</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{selectedBatchForValidation.validCount}</p>
                        <p className="text-sm text-gray-600">Valid Consents</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{selectedBatchForValidation.invalidCount}</p>
                        <p className="text-sm text-gray-600">Invalid Consents</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{selectedBatchForValidation.pendingCount}</p>
                        <p className="text-sm text-gray-600">Pending</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Results Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Individual Validation Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data Principal</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Consent Status</TableHead>
                          <TableHead>Last Validated</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedBatchForValidation.dataPrincipals.map((principal) => (
                          <TableRow key={principal.userId}>
                            <TableCell className="font-medium">{principal.name}</TableCell>
                            <TableCell>{principal.email}</TableCell>
                            <TableCell>
                              <Badge variant={
                                principal.consentStatus === ConsentStatus.GRANTED ? 'default' :
                                principal.consentStatus === ConsentStatus.PENDING ? 'secondary' :
                                principal.consentStatus === ConsentStatus.EXPIRED ? 'outline' : 'destructive'
                              }>
                                {principal.consentStatus}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {principal.lastValidated ? 
                                principal.lastValidated.toLocaleDateString() : 
                                'Never'
                              }
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3 mr-1" />
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setBulkValidationResultsDialogOpen(false)}>
                    Close
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DataFiduciaryDashboard;