import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Globe, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Clock, 
  Eye,
  Lock,
  User,
  UserCheck,
  Languages,
  Smartphone,
  MessageSquare,
  Mail,
  Settings,
  BarChart3,
  Heart,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { 
  ProcessingPurpose, 
  ConsentRecord, 
  ConsentStatus, 
  User as UserType,
  ConsentNoticeGeneration,
  GeneratedNotice,
  EventType,
  ConsentArtifact,
  PurposeTag,
  ConsentDecision,
  ConsentArtifactMetadata,
  IntegrityVerification,
  PurposeCategory
} from '@/types/dpdp';
import EnhancedDynamicNoticeGenerator from '@/components/Consent/EnhancedDynamicNoticeGenerator';

interface ConsentCollectionFlowProps {
  dataFiduciaryId: string;
  dataFiduciaryName: string;
  dataFiduciaryDescription: string;
  onConsentGranted: (consent: ConsentRecord) => void;
  onConsentDenied: (reason: string) => void;
  userId?: string;
  isMinor?: boolean;
}

// Comprehensive processing purposes with categories
const PROCESSING_PURPOSES: ProcessingPurpose[] = [
  {
    id: 'account_management',
    name: 'Account Management',
    category: PurposeCategory.ACCOUNT_MANAGEMENT,
    isEssential: true,
    description: 'Creating and managing your account, authentication, and basic service delivery',
    retentionPeriod: 'Until account deletion',
    legalBasis: 'Legitimate interest for service delivery',
    dataTypes: ['Name', 'Email', 'Phone'],
    isActive: true,
    createdBy: 'system',
    translations: {
      hindi: { name: 'खाता प्रबंधन', description: 'आपका खाता बनाना और प्रबंधित करना', language: 'hindi' },
      bengali: { name: 'অ্যাকাউন্ট ব্যবস্থাপনা', description: 'আপনার অ্যাকাউন্ট তৈরি এবং পরিচালনা', language: 'bengali' },
      tamil: { name: 'கணக்கு மேலாண்மை', description: 'உங்கள் கணக்கை உருவாக்குதல் மற்றும் நிர்வகித்தல்', language: 'tamil' }
    }
  },
  {
    id: 'service_delivery',
    name: 'Service Delivery',
    category: PurposeCategory.SERVICE_DELIVERY,
    isEssential: true,
    description: 'Providing core services, processing transactions, and fulfilling service requests',
    dataCategories: ['Transaction data', 'Service usage data', 'Communication records'],
    retentionPeriod: '7 years (regulatory requirement)',
    legalBasis: 'Contract performance',
    dataTypes: ['Transaction data', 'Service usage data', 'Communication records'],
    isActive: true,
    createdBy: 'system',
    translations: {
      hindi: { name: 'सेवा वितरण', description: 'मुख्य सेवाएं प्रदान करना और लेनदेन संसाधित करना', language: 'hindi' },
      bengali: { name: 'সেবা প্রদান', description: 'মূল সেবা প্রদান এবং লেনদেন প্রক্রিয়াকরণ', language: 'bengali' },
      tamil: { name: 'சேவை வழங்கல்', description: 'முக்கிய சேவைகள் வழங்குதல் மற்றும் பரிவர்த்தனை செயலாக்கம்', language: 'tamil' }
    }
  },
  {
    id: 'marketing_communications',
    name: 'Marketing Communications',
    category: PurposeCategory.MARKETING,
    isEssential: false,
    description: 'Sending promotional emails, SMS, and personalized offers based on your preferences',
    dataCategories: ['Contact information', 'Preference data', 'Interaction history'],
    retentionPeriod: '3 years or until withdrawal',
    legalBasis: 'Explicit consent',
    dataTypes: ['Email', 'Preferences'],
    isActive: true,
    createdBy: 'system',
    translations: {
      hindi: { name: 'विपणन संचार', description: 'प्रचारक ईमेल और व्यक्तिगत ऑफर भेजना', language: 'hindi' },
      bengali: { name: 'বিপণন যোগাযোগ', description: 'প্রচারমূলক ইমেইল এবং ব্যক্তিগত অফার পাঠানো' },
      tamil: { name: 'சந்தைப்படுத்தல் தகவல்தொடர்பு', description: 'விளம்பர மின்னஞ்சல் மற்றும் தனிப்பட்ட சலுகைகள் அனுப்புதல்' }
    }
  },
  {
    id: 'usage_analytics',
    name: 'Usage Analytics',
    category: 'ANALYTICS',
    isEssential: false,
    description: 'Analyzing how you use our services to improve functionality and user experience',
    dataCategories: ['Usage patterns', 'Device information', 'Performance metrics'],
    retentionPeriod: '2 years',
    legalBasis: 'Legitimate interest for service improvement',
    translations: {
      hindi: { name: 'उपयोग विश्लेषण', description: 'सेवा सुधार के लिए उपयोग पैटर्न का विश्लेषण' },
      bengali: { name: 'ব্যবহার বিশ্লেষণ', description: 'সেবা উন্নতির জন্য ব্যবহারের ধরন বিশ্লেষণ' },
      tamil: { name: 'பயன்பாட்டு பகுப்பாய்வு', description: 'சேவை மேம்பாட்டிற்காக பயன்பாட்டு முறைகளை பகுப்பாய்வு செய்தல்' }
    }
  },
  {
    id: 'personalization',
    name: 'Personalization',
    category: 'PERSONALIZATION',
    isEssential: false,
    description: 'Customizing content and recommendations based on your preferences and behavior',
    dataCategories: ['Preference data', 'Behavioral data', 'Interaction history'],
    retentionPeriod: '2 years or until withdrawal',
    legalBasis: 'Explicit consent',
    translations: {
      hindi: { name: 'व्यक्तिगतकरण', description: 'आपकी प्राथमिकताओं के आधार पर सामग्री को अनुकूलित करना' },
      bengali: { name: 'ব্যক্তিগতকরণ', description: 'আপনার পছন্দের ভিত্তিতে কন্টেন্ট কাস্টমাইজ করা' },
      tamil: { name: 'தனிப்பயனாக்கம்', description: 'உங்கள் விருப்பங்களின் அடிப்படையில் உள்ளடக்கத்தை தனிப்பயனாக்குதல்' }
    }
  },
  {
    id: 'security_monitoring',
    name: 'Security Monitoring',
    category: 'SECURITY',
    isEssential: true,
    description: 'Monitoring for fraud, security threats, and ensuring account safety',
    dataCategories: ['Access logs', 'Device fingerprints', 'Security events'],
    retentionPeriod: '5 years (security requirement)',
    legalBasis: 'Legitimate interest for security',
    translations: {
      hindi: { name: 'सुरक्षा निगरानी', description: 'धोखाधड़ी और सुरक्षा खतरों की निगरानी' },
      bengali: { name: 'নিরাপত্তা পর্যবেক্ষণ', description: 'জালিয়াতি এবং নিরাপত্তা হুমকি পর্যবেক্ষণ' },
      tamil: { name: 'பாதுகாப்பு கண்காணிப்பு', description: 'மோசடி மற்றும் பாதுகாப்பு அச்சுறுத்தல்களை கண்காணித்தல்' }
    }
  },
  {
    id: 'customer_support',
    name: 'Customer Support',
    category: 'CUSTOMER_SUPPORT',
    isEssential: false,
    description: 'Providing customer service, handling queries, and resolving issues',
    dataCategories: ['Communication records', 'Support tickets', 'Interaction history'],
    retentionPeriod: '3 years',
    legalBasis: 'Legitimate interest for customer service',
    translations: {
      hindi: { name: 'ग्राहक सहायता', description: 'ग्राहक सेवा प्रदान करना और समस्याओं का समाधान' },
      bengali: { name: 'গ্রাহক সহায়তা', description: 'গ্রাহক সেবা প্রদান এবং সমস্যার সমাধান' },
      tamil: { name: 'வாடிக்கையாளர் ஆதரவு', description: 'வாடிக்கையாளர் சேவை வழங்குதல் மற்றும் சிக்கல்களை தீர்த்தல்' }
    }
  },
  {
    id: 'legal_compliance',
    name: 'Legal Compliance',
    category: 'LEGAL_COMPLIANCE',
    isEssential: true,
    description: 'Meeting regulatory requirements, tax obligations, and legal mandates',
    dataCategories: ['Identity verification', 'Financial records', 'Compliance data'],
    retentionPeriod: '7 years (regulatory requirement)',
    legalBasis: 'Legal obligation',
    translations: {
      hindi: { name: 'कानूनी अनुपालन', description: 'नियामक आवश्यकताओं और कानूनी दायित्वों को पूरा करना' },
      bengali: { name: 'আইনি সম্মতি', description: 'নিয়ামক প্রয়োজনীয়তা এবং আইনি বাধ্যবাধকতা পূরণ' },
      tamil: { name: 'சட்ட இணக்கம்', description: 'ஒழுங்குமுறை தேவைகள் மற்றும் சட்ட கட்டாயங்களை பூர்த்தி செய்தல்' }
    }
  }
];

const SUPPORTED_LANGUAGES = [
  { code: 'english', name: 'English', nativeName: 'English' },
  { code: 'hindi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'bengali', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'tamil', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'telugu', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'marathi', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gujarati', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ' }
];

export default function ConsentCollectionFlow({
  dataFiduciaryId,
  dataFiduciaryName,
  dataFiduciaryDescription,
  onConsentGranted,
  onConsentDenied,
  userId = 'demo_user',
  isMinor = false
}: ConsentCollectionFlowProps) {
  const [currentStep, setCurrentStep] = useState(0); // Start with notice generation
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [consentChoices, setConsentChoices] = useState<Record<string, boolean>>({});
  const [minorVerification, setMinorVerification] = useState({
    parentGuardianName: '',
    parentGuardianEmail: '',
    digiLockerVerified: false
  });
  const [noticeGeneration, setNoticeGeneration] = useState<ConsentNoticeGeneration | null>(null);
  const [generatedNotice, setGeneratedNotice] = useState<GeneratedNotice | null>(null);
  const [showNoticeGenerator, setShowNoticeGenerator] = useState(true);
  const [showMinorDialog, setShowMinorDialog] = useState(false);
  const [consentArtifact, setConsentArtifact] = useState<ConsentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initialChoices: Record<string, boolean> = {};
    PROCESSING_PURPOSES.forEach(purpose => {
      initialChoices[purpose.id] = false;
    });
    setConsentChoices(initialChoices);
  }, []);

  const getPurposeIcon = (category: string) => {
    switch (category) {
      case 'ESSENTIAL': return <ShieldCheck className="h-5 w-5 text-blue-600" />;
      case 'MARKETING': return <Mail className="h-5 w-5 text-purple-600" />;
      case 'ANALYTICS': return <BarChart3 className="h-5 w-5 text-green-600" />;
      case 'PERSONALIZATION': return <Heart className="h-5 w-5 text-pink-600" />;
      case 'SECURITY': return <Shield className="h-5 w-5 text-red-600" />;
      default: return <Settings className="h-5 w-5 text-gray-600" />;
    }
  };

  const createConsentArtifact = (): ConsentRecord => {
    const selectedPurposes = PROCESSING_PURPOSES.filter(p => consentChoices[p.id]);
    
    return {
      id: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      dataFiduciaryId,
      dataFiduciaryName,
      purposes: selectedPurposes,
      status: ConsentStatus.GRANTED,
      grantedAt: new Date(),
      expiresAt: new Date(Date.now() + (6 * 30 * 24 * 60 * 60 * 1000)),
      language: selectedLanguage,
      consentMethod: 'explicit_click',
      ipAddress: '192.168.1.100',
      sessionId: `sess_${Date.now()}`,
      version: '1.0',
      metadata: {
        userAgent: navigator.userAgent,
        deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        location: 'India'
      }
    };
  };

  const handleNoticeGenerated = (generation: ConsentNoticeGeneration) => {
    setNoticeGeneration(generation);
    setGeneratedNotice(generation.generatedNotice);
  };

  const handleConsentRequired = (notice: GeneratedNotice) => {
    setGeneratedNotice(notice);
    setShowNoticeGenerator(false);
    setCurrentStep(1); // Move to notice presentation
  };

  const handleConsentSubmission = async () => {
    setIsLoading(true);
    const artifact = createConsentArtifact();
    setConsentArtifact(artifact);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCurrentStep(isMinor ? 5 : 4);
    setTimeout(() => onConsentGranted(artifact), 2000);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Data Consent Collection</h1>
          </div>
          <p className="text-gray-600 text-lg">{dataFiduciaryName}</p>
          <p className="text-gray-500">{dataFiduciaryDescription}</p>
        </div>

        <div className="mb-8">
          <Progress value={(currentStep / (isMinor ? 5 : 4)) * 100} className="h-2" />
        </div>

        {/* Step 0: Enhanced Dynamic Notice Generation */}
        {currentStep === 0 && showNoticeGenerator && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notice Generation & Administrative Setup
              </CardTitle>
              <CardDescription>
                BRD-compliant notice generation with template configuration and purpose mapping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedDynamicNoticeGenerator
                userId={userId}
                dataFiduciaryId={dataFiduciaryId}
                serviceType="financial_services"
                userLanguage={selectedLanguage}
                triggerEvent={EventType.USER_REGISTRATION}
                onNoticeGenerated={handleNoticeGenerated}
                onConsentRequired={handleConsentRequired}
              />
            </CardContent>
          </Card>
        )}

        {/* Step 1: Generated Notice Presentation */}
        {currentStep === 1 && generatedNotice && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Data Processing Consent Notice
              </CardTitle>
              <CardDescription>
                Generated Notice with Purpose IDs: {generatedNotice.purposeIds.join(', ')} | 
                Language: {generatedNotice.language} | Hash: {generatedNotice.hash}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <pre className="whitespace-pre-wrap text-sm">{generatedNotice.content}</pre>
                </div>
                
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    This notice has been dynamically generated based on your service request and 
                    includes purpose-specific consent requirements with unique Purpose IDs.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <p><strong>Notice Version:</strong> {generatedNotice.hash}</p>
                    <p><strong>Generated:</strong> {generatedNotice.effectiveDate.toLocaleString()}</p>
                    <p><strong>Language:</strong> {generatedNotice.language}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => onConsentDenied('User rejected notice')}>
                      Decline
                    </Button>
                    <Button onClick={() => setCurrentStep(2)}>
                      Proceed to Consent
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Language Selection */}
        {currentStep === 2 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Choose Your Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {['English', 'हिंदी', 'বাংলা', 'தமிழ்'].map(lang => (
                  <Button
                    key={lang}
                    variant={selectedLanguage === lang.toLowerCase() ? "default" : "outline"}
                    onClick={() => setSelectedLanguage(lang.toLowerCase())}
                  >
                    {lang}
                  </Button>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={() => setCurrentStep(3)}>Continue</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Consent Purposes */}
        {currentStep === 3 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Consent Purposes</CardTitle>
              <CardDescription>
                Please select the purposes for which you consent to data processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PROCESSING_PURPOSES.map(purpose => (
                  <div key={purpose.id} className={`border rounded-lg p-4 ${
                    purpose.isEssential ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getPurposeIcon(purpose.category)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{purpose.name}</h3>
                          {purpose.isEssential && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              Essential
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{purpose.description}</p>
                      </div>
                      <Switch
                        checked={consentChoices[purpose.id] || false}
                        onCheckedChange={(checked) => {
                          setConsentChoices(prev => ({ ...prev, [purpose.id]: checked }));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
                <Button onClick={() => isMinor ? setShowMinorDialog(true) : setCurrentStep(4)}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && !isMinor && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Confirm Your Consent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    By clicking "Grant Consent", you provide explicit consent for the selected purposes.
                  </AlertDescription>
                </Alert>
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>Back</Button>
                <Button onClick={handleConsentSubmission} disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Grant Consent'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Success */}
        {(currentStep === 5) && consentArtifact && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Consent Successfully Granted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Consent Artifact Created: {consentArtifact.id}
                </AlertDescription>
              </Alert>
              <div className="flex justify-center mt-6">
                <Button onClick={() => window.location.reload()}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Minor Verification Dialog */}
        <Dialog open={showMinorDialog} onOpenChange={setShowMinorDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Parent/Guardian Verification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Parent/Guardian Name"
                value={minorVerification.parentGuardianName}
                onChange={(e) => setMinorVerification(prev => ({ 
                  ...prev, parentGuardianName: e.target.value 
                }))}
              />
              <Input
                type="email"
                placeholder="Parent Email"
                value={minorVerification.parentGuardianEmail}
                onChange={(e) => setMinorVerification(prev => ({ 
                  ...prev, parentGuardianEmail: e.target.value 
                }))}
              />
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowMinorDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setMinorVerification(prev => ({ ...prev, digiLockerVerified: true }));
                  setShowMinorDialog(false);
                  setCurrentStep(5);
                }}>
                  Verify with DigiLocker
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 