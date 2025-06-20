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
  Languages
} from 'lucide-react';
import { ConsentRecord, ProcessingPurpose, ConsentStatus, GrievanceTicket, AuditEntry, AuditAction, User as UserType, ConsentArtifact, UserRole, PurposeCategory, GrievanceStatus, GrievancePriority, GrievanceCategory } from '@/types/dpdp';
import GrievanceForm from '@/components/ui/grievance-form';
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
  preferredLanguage: 'english',
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
      case ConsentStatus.GRANTED: return 'bg-green-100 text-green-800';
      case ConsentStatus.RENEWED: return 'bg-blue-100 text-blue-800';
      case ConsentStatus.WITHDRAWN: return 'bg-red-100 text-red-800';
      case ConsentStatus.EXPIRED: return 'bg-gray-100 text-gray-800';
      case ConsentStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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

        {/* Integrated Consent Notice - BRD Section 4.1 Implementation */}
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
          <TabsList className="grid w-full grid-cols-7">
            <NavigationTab value="overview">{t.dashboard}</NavigationTab>
            <NavigationTab value="consents">{t.myConsents}</NavigationTab>
            <NavigationTab value="data-requests">{t.dataRequests}</NavigationTab>
            <NavigationTab value="grievances">{t.grievances}</NavigationTab>
            <NavigationTab value="audit">Audit Trail</NavigationTab>
            <NavigationTab value="settings">{t.privacySettings}</NavigationTab>
            <NavigationTab value="notices">Notices</NavigationTab>
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
                    granular consent controls, multi-language support, and BRD Section 4.1.1 compliance.
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

            {/* BRD Workflow Demo Section */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  BRD Section 4.1 - Consent Notice Integration Demo
          </CardTitle>
                <CardDescription>
                  Experience the complete login workflow with consent requirement detection and dynamic notice rendering
          </CardDescription>
        </CardHeader>
              <CardContent>
          <div className="space-y-4">
                  <p className="text-sm text-blue-700">
                    The system automatically detects consent requirements upon login and presents integrated notices 
                    with dynamic templating, multi-language support, and real-time artifact creation.
                  </p>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      ✓ Consent Detection API
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      ✓ Dynamic Notice Rendering
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      ✓ Real-time Workflow State
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      ✓ Artifact Creation
                    </Badge>
                    </div>
                  <p className="text-xs text-gray-600">
                    Refresh the page or re-login to trigger the consent requirement detection workflow.
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
                      isExpiringSoon ? 'border-yellow-400 bg-yellow-50 hover:bg-yellow-100' : 'hover:border-blue-300'
                    }`}
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
                          <Badge className={getStatusColor(consent.status)}>
                            {consent.status.replace('_', ' ')}
                          </Badge>
                          {isExpiringSoon && (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-700">
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

          {/* Data Requests Tab */}
          <TabsContent value="data-requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Principal Rights</CardTitle>
                <CardDescription>
                  Exercise your rights under the DPDP Act 2023
            </CardDescription>
          </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    className="h-24 flex-col gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105 border-blue-200 hover:border-blue-400 hover:bg-blue-50" 
                    variant="outline"
                    onClick={() => {
                      addNotification('success', 'Data access request initiated. You will receive your data within 30 days.');
                      logAuditEntry('DATA_ACCESS_REQUEST', 'User requested access to personal data', user.id);
                    }}
                  >
                    <Eye className="h-6 w-6" />
                    <span>{t.accessData}</span>
            </Button>
                  <Button 
                    className="h-24 flex-col gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105 border-green-200 hover:border-green-400 hover:bg-green-50" 
                    variant="outline"
                    onClick={() => {
                      addNotification('success', 'Data correction request submitted. We will review and update your information.');
                      logAuditEntry('DATA_CORRECTION_REQUEST', 'User requested data correction', user.id);
                    }}
                  >
                    <Settings className="h-6 w-6" />
                    <span>{t.correctData}</span>
            </Button>
                  <Button 
                    className="h-24 flex-col gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105 border-red-200 hover:border-red-400 hover:bg-red-50" 
                    variant="outline"
                    onClick={() => {
                      if (confirm('Are you sure you want to request data erasure? This action cannot be undone.')) {
                        addNotification('warning', 'Data erasure request submitted. Your data will be deleted within 30 days.');
                        logAuditEntry('DATA_ERASURE_REQUEST', 'User requested data erasure', user.id);
                      }
                    }}
                  >
                    <Trash2 className="h-6 w-6" />
                    <span>{t.eraseData}</span>
            </Button>
                  <Button 
                    className="h-24 flex-col gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105 border-purple-200 hover:border-purple-400 hover:bg-purple-50" 
                    variant="outline"
                    onClick={() => {
                      addNotification('success', 'Data portability request initiated. Your data export will be ready for download.');
                      logAuditEntry('DATA_PORTABILITY_REQUEST', 'User requested data portability', user.id);
                    }}
                  >
                    <Download className="h-6 w-6" />
                    <span>{t.portData}</span>
                  </Button>
                </div>
          </CardContent>
        </Card>
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

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Preferences</CardTitle>
                <CardDescription>
                  Manage your privacy and notification settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Preferred Language</Label>
                    <Select defaultValue={user.preferredLanguage}>
                      <SelectTrigger className="w-full mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                        <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                        <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                      </SelectContent>
                    </Select>
      </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium">Notification Preferences</Label>
                    <div className="space-y-3 mt-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <Switch id="email-notifications" defaultChecked={user.notificationPreferences.email} />
    </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <Switch id="sms-notifications" defaultChecked={user.notificationPreferences.sms} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="app-notifications">In-App Notifications</Label>
                        <Switch id="app-notifications" defaultChecked={user.notificationPreferences.inApp} />
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
              <h2 className="text-2xl font-bold text-gray-900">Consent Notices & Configurations</h2>
              <Button onClick={() => setActiveTab('notices-config')}>
                <FileText className="h-4 w-4 mr-2" />
                Configure Notice Templates
              </Button>
            </div>

            <div className="grid gap-6">
              {/* Dynamic Notice Generation Demo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Dynamic Notice Generation
                  </CardTitle>
                  <CardDescription>
                    Experience how consent notices are dynamically generated based on purposes and language
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Data Fiduciary</Label>
                        <Select defaultValue="df_ecommerce">
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
                        <Select defaultValue="english">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="hindi">हिन्दी (Hindi)</SelectItem>
                            <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                            <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                            <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                            <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
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
                            <Switch id={purpose} />
                            <Label htmlFor={purpose} className="text-sm">{purpose}</Label>
              </div>
            ))}
                      </div>
                    </div>

                    <Button className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      Generate Dynamic Notice
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Notice Templates Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-600" />
                    Notice Template Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure consent notice templates for different purposes and languages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>Enhanced BRD Implementation:</strong> This section demonstrates the complete notice workflow 
                        including administrative setup, dynamic generation with templating engine, purpose mapping with unique IDs, 
                        multi-language translation management, and enhanced consent artifacts with blockchain-style integrity verification.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <h4 className="font-medium text-green-900">Purpose Mapping</h4>
                            <p className="text-sm text-green-700 mt-1">
                              Map data collection activities to specific purposes with unique Purpose IDs
                            </p>
                            <div className="mt-3 space-y-1 text-xs text-green-600">
                              <div>• 8 Processing Categories</div>
                              <div>• Essential vs Optional</div>
                              <div>• Data Type Mapping</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Languages className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <h4 className="font-medium text-purple-900">Translation Management</h4>
                            <p className="text-sm text-purple-700 mt-1">
                              22 Indian languages from Eighth Schedule with translation keys
                            </p>
                            <div className="mt-3 space-y-1 text-xs text-purple-600">
                              <div>• Dynamic Translation</div>
                              <div>• RTL Language Support</div>
                              <div>• Cultural Adaptation</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-orange-50 border-orange-200">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <CheckCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                            <h4 className="font-medium text-orange-900">DPDP Compliance</h4>
                            <p className="text-sm text-orange-700 mt-1">
                              Automated compliance checking and validation
                            </p>
                            <div className="mt-3 space-y-1 text-xs text-orange-600">
                              <div>• Legal Requirement Check</div>
                              <div>• Accessibility (WCAG)</div>
                              <div>• Audit Trail</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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

              {/* Notice Workflow Process */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Complete Notice Workflow Process
            </CardTitle>
                  <CardDescription>
                    Step-by-step implementation of the BRD notice workflow
            </CardDescription>
          </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mx-auto mb-2">1</div>
                        <h4 className="font-medium text-blue-900">Admin Configuration</h4>
                        <p className="text-xs text-blue-700 mt-1">Purpose mapping, template design, translation keys</p>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mx-auto mb-2">2</div>
                        <h4 className="font-medium text-purple-900">Trigger Detection</h4>
                        <p className="text-xs text-purple-700 mt-1">User interaction triggers notice generation</p>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mx-auto mb-2">3</div>
                        <h4 className="font-medium text-green-900">Dynamic Generation</h4>
                        <p className="text-xs text-green-700 mt-1">Purpose selection, language translation</p>
                      </div>
                      
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mx-auto mb-2">4</div>
                        <h4 className="font-medium text-orange-900">User Interaction</h4>
                        <p className="text-xs text-orange-700 mt-1">Granular consent, explicit controls</p>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mx-auto mb-2">5</div>
                        <h4 className="font-medium text-gray-900">Artifact Creation</h4>
                        <p className="text-xs text-gray-700 mt-1">Tagging, metadata, audit logging</p>
                      </div>
                    </div>

                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <strong>Implementation Note:</strong> This demonstrates the complete BRD workflow including 
                        administrative setup, dynamic generation, multi-language support, and purpose tagging as 
                        required for DPDP Act 2023 compliance.
                      </AlertDescription>
                    </Alert>
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
      </div>
    </div>
  );
}