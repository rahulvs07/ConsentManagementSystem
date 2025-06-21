export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  lastLogin?: Date;
  isMinor?: boolean;
  parentGuardianId?: string;
  digiLockerVerified?: boolean;
}

export enum UserRole {
  DATA_PRINCIPAL = 'data_principal',
  DATA_FIDUCIARY = 'data_fiduciary',
  DATA_PROCESSOR = 'data_processor',
  DPO = 'dpo',
  SYSTEM_ADMIN = 'system_admin'
}

export interface ConsentRecord {
  id: string;
  userId: string;
  purposeId: string;
  categoryId: string;
  status: ConsentStatus;
  timestamp: Date;
  ipAddress: string;
  sessionId: string;
  language: string;
  isMinor: boolean;
  parentGuardianId?: string;
  metadata: ConsentMetadata;
  expiryDate?: Date;
  lastUpdated: Date;
  version: string;
}

export enum ConsentStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  WITHDRAWN = 'withdrawn',
  EXPIRED = 'expired',
  PENDING = 'pending',
  RENEWED = 'renewed'
}

export interface ConsentMetadata {
  userAgent: string;
  consentVersion: string;
  processingBasis: string;
  retentionPeriod: string;
  dataTransferDetails?: string;
  consentMethod: 'click' | 'digital_signature' | 'verbal' | 'written';
  evidenceHash?: string;
}

export interface ProcessingPurpose {
  id: string;
  name: string;
  description: string;
  isEssential: boolean;
  category: PurposeCategory;
  retentionPeriod: string;
  legalBasis: string;
  dataTypes: string[];
  isActive: boolean;
  createdBy: string;
  translations: Record<string, PurposeTranslation>;
}

export interface PurposeTranslation {
  name: string;
  description: string;
  language: string;
}

export enum PurposeCategory {
  ACCOUNT_MANAGEMENT = 'account_management',
  SERVICE_DELIVERY = 'service_delivery',
  MARKETING = 'marketing',
  ANALYTICS = 'analytics',
  LEGAL_COMPLIANCE = 'legal_compliance',
  PERSONALIZATION = 'personalization',
  SECURITY = 'security',
  CUSTOMER_SUPPORT = 'customer_support'
}

export interface DataCategory {
  id: string;
  name: string;
  description: string;
  sensitivity: DataSensitivity;
  examples: string[];
  retentionPeriod: string;
  processingBasis: string;
}

export enum DataSensitivity {
  PERSONAL = 'personal',
  SENSITIVE = 'sensitive',
  BEHAVIORAL = 'behavioral',
  ANALYTICS = 'analytics',
  FINANCIAL = 'financial',
  HEALTH = 'health',
  BIOMETRIC = 'biometric'
}

export interface ConsentNotice {
  id: string;
  title: string;
  content: string;
  purposes: ProcessingPurpose[];
  dataCategories: DataCategory[];
  language: string;
  version: string;
  createdAt: Date;
  createdBy: string;
  status: NoticeStatus;
  translations: Record<string, ConsentNoticeTranslation>;
}

export interface ConsentNoticeTranslation {
  title: string;
  content: string;
  language: string;
  translatedBy: string;
  translatedAt: Date;
}

export enum NoticeStatus {
  DRAFT = 'draft',
  IN_TRANSLATION = 'in_translation',
  PENDING_APPROVAL = 'pending_approval',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface GrievanceTicket {
  id: string;
  referenceNumber: string;
  userId: string;
  category: GrievanceCategory;
  subject: string;
  description: string;
  status: GrievanceStatus;
  priority: GrievancePriority;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  resolutionNotes?: string;
  resolvedAt?: Date;
  escalatedAt?: Date;
  contactEmail: string;
  contactPhone?: string;
  evidence?: string[];
  relatedConsentId?: string;
  dueDate?: Date;
}

export enum GrievanceCategory {
  CONSENT_VIOLATION = 'consent_violation',
  DATA_BREACH = 'data_breach',
  PROCESSING_ERROR = 'processing_error',
  ACCESS_REQUEST = 'access_request',
  CORRECTION_REQUEST = 'correction_request',
  ERASURE_REQUEST = 'erasure_request',
  PORTABILITY_REQUEST = 'portability_request',
  OTHER = 'other'
}

export enum GrievanceStatus {
  SUBMITTED = 'submitted',
  IN_PROGRESS = 'in_progress',
  PENDING_INFO = 'pending_info',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  ESCALATED = 'escalated'
}

export enum GrievancePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface AuditEntry {
  id: string;
  userId: string;
  action: AuditAction;
  resource: string;
  timestamp: Date;
  ipAddress: string;
  sessionId: string;
  details: Record<string, any>;
  hash: string;
  previousHash?: string;
  blockIndex: number;
}

export enum AuditAction {
  CONSENT_GRANTED = 'consent_granted',
  CONSENT_WITHDRAWN = 'consent_withdrawn',
  CONSENT_UPDATED = 'consent_updated',
  CONSENT_RENEWED = 'consent_renewed',
  CONSENT_EXPIRED = 'consent_expired',
  CONSENT_VALIDATION_REQUESTED = 'consent_validation_requested',
  CONSENT_VALIDATED = 'consent_validated',
  CONSENT_VALIDATION_FAILED = 'consent_validation_failed',
  CONSENT_UPDATE_FAILED = 'consent_update_failed',
  CONSENT_RENEWAL_FAILED = 'consent_renewal_failed',
  CONSENT_WITHDRAWAL_FAILED = 'consent_withdrawal_failed',
  PROCESSING_HALTED = 'processing_halted',
  RENEWAL_NOTIFICATION_SENT = 'renewal_notification_sent',
  SYSTEM_SYNC_COMPLETED = 'system_sync_completed',
  ALL_PROCESSING_HALTED = 'all_processing_halted',
  THIRD_PARTY_NOTIFIED = 'third_party_notified',
  FIDUCIARY_NOTIFIED = 'fiduciary_notified',
  DATA_ACCESSED = 'data_accessed',
  DATA_EXPORTED = 'data_exported',
  DATA_DELETED = 'data_deleted',
  GRIEVANCE_SUBMITTED = 'grievance_submitted',
  GRIEVANCE_ASSIGNED = 'grievance_assigned',
  GRIEVANCE_IN_PROGRESS = 'grievance_in_progress',
  GRIEVANCE_PENDING_INFO = 'grievance_pending_info',
  GRIEVANCE_INFO_RECEIVED = 'grievance_info_received',
  GRIEVANCE_RESOLVED = 'grievance_resolved',
  GRIEVANCE_CLOSED = 'grievance_closed',
  GRIEVANCE_ESCALATED = 'grievance_escalated',
  GRIEVANCE_NOTIFICATION_SENT = 'grievance_notification_sent',
  DATA_REQUEST_SUBMITTED = 'data_request_submitted',
  DATA_REQUEST_ASSIGNED = 'data_request_assigned',
  DATA_REQUEST_IN_PROGRESS = 'data_request_in_progress',
  DATA_REQUEST_FULFILLED = 'data_request_fulfilled',
  DATA_REQUEST_REJECTED = 'data_request_rejected',
  DATA_REQUEST_ESCALATED = 'data_request_escalated',
  DATA_REQUEST_NOTIFICATION_SENT = 'data_request_notification_sent',
  NOTICE_CREATED = 'notice_created',
  NOTICE_PUBLISHED = 'notice_published',
  NOTICE_DRAFT_SAVED = 'notice_draft_saved',
  NOTICE_SUBMITTED_FOR_APPROVAL = 'notice_submitted_for_approval',
  NOTICE_APPROVED = 'notice_approved',
  NOTICE_REJECTED = 'notice_rejected',
  NOTICE_ARTIFACT_STORED = 'notice_artifact_stored',
  NOTICE_ARTIFACT_RETRIEVED = 'notice_artifact_retrieved',
  NOTICE_TEMPLATE_VERSION_UPDATED = 'notice_template_version_updated',
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  SYSTEM_CONFIG_CHANGED = 'system_config_changed'
}

export interface CookieConsent {
  id: string;
  userId: string;
  sessionId: string;
  categories: CookieCategory[];
  preferences: Record<string, boolean>;
  timestamp: Date;
  expiryDate: Date;
  domain: string;
  version: string;
}

export enum CookieCategory {
  ESSENTIAL = 'essential',
  PERFORMANCE = 'performance',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing',
  FUNCTIONAL = 'functional'
}

export interface DataRetentionPolicy {
  id: string;
  name: string;
  description: string;
  dataCategory: string;
  retentionPeriod: number; // in days
  retentionBasis: string;
  deletionMethod: DeletionMethod;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  lastUpdated: Date;
}

export enum DeletionMethod {
  SOFT_DELETE = 'soft_delete',
  HARD_DELETE = 'hard_delete',
  ANONYMIZE = 'anonymize',
  ARCHIVE = 'archive'
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  channels: NotificationChannel[];
  status: NotificationStatus;
}

export enum NotificationType {
  CONSENT_EXPIRING = 'consent_expiring',
  CONSENT_WITHDRAWN = 'consent_withdrawn',
  GRIEVANCE_UPDATE = 'grievance_update',
  DATA_REQUEST_FULFILLED = 'data_request_fulfilled',
  SYSTEM_ALERT = 'system_alert'
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  IN_APP = 'in_app',
  PUSH = 'push'
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed'
}

export interface ConsentTemplate {
  id: string;
  name: string;
  description: string;
  type: TemplateType;
  content: string;
  placeholders: TemplatePlaceholder[];
  purposeMapping: PurposeMapping[];
  translationKeys: Record<string, TranslationKey>;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  lastUpdated: Date;
  version: string;
  status?: NoticeStatus;
  approvedBy?: string;
  approvedAt?: Date;
  publishedBy?: string;
  publishedAt?: Date;
}

export enum TemplateType {
  CONSENT_NOTICE = 'consent_notice',
  PRIVACY_NOTICE = 'privacy_notice',
  COOKIE_NOTICE = 'cookie_notice',
  DATA_BREACH_NOTICE = 'data_breach_notice'
}

export interface TemplatePlaceholder {
  key: string;
  name: string;
  description: string;
  type: PlaceholderType;
  required: boolean;
  defaultValue?: string;
  validationRules?: ValidationRule[];
}

export enum PlaceholderType {
  TEXT = 'text',
  PURPOSE_LIST = 'purpose_list',
  DATA_CATEGORIES = 'data_categories',
  RETENTION_PERIOD = 'retention_period',
  CONTACT_INFO = 'contact_info',
  RIGHTS_LIST = 'rights_list',
  LEGAL_BASIS = 'legal_basis'
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'regex';
  value?: string | number;
  message: string;
}

export interface PurposeMapping {
  purposeId: string;
  uniqueId: string; // P-001, P-002, etc.
  category: ConsentCategory;
  isEssential: boolean;
  triggerEvents: TriggerEvent[];
  associatedDataCategories: string[];
  templateSections: string[];
}

export enum ConsentCategory {
  ESSENTIAL = 'essential',
  NON_ESSENTIAL = 'non_essential',
  MARKETING = 'marketing',
  ANALYTICS = 'analytics',
  PERSONALIZATION = 'personalization'
}

export interface TriggerEvent {
  id: string;
  name: string;
  description: string;
  eventType: EventType;
  conditions: EventCondition[];
  purposeIds: string[];
}

export enum EventType {
  USER_REGISTRATION = 'user_registration',
  SERVICE_ONBOARDING = 'service_onboarding',
  FEATURE_ACCESS = 'feature_access',
  DATA_COLLECTION = 'data_collection',
  MARKETING_ENROLLMENT = 'marketing_enrollment',
  ANALYTICS_TRACKING = 'analytics_tracking'
}

export interface EventCondition {
  field: string;
  operator: 'equals' | 'contains' | 'exists' | 'not_exists';
  value?: string;
}

export interface TranslationKey {
  key: string;
  englishText: string;
  translations: Record<string, string>; // language code -> translated text
  category: TranslationCategory;
  lastUpdated: Date;
}

export enum TranslationCategory {
  TITLE = 'title',
  DESCRIPTION = 'description',
  PURPOSE = 'purpose',
  RIGHT = 'right',
  LEGAL_TEXT = 'legal_text',
  BUTTON = 'button',
  LABEL = 'label'
}

export interface ConsentNoticeGeneration {
  id: string;
  templateId: string;
  triggeredBy: string; // event that triggered generation
  context: NoticeContext;
  generatedNotice: GeneratedNotice;
  userId: string;
  sessionId: string;
  timestamp: Date;
  ipAddress: string;
  status: GenerationStatus;
}

export interface NoticeContext {
  dataFiduciaryId: string;
  serviceType: string;
  userLanguage: string;
  purposes: string[];
  dataCategories: string[];
  userType: 'adult' | 'minor';
  previousConsents?: string[];
  customParameters: Record<string, any>;
}

export interface GeneratedNotice {
  title: string;
  content: string;
  language: string;
  purposeIds: string[];
  sectionsIncluded: NoticeSection[];
  userRights: UserRight[];
  legalBasis: string[];
  contactInformation: ContactInfo;
  effectiveDate: Date;
  hash: string; // for integrity verification
}

export interface NoticeSection {
  id: string;
  title: string;
  content: string;
  purposeIds: string[];
  isRequired: boolean;
  order: number;
}

export interface UserRight {
  rightId: string;
  name: string;
  description: string;
  howToExercise: string;
  contactMethod: string;
  responseTime: string;
  translations: Record<string, UserRightTranslation>;
}

export interface UserRightTranslation {
  name: string;
  description: string;
  howToExercise: string;
  language: string;
}

export interface ContactInfo {
  dpoName: string;
  dpoEmail: string;
  dpoPhone?: string;
  organizationName: string;
  organizationAddress: string;
  grievanceEmail: string;
  grievancePhone?: string;
}

export enum GenerationStatus {
  PENDING = 'pending',
  GENERATED = 'generated',
  PRESENTED = 'presented',
  CONSENTED = 'consented',
  DECLINED = 'declined',
  EXPIRED = 'expired'
}

// Enhanced consent artifact with purpose tagging
export interface ConsentArtifact {
  id: string;
  consentId: string;
  userId: string;
  noticeGenerationId: string;
  noticeArtifactId?: string; // Link to the rendered notice
  purposeTags: PurposeTag[];
  consentDecisions: ConsentDecision[];
  metadata: ConsentArtifactMetadata;
  integrity: IntegrityVerification;
  createdAt: Date;
  version: string;
}

export interface PurposeTag {
  purposeId: string;
  uniqueId: string; // P-001, P-002, etc.
  category: ConsentCategory;
  status: ConsentStatus;
  grantedAt?: Date;
  deniedAt?: Date;
  metadata: PurposeMetadata;
}

export interface PurposeMetadata {
  consentMethod: 'explicit_click' | 'granular_selection' | 'toggle_switch';
  displayedLanguage: string;
  userAgent: string;
  timestamp: Date;
  evidenceHash: string;
}

export interface ConsentDecision {
  purposeId: string;
  decision: 'granted' | 'denied';
  timestamp: Date;
  evidenceData: EvidenceData;
}

export interface EvidenceData {
  uiComponent: string;
  userAction: string;
  screenCapture?: string; // base64 encoded
  timestamp: Date;
  coordinates?: { x: number; y: number };
}

export interface ConsentArtifactMetadata {
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  language: string;
  noticeVersion: string;
  templateVersion: string;
  consentFlowVersion: string;
  deviceFingerprint?: string;
  geolocation?: string;
}

export interface IntegrityVerification {
  hash: string;
  algorithm: 'SHA-256' | 'SHA-512';
  signature?: string;
  publicKey?: string;
  blockchainHash?: string;
  verificationStatus: 'verified' | 'failed' | 'pending';
}

// Notice Artifact Storage (BRD Critical Requirement)
export interface NoticeArtifact {
  id: string;
  consentArtifactId: string;
  templateId: string;
  templateVersion: string;
  renderedHtml: string;
  renderedPlainText: string;
  languageUsed: string;
  purposeIds: string[];
  dataCategories: string[];
  userType: 'adult' | 'minor';
  createdOn: Date;
  integrity: {
    hash: string;
    algorithm: 'SHA-256' | 'SHA-512';
    verificationStatus: 'verified' | 'failed' | 'pending';
  };
  metadata: {
    ipAddress: string;
    userAgent: string;
    sessionId: string;
    deviceFingerprint?: string;
    screenResolution?: string;
  };
}

// Administrative configuration
export interface AdminConfiguration {
  id: string;
  organizationId: string;
  templates: ConsentTemplate[];
  purposeMappings: PurposeMapping[];
  translationKeys: TranslationKey[];
  triggerEvents: TriggerEvent[];
  retentionPolicies: DataRetentionPolicy[];
  userRights: UserRight[];
  contactInformation: ContactInfo;
  complianceSettings: ComplianceSettings;
  lastUpdated: Date;
  version: string;
}

export interface ComplianceSettings {
  consentExpiry: number; // days
  renewalReminder: number; // days before expiry
  dataRetentionDefault: number; // days
  auditLogRetention: number; // days
  encryptionRequired: boolean;
  blockchainLogging: boolean;
  multiLanguageRequired: boolean;
  minorConsentRequired: boolean;
  digiLockerIntegration: boolean;
}

// Consent Requirement Detection (BRD Section 4.1)
export interface ConsentRequirement {
  id: string;
  userId: string;
  dataFiduciaryId: string;
  dataFiduciaryName: string;
  requirementType: 'NEW' | 'RENEWAL' | 'UPDATE' | 'MANDATORY';
  purposeIds: string[];
  purposes: ProcessingPurpose[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate?: Date;
  expiryDate?: Date;
  language: string;
  isBlocking: boolean; // Requires immediate action before using service
  metadata: {
    triggerEvent: string;
    contextualFlags: Record<string, any>;
    templateId: string;
    noticeVersion: string;
  };
  createdAt: Date;
  status: 'PENDING' | 'PRESENTED' | 'COMPLETED' | 'EXPIRED';
}

// Consent Management System API Response
export interface ConsentCheckResponse {
  userId: string;
  hasPendingConsents: boolean;
  requirements: ConsentRequirement[];
  immediateActionRequired: boolean;
  summary: {
    newConsents: number;
    renewals: number;
    updates: number;
    expired: number;
  };
  userPreferences: {
    language: string;
    notificationMethod: 'BANNER' | 'MODAL' | 'SECTION';
    autoRenewal: boolean;
  };
}

// Notice Integration Configuration
export interface NoticeIntegrationConfig {
  displayMode: 'BANNER' | 'MODAL' | 'SECTION' | 'OVERLAY';
  position: 'TOP' | 'BOTTOM' | 'CENTER' | 'SIDEBAR';
  dismissible: boolean;
  requiresImmediateAction: boolean;
  showProgressIndicator: boolean;
  enableRealTimeFeedback: boolean;
  accessibilityFeatures: {
    screenReaderSupport: boolean;
    keyboardNavigation: boolean;
    highContrast: boolean;
    fontSize: 'SMALL' | 'MEDIUM' | 'LARGE';
  };
}

// Dynamic Notice Rendering Data
export interface NoticeRenderingData {
  templateId: string;
  purposeMapping: Record<string, any>;
  languageData: Record<string, string>;
  dynamicContent: {
    title: string;
    description: string;
    purposes: ProcessingPurpose[];
    legalBasis: string;
    retentionPeriod: string;
    dataCategories: string[];
    thirdPartySharing: boolean;
  };
  interactionOptions: {
    allowGranularControl: boolean;
    enableBulkActions: boolean;
    showPurposeDetails: boolean;
    requireExplicitAction: boolean;
  };
}

// Consent Workflow State
export interface ConsentWorkflowState {
  currentStep: 'DETECTION' | 'PRESENTATION' | 'INTERACTION' | 'SUBMISSION' | 'CONFIRMATION';
  requirementId: string;
  userSelections: Record<string, boolean>;
  validationErrors: string[];
  submissionStatus: 'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR';
  artifactId?: string;
  nextAction?: 'REDIRECT' | 'REFRESH' | 'CONTINUE';
}

// History Tracking System for Grievances and Data Principal Requests
export interface ActivityHistoryEntry {
  id: string;
  timestamp: Date;
  activityType: 'STATUS_CHANGE' | 'ASSIGNMENT_CHANGE' | 'PRIORITY_CHANGE' | 'UPDATE' | 'COMMENT' | 'DOCUMENT_UPLOAD' | 'ESCALATION' | 'RESOLUTION' | 'COMMUNICATION';
  actor: {
    id: string;
    name: string;
    role: 'DATA_PRINCIPAL' | 'DPO' | 'DATA_FIDUCIARY' | 'DATA_PROCESSOR' | 'SYSTEM_ADMIN' | 'SYSTEM';
    email?: string;
  };
  changes: {
    field: string;
    oldValue: string | null;
    newValue: string | null;
  }[];
  description: string;
  notes?: string;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    source: 'WEB_UI' | 'API' | 'SYSTEM' | 'EMAIL' | 'PHONE';
    automaticAction: boolean;
  };
  attachments?: {
    fileName: string;
    fileSize: number;
    uploadedAt: Date;
    uploadedBy: string;
  }[];
  visibility: 'PUBLIC' | 'INTERNAL' | 'DPO_ONLY' | 'SYSTEM_ONLY';
  relatedEntities?: {
    type: 'CONSENT' | 'USER' | 'POLICY' | 'INCIDENT';
    id: string;
    name: string;
  }[];
}

export interface GrievanceHistory {
  grievanceId: string;
  referenceNumber: string;
  activities: ActivityHistoryEntry[];
  createdAt: Date;
  lastUpdated: Date;
  totalActivities: number;
  statusChangeCount: number;
  assignmentChangeCount: number;
  communicationCount: number;
  escalationCount: number;
}

export interface DataPrincipalRequestHistory {
  requestId: string;
  referenceNumber: string;
  requestType: 'ACCESS' | 'CORRECTION' | 'ERASURE' | 'PORTABILITY' | 'OBJECTION' | 'NOMINATION';
  activities: ActivityHistoryEntry[];
  createdAt: Date;
  lastUpdated: Date;
  totalActivities: number;
  statusChangeCount: number;
  assignmentChangeCount: number;
  communicationCount: number;
  slaBreachCount: number;
  processingMilestones: {
    received: Date;
    validated?: Date;
    inProgress?: Date;
    completed?: Date;
    rejected?: Date;
  };
}

// Enhanced interfaces with history tracking
export interface GrievanceTicketWithHistory extends GrievanceTicket {
  history: GrievanceHistory;
  lastActivityAt: Date;
  activitySummary: {
    totalActivities: number;
    recentActivity: string;
    nextAction?: string;
    daysActive: number;
  };
}

export interface DataPrincipalRequestWithHistory {
  id: string;
  referenceNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  requestType: 'ACCESS' | 'CORRECTION' | 'ERASURE' | 'PORTABILITY' | 'OBJECTION' | 'NOMINATION';
  status: 'SUBMITTED' | 'IN_PROGRESS' | 'FULFILLED' | 'REJECTED' | 'ESCALATED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  submittedAt: Date;
  dueDate: Date;
  fulfilledAt?: Date;
  description: string;
  relatedConsents: string[];
  assignedTo?: string;
  documents: string[];
  history: DataPrincipalRequestHistory;
  lastActivityAt: Date;
  activitySummary: {
    totalActivities: number;
    recentActivity: string;
    nextAction?: string;
    daysActive: number;
    slaStatus: 'ON_TIME' | 'AT_RISK' | 'BREACHED';
  };
}

// History Service Interface
export interface HistoryService {
  addActivity(
    entityType: 'GRIEVANCE' | 'DATA_REQUEST',
    entityId: string,
    activity: Omit<ActivityHistoryEntry, 'id' | 'timestamp'>
  ): Promise<ActivityHistoryEntry>;
  
  getHistory(
    entityType: 'GRIEVANCE' | 'DATA_REQUEST',
    entityId: string,
    filters?: {
      activityTypes?: ActivityHistoryEntry['activityType'][];
      dateRange?: { start: Date; end: Date };
      actors?: string[];
      visibility?: ActivityHistoryEntry['visibility'][];
    }
  ): Promise<GrievanceHistory | DataPrincipalRequestHistory>;
  
  getActivitySummary(
    entityType: 'GRIEVANCE' | 'DATA_REQUEST',
    entityId: string
  ): Promise<{
    totalActivities: number;
    recentActivity: string;
    nextAction?: string;
    daysActive: number;
  }>;
}
