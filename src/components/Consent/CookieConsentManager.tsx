import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Cookie, 
  Settings, 
  Shield, 
  BarChart3, 
  Target, 
  Wrench,
  Info,
  Clock,
  CheckCircle,
  AlertTriangle,
  Globe,
  FileText,
  History,
  Download,
  Eye,
  Edit,
  RefreshCw,
  Bell
} from 'lucide-react';
import { CookieCategory, CookieConsent, AuditAction } from '@/types/dpdp';

// Enhanced interfaces for BRD compliance
interface CookieCategoryConfig {
  category: CookieCategory;
  name: string;
  description: string;
  essential: boolean;
  icon: React.ReactNode;
  examples: string[];
  purpose: string;
  retention: string;
  legalBasis: string;
  thirdPartySharing: boolean;
  dataTransfer: string[];
  translations: Record<string, {
    name: string;
    description: string;
    purpose: string;
  }>;
}

interface CookiePolicyVersion {
  version: string;
  releaseDate: Date;
  changes: string[];
  requiresReconsent: boolean;
  categories: CookieCategory[];
}

interface CookieAuditEntry {
  id: string;
  userId: string;
  sessionId: string;
  action: CookieAuditAction;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  categories: CookieCategory[];
  preferences: Record<CookieCategory, boolean>;
  policyVersion: string;
  language: string;
  metadata: Record<string, any>;
}

enum CookieAuditAction {
  BANNER_SHOWN = 'banner_shown',
  CONSENT_GRANTED = 'consent_granted',
  CONSENT_DECLINED = 'consent_declined',
  PREFERENCES_UPDATED = 'preferences_updated',
  POLICY_VIEWED = 'policy_viewed',
  CONSENT_WITHDRAWN = 'consent_withdrawn',
  CONSENT_EXPIRED = 'consent_expired',
  CONSENT_RENEWED = 'consent_renewed',
  POLICY_CHANGED = 'policy_changed',
  TAG_BLOCKED = 'tag_blocked',
  TAG_LOADED = 'tag_loaded',
  VALIDATION_REQUESTED = 'validation_requested'
}

interface CookieConsentManagerProps {
  userId?: string;
  domain: string;
  showBanner?: boolean;
  onConsentChange: (consent: CookieConsent) => void;
  onAuditLog: (entry: CookieAuditEntry) => void;
  currentConsent?: CookieConsent;
  language?: string;
  userRole?: 'data_principal' | 'data_fiduciary' | 'data_processor' | 'admin' | 'dpo';
  policyVersion?: string;
  apiEndpoint?: string;
  enableRealTimeSync?: boolean;
  autoExpiryMonths?: number;
  showAdvancedControls?: boolean;
}

// Multi-language translations (BRD Eighth Schedule compliance)
const translations = {
  en: {
    bannerTitle: 'Cookie Consent - CMS',
    bannerDescription: 'We use cookies to enhance your experience, analyze website performance, and deliver personalized content. You have full control over which cookies to accept. Essential cookies are required for basic functionality.',
    acceptAll: 'Accept All',
    declineAll: 'Accept Essential Only',
    customize: 'Customize',
    saving: 'Saving...',
    preferences: 'Cookie Preferences',
    preferencesDescription: 'Customize your cookie preferences. You can change these settings at any time. Essential cookies cannot be disabled as they are required for basic website functionality.',
    complianceNote: 'CMS Compliance: We provide granular control over cookie categories. Your preferences are stored securely and can be modified at any time.',
    required: 'Required',
    purpose: 'Purpose',
    retention: 'Retention',
    examples: 'Examples',
    enabled: 'Enabled',
    disabled: 'Disabled',
    expires: 'Expires',
    domain: 'Domain',
    updatePreferences: 'Update Preferences',
    savePreferences: 'Save Preferences',
    cancel: 'Cancel',
    viewPolicy: 'View Cookie Policy',
    auditTrail: 'Audit Trail',
    policyChanged: 'Cookie Policy Updated',
    policyChangedDescription: 'Our cookie policy has been updated. Please review and provide fresh consent.',
    consentExpiring: 'Consent Expiring',
    consentExpiringDescription: 'Your cookie consent will expire soon. Please renew your preferences.',
    renewConsent: 'Renew Consent'
  },
  hi: {
    bannerTitle: 'कुकी सहमति - डीपीडीपी अधिनियम 2023',
    bannerDescription: 'हम आपके अनुभव को बेहतर बनाने, वेबसाइट के प्रदर्शन का विश्लेषण करने और व्यक्तिगत सामग्री प्रदान करने के लिए कुकीज़ का उपयोग करते हैं। आपका पूरा नियंत्रण है कि कौन सी कुकीज़ स्वीकार करनी हैं। आवश्यक कुकीज़ बुनियादी कार्यक्षमता के लिए आवश्यक हैं।',
    acceptAll: 'सभी स्वीकार करें',
    declineAll: 'केवल आवश्यक स्वीकार करें',
    customize: 'अनुकूलित करें',
    saving: 'सहेज रहे हैं...',
    preferences: 'कुकी प्राथमिकताएं',
    preferencesDescription: 'अपनी कुकी प्राथमिकताओं को अनुकूलित करें। आप इन सेटिंग्स को किसी भी समय बदल सकते हैं। आवश्यक कुकीज़ को अक्षम नहीं किया जा सकता क्योंकि वे बुनियादी वेबसाइट कार्यक्षमता के लिए आवश्यक हैं।',
    complianceNote: 'डीपीडीपी अधिनियम 2023 अनुपालन: हम कुकी श्रेणियों पर विस्तृत नियंत्रण प्रदान करते हैं। आपकी प्राथमिकताएं सुरक्षित रूप से संग्रहीत हैं और किसी भी समय संशोधित की जा सकती हैं।',
    required: 'आवश्यक',
    purpose: 'उद्देश्य',
    retention: 'संधारण',
    examples: 'उदाहरण',
    enabled: 'सक्षम',
    disabled: 'अक्षम',
    expires: 'समाप्ति',
    domain: 'डोमेन',
    updatePreferences: 'प्राथमिकताएं अपडेट करें',
    savePreferences: 'प्राथमिकताएं सहेजें',
    cancel: 'रद्द करें',
    viewPolicy: 'कुकी नीति देखें',
    auditTrail: 'ऑडिट ट्रेल',
    policyChanged: 'कुकी नीति अपडेट की गई',
    policyChangedDescription: 'हमारी कुकी नीति अपडेट की गई है। कृपया समीक्षा करें और नई सहमति प्रदान करें।',
    consentExpiring: 'सहमति समाप्त हो रही है',
    consentExpiringDescription: 'आपकी कुकी सहमति जल्द ही समाप्त हो जाएगी। कृपया अपनी प्राथमिकताएं नवीनीकृत करें।',
    renewConsent: 'सहमति नवीनीकृत करें'
  }
};

const CookieConsentManager = ({ 
  userId = 'anonymous', 
  domain, 
  showBanner = true, 
  onConsentChange,
  onAuditLog,
  currentConsent,
  language = 'en',
  userRole = 'data_principal',
  policyVersion = '1.0',
  apiEndpoint = '/api/cookie-consent',
  enableRealTimeSync = true,
  autoExpiryMonths = 6,
  showAdvancedControls = false
}: CookieConsentManagerProps) => {
  const [showPreferences, setShowPreferences] = useState(false);
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  const [showAuditDialog, setShowAuditDialog] = useState(false);
  const [showBannerState, setShowBannerState] = useState(false);
  const [preferences, setPreferences] = useState<Record<CookieCategory, boolean>>({
    [CookieCategory.ESSENTIAL]: true,
    [CookieCategory.PERFORMANCE]: currentConsent?.preferences.performance || false,
    [CookieCategory.ANALYTICS]: currentConsent?.preferences.analytics || false,
    [CookieCategory.MARKETING]: currentConsent?.preferences.marketing || false,
    [CookieCategory.FUNCTIONAL]: currentConsent?.preferences.functional || false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [policyChangedAlert, setPolicyChangedAlert] = useState(false);
  const [consentExpiringAlert, setConsentExpiringAlert] = useState(false);
  const [auditEntries, setAuditEntries] = useState<CookieAuditEntry[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  // Enhanced cookie categories with BRD compliance
  const cookieCategories: CookieCategoryConfig[] = [
    {
      category: CookieCategory.ESSENTIAL,
      name: 'Essential Cookies',
      description: 'Required for basic website functionality and security. Cannot be disabled.',
      essential: true,
      icon: <Shield className="h-5 w-5 text-blue-600" />,
      examples: ['Session ID', 'Authentication token', 'Security preferences', 'Language selection'],
      purpose: 'Enable core website functionality and maintain security',
      retention: 'Session or up to 1 year',
      legalBasis: 'Legitimate interest - essential for service delivery',
      thirdPartySharing: false,
      dataTransfer: [],
      translations: {
        hi: {
          name: 'आवश्यक कुकीज़',
          description: 'बुनियादी वेबसाइट कार्यक्षमता और सुरक्षा के लिए आवश्यक। अक्षम नहीं किया जा सकता।',
          purpose: 'मुख्य वेबसाइट कार्यक्षमता सक्षम करें और सुरक्षा बनाए रखें'
        }
      }
    },
    {
      category: CookieCategory.PERFORMANCE,
      name: 'Performance Cookies',
      description: 'Help us understand how visitors interact with our website by collecting anonymous information.',
      essential: false,
      icon: <BarChart3 className="h-5 w-5 text-green-600" />,
      examples: ['Page load times', 'Error tracking', 'Performance metrics', 'Usage statistics'],
      purpose: 'Improve website performance and user experience',
      retention: 'Up to 2 years',
      legalBasis: 'Consent - optional performance optimization',
      thirdPartySharing: true,
      dataTransfer: ['Google Analytics', 'Performance monitoring services'],
      translations: {
        hi: {
          name: 'प्रदर्शन कुकीज़',
          description: 'गुमनाम जानकारी एकत्र करके आगंतुकों की वेबसाइट के साथ बातचीत को समझने में हमारी सहायता करती हैं।',
          purpose: 'वेबसाइट प्रदर्शन और उपयोगकर्ता अनुभव में सुधार'
        }
      }
    },
    {
      category: CookieCategory.ANALYTICS,
      name: 'Analytics Cookies',
      description: 'Used to analyze website traffic and user behavior to improve our services.',
      essential: false,
      icon: <BarChart3 className="h-5 w-5 text-purple-600" />,
      examples: ['Google Analytics', 'User journey tracking', 'Conversion tracking', 'A/B testing'],
      purpose: 'Understand user behavior and optimize website experience',
      retention: 'Up to 26 months',
      legalBasis: 'Consent - analytical insights for service improvement',
      thirdPartySharing: true,
      dataTransfer: ['Google Analytics', 'Adobe Analytics', 'Hotjar'],
      translations: {
        hi: {
          name: 'विश्लेषण कुकीज़',
          description: 'हमारी सेवाओं को बेहतर बनाने के लिए वेबसाइट ट्रैफिक और उपयोगकर्ता व्यवहार का विश्लेषण करने के लिए उपयोग की जाती हैं।',
          purpose: 'उपयोगकर्ता व्यवहार को समझें और वेबसाइट अनुभव को अनुकूलित करें'
        }
      }
    },
    {
      category: CookieCategory.MARKETING,
      name: 'Marketing Cookies',
      description: 'Used to deliver personalized advertisements and track advertising effectiveness.',
      essential: false,
      icon: <Target className="h-5 w-5 text-orange-600" />,
      examples: ['Ad targeting', 'Retargeting pixels', 'Social media integration', 'Marketing attribution'],
      purpose: 'Deliver relevant advertisements and measure campaign effectiveness',
      retention: 'Up to 2 years',
      legalBasis: 'Consent - personalized marketing and advertising',
      thirdPartySharing: true,
      dataTransfer: ['Google Ads', 'Facebook Pixel', 'LinkedIn Insight Tag'],
      translations: {
        hi: {
          name: 'मार्केटिंग कुकीज़',
          description: 'व्यक्तिगत विज्ञापन प्रदान करने और विज्ञापन प्रभावशीलता को ट्रैक करने के लिए उपयोग की जाती हैं।',
          purpose: 'प्रासंगिक विज्ञापन प्रदान करें और अभियान प्रभावशीलता को मापें'
        }
      }
    },
    {
      category: CookieCategory.FUNCTIONAL,
      name: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization features.',
      essential: false,
      icon: <Wrench className="h-5 w-5 text-indigo-600" />,
      examples: ['User preferences', 'Chat widgets', 'Video players', 'Social sharing'],
      purpose: 'Provide enhanced features and remember user preferences',
      retention: 'Up to 1 year',
      legalBasis: 'Consent - enhanced user experience features',
      thirdPartySharing: false,
      dataTransfer: ['Chat service providers', 'Video hosting services'],
      translations: {
        hi: {
          name: 'कार्यात्मक कुकीज़',
          description: 'उन्नत कार्यक्षमता और व्यक्तिगतकरण सुविधाओं को सक्षम करती हैं।',
          purpose: 'उन्नत सुविधाएं प्रदान करें और उपयोगकर्ता प्राथमिकताओं को याद रखें'
        }
      }
    }
  ];

  // Initialize component with BRD compliance checks
  useEffect(() => {
    checkConsentStatus();
    checkPolicyVersion();
    loadAuditEntries();
  }, [currentConsent, policyVersion]);

  const checkConsentStatus = () => {
    if (!currentConsent) {
      setShowBannerState(showBanner);
      logAuditEntry(CookieAuditAction.BANNER_SHOWN, {});
      return;
    }

    // Check if consent is expiring (30 days before expiry)
    const expiryDate = new Date(currentConsent.expiryDate);
    const warningDate = new Date(expiryDate.getTime() - (30 * 24 * 60 * 60 * 1000));
    if (new Date() > warningDate) {
      setConsentExpiringAlert(true);
    }

    // Check if consent has expired
    if (new Date() > expiryDate) {
      setShowBannerState(true);
      logAuditEntry(CookieAuditAction.CONSENT_EXPIRED, {});
    }
  };

  const checkPolicyVersion = () => {
    if (currentConsent && currentConsent.version !== policyVersion) {
      setPolicyChangedAlert(true);
      setShowBannerState(true);
      logAuditEntry(CookieAuditAction.POLICY_CHANGED, {
        oldVersion: currentConsent.version,
        newVersion: policyVersion
      });
    }
  };

  const loadAuditEntries = async () => {
    // In real implementation, fetch from API
    // For demo, using mock data
    const mockEntries: CookieAuditEntry[] = [
      {
        id: '1',
        userId,
        sessionId: `session_${Date.now()}`,
        action: CookieAuditAction.CONSENT_GRANTED,
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        ipAddress: '192.168.1.1',
        userAgent: navigator.userAgent,
        categories: [CookieCategory.ESSENTIAL, CookieCategory.ANALYTICS],
        preferences: {
          [CookieCategory.ESSENTIAL]: true,
          [CookieCategory.PERFORMANCE]: false,
          [CookieCategory.ANALYTICS]: true,
          [CookieCategory.MARKETING]: false,
          [CookieCategory.FUNCTIONAL]: false
        },
        policyVersion: '1.0',
        language: selectedLanguage,
        metadata: { source: 'banner' }
      }
    ];
    setAuditEntries(mockEntries);
  };

  const logAuditEntry = (action: CookieAuditAction, metadata: Record<string, any>) => {
    const entry: CookieAuditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      sessionId: `session_${Date.now()}`,
      action,
      timestamp: new Date(),
      ipAddress: '192.168.1.1', // In real implementation, get from server
      userAgent: navigator.userAgent,
      categories: Object.entries(preferences)
        .filter(([_, enabled]) => enabled)
        .map(([category]) => category as CookieCategory),
      preferences,
      policyVersion,
      language: selectedLanguage,
      metadata
    };

    setAuditEntries(prev => [entry, ...prev]);
    onAuditLog(entry);
  };

  const handleCategoryToggle = (category: CookieCategory, enabled: boolean) => {
    if (category === CookieCategory.ESSENTIAL) return; // Essential cookies cannot be disabled
    
    setPreferences(prev => ({
      ...prev,
      [category]: enabled
    }));
  };

  const saveConsent = async (acceptAll: boolean = false, declineAll: boolean = false) => {
    setIsSubmitting(true);
    
    let finalPreferences = { ...preferences };
    let auditAction = CookieAuditAction.PREFERENCES_UPDATED;
    
    if (acceptAll) {
      finalPreferences = {
        [CookieCategory.ESSENTIAL]: true,
        [CookieCategory.PERFORMANCE]: true,
        [CookieCategory.ANALYTICS]: true,
        [CookieCategory.MARKETING]: true,
        [CookieCategory.FUNCTIONAL]: true,
      };
      auditAction = CookieAuditAction.CONSENT_GRANTED;
    } else if (declineAll) {
      finalPreferences = {
        [CookieCategory.ESSENTIAL]: true, // Always required
        [CookieCategory.PERFORMANCE]: false,
        [CookieCategory.ANALYTICS]: false,
        [CookieCategory.MARKETING]: false,
        [CookieCategory.FUNCTIONAL]: false,
      };
      auditAction = CookieAuditAction.CONSENT_DECLINED;
    }

    const consent: CookieConsent = {
      id: `cookie_${Date.now()}`,
      userId,
      sessionId: `session_${Date.now()}`,
      categories: Object.entries(finalPreferences)
        .filter(([_, enabled]) => enabled)
        .map(([category]) => category as CookieCategory),
      preferences: {
        essential: finalPreferences[CookieCategory.ESSENTIAL],
        performance: finalPreferences[CookieCategory.PERFORMANCE],
        analytics: finalPreferences[CookieCategory.ANALYTICS],
        marketing: finalPreferences[CookieCategory.MARKETING],
        functional: finalPreferences[CookieCategory.FUNCTIONAL]
      },
      timestamp: new Date(),
      expiryDate: new Date(Date.now() + autoExpiryMonths * 30 * 24 * 60 * 60 * 1000),
      domain,
      version: policyVersion
    };

    // Real-time API sync if enabled
    if (enableRealTimeSync && apiEndpoint) {
      try {
        await fetch(`${apiEndpoint}/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(consent)
        });
      } catch (error) {
        console.error('Failed to sync consent:', error);
      }
    }

    // Simulate API call
    setTimeout(() => {
      onConsentChange(consent);
      setPreferences(finalPreferences);
      setShowBannerState(false);
      setShowPreferences(false);
      setPolicyChangedAlert(false);
      setConsentExpiringAlert(false);
      setIsSubmitting(false);
      
      logAuditEntry(auditAction, {
        acceptedCategories: consent.categories,
        method: acceptAll ? 'accept_all' : declineAll ? 'decline_all' : 'custom',
        source: showPreferences ? 'preferences_dialog' : 'banner'
      });
    }, 1000);
  };

  const handleValidationRequest = async () => {
    logAuditEntry(CookieAuditAction.VALIDATION_REQUESTED, {
      requestedBy: userRole,
      currentPreferences: preferences
    });

    if (apiEndpoint) {
      try {
        const response = await fetch(`${apiEndpoint}/validate?userId=${userId}`);
        const validationResult = await response.json();
        return validationResult;
      } catch (error) {
        console.error('Validation request failed:', error);
        return null;
      }
    }
  };

  const getEnabledCategoriesCount = () => {
    return Object.values(preferences).filter(Boolean).length;
  };

  const getCategoryDisplayName = (categoryConfig: CookieCategoryConfig) => {
    const translation = categoryConfig.translations[selectedLanguage as keyof typeof categoryConfig.translations];
    return translation?.name || categoryConfig.name;
  };

  const getCategoryDescription = (categoryConfig: CookieCategoryConfig) => {
    const translation = categoryConfig.translations[selectedLanguage as keyof typeof categoryConfig.translations];
    return translation?.description || categoryConfig.description;
  };

  const getCategoryPurpose = (categoryConfig: CookieCategoryConfig) => {
    const translation = categoryConfig.translations[selectedLanguage as keyof typeof categoryConfig.translations];
    return translation?.purpose || categoryConfig.purpose;
  };

  // Enhanced Cookie Banner with policy change and expiry alerts
  const CookieBanner = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-600 shadow-2xl z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto p-6">
        {(policyChangedAlert || consentExpiringAlert) && (
          <Alert className="mb-4 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>
                {policyChangedAlert ? t.policyChanged : t.consentExpiring}
              </strong>
              <br />
              {policyChangedAlert ? t.policyChangedDescription : t.consentExpiringDescription}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          <div className="flex items-start space-x-4 flex-1">
            <Cookie className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.bannerTitle}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                {t.bannerDescription}
              </p>
              <div className="flex items-center space-x-4 text-xs">
                <button
                  onClick={() => setShowPolicyDialog(true)}
                  className="text-blue-600 hover:text-blue-800 underline flex items-center"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  {t.viewPolicy}
                </button>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-20 h-6 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">EN</SelectItem>
                    <SelectItem value="hi">हि</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreferences(true)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              {t.customize}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => saveConsent(false, true)}
              disabled={isSubmitting}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {t.declineAll}
            </Button>
            <Button
              size="sm"
              onClick={() => saveConsent(true)}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? t.saving : t.acceptAll}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Preferences Dialog with BRD compliance features
  const PreferencesDialog = () => (
    <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-xl">
            <Cookie className="h-6 w-6 text-blue-600" />
            <span>{t.preferences}</span>
            <Badge className="bg-blue-100 text-blue-800">v{policyVersion}</Badge>
          </DialogTitle>
          <DialogDescription>
            {t.preferencesDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <Alert className="border-blue-200 bg-blue-50 flex-1 mr-4">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>{t.complianceNote}</strong>
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="language-select" className="text-sm">Language:</Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {cookieCategories.map((categoryConfig) => (
            <Card key={categoryConfig.category} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="mt-1">
                      {categoryConfig.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getCategoryDisplayName(categoryConfig)}
                        </h3>
                        {categoryConfig.essential && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {t.required}
                          </Badge>
                        )}
                        {categoryConfig.thirdPartySharing && (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            Third-party
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{getCategoryDescription(categoryConfig)}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong className="text-gray-700">{t.purpose}:</strong>
                          <p className="text-gray-600 mt-1">{getCategoryPurpose(categoryConfig)}</p>
                        </div>
                        <div>
                          <strong className="text-gray-700">{t.retention}:</strong>
                          <p className="text-gray-600 mt-1">{categoryConfig.retention}</p>
                        </div>
                        <div>
                          <strong className="text-gray-700">Legal Basis:</strong>
                          <p className="text-gray-600 mt-1">{categoryConfig.legalBasis}</p>
                        </div>
                        {categoryConfig.dataTransfer.length > 0 && (
                          <div>
                            <strong className="text-gray-700">Data Transfer:</strong>
                            <p className="text-gray-600 mt-1">{categoryConfig.dataTransfer.join(', ')}</p>
                          </div>
                        )}
                        <div className="md:col-span-2">
                          <strong className="text-gray-700">{t.examples}:</strong>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {categoryConfig.examples.map((example, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Switch
                      checked={preferences[categoryConfig.category]}
                      onCheckedChange={(checked) => handleCategoryToggle(categoryConfig.category, checked)}
                      disabled={categoryConfig.essential}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600">
                {getEnabledCategoriesCount()} of {cookieCategories.length} categories enabled
              </p>
              {showAdvancedControls && userRole !== 'data_principal' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuditDialog(true)}
                >
                  <History className="h-4 w-4 mr-2" />
                  {t.auditTrail}
                </Button>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowPreferences(false)}
                disabled={isSubmitting}
              >
                {t.cancel}
              </Button>
              <Button
                onClick={() => saveConsent()}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? t.saving : t.savePreferences}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Cookie Policy Dialog
  const PolicyDialog = () => (
    <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <span>Cookie Policy</span>
            <Badge>v{policyVersion}</Badge>
          </DialogTitle>
          <DialogDescription>
            Comprehensive cookie usage policy in compliance with CMS
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="prose max-w-none">
            <h3>What are cookies?</h3>
            <p>
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and 
              understanding how you use our services.
            </p>

            <h3>Types of cookies we use</h3>
            {cookieCategories.map((category) => (
              <div key={category.category} className="mb-4 p-4 border rounded-lg">
                <h4 className="font-semibold flex items-center">
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                </h4>
                <p className="text-gray-600 mt-2">{category.description}</p>
                <div className="mt-2 text-sm">
                  <strong>Legal Basis:</strong> {category.legalBasis}<br />
                  <strong>Retention:</strong> {category.retention}<br />
                  <strong>Third-party sharing:</strong> {category.thirdPartySharing ? 'Yes' : 'No'}
                </div>
              </div>
            ))}

            <h3>Your rights</h3>
            <ul>
              <li>Right to granular control over cookie categories</li>
              <li>Right to withdraw consent at any time</li>
              <li>Right to view and download your consent history</li>
              <li>Right to be notified of policy changes</li>
              <li>Right to data portability of your preferences</li>
            </ul>

            <h3>Contact information</h3>
            <p>
              For questions about our cookie policy or to exercise your rights, contact our 
              Data Protection Officer at dpo@company.com or our Grievance Officer at grievance@company.com.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Audit Trail Dialog (for advanced users)
  const AuditDialog = () => (
    <Dialog open={showAuditDialog} onOpenChange={setShowAuditDialog}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <History className="h-6 w-6 text-blue-600" />
            <span>Cookie Consent Audit Trail</span>
          </DialogTitle>
          <DialogDescription>
            Complete audit log of all cookie consent activities for compliance monitoring
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">{auditEntries.length} entries found</p>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <div className="space-y-2">
            {auditEntries.map((entry) => (
              <Card key={entry.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant={entry.action.includes('GRANTED') ? 'default' : 'outline'}>
                      {entry.action.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm font-medium">{entry.timestamp.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">
                      {entry.categories.length} categories • {entry.language} • v{entry.policyVersion}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {entry.ipAddress}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Current Consent Status Component with enhanced information
  const ConsentStatus = () => (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Cookie Preferences Active</span>
          </div>
          <div className="flex items-center space-x-2">
            {consentExpiringAlert && (
              <Badge variant="destructive" className="animate-pulse">
                <Clock className="h-3 w-3 mr-1" />
                Expiring Soon
              </Badge>
            )}
            <Badge variant="outline">v{currentConsent?.version}</Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Last updated: {currentConsent?.timestamp.toLocaleString()} • 
          Expires: {currentConsent?.expiryDate.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {cookieCategories.map((categoryConfig) => (
              <div key={categoryConfig.category} className="text-center p-3 border rounded-lg">
                <div className="mb-2">{categoryConfig.icon}</div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {getCategoryDisplayName(categoryConfig)}
                </p>
                <Badge 
                  variant={preferences[categoryConfig.category] ? "default" : "outline"}
                  className="text-xs"
                >
                  {preferences[categoryConfig.category] ? t.enabled : t.disabled}
                </Badge>
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>{t.domain}:</strong> {currentConsent?.domain}</p>
              <p><strong>User ID:</strong> {currentConsent?.userId}</p>
              <p><strong>Categories:</strong> {getEnabledCategoriesCount()}/{cookieCategories.length} enabled</p>
            </div>
            <div className="flex space-x-2">
              {enableRealTimeSync && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleValidationRequest}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Validate
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreferences(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                {t.updatePreferences}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {showBannerState && <CookieBanner />}
      <PreferencesDialog />
      <PolicyDialog />
      {showAdvancedControls && <AuditDialog />}
      {currentConsent && !showBannerState && <ConsentStatus />}
    </>
  );
};

export default CookieConsentManager; 