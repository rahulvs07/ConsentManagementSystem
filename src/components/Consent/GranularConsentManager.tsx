import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  Info, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText,
  Lock,
  Eye,
  Calendar,
  Globe,
  ShieldCheck,
  Mail,
  BarChart3,
  Heart,
  Settings,
  Smartphone,
  Zap
} from 'lucide-react';
import { 
  ProcessingPurpose, 
  PurposeCategory,
  ConsentRecord,
  ConsentStatus,
  DataCategory,
  DataSensitivity 
} from '@/types/dpdp';
import ParentAuthenticationUI from './ParentAuthenticationUI';

interface GranularConsentManagerProps {
  userId: string;
  isMinor?: boolean;
  language?: string;
  onConsentSubmit: (consents: ConsentRecord[]) => void;
  onMinorVerification?: (parentId: string, digiLockerToken: string) => Promise<boolean>;
}

const GranularConsentManager = ({ 
  userId, 
  isMinor = false, 
  language = 'en', 
  onConsentSubmit,
  onMinorVerification 
}: GranularConsentManagerProps) => {
  const [consentChoices, setConsentChoices] = useState<Record<string, ConsentStatus>>({});
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  const [minorVerified, setMinorVerified] = useState(!isMinor);
  const [parentGuardianId, setParentGuardianId] = useState('');
  const [digiLockerToken, setDigiLockerToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'consent' | 'verification' | 'submitted'>('consent');

  // Mock data representing the purpose categories as per BRD
  const purposeCategories: Record<PurposeCategory, ProcessingPurpose[]> = {
    [PurposeCategory.ACCOUNT_MANAGEMENT]: [
      {
        id: 'acc_mgmt_01',
        name: 'Account Creation & Management',
        description: 'Creating and maintaining your user account, authentication, and basic profile information',
        isEssential: true,
        category: PurposeCategory.ACCOUNT_MANAGEMENT,
        retentionPeriod: 'Until account deletion + 3 years for legal compliance',
        legalBasis: 'Contractual necessity under DPDP Act 2023',
        dataTypes: ['Name', 'Email', 'Phone Number', 'Login Credentials'],
        isActive: true,
        createdBy: 'system',
        translations: {
          'hi': { name: 'खाता निर्माण और प्रबंधन', description: 'आपके उपयोगकर्ता खाते का निर्माण और रखरखाव', language: 'hi' },
          'en': { name: 'Account Creation & Management', description: 'Creating and maintaining your user account', language: 'en' }
        }
      }
    ],
    [PurposeCategory.SERVICE_DELIVERY]: [
      {
        id: 'svc_delivery_01',
        name: 'Core Service Functionality',
        description: 'Essential processing required for delivering the primary services you requested',
        isEssential: true,
        category: PurposeCategory.SERVICE_DELIVERY,
        retentionPeriod: 'Duration of service + 1 year',
        legalBasis: 'Performance of contract under DPDP Act 2023',
        dataTypes: ['Service Data', 'Usage Information', 'Transaction Records'],
        isActive: true,
        createdBy: 'system',
        translations: {
          'hi': { name: 'मुख्य सेवा कार्यक्षमता', description: 'आपके द्वारा अनुरोधित प्राथमिक सेवाओं को प्रदान करने के लिए आवश्यक प्रसंस्करण', language: 'hi' },
          'en': { name: 'Core Service Functionality', description: 'Essential processing required for delivering services', language: 'en' }
        }
      }
    ],
    [PurposeCategory.MARKETING]: [
      {
        id: 'marketing_01',
        name: 'Marketing Communications',
        description: 'Sending promotional emails, newsletters, and personalized marketing content',
        isEssential: false,
        category: PurposeCategory.MARKETING,
        retentionPeriod: '2 years from last interaction or until consent withdrawal',
        legalBasis: 'Consent under Section 7 of DPDP Act 2023',
        dataTypes: ['Email', 'Communication Preferences', 'Marketing Interaction History'],
        isActive: true,
        createdBy: 'marketing_team',
        translations: {
          'hi': { name: 'विपणन संचार', description: 'प्रचारक ईमेल, समाचारपत्र और व्यक्तिगत विपणन सामग्री भेजना', language: 'hi' },
          'en': { name: 'Marketing Communications', description: 'Sending promotional emails and marketing content', language: 'en' }
        }
      }
    ],
    [PurposeCategory.ANALYTICS]: [
      {
        id: 'analytics_01',
        name: 'Usage Analytics & Insights',
        description: 'Analyzing how you use our services to improve performance and user experience',
        isEssential: false,
        category: PurposeCategory.ANALYTICS,
        retentionPeriod: '13 months from collection date',
        legalBasis: 'Legitimate interest with consent under DPDP Act 2023',
        dataTypes: ['Usage Patterns', 'Device Information', 'Performance Metrics', 'Behavioral Data'],
        isActive: true,
        createdBy: 'analytics_team',
        translations: {
          'hi': { name: 'उपयोग विश्लेषण और अंतर्दृष्टि', description: 'प्रदर्शन और उपयोगकर्ता अनुभव को बेहतर बनाने के लिए विश्लेषण', language: 'hi' },
          'en': { name: 'Usage Analytics & Insights', description: 'Analyzing usage to improve performance', language: 'en' }
        }
      }
    ],
    [PurposeCategory.PERSONALIZATION]: [
      {
        id: 'personalization_01',
        name: 'Content Personalization',
        description: 'Customizing content, recommendations, and user interface based on your preferences',
        isEssential: false,
        category: PurposeCategory.PERSONALIZATION,
        retentionPeriod: '24 months or until consent withdrawal',
        legalBasis: 'Consent under Section 7 of DPDP Act 2023',
        dataTypes: ['Preference Data', 'Behavioral Patterns', 'Customization Settings'],
        isActive: true,
        createdBy: 'personalization_team',
        translations: {
          'hi': { name: 'सामग्री व्यक्तिकरण', description: 'आपकी प्राथमिकताओं के आधार पर सामग्री और सिफारिशों को अनुकूलित करना', language: 'hi' },
          'en': { name: 'Content Personalization', description: 'Customizing content based on your preferences', language: 'en' }
        }
      }
    ],
    [PurposeCategory.SECURITY]: [
      {
        id: 'security_01',
        name: 'Security & Fraud Prevention',
        description: 'Protecting your account and preventing unauthorized access or fraudulent activities',
        isEssential: true,
        category: PurposeCategory.SECURITY,
        retentionPeriod: '5 years for security audit purposes',
        legalBasis: 'Legitimate interest for security under DPDP Act 2023',
        dataTypes: ['Security Logs', 'Access Patterns', 'Device Fingerprints', 'IP Addresses'],
        isActive: true,
        createdBy: 'security_team',
        translations: {
          'hi': { name: 'सुरक्षा और धोखाधड़ी रोकथाम', description: 'आपके खाते की सुरक्षा और अनधिकृत पहुंच को रोकना', language: 'hi' },
          'en': { name: 'Security & Fraud Prevention', description: 'Protecting your account from unauthorized access', language: 'en' }
        }
      }
    ],
    [PurposeCategory.CUSTOMER_SUPPORT]: [
      {
        id: 'support_01',
        name: 'Customer Support Services',
        description: 'Providing technical support, handling queries, and resolving service issues',
        isEssential: false,
        category: PurposeCategory.CUSTOMER_SUPPORT,
        retentionPeriod: '3 years from last interaction',
        legalBasis: 'Legitimate interest for support under DPDP Act 2023',
        dataTypes: ['Support Tickets', 'Chat Logs', 'Call Records', 'Issue Resolution Data'],
        isActive: true,
        createdBy: 'support_team',
        translations: {
          'hi': { name: 'ग्राहक सहायता सेवाएं', description: 'तकनीकी सहायता प्रदान करना और सेवा समस्याओं का समाधान', language: 'hi' },
          'en': { name: 'Customer Support Services', description: 'Providing technical support and resolving issues', language: 'en' }
        }
      }
    ],
    [PurposeCategory.LEGAL_COMPLIANCE]: [
      {
        id: 'legal_01',
        name: 'Legal & Regulatory Compliance',
        description: 'Meeting legal obligations, regulatory requirements, and compliance mandates',
        isEssential: true,
        category: PurposeCategory.LEGAL_COMPLIANCE,
        retentionPeriod: 'As required by applicable laws (typically 7 years)',
        legalBasis: 'Legal obligation under applicable laws',
        dataTypes: ['Compliance Records', 'Audit Trails', 'Regulatory Reports'],
        isActive: true,
        createdBy: 'legal_team',
        translations: {
          'hi': { name: 'कानूनी और नियामक अनुपालन', description: 'कानूनी दायित्वों और नियामक आवश्यकताओं को पूरा करना', language: 'hi' },
          'en': { name: 'Legal & Regulatory Compliance', description: 'Meeting legal obligations and regulatory requirements', language: 'en' }
        }
      }
    ]
  };

  const handleConsentChange = (purposeId: string, status: ConsentStatus) => {
    setConsentChoices(prev => ({
      ...prev,
      [purposeId]: status
    }));
  };

  const toggleDetails = (purposeId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [purposeId]: !prev[purposeId]
    }));
  };

  const handleMinorVerification = async () => {
    if (!onMinorVerification) return;
    
    setIsSubmitting(true);
    try {
      const verified = await onMinorVerification(parentGuardianId, digiLockerToken);
      setMinorVerified(verified);
      if (verified) {
        setCurrentStep('consent');
      }
    } catch (error) {
      console.error('Minor verification failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitConsents = () => {
    setIsSubmitting(true);
    
    const consentRecords: ConsentRecord[] = Object.entries(consentChoices).map(([purposeId, status]) => ({
      id: `consent_${Date.now()}_${purposeId}`,
      userId,
      purposeId,
      categoryId: 'default_category',
      status,
      timestamp: new Date(),
      ipAddress: '127.0.0.1', // This would be captured from the request
      sessionId: `session_${Date.now()}`,
      language,
      isMinor,
      parentGuardianId: isMinor ? parentGuardianId : undefined,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      lastUpdated: new Date(),
      version: '1.0',
      metadata: {
        userAgent: navigator.userAgent,
        consentVersion: '1.0',
        processingBasis: 'consent',
        retentionPeriod: 'varies_by_purpose',
        consentMethod: 'click'
      }
    }));

    setTimeout(() => {
      onConsentSubmit(consentRecords);
      setCurrentStep('submitted');
      setIsSubmitting(false);
    }, 2000);
  };

  const getCategoryIcon = (category: PurposeCategory) => {
    switch (category) {
      case PurposeCategory.ACCOUNT_MANAGEMENT: return <Users className="h-5 w-5" />;
      case PurposeCategory.SERVICE_DELIVERY: return <Shield className="h-5 w-5" />;
      case PurposeCategory.MARKETING: return <Globe className="h-5 w-5" />;
      case PurposeCategory.ANALYTICS: return <Eye className="h-5 w-5" />;
      case PurposeCategory.PERSONALIZATION: return <Users className="h-5 w-5" />;
      case PurposeCategory.SECURITY: return <Lock className="h-5 w-5" />;
      case PurposeCategory.CUSTOMER_SUPPORT: return <Users className="h-5 w-5" />;
      case PurposeCategory.LEGAL_COMPLIANCE: return <FileText className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getSensitivityBadge = (dataTypes: string[]) => {
    const hasSensitive = dataTypes.some(type => 
      type.toLowerCase().includes('financial') || 
      type.toLowerCase().includes('health') || 
      type.toLowerCase().includes('biometric')
    );
    
    if (hasSensitive) {
      return <Badge variant="destructive" className="text-xs">Sensitive Data</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">Personal Data</Badge>;
  };

  // Minor verification screen
  if (isMinor && !minorVerified && currentStep === 'consent') {
    setCurrentStep('verification');
  }

  if (currentStep === 'verification') {
    return (
      <ParentAuthenticationUI
        minorName="Demo Minor User"
        minorEmail="minor@example.com"
        minorAge={16}
        onDigiLockerVerification={(verificationData) => {
          console.log('DigiLocker verification:', verificationData);
          setMinorVerified(true);
          setCurrentStep('consent');
        }}
        onManualSubmission={(submissionData) => {
          console.log('Manual submission:', submissionData);
          // In a real implementation, this would trigger the DPO approval workflow
          alert('Manual consent submitted for DPO approval. You will be notified once reviewed.');
          setCurrentStep('consent');
        }}
        onCancel={() => {
          setCurrentStep('consent');
        }}
        isLoading={isSubmitting}
      />
    );
  }

  // Success screen
  if (currentStep === 'submitted') {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Consent Preferences Recorded</h2>
          <p className="text-slate-600 mb-6">
            Your granular consent preferences have been securely recorded in compliance with DPDP Act 2023.
            You can modify these preferences at any time from your account dashboard.
          </p>
          {isMinor && (
            <Alert className="mb-6 text-left">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Minor Consent Recorded:</strong> Parent/guardian verification completed successfully. 
                All processing will be conducted in accordance with your consent choices.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  // Main consent collection interface
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Privacy Notice Header */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Granular Consent Management - DPDP Act 2023
            </span>
          </CardTitle>
          <CardDescription className="text-slate-600">
            Please review each processing purpose carefully and provide your explicit consent. 
            You have granular control over each purpose and can modify these choices at any time.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Your Rights:</strong> Withdraw consent anytime • Request data deletion • Access your data • File grievances
              {isMinor && <span className="block mt-1"><strong>Minor Protection:</strong> Parent/guardian verification completed via DigiLocker</span>}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Purpose Categories */}
      {Object.entries(purposeCategories).map(([category, purposes]) => (
        <Card key={category} className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
            <CardTitle className="flex items-center space-x-3 text-lg">
              {getCategoryIcon(category as PurposeCategory)}
              <span className="capitalize">{category.replace('_', ' ')}</span>
              <Badge variant="outline" className="ml-auto">
                {purposes.length} Purpose{purposes.length !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {purposes.map((purpose) => (
                <div key={purpose.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {purpose.translations[language]?.name || purpose.name}
                        </h3>
                        {purpose.isEssential && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            <Lock className="w-3 h-3 mr-1" />
                            Essential
                          </Badge>
                        )}
                        {getSensitivityBadge(purpose.dataTypes)}
                      </div>
                      <p className="text-slate-600 mb-3">
                        {purpose.translations[language]?.description || purpose.description}
                      </p>
                      
                      {/* Consent Controls */}
                      <div className="flex items-center space-x-6 mb-3">
                        {purpose.isEssential ? (
                          <div className="flex items-center space-x-2">
                            <Checkbox checked={true} disabled className="bg-blue-100 border-blue-300" />
                            <Label className="text-sm text-slate-700">
                              Required for service delivery (cannot be disabled)
                            </Label>
                          </div>
                        ) : (
                          <RadioGroup
                            value={consentChoices[purpose.id] || ''}
                            onValueChange={(value) => handleConsentChange(purpose.id, value as ConsentStatus)}
                            className="flex space-x-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={ConsentStatus.GRANTED} id={`${purpose.id}-grant`} />
                              <Label htmlFor={`${purpose.id}-grant`} className="text-sm font-medium text-green-700">
                                I consent
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={ConsentStatus.DENIED} id={`${purpose.id}-deny`} />
                              <Label htmlFor={`${purpose.id}-deny`} className="text-sm font-medium text-red-700">
                                I do not consent
                              </Label>
                            </div>
                          </RadioGroup>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleDetails(purpose.id)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        {showDetails[purpose.id] ? 'Hide Details' : 'Show Details'}
                      </Button>
                    </div>
                  </div>

                  {/* Detailed Information */}
                  {showDetails[purpose.id] && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong className="text-slate-700">Legal Basis:</strong>
                          <p className="text-slate-600 mt-1">{purpose.legalBasis}</p>
                        </div>
                        <div>
                          <strong className="text-slate-700">Data Retention:</strong>
                          <p className="text-slate-600 mt-1">{purpose.retentionPeriod}</p>
                        </div>
                        <div className="md:col-span-2">
                          <strong className="text-slate-700">Data Types Processed:</strong>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {purpose.dataTypes.map((dataType, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {dataType}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Submit Section */}
      <Card className="border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Review Your Choices</h3>
              <p className="text-slate-600">
                You have made choices for {Object.keys(consentChoices).length} processing purposes.
                {isMinor && ' Parent/guardian verification completed via DigiLocker.'}
              </p>
            </div>
            <Button
              onClick={handleSubmitConsents}
              disabled={isSubmitting || Object.keys(consentChoices).length === 0}
              className="px-8 py-3 text-lg"
            >
              {isSubmitting ? 'Processing Consent...' : 'Submit Consent Preferences'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GranularConsentManager; 