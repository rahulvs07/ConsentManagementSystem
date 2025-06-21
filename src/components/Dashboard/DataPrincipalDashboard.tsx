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
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Shield,
  ShieldCheck,
  Scale,
  User,
  FileText,
  Settings,
  Bell,
  Download,
  Upload,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Info,
  Heart,
  Target,
  Zap,
  RefreshCw,
  Calendar,
  Globe,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Key,
  Lock,
  Unlock,
  History,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  Database,
  Server,
  Cloud,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  ExternalLink,
  Copy,
  Share,
  Star,
  Bookmark,
  Tag,
  Archive,
  Send,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  X,
  Check,
  Save,
  RotateCcw,
  MoreHorizontal,
  Languages,
  ArrowLeft,
  UserPlus
} from 'lucide-react';
import { ConsentRecord, ProcessingPurpose, ConsentStatus, GrievanceTicket, AuditEntry, AuditAction, User as UserType, ConsentArtifact, UserRole, PurposeCategory, GrievanceStatus, GrievancePriority, GrievanceCategory } from '@/types/dpdp';
import GrievanceForm from '@/components/ui/grievance-form';
import ActivityHistory from '@/components/ui/activity-history';
import IntegratedConsentNotice from '@/components/Consent/IntegratedConsentNotice';
import LoginConsentBanner from '@/components/Consent/LoginConsentBanner';

// Mock user data with minor verification
const mockUser: UserType = {
  id: 'dp_001',
  email: 'alice.smith@email.com',
  name: 'Alice Smith',
  role: UserRole.DATA_PRINCIPAL,
  createdAt: new Date('2024-01-15'),
  isMinor: false,
  parentGuardianId: undefined,
  digiLockerVerified: true,
  contactPhone: '+91-9876543210',
  notificationPreferences: {
    email: true,
    sms: true,
    inApp: true
  }
};

// Enhanced consent record interface for dashboard display
interface DashboardConsentRecord extends ConsentRecord {
  dataFiduciaryName: string;
  grantedAt: Date;
  expiresAt?: Date;
  purposes: ProcessingPurpose[];
  consentMethod: string;
  linkedNoticeId: string;
  linkedNoticeName: string;
  noticeContent: string;
}

// Interface for comprehensive notice display
interface ConsentNoticeData {
  id: string;
  title: string;
  content: string;
  dataFiduciaryName: string;
  version: string;
  language: string;
  createdAt: Date;
  purposes: ProcessingPurpose[];
  legalBasis: string;
  retentionPeriod: string;
  dataCategories: string[];
  dataFiduciaryContact: {
    dpo: string;
    grievance: string;
    address: string;
  };
  userRights: string[];
}

// Mock data for demonstration
const mockConsentRecords: DashboardConsentRecord[] = [
  {
    id: 'consent_001',
    userId: 'dp_001',
    purposeId: 'account_mgmt',
    categoryId: 'essential',
    status: ConsentStatus.GRANTED,
    timestamp: new Date('2024-01-15T10:30:00Z'),
    ipAddress: '192.168.1.100',
    sessionId: 'sess_abc123',
    language: 'english',
    isMinor: false,
    metadata: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      consentVersion: '1.0',
      processingBasis: 'consent',
      retentionPeriod: '3 years',
      consentMethod: 'click'
    },
    expiryDate: new Date('2024-07-15T10:30:00Z'),
    lastUpdated: new Date('2024-01-15T10:30:00Z'),
    version: '1.0',
    // Additional dashboard properties
    dataFiduciaryName: 'TechCorp Services',
    grantedAt: new Date('2024-01-15T10:30:00Z'),
    expiresAt: new Date('2024-07-15T10:30:00Z'),
    consentMethod: 'Explicit Click',
    linkedNoticeId: 'NOT-TC-001',
    linkedNoticeName: 'TechCorp Data Processing Notice',
    noticeContent: 'Comprehensive data processing notice content...',
    purposes: [
      {
        id: 'account_mgmt',
        name: 'Account Management',
        description: 'Managing your user account and profile',
        isEssential: true,
        category: PurposeCategory.ACCOUNT_MANAGEMENT,
        retentionPeriod: '3 years',
        legalBasis: 'Consent',
        dataTypes: ['Personal Information', 'Contact Details'],
        isActive: true,
        createdBy: 'system',
        translations: {
          english: {
            name: 'Account Management',
            description: 'Managing your user account and profile',
            language: 'english'
          }
        }
      }
    ]
  },
  {
    id: 'consent_002',
    userId: 'dp_001',
    purposeId: 'marketing',
    categoryId: 'marketing',
    status: ConsentStatus.GRANTED,
    timestamp: new Date('2024-02-01T14:20:00Z'),
    ipAddress: '192.168.1.100',
    sessionId: 'sess_def456',
    language: 'english',
    isMinor: false,
    metadata: {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      consentVersion: '1.0',
      processingBasis: 'consent',
      retentionPeriod: '2 years',
      consentMethod: 'click'
    },
    expiryDate: new Date('2024-08-01T14:20:00Z'),
    lastUpdated: new Date('2024-02-01T14:20:00Z'),
    version: '1.0',
    // Additional dashboard properties
    dataFiduciaryName: 'Marketing Analytics Ltd',
    grantedAt: new Date('2024-02-01T14:20:00Z'),
    expiresAt: new Date('2024-08-01T14:20:00Z'),
    consentMethod: 'Mobile App Toggle',
    linkedNoticeId: 'NOT-MA-002',
    linkedNoticeName: 'Marketing Analytics Privacy Notice',
    noticeContent: 'Marketing analytics data processing notice...',
    purposes: [
      {
        id: 'marketing',
        name: 'Marketing Communications',
        description: 'Sending promotional emails and personalized offers',
        isEssential: false,
        category: PurposeCategory.MARKETING,
        retentionPeriod: '2 years',
        legalBasis: 'Consent',
        dataTypes: ['Email Address', 'Purchase History', 'Preferences'],
        isActive: true,
        createdBy: 'marketing_team',
        translations: {
          english: {
            name: 'Marketing Communications',
            description: 'Sending promotional emails and personalized offers',
            language: 'english'
          }
        }
      }
    ]
  }
];

// New interfaces for data request forms
interface DataRequestForm {
  type: 'ACCESS' | 'CORRECT' | 'ERASE' | 'PORTABILITY' | 'NOMINATION';
  consentId: string;
  purpose: string;
  reason?: string;
  notificationPreference: 'email' | 'sms';
  fields?: string[];
  corrections?: Array<{ field: string; currentValue: string; newValue: string }>;
  erasureScope?: 'full' | 'partial';
  erasureFields?: string[];
  confirmErasure?: boolean;
  // Nomination specific fields
  nomineeName?: string;
  nomineeRelationship?: string;
  nomineeContact?: string;
  nomineeEmail?: string;
  nomineeAddress?: string;
  proxyScope?: string[];
  validityFrom?: string;
  validityTo?: string;
  authDocuments?: File[];
}

interface DataRequest {
  id: string;
  referenceId: string;
  type: 'ACCESS' | 'CORRECT' | 'ERASE' | 'PORTABILITY' | 'NOMINATION';
  status: 'SUBMITTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  submittedAt: Date;
  dueDate: Date;
  description: string;
  userId: string;
}

// Mock data for active consents
const mockActiveConsents = [
  {
    id: 'consent_001',
    purposeId: 'P-001',
    purposeName: 'Account Creation',
    category: 'Essential',
    grantedAt: '12-May-2025',
    status: 'GRANTED'
  },
  {
    id: 'consent_002',
    purposeId: 'P-002',
    purposeName: 'Marketing Emails',
    category: 'Marketing',
    grantedAt: '10-Feb-2025',
    status: 'GRANTED'
  },
  {
    id: 'consent_003',
    purposeId: 'P-003',
    purposeName: 'Analytics Sharing',
    category: 'Analytics',
    grantedAt: '21-Mar-2025',
    status: 'GRANTED'
  }
];

// Mock data requests for demonstration
const mockDataRequests: DataRequest[] = [
  {
    id: 'req_001',
    referenceId: 'REQ-20251106-001',
    type: 'ACCESS',
    status: 'IN_PROGRESS',
    submittedAt: new Date('2024-11-05T10:30:00Z'),
    dueDate: new Date('2024-12-05T10:30:00Z'),
    description: 'Request to access personal data for account verification',
    userId: 'dp_001'
  },
  {
    id: 'req_002',
    referenceId: 'REQ-20251105-002',
    type: 'CORRECT',
    status: 'COMPLETED',
    submittedAt: new Date('2024-11-03T14:20:00Z'),
    dueDate: new Date('2024-11-18T14:20:00Z'),
    description: 'Correction of email address and phone number',
    userId: 'dp_001'
  },
  {
    id: 'req_003',
    referenceId: 'NOM-20251110-001',
    type: 'NOMINATION',
    status: 'SUBMITTED',
    submittedAt: new Date('2024-11-10T09:15:00Z'),
    dueDate: new Date('2024-11-12T09:15:00Z'),
    description: 'Proxy nomination for spouse - John Smith',
    userId: 'dp_001'
  }
];

export default function DataPrincipalDashboard() {
  const { t } = useLanguage();
  const [user] = useState<any>(mockUser); // Using any to allow additional properties
  const [consentRecords, setConsentRecords] = useState<DashboardConsentRecord[]>(mockConsentRecords);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState<Array<{id: string, type: 'success' | 'warning' | 'error', message: string}>>([]);
  const [renewalDialogOpen, setRenewalDialogOpen] = useState(false);
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
  const [selectedConsent, setSelectedConsent] = useState<DashboardConsentRecord | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [showLoginConsent, setShowLoginConsent] = useState(true);
  const [consentDisplayMode, setConsentDisplayMode] = useState<'banner' | 'modal'>('banner');
  const [grievanceFormOpen, setGrievanceFormOpen] = useState(false);
  const [grievances, setGrievances] = useState<GrievanceTicket[]>([]);
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceTicket | null>(null);
  const [grievanceDetailOpen, setGrievanceDetailOpen] = useState(false);
  
  // History dialog states
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyEntityType, setHistoryEntityType] = useState<'GRIEVANCE' | 'DATA_REQUEST'>('GRIEVANCE');
  const [historyEntityId, setHistoryEntityId] = useState<string>('');
  const [historyReferenceNumber, setHistoryReferenceNumber] = useState<string>('');

  // New state for data request forms
  const [dataRequestFormOpen, setDataRequestFormOpen] = useState(false);
  const [dataRequestType, setDataRequestType] = useState<'ACCESS' | 'CORRECT' | 'ERASE' | 'PORTABILITY' | 'NOMINATION' | null>(null);
  const [dataRequestForm, setDataRequestForm] = useState<DataRequestForm>({
    type: 'ACCESS',
    consentId: '',
    purpose: '',
    notificationPreference: 'email',
    fields: [],
    corrections: [],
    proxyScope: []
  });
  const [dataRequests, setDataRequests] = useState<DataRequest[]>(mockDataRequests);
  const [showRequestTypeSelection, setShowRequestTypeSelection] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string>('');

  // Notice viewing states
  const [noticeDialogOpen, setNoticeDialogOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<ConsentNoticeData | null>(null);

  // Simulate real-time notifications
  useEffect(() => {
    const checkExpiringConsents = () => {
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      
      consentRecords.forEach(consent => {
        if (consent.expiresAt && consent.expiresAt <= thirtyDaysFromNow && consent.status === ConsentStatus.GRANTED) {
          addNotification('warning', `Your consent for ${consent.dataFiduciaryName} expires on ${consent.expiresAt.toLocaleDateString()}. Please renew to continue services.`);
        }
      });
    };

    checkExpiringConsents();
    const interval = setInterval(checkExpiringConsents, 24 * 60 * 60 * 1000); // Check daily
    
    return () => clearInterval(interval);
  }, [consentRecords]);

  // Initialize mock grievance data
  useEffect(() => {
    const mockGrievances: GrievanceTicket[] = [
      {
        id: 'grv_001',
        referenceNumber: 'GRV-240120001',
        userId: 'dp_001',
        category: GrievanceCategory.CONSENT_VIOLATION,
        subject: 'Unauthorized Marketing Emails After Withdrawal',
        description: 'I withdrew my consent for marketing emails on January 10th, but I continue to receive promotional emails daily. This is a clear violation of my consent withdrawal.',
        status: GrievanceStatus.IN_PROGRESS,
        priority: GrievancePriority.HIGH,
        createdAt: new Date('2024-01-20T09:30:00Z'),
        updatedAt: new Date('2024-01-21T14:20:00Z'),
        assignedTo: 'grievance.officer@techcorp.com',
        contactEmail: 'alice.smith@email.com',
        contactPhone: '+91-9876543210',
        evidence: ['email_screenshot_1.png', 'consent_withdrawal_proof.pdf'],
        relatedConsentId: 'consent_002',
        resolutionNotes: 'Initial investigation started. Marketing team contacted.',
        dueDate: new Date('2024-01-27T09:30:00Z')
      },
      {
        id: 'grv_002',
        referenceNumber: 'GRV-240115002',
        userId: 'dp_001',
        category: GrievanceCategory.ACCESS_REQUEST,
        subject: 'Request for Complete Data Access Report',
        description: 'I need a comprehensive report of all my personal data being processed by your organization as per Section 11 of DPDP Act 2023.',
        status: GrievanceStatus.RESOLVED,
        priority: GrievancePriority.MEDIUM,
        createdAt: new Date('2024-01-15T11:00:00Z'),
        updatedAt: new Date('2024-01-18T16:45:00Z'),
        assignedTo: 'dpo@techcorp.com',
        contactEmail: 'alice.smith@email.com',
        evidence: [],
        relatedConsentId: 'consent_001',
        resolutionNotes: 'Data access report provided via secure email. All processing activities documented.',
        dueDate: new Date('2024-01-22T11:00:00Z')
      },
      {
        id: 'grv_003',
        referenceNumber: 'GRV-240118003',
        userId: 'dp_001',
        category: GrievanceCategory.CORRECTION_REQUEST,
        subject: 'Incorrect Personal Information in Profile',
        description: 'My date of birth and address information in your system is incorrect. I need this corrected immediately as it affects service delivery.',
        status: GrievanceStatus.SUBMITTED,
        priority: GrievancePriority.MEDIUM,
        createdAt: new Date('2024-01-18T15:30:00Z'),
        updatedAt: new Date('2024-01-18T15:30:00Z'),
        contactEmail: 'alice.smith@email.com',
        evidence: ['id_proof.pdf', 'address_proof.pdf'],
        relatedConsentId: 'consent_001',
        dueDate: new Date('2024-01-25T15:30:00Z')
      }
    ];
    
    setGrievances(mockGrievances);
  }, []);

  const addNotification = (type: 'success' | 'warning' | 'error', message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Wireframe Consent Banner Handlers
  const handleConsentCompleted = (artifact: any) => {
    addNotification('success', `Consent successfully submitted for ${artifact.purposes.length} purposes`);
    setShowLoginConsent(false);
    
    // Add to consent records
    const newConsents = artifact.purposes.map((purpose: any) => ({
      id: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${purpose.id}`,
      userId: user.id,
      purposeId: purpose.id,
      categoryId: purpose.category || 'general',
      status: ConsentStatus.GRANTED,
      timestamp: artifact.timestamp,
      ipAddress: '192.168.1.100',
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      language: artifact.language,
      isMinor: user.isMinor || false,
      metadata: {
        userAgent: navigator.userAgent,
        consentVersion: '1.0',
        processingBasis: 'consent',
        retentionPeriod: '3 years',
        consentMethod: 'explicit_click'
      },
      expiryDate: new Date(Date.now() + (6 * 30 * 24 * 60 * 60 * 1000)),
      lastUpdated: artifact.timestamp,
      version: '1.0',
      // Additional dashboard properties
      dataFiduciaryName: 'New Service Provider',
      grantedAt: artifact.timestamp,
      expiresAt: new Date(Date.now() + (6 * 30 * 24 * 60 * 60 * 1000)),
      consentMethod: 'Explicit Click',
      purposes: [purpose]
    }));
    
    setConsentRecords(prev => [...prev, ...newConsents]);
  };

  const handleConsentDismissed = () => {
    setShowLoginConsent(false);
    addNotification('warning', 'Consent notice dismissed. Some features may be limited.');
  };

  // 1. Consent Collection Handler
  const handleNewConsentCollection = (purposeId: string, purposes: ProcessingPurpose[]) => {
    const newConsent: ConsentRecord = {
      id: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      purposeId,
      categoryId: 'new_service',
      status: ConsentStatus.GRANTED,
      timestamp: new Date(),
      ipAddress: '192.168.1.100',
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      language: 'english',
      isMinor: user.isMinor || false,
      metadata: {
        userAgent: navigator.userAgent,
        consentVersion: '1.0',
        processingBasis: 'consent',
        retentionPeriod: '3 years',
        consentMethod: 'click'
      },
      expiryDate: new Date(Date.now() + (6 * 30 * 24 * 60 * 60 * 1000)), // 6 months
      lastUpdated: new Date(),
      version: '1.0'
    };

    setConsentRecords(prev => [...prev, newConsent]);
    addNotification('success', `Consent successfully granted for purpose: ${purposeId}`);
    
    // Log audit entry
    logAuditEntry('CONSENT_GRANTED', `Consent granted for purpose ${purposeId}`, newConsent.id);
  };

  // 2. Consent Validation (simulated API call)
  const validateConsent = async (consentId: string, purpose: string): Promise<boolean> => {
    const consent = consentRecords.find(c => c.id === consentId);
    if (!consent) return false;
    
    const isValid = consent.status === ConsentStatus.GRANTED && 
                   (!consent.expiryDate || new Date() < consent.expiryDate) &&
                   consent.purposeId === purpose;
    
    logAuditEntry('CONSENT_VALIDATED', `Consent validation for purpose: ${purpose}`, consentId);
    return isValid;
  };

  // 3. Consent Update Handler
  const handleConsentUpdate = (consentId: string, updatedPurposes: ProcessingPurpose[]) => {
    setConsentRecords(prev => prev.map(consent => 
      consent.id === consentId 
        ? { 
            ...consent, 
            purposes: updatedPurposes,
            version: (parseFloat(consent.version) + 0.1).toFixed(1),
            updatedAt: new Date()
          }
        : consent
    ));
    
    addNotification('success', 'Consent preferences updated successfully');
    logAuditEntry('CONSENT_UPDATED', `Consent purposes modified`, consentId);
  };

  // 4. Consent Renewal Handler
  const handleConsentRenewal = (consentId: string) => {
    setConsentRecords(prev => prev.map(consent => 
      consent.id === consentId 
        ? { 
            ...consent, 
            status: ConsentStatus.RENEWED,
            expiresAt: new Date(Date.now() + (6 * 30 * 24 * 60 * 60 * 1000)), // 6 months from now
            renewedAt: new Date()
          }
        : consent
    ));
    
    addNotification('success', `Consent renewed successfully for ${selectedConsent?.dataFiduciaryName}`);
    logAuditEntry('CONSENT_RENEWED', `Consent renewed`, consentId);
    setRenewalDialogOpen(false);
    setSelectedConsent(null);
  };

  // 5. Consent Withdrawal Handler
  const handleConsentWithdrawal = (consentId: string, reason?: string) => {
    setConsentRecords(prev => prev.map(consent => 
      consent.id === consentId 
        ? { 
            ...consent, 
            status: ConsentStatus.WITHDRAWN,
            withdrawnAt: new Date(),
            withdrawalReason: reason
          }
        : consent
    ));
    
    addNotification('success', `Consent withdrawn successfully for ${selectedConsent?.dataFiduciaryName}`);
    logAuditEntry('CONSENT_WITHDRAWN', `Consent withdrawn${reason ? `: ${reason}` : ''}`, consentId);
    setWithdrawalDialogOpen(false);
    setSelectedConsent(null);

    // Simulate immediate data processing halt
    setTimeout(() => {
      addNotification('success', 'All data processing has been immediately halted for the withdrawn consent');
    }, 2000);
  };

  // Audit logging function
  const logAuditEntry = (action: string, description: string, resourceId: string) => {
    const entry: AuditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      action: AuditAction.CONSENT_GRANTED, // Default to CONSENT_GRANTED for now
      resource: resourceId,
      timestamp: new Date(),
      ipAddress: '192.168.1.100',
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      details: { description },
      hash: `hash_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      blockIndex: auditLogs.length + 1
    };
    
    setAuditLogs(prev => [...prev, entry]);
  };

  const getStatusColor = (status: ConsentStatus) => {
    switch (status) {
      case ConsentStatus.GRANTED: return 'bg-blue-100 text-blue-800 border-blue-200';
      case ConsentStatus.RENEWED: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case ConsentStatus.WITHDRAWN: return 'bg-red-100 text-red-800 border-red-200';
      case ConsentStatus.EXPIRED: return 'bg-gray-100 text-gray-800 border-gray-200';
      case ConsentStatus.PENDING: return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getConsentCardColor = (status: ConsentStatus) => {
    switch (status) {
      case ConsentStatus.GRANTED: return 'border-blue-200 bg-blue-50/30';
      case ConsentStatus.RENEWED: return 'border-indigo-200 bg-indigo-50/30';
      case ConsentStatus.WITHDRAWN: return 'border-red-200 bg-red-50/30';
      case ConsentStatus.EXPIRED: return 'border-gray-200 bg-gray-50/30';
      case ConsentStatus.PENDING: return 'border-orange-200 bg-orange-50/30';
      default: return 'border-slate-200 bg-slate-50/30';
    }
  };

  const getDaysUntilExpiry = (expiryDate: Date | undefined) => {
    if (!expiryDate) return null;
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Grievance handlers
  const handleGrievanceSubmit = (formData: any) => {
    const newGrievance: GrievanceTicket = {
      id: `grv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      referenceNumber: `GRV-${Date.now().toString().slice(-9)}`,
      userId: user.id,
      category: formData.complaintCategory,
      subject: formData.grievanceDescription.substring(0, 50) + '...',
      description: formData.grievanceDescription,
      status: GrievanceStatus.SUBMITTED,
      priority: GrievancePriority.MEDIUM,
      createdAt: new Date(),
      updatedAt: new Date(),
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      evidence: formData.attachedFiles.map((file: File) => file.name),
      relatedConsentId: formData.selectedConsentId,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };

    setGrievances(prev => [newGrievance, ...prev]);
    addNotification('success', `Grievance submitted successfully. Reference: ${newGrievance.referenceNumber}`);
    setGrievanceFormOpen(false);
    logAuditEntry('GRIEVANCE_SUBMITTED', `New grievance submitted: ${newGrievance.referenceNumber}`, newGrievance.id);
  };

  const handleGrievanceView = (grievance: GrievanceTicket) => {
    setSelectedGrievance(grievance);
    setGrievanceDetailOpen(true);
  };

  const getStatusBadgeVariant = (status: GrievanceStatus | undefined) => {
    if (!status) return 'secondary';
    switch (status) {
      case GrievanceStatus.SUBMITTED: return 'secondary';
      case GrievanceStatus.IN_PROGRESS: return 'default';
      case GrievanceStatus.PENDING_INFO: return 'destructive';
      case GrievanceStatus.RESOLVED: return 'default';
      case GrievanceStatus.CLOSED: return 'outline';
      case GrievanceStatus.ESCALATED: return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority: GrievancePriority | undefined) => {
    if (!priority) return 'secondary';
    switch (priority) {
      case GrievancePriority.LOW: return 'outline';
      case GrievancePriority.MEDIUM: return 'secondary';
      case GrievancePriority.HIGH: return 'destructive';
      case GrievancePriority.CRITICAL: return 'destructive';
      default: return 'secondary';
    }
  };

  // New functions for data request handling
  const handleDataRequestTypeSelect = (type: 'ACCESS' | 'CORRECT' | 'ERASE' | 'PORTABILITY' | 'NOMINATION') => {
    setDataRequestType(type);
    setDataRequestForm(prev => ({ ...prev, type }));
    setShowRequestTypeSelection(false);
  };

  const handleDataRequestSubmit = () => {
    const newRequest: DataRequest = {
      id: `req_${Date.now()}`,
      referenceId: `${dataRequestType === 'NOMINATION' ? 'NOM' : 'REQ'}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      type: dataRequestForm.type,
      status: 'SUBMITTED',
      submittedAt: new Date(),
      dueDate: new Date(Date.now() + (dataRequestType === 'NOMINATION' ? 2 : 30) * 24 * 60 * 60 * 1000),
      description: getRequestDescription(),
      userId: user.id
    };

    setDataRequests(prev => [newRequest, ...prev]);
    setSubmittedRequestId(newRequest.referenceId);
    setRequestSubmitted(true);
    
    // Log audit entry
    logAuditEntry(
      `DATA_REQUEST_SUBMITTED_${dataRequestForm.type}`,
      `User submitted ${dataRequestForm.type.toLowerCase()} request`,
      newRequest.id
    );

    // Add notification
    addNotification('success', `${dataRequestForm.type} request submitted successfully! Reference: ${newRequest.referenceId}`);
  };

  const getRequestDescription = () => {
    switch (dataRequestForm.type) {
      case 'ACCESS':
        return `Request to access personal data fields: ${dataRequestForm.fields?.join(', ') || 'All data'}`;
      case 'CORRECT':
        return `Data correction request for ${dataRequestForm.corrections?.length || 0} fields`;
      case 'ERASE':
        return `Data erasure request - ${dataRequestForm.erasureScope === 'full' ? 'Complete profile' : 'Specific fields'}`;
      case 'PORTABILITY':
        return 'Data portability request for data export';
      case 'NOMINATION':
        return `Proxy nomination for ${dataRequestForm.nomineeName} - ${dataRequestForm.nomineeRelationship}`;
      default:
        return 'Data request submitted';
    }
  };

  const resetDataRequestForm = () => {
    setDataRequestFormOpen(false);
    setDataRequestType(null);
    setShowRequestTypeSelection(false);
    setRequestSubmitted(false);
    setSubmittedRequestId('');
    setDataRequestForm({
      type: 'ACCESS',
      consentId: '',
      purpose: '',
      notificationPreference: 'email',
      fields: [],
      corrections: [],
      proxyScope: []
    });
  };

  const addCorrectionField = () => {
    setDataRequestForm(prev => ({
      ...prev,
      corrections: [...(prev.corrections || []), { field: '', currentValue: '', newValue: '' }]
    }));
  };

  const updateCorrectionField = (index: number, field: keyof typeof dataRequestForm.corrections[0], value: string) => {
    setDataRequestForm(prev => ({
      ...prev,
      corrections: prev.corrections?.map((correction, i) => 
        i === index ? { ...correction, [field]: value } : correction
      ) || []
    }));
  };

  const removeCorrectionField = (index: number) => {
    setDataRequestForm(prev => ({
      ...prev,
      corrections: prev.corrections?.filter((_, i) => i !== index) || []
    }));
  };

  const getRequestStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'default';
      case 'IN_PROGRESS': return 'secondary';
      case 'COMPLETED': return 'default';
      case 'REJECTED': return 'destructive';
      default: return 'outline';
    }
  };

  // Notice viewing handler
  const handleViewNotice = (consent: DashboardConsentRecord) => {
    const noticeData: ConsentNoticeData = {
      id: consent.linkedNoticeId,
      title: consent.linkedNoticeName,
      content: generateNoticeContent(consent),
      dataFiduciaryName: consent.dataFiduciaryName,
      version: consent.version,
      language: consent.language,
      createdAt: consent.grantedAt,
      purposes: consent.purposes,
      legalBasis: 'Consent under Section 7 of DPDP Act 2023',
      retentionPeriod: consent.purposes[0]?.retentionPeriod || '3 years',
      dataCategories: consent.purposes.flatMap(p => p.dataTypes),
      dataFiduciaryContact: {
        dpo: `dpo@${consent.dataFiduciaryName.toLowerCase().replace(/\s+/g, '')}.com`,
        grievance: `grievance@${consent.dataFiduciaryName.toLowerCase().replace(/\s+/g, '')}.com`,
        address: `${consent.dataFiduciaryName}, Data Protection Office, Mumbai, India`
      },
      userRights: [
        'Right to access your personal data',
        'Right to correct inaccurate data',
        'Right to erase your data',
        'Right to data portability',
        'Right to withdraw consent',
        'Right to file grievances'
      ]
    };
    
    setSelectedNotice(noticeData);
    setNoticeDialogOpen(true);
  };

  const generateNoticeContent = (consent: DashboardConsentRecord): string => {
    return `
      <div class="space-y-6">
        <div class="border-b pb-4">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Data Processing Notice</h1>
          <p class="text-gray-600">In compliance with the Digital Personal Data Protection Act 2023</p>
        </div>
        
        <div class="space-y-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Data Fiduciary Information</h2>
            <p><strong>Organization:</strong> ${consent.dataFiduciaryName}</p>
            <p><strong>Contact:</strong> dpo@${consent.dataFiduciaryName.toLowerCase().replace(/\s+/g, '')}.com</p>
          </div>
          
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Purposes of Processing</h2>
            ${consent.purposes.map(purpose => `
              <div class="mb-3 p-3 bg-blue-50 rounded-lg">
                <h3 class="font-medium text-blue-900">${purpose.name}</h3>
                <p class="text-sm text-blue-800">${purpose.description}</p>
                <p class="text-xs text-blue-600 mt-1">Legal Basis: ${purpose.legalBasis}</p>
                <p class="text-xs text-blue-600">Retention: ${purpose.retentionPeriod}</p>
              </div>
            `).join('')}
          </div>
          
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Your Rights Under DPDP Act 2023</h2>
            <ul class="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Right to access your personal data (Section 11)</li>
              <li>Right to correction and erasure (Section 12)</li>
              <li>Right to data portability (Section 13)</li>
              <li>Right to withdraw consent at any time</li>
              <li>Right to file grievances (Section 17)</li>
            </ul>
          </div>
          
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Contact Information</h2>
            <p><strong>Data Protection Officer:</strong> dpo@${consent.dataFiduciaryName.toLowerCase().replace(/\s+/g, '')}.com</p>
            <p><strong>Grievance Officer:</strong> grievance@${consent.dataFiduciaryName.toLowerCase().replace(/\s+/g, '')}.com</p>
          </div>
        </div>
      </div>
    `;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
                <User className="h-8 w-8 text-blue-600" />
                {t.dashboard}
              </h1>
              <p className="text-gray-600 mt-2">
                {t.welcome}, {user.name}! Manage your data consents and privacy preferences.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {user.isMinor && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                  <Shield className="h-3 w-3 mr-1" />
                  Minor Account
                </Badge>
              )}
              {user.digiLockerVerified && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  DigiLocker Verified
                </Badge>
              )}
            </div>
        </div>
      </div>

        {/* Wireframe Implementation - Login Consent Banner */}
        {showLoginConsent && (
          <LoginConsentBanner
            userId={user.id}
            userName={user.name}
            displayMode={consentDisplayMode}
            onConsentCompleted={handleConsentCompleted}
            onConsentDismissed={handleConsentDismissed}
          />
        )}

        {/* Integrated Consent Notice */}
        <IntegratedConsentNotice 
          userId={user.id}
          onConsentCompleted={(artifact: ConsentArtifact) => {
            addNotification('success', `Consent artifact created: ${artifact.id}`);
            // Refresh consent records or update state as needed
          }}
          onConsentDismissed={() => {
            addNotification('warning', 'Consent notice dismissed');
          }}
          config={{
            displayMode: 'MODAL',
            dismissible: false,
            requiresImmediateAction: true,
            showProgressIndicator: true,
            enableRealTimeFeedback: true
          }}
        />

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-green-200 hover:border-green-400"
            onClick={() => setActiveTab('consents')}
          >
            <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-gray-600">{t.activeConsents}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {consentRecords.filter(c => c.status === ConsentStatus.GRANTED || c.status === ConsentStatus.RENEWED).length}
                  </p>
              </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-yellow-200 hover:border-yellow-400"
            onClick={() => {
              setActiveTab('consents');
              // Filter to show expiring consents
              addNotification('info', `${consentRecords.filter(c => {
                const days = getDaysUntilExpiry(c.expiryDate);
                return days !== null && days <= 30 && days > 0;
              }).length} consents expiring soon`);
            }}
          >
            <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {consentRecords.filter(c => {
                      const days = getDaysUntilExpiry(c.expiryDate);
                      return days !== null && days <= 30 && days > 0;
                    }).length}
                  </p>
              </div>
                <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-blue-200 hover:border-blue-400"
            onClick={() => {
              setActiveTab('consents');
              addNotification('info', `Managing consents from ${new Set(consentRecords.map(c => c.categoryId)).size} data fiduciaries`);
            }}
          >
            <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-gray-600">{t.dataFiduciary}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {new Set(consentRecords.map(c => c.categoryId)).size}
                  </p>
              </div>
                <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-purple-200 hover:border-purple-400"
            onClick={() => setActiveTab('audit')}
          >
            <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-gray-600">Audit Logs</p>
                  <p className="text-2xl font-bold text-purple-600">{auditLogs.length}</p>
              </div>
                <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <NavigationTab value="overview">{t.dashboard}</NavigationTab>
            <NavigationTab value="consents">{t.myConsents}</NavigationTab>
            <NavigationTab value="data-requests">{t.dataRequests}</NavigationTab>
            <NavigationTab value="grievances">{t.grievances}</NavigationTab>
            <NavigationTab value="audit">Audit Trail</NavigationTab>
            <NavigationTab value="settings">{t.privacySettings}</NavigationTab>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Wireframe Implementation Demo Section */}
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Wireframe Implementation - Login Consent Banner
                </CardTitle>
                <CardDescription>
                  Live demonstration of the wireframe-compliant consent notice integration upon login
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-purple-700">
                    This implementation matches your exact wireframe specification with banner/modal display modes, 
                    granular consent controls, multi-language support, and DPDP Act 2023 compliance.
                  </p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Badge variant="outline" className="bg-green-100 text-green-700 justify-center py-2">
                      ✓ Wireframe Layout
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-700 justify-center py-2">
                      ✓ Purpose-Specific Controls
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-700 justify-center py-2">
                      ✓ No Pre-selection
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-700 justify-center py-2">
                      ✓ Multi-language UI
                    </Badge>
            </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Demo Controls</h4>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="display-mode" className="text-sm">Display Mode:</Label>
                        <select
                          id="display-mode"
                          value={consentDisplayMode}
                          onChange={(e) => setConsentDisplayMode(e.target.value as 'banner' | 'modal')}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="banner">Banner</option>
                          <option value="modal">Modal</option>
                        </select>
                      </div>
            </div>
                    
                    <div className="flex items-center gap-3">
            <Button
                        onClick={() => setShowLoginConsent(true)}
                        disabled={showLoginConsent}
                        className="flex items-center gap-2"
            >
                        <RefreshCw className="h-4 w-4" />
                        {showLoginConsent ? 'Consent Notice Active' : 'Show Consent Notice'}
            </Button>
                      
                      {showLoginConsent && (
            <Button
                          variant="outline"
                          onClick={() => setShowLoginConsent(false)}
                          className="flex items-center gap-2"
            >
                          <XCircle className="h-4 w-4" />
                          Hide Notice
            </Button>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 bg-gray-100 p-3 rounded">
                    <p className="font-medium mb-1">Implementation Details:</p>
                    <ul className="space-y-1">
                      <li>• Automatic consent requirement detection upon login</li>
                      <li>• Dynamic purpose rendering with P-001, P-002 identifiers</li>
                      <li>• Mandatory/Optional purpose classification</li>
                      <li>• Real-time consent artifact creation and storage</li>
                      <li>• Complete audit trail integration</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Management Overview */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Privacy Management Overview
          </CardTitle>
                <CardDescription>
                  Comprehensive privacy controls and consent management features
          </CardDescription>
        </CardHeader>
              <CardContent>
          <div className="space-y-4">
                  <p className="text-sm text-blue-700">
                    Your privacy dashboard provides complete control over your personal data with automated consent 
                    management, real-time notifications, and comprehensive audit trails.
                  </p>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      ✓ Consent Management
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      ✓ Notice Viewing
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      ✓ Data Rights Exercising
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      ✓ Audit Trail Access
                    </Badge>
                    </div>
                  <p className="text-xs text-gray-600">
                    All features are designed in compliance with the Digital Personal Data Protection Act 2023.
                    </p>
                  </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Consent Health Score
          </CardTitle>
                  <CardDescription>
                    Your current privacy and consent management status
          </CardDescription>
        </CardHeader>
                <CardContent>
          <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Overall Score</span>
                      <Badge className="bg-green-100 text-green-800">95/100 Excellent</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Active Consents</p>
                        <p className="font-semibold text-green-600">Up to date</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Verification Status</p>
                        <p className="font-semibold text-green-600">Verified</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-500" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest consent and privacy-related activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {auditLogs.slice(-5).reverse().map(log => (
                      <div 
                        key={log.id} 
                        className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 hover:shadow-sm transition-all duration-200"
                        onClick={() => {
                          setActiveTab('audit');
                          addNotification('info', `Viewing audit log: ${log.action}`);
                        }}
                      >
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.action.replace('_', ' ')}</p>
                          <p className="text-xs text-gray-500">{log.timestamp.toLocaleString()}</p>
                </div>
                        <Eye className="h-3 w-3 text-gray-400" />
              </div>
            ))}
                    {auditLogs.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                    )}
          </div>
        </CardContent>
      </Card>
            </div>
          </TabsContent>

          {/* My Consents Tab */}
          <TabsContent value="consents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{t.myConsents}</h2>
              <Button onClick={() => handleNewConsentCollection('demo_purpose', [])}>
                <Globe className="h-4 w-4 mr-2" />
                Grant New Consent
              </Button>
            </div>

            <div className="grid gap-6">
              {consentRecords.map(consent => {
                const daysUntilExpiry = getDaysUntilExpiry(consent.expiresAt);
                const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30;
                
                return (
                  <Card 
                    key={consent.id} 
                    className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] ${
                      isExpiringSoon ? 'border-orange-400 bg-orange-50/50 hover:bg-orange-100/50' : getConsentCardColor(consent.status)
                    } hover:shadow-xl`}
                    onClick={() => {
                      setSelectedConsent(consent);
                      addNotification('info', `Viewing details for ${consent.dataFiduciaryName} consent`);
                    }}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {consent.dataFiduciaryName}
                            <Eye className="h-4 w-4 text-gray-400" />
            </CardTitle>
                          <CardDescription>
                            Granted on {consent.grantedAt.toLocaleDateString()} • 
                            Version {consent.version} • 
                            {consent.language}
            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(consent.status)} variant="outline">
                            {consent.status.replace('_', ' ')}
                          </Badge>
                          {isExpiringSoon && (
                            <Badge variant="outline" className="border-orange-500 text-orange-700 bg-orange-50">
                              <Clock className="h-3 w-3 mr-1" />
                              Expires in {daysUntilExpiry} days
                            </Badge>
                          )}
                        </div>
                      </div>
          </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Processing Purposes */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">{t.purpose}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {consent.purposes.map(purpose => (
                              <div key={purpose.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="text-sm font-medium">{purpose.name}</p>
                                  <p className="text-xs text-gray-500">{purpose.category}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {purpose.isEssential && (
                                    <Badge variant="outline" className="text-xs">Essential</Badge>
                                  )}
                                  <Switch
                                    checked={true}
                                    disabled={purpose.isEssential}
                                    onCheckedChange={(checked) => {
                                      if (!purpose.isEssential) {
                                        const updatedPurposes = consent.purposes.filter(p => 
                                          p.id !== purpose.id || checked
                                        );
                                        handleConsentUpdate(consent.id, updatedPurposes);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Consent Metadata */}
                        <div className="border-t pt-4">
                          <h4 className="font-medium text-gray-900 mb-2">Consent Details</h4>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Method</p>
                              <p className="font-medium">{consent.consentMethod.replace('_', ' ')}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">IP Address</p>
                              <p className="font-medium">{consent.ipAddress}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Device</p>
                              <p className="font-medium">{consent.metadata.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Expires</p>
                              <p className="font-medium">
                                {consent.expiresAt ? consent.expiresAt.toLocaleDateString() : 'Never'}
                              </p>
                            </div>
                          </div>
                  </div>
                  
                        {/* Linked Notice Information */}
                        <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">Linked Notice</span>
                              </div>
                              <p className="text-sm text-blue-700">{consent.linkedNoticeName}</p>
                              <p className="text-xs text-blue-600">ID: {consent.linkedNoticeId}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewNotice(consent);
                              }}
                              className="text-blue-600 border-blue-300 hover:bg-blue-100"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Notice
                            </Button>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedConsent(consent);
                              setRenewalDialogOpen(true);
                            }}
                            disabled={consent.status === ConsentStatus.WITHDRAWN}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            {t.renew}
            </Button>
                  <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedConsent(consent);
                              setWithdrawalDialogOpen(true);
                            }}
                            disabled={consent.status === ConsentStatus.WITHDRAWN}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            {t.withdraw}
            </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              addNotification('info', `Viewing detailed consent information for ${consent.dataFiduciaryName}`);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {t.view}
            </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              addNotification('success', `Exporting consent data for ${consent.dataFiduciaryName}`);
                              logAuditEntry('CONSENT_DATA_EXPORT', `User exported consent data for ${consent.dataFiduciaryName}`, consent.id);
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {t.export}
                          </Button>
                        </div>
                      </div>
          </CardContent>
        </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Data Requests Tab - Enhanced */}
          <TabsContent value="data-requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Principal Rights</CardTitle>
                <CardDescription>
                  Exercise your rights under the Digital Personal Data Protection Act 2023
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Button 
                    className="h-24 flex-col gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105 border-blue-200 hover:border-blue-400 hover:bg-blue-50" 
                    variant="outline"
                    onClick={() => {
                      setDataRequestFormOpen(true);
                      setShowRequestTypeSelection(true);
                    }}
                  >
                    <Eye className="h-6 w-6" />
                    <span>Access My Data</span>
                  </Button>
                  <Button 
                    className="h-24 flex-col gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105 border-green-200 hover:border-green-400 hover:bg-green-50" 
                    variant="outline"
                    onClick={() => {
                      setDataRequestFormOpen(true);
                      setShowRequestTypeSelection(true);
                    }}
                  >
                    <Settings className="h-6 w-6" />
                    <span>Correct My Data</span>
                  </Button>
                  <Button 
                    className="h-24 flex-col gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105 border-red-200 hover:border-red-400 hover:bg-red-50" 
                    variant="outline"
                    onClick={() => {
                      setDataRequestFormOpen(true);
                      setShowRequestTypeSelection(true);
                    }}
                  >
                    <Trash2 className="h-6 w-6" />
                    <span>Erase My Data</span>
                  </Button>
                  <Button 
                    className="h-24 flex-col gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105 border-purple-200 hover:border-purple-400 hover:bg-purple-50" 
                    variant="outline"
                    onClick={() => {
                      setDataRequestFormOpen(true);
                      setShowRequestTypeSelection(true);
                    }}
                  >
                    <Download className="h-6 w-6" />
                    <span>Port My Data</span>
                  </Button>
                  <Button 
                    className="h-24 flex-col gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105 border-orange-200 hover:border-orange-400 hover:bg-orange-50" 
                    variant="outline"
                    onClick={() => {
                      setDataRequestFormOpen(true);
                      setShowRequestTypeSelection(true);
                    }}
                  >
                    <UserPlus className="h-6 w-6" />
                    <span>Nomination</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* My Data Requests Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  My Data Requests
                </CardTitle>
                <CardDescription>
                  Track the status of your submitted data requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dataRequests && dataRequests.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reference</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dataRequests.map((request) => (
                          <TableRow key={request.id} className="cursor-pointer hover:bg-gray-50">
                            <TableCell className="font-mono text-sm">
                              {request.referenceId}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {request.type.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {request.description}
                            </TableCell>
                                                         <TableCell>
                               <Badge variant={getRequestStatusBadgeVariant(request.status)}>
                                 {request.status.replace('_', ' ')}
                               </Badge>
                             </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {request.submittedAt.toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {request.dueDate.toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No data requests yet</h3>
                    <p className="text-gray-600 mb-4">
                      You haven't submitted any data requests. Click the buttons above to get started.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Data Request Form Dialog */}
            <Dialog open={dataRequestFormOpen} onOpenChange={setDataRequestFormOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {showRequestTypeSelection ? (
                      <>
                        <ArrowLeft className="h-5 w-5 cursor-pointer" onClick={() => setShowRequestTypeSelection(false)} />
                        Submit a Data Request
                      </>
                    ) : requestSubmitted ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Request Submitted!
                      </>
                    ) : (
                      <>
                        <ArrowLeft className="h-5 w-5 cursor-pointer" onClick={() => setShowRequestTypeSelection(true)} />
                        Data Request: {dataRequestType?.replace('_', ' ')}
                      </>
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    {showRequestTypeSelection 
                      ? "Which data right would you like to exercise?"
                      : requestSubmitted
                      ? "Your request has been submitted successfully"
                      : "Complete the form below to submit your request"
                    }
                  </DialogDescription>
                </DialogHeader>

                {showRequestTypeSelection && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-4">Which data right would you like to exercise?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                          variant="outline"
                          className="h-20 flex-col gap-2 hover:bg-blue-50"
                          onClick={() => handleDataRequestTypeSelect('ACCESS')}
                        >
                          <Eye className="h-6 w-6" />
                          Access My Data
                        </Button>
                        <Button
                          variant="outline"
                          className="h-20 flex-col gap-2 hover:bg-green-50"
                          onClick={() => handleDataRequestTypeSelect('CORRECT')}
                        >
                          <Settings className="h-6 w-6" />
                          Correct My Data
                        </Button>
                        <Button
                          variant="outline"
                          className="h-20 flex-col gap-2 hover:bg-red-50"
                          onClick={() => handleDataRequestTypeSelect('ERASE')}
                        >
                          <Trash2 className="h-6 w-6" />
                          Erase My Data
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <Button
                          variant="outline"
                          className="h-20 flex-col gap-2 hover:bg-purple-50"
                          onClick={() => handleDataRequestTypeSelect('PORTABILITY')}
                        >
                          <Download className="h-6 w-6" />
                          Port My Data
                        </Button>
                        <Button
                          variant="outline"
                          className="h-20 flex-col gap-2 hover:bg-orange-50"
                          onClick={() => handleDataRequestTypeSelect('NOMINATION')}
                        >
                          <UserPlus className="h-6 w-6" />
                          Nomination
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button variant="outline" onClick={resetDataRequestForm}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {requestSubmitted && (
                  <div className="space-y-6 text-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Request Submitted Successfully!</h3>
                      <div className="space-y-2 text-sm text-green-700">
                        <p><strong>Reference ID:</strong> {submittedRequestId}</p>
                        <p><strong>Type:</strong> {dataRequestForm.type.replace('_', ' ')}</p>
                        <p><strong>Purpose:</strong> {dataRequestForm.purpose || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">What's next?</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• We've emailed you confirmation.</li>
                        <li>• Track your request under "My Data Requests."</li>
                        <li>• {dataRequestType === 'NOMINATION' ? 'DPO review within 48 hours.' : 'Response within 30 days.'}</li>
                      </ul>
                    </div>
                    <Button onClick={resetDataRequestForm} className="w-full">
                      Go to My Data Requests
                    </Button>
                  </div>
                )}

                {!showRequestTypeSelection && !requestSubmitted && dataRequestType && (
                  <div className="space-y-6">
                    {/* Common section - Linked Consent */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">1. Linked Consent (Active)</h3>
                      <Select
                        value={dataRequestForm.consentId}
                        onValueChange={(value) => {
                          const consent = mockActiveConsents.find(c => c.id === value);
                          setDataRequestForm(prev => ({
                            ...prev,
                            consentId: value,
                            purpose: consent ? `${consent.purposeId} (${consent.purposeName})` : ''
                          }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Consent..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockActiveConsents.map((consent) => (
                            <SelectItem key={consent.id} value={consent.id}>
                              {consent.purposeId} | {consent.purposeName} ({consent.category}) - Granted: {consent.grantedAt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Access My Data Form */}
                    {dataRequestType === 'ACCESS' && (
                      <>
                        <div>
                          <h3 className="text-lg font-semibold mb-3">2. Fields to Access</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {['Full Name', 'Email Address', 'Consent History', 'Transaction History'].map((field) => (
                              <div key={field} className="flex items-center space-x-2">
                                <Checkbox
                                  id={field}
                                  checked={dataRequestForm.fields?.includes(field)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setDataRequestForm(prev => ({
                                        ...prev,
                                        fields: [...(prev.fields || []), field]
                                      }));
                                    } else {
                                      setDataRequestForm(prev => ({
                                        ...prev,
                                        fields: prev.fields?.filter(f => f !== field) || []
                                      }));
                                    }
                                  }}
                                />
                                <Label htmlFor={field} className="text-sm">{field}</Label>
                              </div>
                            ))}
                            <div className="col-span-full">
                              <Label htmlFor="other-field">Other:</Label>
                              <Input
                                id="other-field"
                                placeholder="Specify other fields..."
                                onBlur={(e) => {
                                  if (e.target.value) {
                                    setDataRequestForm(prev => ({
                                      ...prev,
                                      fields: [...(prev.fields || []), e.target.value]
                                    }));
                                    e.target.value = '';
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="access-purpose">3. Purpose of Request (optional)</Label>
                          <Textarea
                            id="access-purpose"
                            placeholder="I need this data to update my profile..."
                            value={dataRequestForm.reason || ''}
                            onChange={(e) => setDataRequestForm(prev => ({ ...prev, reason: e.target.value }))}
                          />
                        </div>
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Note: You'll get a secure link to download your data within 30 days.
                          </AlertDescription>
                        </Alert>
                      </>
                    )}

                    {/* Correct My Data Form */}
                    {dataRequestType === 'CORRECT' && (
                      <>
                        <div>
                          <h3 className="text-lg font-semibold mb-3">2. Fields to Correct & New Values</h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-gray-600 border-b pb-2">
                              <div>Field</div>
                              <div>Current Value</div>
                              <div>New Value</div>
                            </div>
                            {dataRequestForm.corrections?.map((correction, index) => (
                              <div key={index} className="grid grid-cols-3 gap-4 items-center">
                                <Select
                                  value={correction.field}
                                  onValueChange={(value) => updateCorrectionField(index, 'field', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select field" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Name">Name</SelectItem>
                                    <SelectItem value="Email">Email</SelectItem>
                                    <SelectItem value="Phone">Phone</SelectItem>
                                    <SelectItem value="Address">Address</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Input
                                  placeholder="Current value"
                                  value={correction.currentValue}
                                  onChange={(e) => updateCorrectionField(index, 'currentValue', e.target.value)}
                                />
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="New value"
                                    value={correction.newValue}
                                    onChange={(e) => updateCorrectionField(index, 'newValue', e.target.value)}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeCorrectionField(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={addCorrectionField}
                              className="w-full"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add row
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="correction-reason">3. Reason for Correction</Label>
                          <Textarea
                            id="correction-reason"
                            placeholder="My email changed after migration..."
                            value={dataRequestForm.reason || ''}
                            onChange={(e) => setDataRequestForm(prev => ({ ...prev, reason: e.target.value }))}
                          />
                        </div>
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Note: We'll confirm via your new email or SMS once updated. Response in 15 days.
                          </AlertDescription>
                        </Alert>
                      </>
                    )}

                    {/* Erase My Data Form */}
                    {dataRequestType === 'ERASE' && (
                      <>
                        <div>
                          <h3 className="text-lg font-semibold mb-3">2. Scope of Erasure</h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="entire-profile"
                                checked={dataRequestForm.erasureScope === 'full'}
                                onCheckedChange={(checked) => {
                                  setDataRequestForm(prev => ({
                                    ...prev,
                                    erasureScope: checked ? 'full' : 'partial'
                                  }));
                                }}
                              />
                              <Label htmlFor="entire-profile">Entire Profile</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="specific-fields"
                                checked={dataRequestForm.erasureScope === 'partial'}
                                onCheckedChange={(checked) => {
                                  setDataRequestForm(prev => ({
                                    ...prev,
                                    erasureScope: checked ? 'partial' : 'full'
                                  }));
                                }}
                              />
                              <Label htmlFor="specific-fields">Specific Fields:</Label>
                              <div className="flex gap-2">
                                {['Name', 'Email'].map((field) => (
                                  <Badge key={field} variant="outline">{field}</Badge>
                                ))}
                                <Input placeholder="Other..." className="w-32" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-3">3. Consequences & Exceptions</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                            <li>Erasure is irreversible.</li>
                            <li>Some records may persist for legal requirements.</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-3">4. Confirmation</h3>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="confirm-erasure"
                              checked={dataRequestForm.confirmErasure || false}
                              onCheckedChange={(checked) => {
                                setDataRequestForm(prev => ({ ...prev, confirmErasure: !!checked }));
                              }}
                            />
                            <Label htmlFor="confirm-erasure">
                              I understand the consequences and wish to proceed.
                            </Label>
                          </div>
                        </div>
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Note: Erasure completed within 15 days. You will be notified when done.
                          </AlertDescription>
                        </Alert>
                      </>
                    )}

                    {/* Port My Data Form */}
                    {dataRequestType === 'PORTABILITY' && (
                      <>
                        <div>
                          <h3 className="text-lg font-semibold mb-3">2. Data Export Format</h3>
                          <Select
                            value={dataRequestForm.reason || 'JSON'}
                            onValueChange={(value) => setDataRequestForm(prev => ({ ...prev, reason: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="JSON">JSON Format</SelectItem>
                              <SelectItem value="CSV">CSV Format</SelectItem>
                              <SelectItem value="XML">XML Format</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Alert>
                          <Download className="h-4 w-4" />
                          <AlertDescription>
                            Note: Your data export will be available for download within 30 days.
                          </AlertDescription>
                        </Alert>
                      </>
                    )}

                    {/* Nomination Form */}
                    {dataRequestType === 'NOMINATION' && (
                      <>
                        <div>
                          <h3 className="text-lg font-semibold mb-3">2. Nominee Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="nominee-name">Nominee Name</Label>
                              <Input
                                id="nominee-name"
                                value={dataRequestForm.nomineeName || ''}
                                onChange={(e) => setDataRequestForm(prev => ({ ...prev, nomineeName: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="nominee-relationship">Relationship</Label>
                              <Select
                                value={dataRequestForm.nomineeRelationship || ''}
                                onValueChange={(value) => setDataRequestForm(prev => ({ ...prev, nomineeRelationship: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select relationship" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Spouse">Spouse</SelectItem>
                                  <SelectItem value="Parent">Parent</SelectItem>
                                  <SelectItem value="Sibling">Sibling</SelectItem>
                                  <SelectItem value="Attorney">Attorney</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="nominee-contact">Nominee Contact (Phone)</Label>
                              <Input
                                id="nominee-contact"
                                value={dataRequestForm.nomineeContact || ''}
                                onChange={(e) => setDataRequestForm(prev => ({ ...prev, nomineeContact: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="nominee-email">Nominee Email</Label>
                              <Input
                                id="nominee-email"
                                type="email"
                                value={dataRequestForm.nomineeEmail || ''}
                                onChange={(e) => setDataRequestForm(prev => ({ ...prev, nomineeEmail: e.target.value }))}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="nominee-address">Nominee Address</Label>
                              <Textarea
                                id="nominee-address"
                                rows={3}
                                value={dataRequestForm.nomineeAddress || ''}
                                onChange={(e) => setDataRequestForm(prev => ({ ...prev, nomineeAddress: e.target.value }))}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">3. Scope of Proxy</h3>
                          <p className="text-sm text-gray-600 mb-3">Select which rights you authorize your proxy to exercise on your behalf.</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                              'Access My Data',
                              'Correct My Data',
                              'Erase My Data',
                              'Raise Grievances',
                              'Modify/Withdraw Consent',
                              'View Consent History',
                              'Cookie Preferences'
                            ].map((scope) => (
                              <div key={scope} className="flex items-center space-x-2">
                                <Checkbox
                                  id={scope}
                                  checked={dataRequestForm.proxyScope?.includes(scope)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setDataRequestForm(prev => ({
                                        ...prev,
                                        proxyScope: [...(prev.proxyScope || []), scope]
                                      }));
                                    } else {
                                      setDataRequestForm(prev => ({
                                        ...prev,
                                        proxyScope: prev.proxyScope?.filter(s => s !== scope) || []
                                      }));
                                    }
                                  }}
                                />
                                <Label htmlFor={scope} className="text-sm">{scope}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">4. Proof of Authorization</h3>
                          <p className="text-sm text-gray-600 mb-3">Upload a signed Power of Attorney or notarized authorization.</p>
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="poa-document">Upload PoA Document</Label>
                              <Input id="poa-document" type="file" accept=".pdf,.doc,.docx,.jpg,.png" />
                            </div>
                            <div>
                              <Label htmlFor="id-proof">Upload ID Proof</Label>
                              <Input id="id-proof" type="file" accept=".pdf,.jpg,.png" />
                            </div>
                            <Button type="button" variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Add another document
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">5. Validity Period</h3>
                          <div className="flex items-center gap-4">
                            <div>
                              <Label htmlFor="validity-from">Proxy effective from</Label>
                              <Input
                                id="validity-from"
                                type="date"
                                value={dataRequestForm.validityFrom || ''}
                                onChange={(e) => setDataRequestForm(prev => ({ ...prev, validityFrom: e.target.value }))}
                              />
                            </div>
                            <span className="text-gray-500 mt-6">to</span>
                            <div>
                              <Label htmlFor="validity-to">to</Label>
                              <Input
                                id="validity-to"
                                type="date"
                                value={dataRequestForm.validityTo || ''}
                                onChange={(e) => setDataRequestForm(prev => ({ ...prev, validityTo: e.target.value }))}
                              />
                            </div>
                          </div>
                        </div>

                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Note: Your proxy request will be reviewed by our DPO within 48 hours. You can track status under "My Data Requests."
                          </AlertDescription>
                        </Alert>
                      </>
                    )}

                    {/* Common Notification Preference */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        {dataRequestType === 'NOMINATION' ? '6. Notification Preference' : '4. Notification Preference'}
                      </h3>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="email-notification"
                            name="notification"
                            value="email"
                            checked={dataRequestForm.notificationPreference === 'email'}
                            onChange={(e) => setDataRequestForm(prev => ({ ...prev, notificationPreference: e.target.value as 'email' | 'sms' }))}
                          />
                          <Label htmlFor="email-notification">Email ({user.email})</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="sms-notification"
                            name="notification"
                            value="sms"
                            checked={dataRequestForm.notificationPreference === 'sms'}
                            onChange={(e) => setDataRequestForm(prev => ({ ...prev, notificationPreference: e.target.value as 'email' | 'sms' }))}
                          />
                          <Label htmlFor="sms-notification">SMS ({user.contactPhone})</Label>
                        </div>
                        {dataRequestType === 'NOMINATION' && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="inapp-notification"
                              name="notification"
                              value="inapp"
                            />
                            <Label htmlFor="inapp-notification">In-App Notification</Label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4 pt-4 border-t">
                      <Button variant="outline" onClick={resetDataRequestForm}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDataRequestSubmit}
                        disabled={
                          !dataRequestForm.consentId ||
                          (dataRequestType === 'ERASE' && !dataRequestForm.confirmErasure) ||
                          (dataRequestType === 'NOMINATION' && (!dataRequestForm.nomineeName || !dataRequestForm.nomineeEmail))
                        }
                      >
                        Submit {dataRequestType === 'NOMINATION' ? 'Nomination' : 
                               dataRequestType === 'CORRECT' ? 'Correction' :
                               dataRequestType === 'ERASE' ? 'Erasure' : 'Request'}
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Grievances Tab */}
          <TabsContent value="grievances" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Grievance & Data Request Management</h2>
                <p className="text-gray-600">File complaints and track data principal requests as per DPDP Act 2023</p>
              </div>
              <Button 
                className="hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => {
                  setGrievanceFormOpen(true);
                  logAuditEntry('GRIEVANCE_FORM_OPENED', 'User opened grievance submission form', user.id);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Raise New Grievance
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Grievances</p>
                      <p className="text-2xl font-bold">{grievances?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">In Progress</p>
                                             <p className="text-2xl font-bold">
                         {grievances?.filter(g => g && g.status === GrievanceStatus.IN_PROGRESS).length || 0}
                       </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Resolved</p>
                                             <p className="text-2xl font-bold">
                         {grievances?.filter(g => g && g.status === GrievanceStatus.RESOLVED).length || 0}
                       </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600">High Priority</p>
                                             <p className="text-2xl font-bold">
                         {grievances?.filter(g => g && g.priority === GrievancePriority.HIGH).length || 0}
                       </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Grievances Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  My Grievances & Requests
            </CardTitle>
                <CardDescription>
                  Track the status of your submitted grievances and data requests
            </CardDescription>
          </CardHeader>
              <CardContent>
                {grievances && grievances.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reference</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                                             <TableBody>
                         {(grievances || []).filter(g => g && g.id).map((grievance) => (
                          <TableRow 
                            key={grievance.id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleGrievanceView(grievance)}
                          >
                            <TableCell className="font-mono text-sm">
                              {grievance.referenceNumber}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {grievance.subject}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {grievance.category ? grievance.category.replace('_', ' ') : 'Unknown'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(grievance.status)}>
                                {grievance.status ? grievance.status.replace('_', ' ') : 'Unknown'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getPriorityBadgeVariant(grievance.priority)}>
                                {grievance.priority}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {grievance.createdAt.toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {grievance.dueDate?.toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGrievanceView(grievance);
                                }}
                              >
                                <Eye className="h-4 w-4" />
            </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No grievances filed yet</h3>
                    <p className="text-gray-600 mb-4">
                      You haven't filed any grievances or data requests. Click the button above to get started.
                    </p>
                    <Button 
                      onClick={() => setGrievanceFormOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      File Your First Grievance
            </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Grievance Form Modal */}
            <GrievanceForm
              isOpen={grievanceFormOpen}
              onClose={() => setGrievanceFormOpen(false)}
              onSubmit={handleGrievanceSubmit}
              userEmail={user.email}
              userPhone={user.contactPhone}
            />

            {/* Grievance Detail Modal */}
            {selectedGrievance && (
              <Dialog open={grievanceDetailOpen} onOpenChange={setGrievanceDetailOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Grievance Details - {selectedGrievance.referenceNumber}
                    </DialogTitle>
                    <DialogDescription>
                      Complete information about your grievance and its resolution status
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Header Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Status</Label>
                        <Badge variant={getStatusBadgeVariant(selectedGrievance.status)} className="mt-1">
                          {selectedGrievance.status ? selectedGrievance.status.replace('_', ' ') : 'Unknown'}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Priority</Label>
                        <Badge variant={getPriorityBadgeVariant(selectedGrievance.priority)} className="mt-1">
                          {selectedGrievance.priority}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Created</Label>
                        <p className="text-sm mt-1">{selectedGrievance.createdAt.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Due Date</Label>
                        <p className="text-sm mt-1">{selectedGrievance.dueDate?.toLocaleDateString()}</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Main Content */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Subject</Label>
                        <p className="mt-1">{selectedGrievance.subject}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Description</Label>
                        <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                          {selectedGrievance.description}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-600">Category</Label>
                        <Badge variant="outline" className="mt-1">
                          {selectedGrievance.category ? selectedGrievance.category.replace('_', ' ') : 'Unknown'}
                        </Badge>
                      </div>

                      {selectedGrievance.relatedConsentId && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Related Consent</Label>
                          <p className="text-sm mt-1">
                            {consentRecords.find(c => c.id === selectedGrievance.relatedConsentId)?.dataFiduciaryName || 'N/A'}
                          </p>
                        </div>
                      )}

                      {selectedGrievance.assignedTo && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Assigned To</Label>
                          <p className="text-sm mt-1">{selectedGrievance.assignedTo}</p>
                        </div>
                      )}

                      {selectedGrievance.evidence && selectedGrievance.evidence.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Evidence Files</Label>
                          <div className="mt-1 space-y-1">
                            {selectedGrievance.evidence.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span>{file}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedGrievance.resolutionNotes && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Resolution Notes</Label>
                          <p className="text-sm mt-1 p-3 bg-green-50 border border-green-200 rounded">
                            {selectedGrievance.resolutionNotes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setHistoryDialogOpen(true);
                          setHistoryEntityType('GRIEVANCE');
                          setHistoryEntityId(selectedGrievance.id);
                          setHistoryReferenceNumber(selectedGrievance.referenceNumber);
                        }}
                      >
                        <History className="h-4 w-4 mr-2" />
                        History
                      </Button>
                      <Button variant="outline" onClick={() => setGrievanceDetailOpen(false)}>
                        Close
            </Button>
                      {selectedGrievance.status !== GrievanceStatus.RESOLVED && (
                        <Button variant="outline">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Contact Support
                        </Button>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          {/* Audit Trail Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Complete Audit Trail</CardTitle>
                <CardDescription>
                  Immutable log of all consent-related activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.map(log => (
                    <div 
                      key={log.id} 
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all duration-200"
                      onClick={() => {
                        addNotification('info', `Audit Log Details: ${log.action} - ${log.details.description}`);
                      }}
                    >
                      <div className="text-xs text-gray-500">#{log.blockIndex}</div>
                      <div className="flex-1">
                        <p className="font-medium">{log.action.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-600">{log.details.description}</p>
                        <p className="text-xs text-gray-500">{log.timestamp.toLocaleString()}</p>
      </div>
                      <div className="text-xs text-gray-400">
                        Hash: {log.hash.substring(0, 8)}...
    </div>
                      <Eye className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No audit logs available</p>
                  )}
                </div>
          </CardContent>
        </Card>
          </TabsContent>

          {/* Privacy Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Privacy Settings</h2>
                <p className="text-gray-600">Manage your privacy preferences and notification settings</p>
              </div>
            </div>

            <div className="grid gap-6">
              {/* Privacy Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Privacy Preferences
                  </CardTitle>
                  <CardDescription>
                    Control how your data is used and shared
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="data-analytics">Data Analytics</Label>
                        <p className="text-sm text-gray-600">Allow anonymous usage analytics to improve services</p>
                      </div>
                      <Switch id="data-analytics" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing-emails">Marketing Communications</Label>
                        <p className="text-sm text-gray-600">Receive promotional emails and offers</p>
                      </div>
                      <Switch id="marketing-emails" defaultChecked={false} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="third-party-sharing">Third-party Data Sharing</Label>
                        <p className="text-sm text-gray-600">Allow sharing with trusted partners</p>
                      </div>
                      <Switch id="third-party-sharing" defaultChecked={false} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-green-600" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about important updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                      <Switch id="email-notifications" defaultChecked={user.notificationPreferences.email} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-gray-600">Receive critical updates via SMS</p>
                      </div>
                      <Switch id="sms-notifications" defaultChecked={user.notificationPreferences.sms} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="app-notifications">In-App Notifications</Label>
                        <p className="text-sm text-gray-600">Show notifications within the application</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="app-notifications" defaultChecked={user.notificationPreferences.inApp} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Renewal Dialog */}
        <Dialog open={renewalDialogOpen} onOpenChange={setRenewalDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Renew Consent</DialogTitle>
              <DialogDescription>
                Are you sure you want to renew your consent for {selectedConsent?.dataFiduciaryName}? 
                This will extend your consent for another 6 months.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setRenewalDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => selectedConsent && handleConsentRenewal(selectedConsent.id)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Renew Consent
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Withdrawal Dialog */}
        <Dialog open={withdrawalDialogOpen} onOpenChange={setWithdrawalDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Withdraw Consent</DialogTitle>
              <DialogDescription>
                Are you sure you want to withdraw your consent for {selectedConsent?.dataFiduciaryName}? 
                This action will immediately halt all data processing and cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="withdrawal-reason">Reason for Withdrawal (Optional)</Label>
                <Textarea 
                  id="withdrawal-reason"
                  placeholder="Please share why you're withdrawing consent..."
                  className="mt-2"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setWithdrawalDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => selectedConsent && handleConsentWithdrawal(selectedConsent.id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Withdraw Consent
                </Button>
              </div>
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
          userRole="DATA_PRINCIPAL"
        />

        {/* Notice Viewing Dialog */}
        <Dialog open={noticeDialogOpen} onOpenChange={setNoticeDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                {selectedNotice?.title}
              </DialogTitle>
              <DialogDescription>
                Complete data processing notice as per Digital Personal Data Protection Act 2023
              </DialogDescription>
            </DialogHeader>
            
            {selectedNotice && (
              <div className="space-y-6">
                {/* Notice Header */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-blue-700">Data Fiduciary</Label>
                      <p className="text-blue-900 font-semibold">{selectedNotice.dataFiduciaryName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-blue-700">Notice ID</Label>
                      <p className="text-blue-900 font-mono text-sm">{selectedNotice.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-blue-700">Version</Label>
                      <p className="text-blue-900">{selectedNotice.version}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-blue-700">Language</Label>
                      <p className="text-blue-900 capitalize">{selectedNotice.language}</p>
                    </div>
                  </div>
                </div>

                {/* Processing Purposes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Processing Purposes</h3>
                  <div className="space-y-3">
                    {selectedNotice.purposes.map((purpose, index) => (
                      <div key={purpose.id} className="p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{purpose.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{purpose.description}</p>
                            <div className="mt-2 space-y-1">
                              <p className="text-xs text-gray-500">
                                <strong>Legal Basis:</strong> {purpose.legalBasis}
                              </p>
                              <p className="text-xs text-gray-500">
                                <strong>Retention Period:</strong> {purpose.retentionPeriod}
                              </p>
                              <p className="text-xs text-gray-500">
                                <strong>Data Types:</strong> {purpose.dataTypes.join(', ')}
                              </p>
                            </div>
                          </div>
                          {purpose.isEssential && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                              Essential
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Your Rights */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Rights Under DPDP Act 2023</h3>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedNotice.userRights.map((right, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-green-800">{right}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Data Protection Officer</Label>
                        <p className="text-gray-900">{selectedNotice.dataFiduciaryContact.dpo}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Grievance Officer</Label>
                        <p className="text-gray-900">{selectedNotice.dataFiduciaryContact.grievance}</p>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-gray-700">Address</Label>
                        <p className="text-gray-900">{selectedNotice.dataFiduciaryContact.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notice Footer */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Notice Information</span>
                  </div>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p><strong>Created:</strong> {selectedNotice.createdAt.toLocaleDateString()}</p>
                    <p><strong>Legal Basis:</strong> {selectedNotice.legalBasis}</p>
                    <p><strong>Data Categories:</strong> {selectedNotice.dataCategories.join(', ')}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => {
                      addNotification('success', `Notice ${selectedNotice.id} downloaded as PDF`);
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" onClick={() => {
                      addNotification('success', `Notice ${selectedNotice.id} exported successfully`);
                    }}>
                      <Share className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <Button onClick={() => setNoticeDialogOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}