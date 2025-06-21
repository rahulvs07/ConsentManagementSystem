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
import { Checkbox } from '@/components/ui/checkbox';
import AuditLogViewer from '@/components/Admin/AuditLogViewer';
import { UserRole as UserRoleEnum } from '@/types/dpdp';
import { 
  Shield, 
  Settings, 
  Users, 
  Database, 
  BarChart3, 
  FileText, 
  Bug, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  UserPlus,
  Minus, 
  RefreshCw, 
  Save, 
  Copy, 
  ExternalLink, 
  Key, 
  Lock, 
  Unlock, 
  Power, 
  PowerOff, 
  Wifi, 
  WifiOff, 
  Bell, 
  AlertTriangle, 
  Mail, 
  Phone, 
  Globe, 
  Server, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Calendar, 
  Archive, 
  Tag, 
  Flag, 
  Star, 
  Heart, 
  MessageSquare, 
  Send, 
  Paperclip, 
  Image, 
  Video, 
  Music, 
  File, 
  Folder, 
  FolderOpen, 
  Home, 
  Building, 
  MapPin, 
  Navigation, 
  Compass, 
  Map, 
  Route, 
  Car, 
  Plane, 
  Train, 
  Ship, 
  Bike, 
  Bus, 
  Truck, 
  Taxi, 
  Zap, 
  Battery, 
  BatteryLow, 
  Plug, 
  Cable, 
  Radio, 
  Tv, 
  Camera, 
  Mic, 
  Speaker, 
  Headphones, 
  Volume, 
  VolumeOff, 
  Play, 
  Pause, 
  Stop, 
  SkipBack, 
  SkipForward, 
  Rewind, 
  FastForward, 
  Repeat, 
  Shuffle, 
  List, 
  Grid, 
  Layers, 
  Box, 
  Package, 
  Gift, 
  ShoppingCart, 
  CreditCard, 
  DollarSign, 
  Euro, 
  Pound, 
  Yen, 
  Bitcoin, 
  PiggyBank, 
  Wallet, 
  Receipt, 
  Calculator, 
  Scale, 
  Ruler, 
  Scissors, 
  Pin, 
  Magnet, 
  Anchor, 
  Link, 
  Unlink, 
  Chain, 
  Timer, 
  Stopwatch, 
  Alarm, 
  Hourglass, 
  History
} from 'lucide-react';
import { 
  DataRetentionPolicy,
  DeletionMethod,
  ProcessingPurpose,
  PurposeCategory
} from '@/types/dpdp';
import { useLanguage } from '@/hooks/useLanguage';
import NoticeHistoryViewer from '@/components/Admin/NoticeHistoryViewer';

interface SystemConfig {
  sessionTimeout: number;
  maxFailedAttempts: number;
  passwordExpiry: number;
  consentExpiry: number;
  auditRetention: number;
  backupFrequency: string;
  encryptionLevel: string;
  multiLanguageEnabled: boolean;
  cookieConsentRequired: boolean;
  minorVerificationRequired: boolean;
  grievanceAutoEscalation: number;
}

// New interfaces for enhanced functionality
interface DataCategory {
  id: string;
  name: string;
  description: string;
  parentCategory?: string;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  dataFields: string[];
  retentionPeriod: number;
  sensitivityLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface SMTPConfiguration {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: 'none' | 'tls' | 'ssl';
  isDefault: boolean;
  isActive: boolean;
  testEmail?: string;
  lastTested?: Date;
  testStatus?: 'success' | 'failed';
}

interface OTPConfiguration {
  id: string;
  provider: 'sms' | 'email' | 'whatsapp';
  isEnabled: boolean;
  expiryMinutes: number;
  maxAttempts: number;
  template: string;
  apiKey?: string;
  senderId?: string;
  priority: number;
}

interface NotificationSettings {
  id: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  eventType: string;
  isEnabled: boolean;
  template: string;
  recipients: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  retryAttempts: number;
  cooldownMinutes: number;
}

interface ExceptionLog {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'critical';
  component: string;
  message: string;
  stackTrace: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  tags: string[];
}

// Email Template Management Interface
interface EmailTemplate {
  id: string;
  name: string;
  type: 'status_update' | 'otp' | 'request_submission' | 'request_closure' | 'grievance_update' | 'consent_withdrawal' | 'data_breach';
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  lastModified: Date;
  language: string;
  category: 'system' | 'user' | 'compliance';
}

interface UserManagementEntry {
  id: string;
  email: string;
  name: string;
  role: UserRoleEnum;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date;
  createdAt: Date;
  permissions: string[];
}

const SystemAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    sessionTimeout: 30,
    maxFailedAttempts: 3,
    passwordExpiry: 90,
    consentExpiry: 365,
    auditRetention: 2555, // 7 years
    backupFrequency: 'daily',
    encryptionLevel: 'AES256',
    multiLanguageEnabled: true,
    cookieConsentRequired: true,
    minorVerificationRequired: true,
    grievanceAutoEscalation: 72
  });

  // Enhanced state management
  const [retentionPolicies, setRetentionPolicies] = useState<DataRetentionPolicy[]>([]);
  const [purposes, setPurposes] = useState<ProcessingPurpose[]>([]);
  const [users, setUsers] = useState<UserManagementEntry[]>([]);
  const [dataCategories, setDataCategories] = useState<DataCategory[]>([]);
  const [smtpConfigs, setSmtpConfigs] = useState<SMTPConfiguration[]>([]);
  const [otpConfigs, setOtpConfigs] = useState<OTPConfiguration[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings[]>([]);
  const [exceptionLogs, setExceptionLogs] = useState<ExceptionLog[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [smtpDialogOpen, setSmtpDialogOpen] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DataCategory | null>(null);
  const [selectedSmtp, setSelectedSmtp] = useState<SMTPConfiguration | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  // Form states
  const [newCategory, setNewCategory] = useState<Partial<DataCategory>>({
    name: '',
    description: '',
    dataFields: [],
    retentionPeriod: 365,
    sensitivityLevel: 'medium'
  });

  const [newSmtp, setNewSmtp] = useState<Partial<SMTPConfiguration>>({
    name: '',
    host: '',
    port: 587,
    username: '',
    password: '',
    encryption: 'tls',
    isDefault: false,
    isActive: true
  });

  const [newTemplate, setNewTemplate] = useState<Partial<EmailTemplate>>({
    name: '',
    type: 'status_update',
    subject: '',
    htmlContent: '',
    textContent: '',
    variables: [],
    language: 'en',
    category: 'system'
  });

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = () => {
    // Mock data for retention policies as per BRD 4.6.2
    const mockRetentionPolicies: DataRetentionPolicy[] = [
      {
        id: 'policy_001',
        name: 'Personal Data - Account Management',
        description: 'Personal data collected for account creation and management',
        dataCategory: 'personal_data',
        retentionPeriod: 1095, // 3 years
        retentionBasis: 'Legal obligation for financial records',
        deletionMethod: DeletionMethod.HARD_DELETE,
        isActive: true,
        createdBy: 'admin',
        createdAt: new Date('2024-01-01'),
        lastUpdated: new Date('2024-01-15')
      },
      {
        id: 'policy_002',
        name: 'Marketing Data',
        description: 'Data used for marketing communications',
        dataCategory: 'marketing_data',
        retentionPeriod: 730, // 2 years
        retentionBasis: 'Consent-based processing',
        deletionMethod: DeletionMethod.ANONYMIZE,
        isActive: true,
        createdBy: 'admin',
        createdAt: new Date('2024-01-01'),
        lastUpdated: new Date('2024-01-10')
      }
    ];

    // Mock processing purposes
    const mockPurposes: ProcessingPurpose[] = [
      {
        id: 'purpose_001',
        name: 'Account Management',
        description: 'Creating and maintaining user accounts',
        isEssential: true,
        category: PurposeCategory.ACCOUNT_MANAGEMENT,
        retentionPeriod: '3 years',
        legalBasis: 'Contract performance',
        dataTypes: ['Name', 'Email', 'Phone'],
        isActive: true,
        createdBy: 'admin',
        translations: {}
      },
      {
        id: 'purpose_002',
        name: 'Marketing Communications',
        description: 'Sending promotional content',
        isEssential: false,
        category: PurposeCategory.MARKETING,
        retentionPeriod: '2 years',
        legalBasis: 'Consent',
        dataTypes: ['Email', 'Preferences'],
        isActive: true,
        createdBy: 'admin',
        translations: {}
      }
    ];

    // Mock users
    const mockUsers: UserManagementEntry[] = [
      {
        id: 'user_001',
        email: 'user@example.com',
        name: 'John Doe',
        role: UserRoleEnum.DATA_PRINCIPAL,
        status: 'active',
        lastLogin: new Date('2024-01-19'),
        createdAt: new Date('2024-01-01'),
        permissions: ['view_data', 'manage_consent']
      },
      {
        id: 'dpo_001',
        email: 'dpo@company.com',
        name: 'Jane Smith',
        role: UserRoleEnum.DPO,
        status: 'active',
        lastLogin: new Date('2024-01-19'),
        createdAt: new Date('2024-01-01'),
        permissions: ['view_audit', 'manage_grievances', 'export_data']
      }
    ];

    // Mock data categories
    const mockCategories: DataCategory[] = [
      {
        id: 'cat_001',
        name: 'Personal Identifiers',
        description: 'Direct personal identification data',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        createdBy: 'admin',
        dataFields: ['Name', 'Email', 'Phone', 'Address'],
        retentionPeriod: 1095,
        sensitivityLevel: 'high'
      },
      {
        id: 'cat_002',
        name: 'Financial Data',
        description: 'Payment and financial information',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        createdBy: 'admin',
        dataFields: ['Payment Method', 'Transaction History'],
        retentionPeriod: 2555,
        sensitivityLevel: 'critical'
      }
    ];

    // Mock SMTP configurations
    const mockSmtpConfigs: SMTPConfiguration[] = [
      {
        id: 'smtp_001',
        name: 'Primary SMTP Server',
        host: 'smtp.company.com',
        port: 587,
        username: 'noreply@company.com',
        password: '••••••••',
        encryption: 'tls',
        isDefault: true,
        isActive: true,
        lastTested: new Date('2024-01-19'),
        testStatus: 'success'
      }
    ];

    // Mock OTP configurations
    const mockOtpConfigs: OTPConfiguration[] = [
      {
        id: 'otp_001',
        provider: 'sms',
        isEnabled: true,
        expiryMinutes: 5,
        maxAttempts: 3,
        template: 'Your OTP is {code}. Valid for 5 minutes.',
        senderId: 'COMPANY',
        priority: 1
      },
      {
        id: 'otp_002',
        provider: 'email',
        isEnabled: true,
        expiryMinutes: 10,
        maxAttempts: 5,
        template: 'Your verification code is {code}',
        priority: 2
      }
    ];

    // Mock notification settings
    const mockNotificationSettings: NotificationSettings[] = [
      {
        id: 'notif_001',
        type: 'email',
        eventType: 'consent_withdrawal',
        isEnabled: true,
        template: 'Consent withdrawn for {purpose}',
        recipients: ['dpo@company.com'],
        priority: 'high',
        retryAttempts: 3,
        cooldownMinutes: 5
      },
      {
        id: 'notif_002',
        type: 'sms',
        eventType: 'data_breach',
        isEnabled: true,
        template: 'ALERT: Data breach detected. Reference: {incident_id}',
        recipients: ['+1234567890'],
        priority: 'critical',
        retryAttempts: 5,
        cooldownMinutes: 0
      }
    ];

    // Mock exception logs
    const mockExceptionLogs: ExceptionLog[] = [
      {
        id: 'exc_001',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        level: 'error',
        component: 'ConsentValidationService',
        message: 'Failed to validate consent artifact',
        stackTrace: 'Error: Invalid consent format\n  at validateConsent (consent.js:45)\n  at processRequest (api.js:123)',
        userId: 'user_123',
        sessionId: 'sess_456',
        requestId: 'req_789',
        resolved: false,
        tags: ['consent', 'validation', 'api']
      },
      {
        id: 'exc_002',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        level: 'warning',
        component: 'AuditLogger',
        message: 'Audit log storage approaching capacity',
        stackTrace: 'Warning: Storage at 85% capacity',
        resolved: true,
        resolvedBy: 'admin',
        resolvedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        tags: ['storage', 'audit', 'capacity']
      }
    ];

    // Mock email templates
    const mockEmailTemplates: EmailTemplate[] = [
      {
        id: 'template_001',
        name: 'Data Request Status Update',
        type: 'status_update',
        subject: 'Your Data Request Status Update - {request_id}',
        htmlContent: `
          <html>
            <body>
              <h2>Data Request Status Update</h2>
              <p>Dear {user_name},</p>
              <p>Your data request with ID <strong>{request_id}</strong> has been updated.</p>
              <p><strong>Current Status:</strong> {status}</p>
              <p><strong>Updated On:</strong> {updated_date}</p>
              {status_reason && <p><strong>Reason:</strong> {status_reason}</p>}
              <p>Thank you for your patience.</p>
              <p>Best regards,<br/>Data Protection Team</p>
            </body>
          </html>
        `,
        textContent: 'Dear {user_name}, Your data request {request_id} status: {status}. Updated: {updated_date}.',
        variables: ['user_name', 'request_id', 'status', 'updated_date', 'status_reason'],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        createdBy: 'admin',
        lastModified: new Date('2024-01-15'),
        language: 'en',
        category: 'user'
      },
      {
        id: 'template_002',
        name: 'OTP Verification Code',
        type: 'otp',
        subject: 'Your Verification Code - {service_name}',
        htmlContent: `
          <html>
            <body>
              <h2>Verification Code</h2>
              <p>Your verification code is: <strong style="font-size: 24px; color: #007bff;">{otp_code}</strong></p>
              <p>This code will expire in {expiry_minutes} minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
            </body>
          </html>
        `,
        textContent: 'Your verification code: {otp_code}. Expires in {expiry_minutes} minutes.',
        variables: ['otp_code', 'expiry_minutes', 'service_name'],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        createdBy: 'admin',
        lastModified: new Date('2024-01-10'),
        language: 'en',
        category: 'system'
      },
      {
        id: 'template_003',
        name: 'Grievance Submission Confirmation',
        type: 'request_submission',
        subject: 'Grievance Submitted - Reference: {grievance_id}',
        htmlContent: `
          <html>
            <body>
              <h2>Grievance Submission Confirmation</h2>
              <p>Dear {user_name},</p>
              <p>Your grievance has been successfully submitted.</p>
              <p><strong>Reference Number:</strong> {grievance_id}</p>
              <p><strong>Category:</strong> {category}</p>
              <p><strong>Submitted On:</strong> {submission_date}</p>
              <p>We will review your grievance and respond within 30 days as per DPDP Act 2023.</p>
              <p>You can track the status using your reference number.</p>
            </body>
          </html>
        `,
        textContent: 'Grievance submitted. Reference: {grievance_id}. We will respond within 30 days.',
        variables: ['user_name', 'grievance_id', 'category', 'submission_date'],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        createdBy: 'admin',
        lastModified: new Date('2024-01-12'),
        language: 'en',
        category: 'compliance'
      },
      {
        id: 'template_004',
        name: 'Request Closure Notification',
        type: 'request_closure',
        subject: 'Request Closed - {request_id}',
        htmlContent: `
          <html>
            <body>
              <h2>Request Closure Notification</h2>
              <p>Dear {user_name},</p>
              <p>Your request <strong>{request_id}</strong> has been closed.</p>
              <p><strong>Resolution:</strong> {resolution}</p>
              <p><strong>Closed On:</strong> {closure_date}</p>
              <p>If you have any questions about this closure, please contact our support team.</p>
            </body>
          </html>
        `,
        textContent: 'Request {request_id} closed. Resolution: {resolution}. Date: {closure_date}',
        variables: ['user_name', 'request_id', 'resolution', 'closure_date'],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        createdBy: 'admin',
        lastModified: new Date('2024-01-18'),
        language: 'en',
        category: 'user'
      }
    ];

    setRetentionPolicies(mockRetentionPolicies);
    setPurposes(mockPurposes);
    setUsers(mockUsers);
    setDataCategories(mockCategories);
    setSmtpConfigs(mockSmtpConfigs);
    setOtpConfigs(mockOtpConfigs);
    setNotificationSettings(mockNotificationSettings);
    setExceptionLogs(mockExceptionLogs);
    setEmailTemplates(mockEmailTemplates);
  };

  const updateSystemConfig = (key: keyof SystemConfig, value: any) => {
    setSystemConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSystemConfig = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success notification
    }, 1000);
  };

  // Enhanced functions for new functionality
  const handleCreateCategory = () => {
    if (!newCategory.name || !newCategory.description) {
      alert('Please fill in all required fields');
      return;
    }

    const category: DataCategory = {
      id: `cat_${Date.now()}`,
      name: newCategory.name,
      description: newCategory.description,
      isActive: true,
      createdAt: new Date(),
      createdBy: 'admin',
      dataFields: newCategory.dataFields || [],
      retentionPeriod: newCategory.retentionPeriod || 365,
      sensitivityLevel: newCategory.sensitivityLevel || 'medium'
    };

    setDataCategories(prev => [...prev, category]);
    setCategoryDialogOpen(false);
    setNewCategory({
      name: '',
      description: '',
      dataFields: [],
      retentionPeriod: 365,
      sensitivityLevel: 'medium'
    });
  };

  const handleEditCategory = (category: DataCategory) => {
    setSelectedCategory(category);
    setNewCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleCreateSmtp = () => {
    if (!newSmtp.name || !newSmtp.host || !newSmtp.username) {
      alert('Please fill in all required fields');
      return;
    }

    const smtp: SMTPConfiguration = {
      id: `smtp_${Date.now()}`,
      name: newSmtp.name!,
      host: newSmtp.host!,
      port: newSmtp.port || 587,
      username: newSmtp.username!,
      password: newSmtp.password!,
      encryption: newSmtp.encryption || 'tls',
      isDefault: newSmtp.isDefault || false,
      isActive: newSmtp.isActive || true
    };

    setSmtpConfigs(prev => [...prev, smtp]);
    setSmtpDialogOpen(false);
    setNewSmtp({
      name: '',
      host: '',
      port: 587,
      username: '',
      password: '',
      encryption: 'tls',
      isDefault: false,
      isActive: true
    });
  };

  const testSmtpConnection = async (smtpId: string) => {
    setIsLoading(true);
    // Simulate SMTP test
    setTimeout(() => {
      setSmtpConfigs(prev => 
        prev.map(smtp => 
          smtp.id === smtpId 
            ? { ...smtp, lastTested: new Date(), testStatus: 'success' }
            : smtp
        )
      );
      setIsLoading(false);
    }, 2000);
  };

  const resolveException = (exceptionId: string) => {
    setExceptionLogs(prev => 
      prev.map(log => 
        log.id === exceptionId 
          ? { ...log, resolved: true, resolvedBy: 'admin', resolvedAt: new Date() }
          : log
      )
    );
  };

  // Email Template Management Functions
  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.htmlContent) {
      alert('Please fill in all required fields');
      return;
    }

    const template: EmailTemplate = {
      id: `template_${Date.now()}`,
      name: newTemplate.name!,
      type: newTemplate.type || 'status_update',
      subject: newTemplate.subject!,
      htmlContent: newTemplate.htmlContent!,
      textContent: newTemplate.textContent || '',
      variables: newTemplate.variables || [],
      isActive: true,
      createdAt: new Date(),
      createdBy: 'admin',
      lastModified: new Date(),
      language: newTemplate.language || 'en',
      category: newTemplate.category || 'system'
    };

    setEmailTemplates(prev => [...prev, template]);
    setTemplateDialogOpen(false);
    setNewTemplate({
      name: '',
      type: 'status_update',
      subject: '',
      htmlContent: '',
      textContent: '',
      variables: [],
      language: 'en',
      category: 'system'
    });
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setNewTemplate(template);
    setTemplateDialogOpen(true);
  };

  const getTemplateCategoryBadge = (category: string) => {
    switch (category) {
      case 'system': return <Badge className="bg-blue-100 text-blue-800">System</Badge>;
      case 'user': return <Badge className="bg-green-100 text-green-800">User</Badge>;
      case 'compliance': return <Badge className="bg-purple-100 text-purple-800">Compliance</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTemplateTypeBadge = (type: string) => {
    const typeMap: { [key: string]: { label: string; color: string } } = {
      'status_update': { label: 'Status Update', color: 'bg-blue-100 text-blue-800' },
      'otp': { label: 'OTP', color: 'bg-green-100 text-green-800' },
      'request_submission': { label: 'Request Submission', color: 'bg-purple-100 text-purple-800' },
      'request_closure': { label: 'Request Closure', color: 'bg-orange-100 text-orange-800' },
      'grievance_update': { label: 'Grievance Update', color: 'bg-red-100 text-red-800' },
      'consent_withdrawal': { label: 'Consent Withdrawal', color: 'bg-yellow-100 text-yellow-800' },
      'data_breach': { label: 'Data Breach', color: 'bg-red-100 text-red-800' }
    };
    
    const typeInfo = typeMap[type] || { label: type, color: 'bg-gray-100 text-gray-800' };
    return <Badge className={typeInfo.color}>{typeInfo.label}</Badge>;
  };

  const getSensitivityBadge = (level: string) => {
    switch (level) {
      case 'critical': return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low': return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getExceptionLevelBadge = (level: string) => {
    switch (level) {
      case 'critical': return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'error': return <Badge className="bg-orange-100 text-orange-800">Error</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      default: return <Badge variant="outline">Info</Badge>;
    }
  };

  const systemMetrics = [
    { label: 'Total Users', value: users.length.toString(), status: 'active', icon: Users, color: 'text-blue-600' },
    { label: 'Active Policies', value: retentionPolicies.filter(p => p.isActive).length.toString(), status: 'excellent', icon: FileText, color: 'text-green-600' },
    { label: 'Data Records', value: '45.2K', status: 'growing', icon: Database, color: 'text-purple-600' },
    { label: 'Security Score', value: '96%', status: 'secure', icon: Shield, color: 'text-emerald-600' },
  ];

  const systemComponents = [
    { name: 'Authentication Service', status: 'online', lastCheck: '2 min ago', health: 99.9 },
    { name: 'Consent Management API', status: 'online', lastCheck: '1 min ago', health: 99.8 },
    { name: 'Audit Logging', status: 'online', lastCheck: '30 sec ago', health: 100 },
    { name: 'Database Cluster', status: 'online', lastCheck: '1 min ago', health: 99.5 },
    { name: 'Notification Service', status: 'warning', lastCheck: '5 min ago', health: 95.0 },
    { name: 'Backup Systems', status: 'online', lastCheck: '10 min ago', health: 99.9 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-100 text-green-800">Online</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getUserRoleBadge = (role: UserRoleEnum) => {
    const colors = {
      [UserRoleEnum.DATA_PRINCIPAL]: 'bg-blue-100 text-blue-800',
      [UserRoleEnum.DATA_FIDUCIARY]: 'bg-purple-100 text-purple-800',
      [UserRoleEnum.DATA_PROCESSOR]: 'bg-green-100 text-green-800',
      [UserRoleEnum.DPO]: 'bg-orange-100 text-orange-800',
      [UserRoleEnum.SYSTEM_ADMIN]: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[role]}>{role.replace('_', ' ')}</Badge>;
  };

  const getUserStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <Settings className="h-10 w-10 text-blue-400" />
          <div>
            <h2 className="text-3xl font-bold">System Administration</h2>
        <p className="text-gray-300">
              Comprehensive DPDP Act 2023 compliance management and system configuration
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{users.length}</div>
            <div className="text-sm text-gray-300">Registered Users</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{retentionPolicies.length}</div>
            <div className="text-sm text-gray-300">Data Policies</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">100%</div>
            <div className="text-sm text-gray-300">Compliance Score</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">24/7</div>
            <div className="text-sm text-gray-300">System Monitoring</div>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {systemMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                    <p className={`text-xs font-medium ${metric.color}`}>
                      {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                    </p>
                  </div>
                  <Icon className={`h-10 w-10 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>System Health Monitor</span>
            </CardTitle>
          <CardDescription>Real-time monitoring of all system components</CardDescription>
          </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemComponents.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <p className="font-medium text-gray-900">{component.name}</p>
                    {getStatusBadge(component.status)}
                  </div>
                  <p className="text-xs text-gray-500">Last check: {component.lastCheck}</p>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${component.health >= 99 ? 'bg-green-500' : component.health >= 95 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${component.health}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{component.health}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const DataConfigTab = () => (
    <div className="space-y-6">
      {/* Data Categories Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Categories</span>
          </CardTitle>
          <CardDescription>
            Manage data categories and their classification levels as per DPDP Act 2023
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Category
            </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Data Category</DialogTitle>
                  <DialogDescription>
                    Define a new data category with appropriate sensitivity classification
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        value={newCategory.name || ''}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Personal Identifiers"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sensitivityLevel">Sensitivity Level</Label>
                      <Select 
                        value={newCategory.sensitivityLevel}
                        onValueChange={(value) => setNewCategory(prev => ({ ...prev, sensitivityLevel: value as any }))}
                      >
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
                  </div>
                  <div>
                    <Label htmlFor="categoryDesc">Description</Label>
                    <Textarea
                      id="categoryDesc"
                      value={newCategory.description || ''}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the type of data in this category"
                    />
                  </div>
                  <div>
                    <Label htmlFor="retentionPeriod">Default Retention Period (days)</Label>
                    <Input
                      id="retentionPeriod"
                      type="number"
                      value={newCategory.retentionPeriod || 365}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, retentionPeriod: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                      Cancel
            </Button>
                    <Button onClick={handleCreateCategory}>
                      Create Category
            </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {dataCategories.map((category) => (
              <Card key={category.id} className="border-l-4 border-l-indigo-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{category.name}</h4>
                        {getSensitivityBadge(category.sensitivityLevel)}
                        <Badge className={category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <strong>Data Fields:</strong>
                          <p>{category.dataFields.length} fields</p>
                        </div>
                        <div>
                          <strong>Retention:</strong>
                          <p>{Math.floor(category.retentionPeriod / 365)} years</p>
                        </div>
                        <div>
                          <strong>Created:</strong>
                          <p>{category.createdAt.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <strong>Created By:</strong>
                          <p>{category.createdBy}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>
                        <Edit className="h-4 w-4" />
            </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </CardContent>
        </Card>

      {/* Data Retention Policies Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
            <Archive className="h-5 w-5" />
            <span>Data Retention Policies</span>
            </CardTitle>
          <CardDescription>
            Configure data retention and deletion policies.
          </CardDescription>
          </CardHeader>
          <CardContent>
          <div className="space-y-4">
            <Button className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create New Policy
            </Button>
            
            {retentionPolicies.map((policy) => (
              <Card key={policy.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{policy.name}</h4>
                        <Badge className={policy.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {policy.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{policy.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                          <strong>Category:</strong>
                          <p className="capitalize">{policy.dataCategory.replace('_', ' ')}</p>
                  </div>
                        <div>
                          <strong>Retention:</strong>
                          <p>{Math.floor(policy.retentionPeriod / 365)} years</p>
                </div>
                        <div>
                          <strong>Deletion Method:</strong>
                          <p className="capitalize">{policy.deletionMethod.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <strong>Last Updated:</strong>
                          <p>{policy.lastUpdated.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
            </Button>
                      <Button size="sm" variant="outline">
                        <Archive className="h-4 w-4" />
            </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Processing Purposes</span>
            </CardTitle>
          <CardDescription>
            Manage data processing purposes and their configurations
          </CardDescription>
          </CardHeader>
          <CardContent>
          <div className="space-y-4">
            <Button className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add New Purpose
            </Button>
            
            {purposes.map((purpose) => (
              <Card key={purpose.id} className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{purpose.name}</h4>
                        <Badge className={purpose.isEssential ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                          {purpose.isEssential ? 'Essential' : 'Optional'}
                        </Badge>
                        <Badge className={purpose.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {purpose.isActive ? 'Active' : 'Inactive'}
                        </Badge>
      </div>
                      <p className="text-sm text-gray-600 mb-3">{purpose.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>Category:</strong>
                          <p className="capitalize">{purpose.category.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <strong>Legal Basis:</strong>
                          <p>{purpose.legalBasis}</p>
                        </div>
                  <div>
                          <strong>Retention:</strong>
                          <p>{purpose.retentionPeriod}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Globe className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );

  const AppConfigTab = () => (
    <div className="space-y-6">
      {/* SMTP Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>SMTP Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure email server settings for system notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Dialog open={smtpDialogOpen} onOpenChange={setSmtpDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add SMTP Server
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>SMTP Server Configuration</DialogTitle>
                  <DialogDescription>
                    Configure email server for system notifications
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
              <div>
                      <Label htmlFor="smtpName">Configuration Name</Label>
                      <Input
                        id="smtpName"
                        value={newSmtp.name || ''}
                        onChange={(e) => setNewSmtp(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Primary SMTP"
                      />
              </div>
                    <div>
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input
                        id="smtpHost"
                        value={newSmtp.host || ''}
                        onChange={(e) => setNewSmtp(prev => ({ ...prev, host: e.target.value }))}
                        placeholder="smtp.example.com"
                      />
            </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
              <div>
                      <Label htmlFor="smtpPort">Port</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        value={newSmtp.port || 587}
                        onChange={(e) => setNewSmtp(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                      />
              </div>
                    <div>
                      <Label htmlFor="smtpEncryption">Encryption</Label>
                      <Select 
                        value={newSmtp.encryption}
                        onValueChange={(value) => setNewSmtp(prev => ({ ...prev, encryption: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="tls">TLS</SelectItem>
                          <SelectItem value="ssl">SSL</SelectItem>
                        </SelectContent>
                      </Select>
            </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
              <div>
                      <Label htmlFor="smtpUsername">Username</Label>
                      <Input
                        id="smtpUsername"
                        value={newSmtp.username || ''}
                        onChange={(e) => setNewSmtp(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="username@example.com"
                      />
              </div>
                    <div>
                      <Label htmlFor="smtpPassword">Password</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={newSmtp.password || ''}
                        onChange={(e) => setNewSmtp(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newSmtp.isDefault || false}
                      onCheckedChange={(checked) => setNewSmtp(prev => ({ ...prev, isDefault: checked }))}
                    />
                    <Label>Set as default SMTP server</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setSmtpDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateSmtp}>
                      Save Configuration
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {smtpConfigs.map((smtp) => (
              <Card key={smtp.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{smtp.name}</h4>
                        {smtp.isDefault && <Badge className="bg-blue-100 text-blue-800">Default</Badge>}
                        <Badge className={smtp.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {smtp.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {smtp.testStatus && (
                          <Badge className={smtp.testStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {smtp.testStatus === 'success' ? 'Test Success' : 'Test Failed'}
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <strong>Host:</strong>
                          <p>{smtp.host}:{smtp.port}</p>
                        </div>
                        <div>
                          <strong>Username:</strong>
                          <p>{smtp.username}</p>
                        </div>
                        <div>
                          <strong>Encryption:</strong>
                          <p className="uppercase">{smtp.encryption}</p>
                        </div>
                        <div>
                          <strong>Last Tested:</strong>
                          <p>{smtp.lastTested ? smtp.lastTested.toLocaleDateString() : 'Never'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => testSmtpConnection(smtp.id)}>
                        <Zap className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
            </div>
          </div>
        </CardContent>
      </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* OTP Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>OTP Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure OTP delivery methods and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {otpConfigs.map((otp) => (
              <Card key={otp.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900 capitalize">{otp.provider} OTP</h4>
                        <Badge className={otp.isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {otp.isEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                        <Badge variant="outline">Priority {otp.priority}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <strong>Expiry:</strong>
                          <p>{otp.expiryMinutes} minutes</p>
                        </div>
                        <div>
                          <strong>Max Attempts:</strong>
                          <p>{otp.maxAttempts}</p>
                        </div>
                        <div>
                          <strong>Template:</strong>
                          <p className="truncate">{otp.template}</p>
                        </div>
                        <div>
                          <strong>Sender ID:</strong>
                          <p>{otp.senderId || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Switch
                        checked={otp.isEnabled}
                        onCheckedChange={(checked) => {
                          setOtpConfigs(prev => 
                            prev.map(config => 
                              config.id === otp.id ? { ...config, isEnabled: checked } : config
                            )
                          );
                        }}
                      />
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>In-App Notification Settings</span>
          </CardTitle>
          <CardDescription>
            Configure system notifications and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notificationSettings.map((notification) => (
              <Card key={notification.id} className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900 capitalize">{notification.eventType.replace('_', ' ')}</h4>
                        <Badge className={`bg-${notification.priority === 'critical' ? 'red' : notification.priority === 'high' ? 'orange' : 'blue'}-100 text-${notification.priority === 'critical' ? 'red' : notification.priority === 'high' ? 'orange' : 'blue'}-800`}>
                          {notification.priority}
                        </Badge>
                        <Badge className={notification.isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {notification.isEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <strong>Type:</strong>
                          <p className="capitalize">{notification.type}</p>
                        </div>
                        <div>
                          <strong>Recipients:</strong>
                          <p>{notification.recipients.length} configured</p>
                        </div>
                        <div>
                          <strong>Retry Attempts:</strong>
                          <p>{notification.retryAttempts}</p>
                        </div>
                        <div>
                          <strong>Cooldown:</strong>
                          <p>{notification.cooldownMinutes} minutes</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Switch
                        checked={notification.isEnabled}
                        onCheckedChange={(checked) => {
                          setNotificationSettings(prev => 
                            prev.map(setting => 
                              setting.id === notification.id ? { ...setting, isEnabled: checked } : setting
                            )
                          );
                        }}
                      />
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Templates Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Email Templates</span>
          </CardTitle>
          <CardDescription>
            Manage email templates for status updates, OTP, requests, and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Email Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Email Template Editor</DialogTitle>
                  <DialogDescription>
                    Create or edit email templates for system communications
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="templateName">Template Name</Label>
                      <Input
                        id="templateName"
                        value={newTemplate.name || ''}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Data Request Status Update"
                      />
                    </div>
                    <div>
                      <Label htmlFor="templateType">Template Type</Label>
                      <Select 
                        value={newTemplate.type}
                        onValueChange={(value) => setNewTemplate(prev => ({ ...prev, type: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="status_update">Status Update</SelectItem>
                          <SelectItem value="otp">OTP Verification</SelectItem>
                          <SelectItem value="request_submission">Request Submission</SelectItem>
                          <SelectItem value="request_closure">Request Closure</SelectItem>
                          <SelectItem value="grievance_update">Grievance Update</SelectItem>
                          <SelectItem value="consent_withdrawal">Consent Withdrawal</SelectItem>
                          <SelectItem value="data_breach">Data Breach</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="templateCategory">Category</Label>
                      <Select 
                        value={newTemplate.category}
                        onValueChange={(value) => setNewTemplate(prev => ({ ...prev, category: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="templateLanguage">Language</Label>
                      <Select 
                        value={newTemplate.language}
                        onValueChange={(value) => setNewTemplate(prev => ({ ...prev, language: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="ta">Tamil</SelectItem>
                          <SelectItem value="te">Telugu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="templateSubject">Email Subject</Label>
                    <Input
                      id="templateSubject"
                      value={newTemplate.subject || ''}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="e.g., Your Data Request Status - {request_id}"
                    />
                  </div>
                  <div>
                    <Label htmlFor="templateHtml">HTML Content</Label>
                    <Textarea
                      id="templateHtml"
                      value={newTemplate.htmlContent || ''}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, htmlContent: e.target.value }))}
                      placeholder="HTML email template content..."
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="templateText">Text Content (Fallback)</Label>
                    <Textarea
                      id="templateText"
                      value={newTemplate.textContent || ''}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, textContent: e.target.value }))}
                      placeholder="Plain text version of the email..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label>Available Variables</Label>
                    <p className="text-sm text-gray-600 mb-2">
                      Common variables: {'{user_name}'}, {'{request_id}'}, {'{status}'}, {'{date}'}, {'{grievance_id}'}, {'{otp_code}'}
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTemplate}>
                      {selectedTemplate ? 'Update Template' : 'Create Template'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {emailTemplates.map((template) => (
              <Card key={template.id} className="border-l-4 border-l-teal-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{template.name}</h4>
                        {getTemplateTypeBadge(template.type)}
                        {getTemplateCategoryBadge(template.category)}
                        <Badge className={template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">{template.language.toUpperCase()}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 font-medium">Subject: {template.subject}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <strong>Variables:</strong>
                          <p>{template.variables.length} defined</p>
                        </div>
                        <div>
                          <strong>Created:</strong>
                          <p>{template.createdAt.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <strong>Last Modified:</strong>
                          <p>{template.lastModified.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <strong>Created By:</strong>
                          <p>{template.createdBy}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditTemplate(template)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Switch
                        checked={template.isActive}
                        onCheckedChange={(checked) => {
                          setEmailTemplates(prev => 
                            prev.map(t => 
                              t.id === template.id ? { ...t, isActive: checked } : t
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>System Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure system-wide settings and security parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Security Settings */}
          <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Security Settings</span>
              </h4>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={systemConfig.sessionTimeout}
                    onChange={(e) => updateSystemConfig('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxFailedAttempts">Max Failed Login Attempts</Label>
                  <Input
                    id="maxFailedAttempts"
                    type="number"
                    value={systemConfig.maxFailedAttempts}
                    onChange={(e) => updateSystemConfig('maxFailedAttempts', parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={systemConfig.passwordExpiry}
                    onChange={(e) => updateSystemConfig('passwordExpiry', parseInt(e.target.value))}
                  />
                </div>
                
              <div>
                  <Label htmlFor="encryptionLevel">Encryption Level</Label>
                  <Select 
                    value={systemConfig.encryptionLevel}
                    onValueChange={(value) => updateSystemConfig('encryptionLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AES128">AES-128</SelectItem>
                      <SelectItem value="AES256">AES-256</SelectItem>
                      <SelectItem value="AES512">AES-512</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Data & Consent Settings */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Data & Consent Settings</span>
              </h4>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="consentExpiry">Default Consent Expiry (days)</Label>
                  <Input
                    id="consentExpiry"
                    type="number"
                    value={systemConfig.consentExpiry}
                    onChange={(e) => updateSystemConfig('consentExpiry', parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="auditRetention">Audit Log Retention (days)</Label>
                  <Input
                    id="auditRetention"
                    type="number"
                    value={systemConfig.auditRetention}
                    onChange={(e) => updateSystemConfig('auditRetention', parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="grievanceEscalation">Grievance Auto-Escalation (hours)</Label>
                  <Input
                    id="grievanceEscalation"
                    type="number"
                    value={systemConfig.grievanceAutoEscalation}
                    onChange={(e) => updateSystemConfig('grievanceAutoEscalation', parseInt(e.target.value))}
                  />
                </div>
                
              <div>
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select 
                    value={systemConfig.backupFrequency}
                    onValueChange={(value) => updateSystemConfig('backupFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Feature Toggles</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Multi-Language Support</p>
                  <p className="text-sm text-gray-600">Enable DPDP Act Sec 5(3) compliance</p>
                </div>
                <Switch
                  checked={systemConfig.multiLanguageEnabled}
                  onCheckedChange={(checked) => updateSystemConfig('multiLanguageEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Cookie Consent Required</p>
                  <p className="text-sm text-gray-600">Mandatory cookie consent banner</p>
                </div>
                <Switch
                  checked={systemConfig.cookieConsentRequired}
                  onCheckedChange={(checked) => updateSystemConfig('cookieConsentRequired', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                  <p className="font-medium">Minor Verification</p>
                  <p className="text-sm text-gray-600">Require DigiLocker verification for minors</p>
                </div>
                <Switch
                  checked={systemConfig.minorVerificationRequired}
                  onCheckedChange={(checked) => updateSystemConfig('minorVerificationRequired', checked)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={saveSystemConfig} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const UserManagementTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>User Role Management</span>
          </CardTitle>
          <CardDescription>
            Manage user accounts and role-based access control as per BRD Section 4.6.1
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add New User
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Export Users
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {users.map((user) => (
              <Card key={user.id} className="border-l-4 border-l-indigo-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{user.name}</h4>
                        {getUserRoleBadge(user.role)}
                        {getUserStatusBadge(user.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{user.email}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <strong>Last Login:</strong>
                          <p>{user.lastLogin.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <strong>Created:</strong>
                          <p>{user.createdAt.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <strong>Permissions:</strong>
                          <p>{user.permissions.length} assigned</p>
                        </div>
                        <div>
                          <strong>Status:</strong>
                          <p className="capitalize">{user.status}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Lock className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AuditTab = () => (
    <AuditLogViewer userRole="system_admin" userId="admin_001" />
  );

  const ExceptionLogsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bug className="h-5 w-5" />
            <span>Exception Logs</span>
          </CardTitle>
          <CardDescription>
            Monitor and manage application exceptions and runtime errors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="flex space-x-2">
                <Input placeholder="Search exceptions..." className="w-64" />
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {exceptionLogs.map((log) => (
                <Card key={log.id} className={`border-l-4 ${log.resolved ? 'border-l-green-500' : log.level === 'critical' ? 'border-l-red-500' : log.level === 'error' ? 'border-l-orange-500' : 'border-l-yellow-500'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{log.component}</h4>
                          {getExceptionLevelBadge(log.level)}
                          <Badge className={log.resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {log.resolved ? 'Resolved' : 'Open'}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {log.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{log.message}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <strong>User ID:</strong>
                            <p>{log.userId || 'N/A'}</p>
                          </div>
                          <div>
                            <strong>Session:</strong>
                            <p>{log.sessionId || 'N/A'}</p>
                          </div>
                          <div>
                            <strong>Request ID:</strong>
                            <p>{log.requestId || 'N/A'}</p>
                          </div>
                          <div>
                            <strong>Tags:</strong>
                            <div className="flex flex-wrap gap-1">
                              {log.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {log.resolved && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm text-green-800">
                              <strong>Resolved by:</strong> {log.resolvedBy} on {log.resolvedAt?.toLocaleString()}
                            </p>
                          </div>
                        )}

                        <details className="mt-3">
                          <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                            View Stack Trace
                          </summary>
                          <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                            {log.stackTrace}
                          </pre>
                        </details>
                      </div>
                      <div className="flex space-x-2">
                        {!log.resolved && (
                          <Button size="sm" variant="outline" onClick={() => resolveException(log.id)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {exceptionLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bug className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No exceptions logged</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">System Administration</h1>
        <Badge className="bg-red-100 text-red-800">
          <Shield className="w-3 h-3 mr-1" />
          System Admin
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-1 h-auto p-1 bg-muted/50 rounded-lg">
          <NavigationTab 
            value="overview" 
            icon={<BarChart3 className="h-4 w-4" />}
            isCompact={true}
          >
            Overview
          </NavigationTab>
          
          <NavigationTab 
            value="data-config" 
            icon={<Database className="h-4 w-4" />}
            isCompact={true}
          >
            Data Config
          </NavigationTab>
          
          <NavigationTab 
            value="app-config" 
            icon={<Settings className="h-4 w-4" />}
            isCompact={true}
          >
            App Config
          </NavigationTab>
          
          <NavigationTab 
            value="notices" 
            icon={<FileText className="h-4 w-4" />}
            isCompact={true}
          >
            Notice History
          </NavigationTab>
          
          <NavigationTab 
            value="users" 
            icon={<Users className="h-4 w-4" />}
            notificationCount={users.filter(u => u.status === 'inactive' || u.status === 'suspended').length}
            notificationVariant="secondary"
            isCompact={true}
          >
            User Management
          </NavigationTab>
          
          <NavigationTab 
            value="audit" 
            icon={<FileText className="h-4 w-4" />}
            isCompact={true}
          >
            Audit Logs
          </NavigationTab>
          
          <NavigationTab 
            value="exceptions" 
            icon={<Bug className="h-4 w-4" />}
            notificationCount={exceptionLogs.filter(e => !e.resolved).length}
            notificationVariant="destructive"
            isCompact={true}
          >
            Exceptions
          </NavigationTab>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>
        
        <TabsContent value="data-config">
          <DataConfigTab />
        </TabsContent>
        
        <TabsContent value="app-config">
          <AppConfigTab />
        </TabsContent>
        
        <TabsContent value="notices">
          <NoticeHistoryViewer />
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagementTab />
        </TabsContent>
        
        <TabsContent value="audit">
          <AuditTab />
        </TabsContent>
        
        <TabsContent value="exceptions">
          <ExceptionLogsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemAdminDashboard;
