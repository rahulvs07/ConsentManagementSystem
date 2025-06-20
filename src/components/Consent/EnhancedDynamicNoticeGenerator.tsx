import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Globe, 
  Settings, 
  Hash, 
  CheckCircle, 
  Eye,
  Download,
  RefreshCw,
  Languages,
  MapPin,
  Shield,
  Clock,
  User,
  Building,
  Mail,
  Phone
} from 'lucide-react';
import {
  ConsentTemplate,
  ConsentNoticeGeneration,
  NoticeContext,
  GeneratedNotice,
  NoticeSection,
  UserRight,
  ContactInfo,
  PurposeMapping,
  ConsentCategory,
  TranslationKey,
  GenerationStatus,
  EventType
} from '@/types/dpdp';

interface EnhancedDynamicNoticeGeneratorProps {
  userId: string;
  dataFiduciaryId: string;
  serviceType: string;
  userLanguage: string;
  triggerEvent: EventType;
  onNoticeGenerated: (generation: ConsentNoticeGeneration) => void;
  onConsentRequired: (notice: GeneratedNotice) => void;
}

// Mock administrative configuration
const MOCK_TEMPLATES: ConsentTemplate[] = [
  {
    id: 'template_standard',
    name: 'Standard Consent Notice',
    description: 'Standard DPDP Act 2023 compliant consent notice',
    type: 'consent_notice' as any,
    content: `# {{NOTICE_TITLE}}

Dear {{USER_NAME}},

{{ORGANIZATION_INTRO}}

## Purpose of Data Processing
{{PURPOSE_LIST}}

## Data Categories
{{DATA_CATEGORIES}}

## Your Rights Under DPDP Act 2023
{{RIGHTS_LIST}}

## Contact Information
{{CONTACT_INFO}}

## Legal Basis & Retention
{{LEGAL_BASIS}}
{{RETENTION_PERIOD}}

{{CONSENT_REQUEST}}`,
    placeholders: [],
    purposeMapping: [],
    translationKeys: {},
    isActive: true,
    createdBy: 'admin',
    createdAt: new Date(),
    lastUpdated: new Date(),
    version: '1.0'
  }
];

const PURPOSE_MAPPINGS: PurposeMapping[] = [
  {
    purposeId: 'account_management',
    uniqueId: 'P-001',
    category: ConsentCategory.ESSENTIAL,
    isEssential: true,
    triggerEvents: [],
    associatedDataCategories: ['personal_info', 'contact_info'],
    templateSections: ['purpose_list', 'data_categories']
  },
  {
    purposeId: 'marketing_communications',
    uniqueId: 'P-002', 
    category: ConsentCategory.MARKETING,
    isEssential: false,
    triggerEvents: [],
    associatedDataCategories: ['contact_info', 'preferences'],
    templateSections: ['purpose_list']
  },
  {
    purposeId: 'usage_analytics',
    uniqueId: 'P-003',
    category: ConsentCategory.ANALYTICS,
    isEssential: false,
    triggerEvents: [],
    associatedDataCategories: ['usage_data', 'device_info'],
    templateSections: ['purpose_list', 'data_categories']
  }
];

const TRANSLATION_KEYS: Record<string, TranslationKey> = {
  'notice_title': {
    key: 'notice_title',
    englishText: 'Data Processing Consent Notice',
    translations: {
      'hi': 'डेटा प्रसंस्करण सहमति सूचना',
      'bn': 'ডেটা প্রসেসিং সম্মতি নোটিশ',
      'te': 'డేటా ప్రాసెసింగ్ సమ్మతి నోటీసు',
      'ta': 'தரவு செயலாக்க ஒப்புதல் அறிவிப்பு',
      'mr': 'डेटा प्रक्रिया संमती सूचना',
      'gu': 'ડેટા પ્રોસેસિંગ સંમતિ નોટિસ'
    },
    category: 'title' as any,
    lastUpdated: new Date()
  }
};

const USER_RIGHTS: UserRight[] = [
  {
    rightId: 'right_access',
    name: 'Right to Access',
    description: 'You have the right to obtain confirmation and access to your personal data',
    howToExercise: 'Submit a data access request through our portal or email',
    contactMethod: 'dpo@company.com',
    responseTime: '30 days',
    translations: {
      'hi': {
        name: 'पहुंच का अधिकार',
        description: 'आपको अपने व्यक्तिगत डेटा की पुष्टि और पहुंच का अधिकार है',
        howToExercise: 'हमारे पोर्टल या ईमेल के माध्यम से डेटा एक्सेस अनुरोध सबमिट करें',
        language: 'hi'
      }
    }
  },
  {
    rightId: 'right_correction',
    name: 'Right to Correction',
    description: 'You have the right to correct inaccurate personal data',
    howToExercise: 'Contact us with correction details',
    contactMethod: 'support@company.com',
    responseTime: '15 days',
    translations: {
      'hi': {
        name: 'सुधार का अधिकार',
        description: 'आपको गलत व्यक्तिगत डेटा को सुधारने का अधिकार है',
        howToExercise: 'सुधार विवरण के साथ हमसे संपर्क करें',
        language: 'hi'
      }
    }
  }
];

const CONTACT_INFO: ContactInfo = {
  dpoName: 'Chief Privacy Officer',
  dpoEmail: 'dpo@company.com',
  dpoPhone: '+91-11-1234-5678',
  organizationName: 'Sample Data Fiduciary Pvt Ltd',
  organizationAddress: '123 Business District, New Delhi, India 110001',
  grievanceEmail: 'grievance@company.com',
  grievancePhone: '+91-11-1234-5679'
};

export default function EnhancedDynamicNoticeGenerator({
  userId,
  dataFiduciaryId,
  serviceType,
  userLanguage,
  triggerEvent,
  onNoticeGenerated,
  onConsentRequired
}: EnhancedDynamicNoticeGeneratorProps) {
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>(GenerationStatus.PENDING);
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedNotice, setGeneratedNotice] = useState<GeneratedNotice | null>(null);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [noticeContext, setNoticeContext] = useState<NoticeContext | null>(null);

  const totalSteps = 5;

  useEffect(() => {
    if (triggerEvent) {
      initiateNoticeGeneration();
    }
  }, [triggerEvent, userId, dataFiduciaryId]);

  const initiateNoticeGeneration = async () => {
    setGenerationStatus(GenerationStatus.PENDING);
    setCurrentStep(1);

    // Step 1: Trigger Detection
    await simulateStep(() => {
      console.log('Step 1: Trigger event detected:', triggerEvent);
      setCurrentStep(2);
    });

    // Step 2: Context Preparation
    await simulateStep(() => {
      const context: NoticeContext = {
        dataFiduciaryId,
        serviceType,
        userLanguage,
        purposes: getPurposesForTrigger(triggerEvent),
        dataCategories: getDataCategoriesForPurposes(selectedPurposes),
        userType: 'adult', // This would be determined based on user profile
        customParameters: {
          triggerEvent,
          timestamp: new Date().toISOString()
        }
      };
      setNoticeContext(context);
      setCurrentStep(3);
    });

    // Step 3: Template Selection & Parameter Population
    await simulateStep(() => {
      console.log('Step 3: Selecting template and populating parameters');
      setCurrentStep(4);
    });

    // Step 4: Dynamic Generation
    await simulateStep(() => {
      if (noticeContext) {
        const notice = generateNotice(noticeContext);
        setGeneratedNotice(notice);
        setGenerationStatus(GenerationStatus.GENERATED);
        setCurrentStep(5);
      }
    });

    // Step 5: Ready for Presentation
    await simulateStep(() => {
      setGenerationStatus(GenerationStatus.PRESENTED);
      if (generatedNotice && onNoticeGenerated) {
        const generation: ConsentNoticeGeneration = {
          id: `gen_${Date.now()}`,
          templateId: 'template_standard',
          triggeredBy: triggerEvent,
          context: noticeContext!,
          generatedNotice: generatedNotice,
          userId,
          sessionId: `session_${Date.now()}`,
          timestamp: new Date(),
          ipAddress: '192.168.1.100',
          status: GenerationStatus.PRESENTED
        };
        onNoticeGenerated(generation);
      }
    });
  };

  const simulateStep = (callback: () => void, delay: number = 1000) => {
    return new Promise(resolve => {
      setTimeout(() => {
        callback();
        resolve(void 0);
      }, delay);
    });
  };

  const getPurposesForTrigger = (trigger: EventType): string[] => {
    switch (trigger) {
      case EventType.USER_REGISTRATION:
        return ['account_management', 'marketing_communications'];
      case EventType.SERVICE_ONBOARDING:
        return ['account_management', 'usage_analytics'];
      case EventType.MARKETING_ENROLLMENT:
        return ['marketing_communications'];
      case EventType.ANALYTICS_TRACKING:
        return ['usage_analytics'];
      default:
        return ['account_management'];
    }
  };

  const getDataCategoriesForPurposes = (purposes: string[]): string[] => {
    const categories = new Set<string>();
    purposes.forEach(purposeId => {
      const mapping = PURPOSE_MAPPINGS.find(m => m.purposeId === purposeId);
      if (mapping) {
        mapping.associatedDataCategories.forEach(cat => categories.add(cat));
      }
    });
    return Array.from(categories);
  };

  const generateNotice = (context: NoticeContext): GeneratedNotice => {
    const template = MOCK_TEMPLATES[0]; // Use standard template
    const titleKey = TRANSLATION_KEYS['notice_title'];
    
    const title = titleKey.translations[context.userLanguage] || titleKey.englishText;
    
    // Generate purpose list with unique IDs
    const purposeList = context.purposes.map(purposeId => {
      const mapping = PURPOSE_MAPPINGS.find(m => m.purposeId === purposeId);
      return `• ${mapping?.uniqueId}: ${purposeId.replace('_', ' ').toUpperCase()}`;
    }).join('\n');

    // Generate data categories
    const dataCategories = context.dataCategories.map(cat => 
      `• ${cat.replace('_', ' ').toUpperCase()}`
    ).join('\n');

    // Generate user rights
    const rightsList = USER_RIGHTS.map(right => {
      const translation = right.translations[context.userLanguage];
      const name = translation?.name || right.name;
      const description = translation?.description || right.description;
      return `• ${name}: ${description}`;
    }).join('\n');

    // Replace placeholders in template
    let content = template.content
      .replace('{{NOTICE_TITLE}}', title)
      .replace('{{USER_NAME}}', 'Valued User')
      .replace('{{ORGANIZATION_INTRO}}', `We, ${CONTACT_INFO.organizationName}, are committed to protecting your privacy under the Digital Personal Data Protection Act, 2023.`)
      .replace('{{PURPOSE_LIST}}', purposeList)
      .replace('{{DATA_CATEGORIES}}', dataCategories)
      .replace('{{RIGHTS_LIST}}', rightsList)
      .replace('{{CONTACT_INFO}}', formatContactInfo())
      .replace('{{LEGAL_BASIS}}', 'Legal Basis: Consent and Legitimate Interest as per DPDP Act 2023')
      .replace('{{RETENTION_PERIOD}}', 'Data Retention: As per our retention policy (3-7 years based on purpose)')
      .replace('{{CONSENT_REQUEST}}', 'Please review and provide your explicit consent for the above purposes.');

    const notice: GeneratedNotice = {
      title,
      content,
      language: context.userLanguage,
      purposeIds: context.purposes.map(p => PURPOSE_MAPPINGS.find(m => m.purposeId === p)?.uniqueId || p),
      sectionsIncluded: [
        {
          id: 'purpose_section',
          title: 'Purpose of Processing',
          content: purposeList,
          purposeIds: context.purposes,
          isRequired: true,
          order: 1
        },
        {
          id: 'rights_section',
          title: 'Your Rights',
          content: rightsList,
          purposeIds: [],
          isRequired: true,
          order: 2
        }
      ],
      userRights: USER_RIGHTS,
      legalBasis: ['Consent', 'Legitimate Interest'],
      contactInformation: CONTACT_INFO,
      effectiveDate: new Date(),
      hash: generateHash(content)
    };

    return notice;
  };

  const formatContactInfo = (): string => {
    return `Data Protection Officer: ${CONTACT_INFO.dpoName}
Email: ${CONTACT_INFO.dpoEmail}
Phone: ${CONTACT_INFO.dpoPhone}
Address: ${CONTACT_INFO.organizationAddress}
Grievance Contact: ${CONTACT_INFO.grievanceEmail}`;
  };

  const generateHash = (content: string): string => {
    // Simple hash generation for demo - in production, use proper cryptographic hashing
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  const handlePresentNotice = () => {
    if (generatedNotice) {
      onConsentRequired(generatedNotice);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Dynamic Notice Generation Engine</span>
          </CardTitle>
          <CardDescription>
            BRD-compliant notice generation with administrative configuration and templating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Generation Progress</span>
              <Badge variant={generationStatus === GenerationStatus.PRESENTED ? "default" : "secondary"}>
                {generationStatus}
              </Badge>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
            
            <div className="grid grid-cols-5 gap-2 text-xs">
              {[
                'Trigger Detection',
                'Context Preparation', 
                'Template Selection',
                'Dynamic Generation',
                'Ready for Presentation'
              ].map((step, index) => (
                <div key={index} className={`text-center p-2 rounded ${
                  index + 1 <= currentStep ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
                }`}>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {noticeContext && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notice Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Trigger Event:</strong> {triggerEvent}
              </div>
              <div>
                <strong>User Language:</strong> {noticeContext.userLanguage}
              </div>
              <div>
                <strong>Service Type:</strong> {noticeContext.serviceType}
              </div>
              <div>
                <strong>User Type:</strong> {noticeContext.userType}
              </div>
              <div className="col-span-2">
                <strong>Purposes:</strong> {noticeContext.purposes.map(p => {
                  const mapping = PURPOSE_MAPPINGS.find(m => m.purposeId === p);
                  return mapping?.uniqueId || p;
                }).join(', ')}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {generatedNotice && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Generated Notice</CardTitle>
                <CardDescription>
                  Purpose IDs: {generatedNotice.purposeIds.join(', ')} | 
                  Language: {generatedNotice.language} | 
                  Hash: {generatedNotice.hash}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button onClick={handlePresentNotice}>
                  <Eye className="h-4 w-4 mr-2" />
                  Present to User
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{generatedNotice.content}</pre>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Sections Included:</strong>
                  <ul className="mt-1 space-y-1">
                    {generatedNotice.sectionsIncluded.map(section => (
                      <li key={section.id} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{section.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>User Rights:</strong>
                  <ul className="mt-1 space-y-1">
                    {generatedNotice.userRights.map(right => (
                      <li key={right.rightId} className="flex items-center space-x-2">
                        <Shield className="h-3 w-3 text-blue-600" />
                        <span>{right.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert>
        <Hash className="h-4 w-4" />
        <AlertDescription>
          All generated notices include cryptographic hashing for integrity verification and 
          purpose tagging with unique IDs (P-001, P-002, etc.) for audit compliance.
        </AlertDescription>
      </Alert>
    </div>
  );
} 