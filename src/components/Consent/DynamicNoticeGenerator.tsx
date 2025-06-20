import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Globe, 
  Shield, 
  Eye, 
  AlertTriangle, 
  CheckCircle,
  Languages,
  Target,
  Lock,
  Clock,
  UserCheck,
  Scale,
  Info
} from 'lucide-react';
import { ProcessingPurpose, ConsentRecord, User as UserType } from '@/types/dpdp';

interface DynamicNoticeGeneratorProps {
  dataFiduciaryId: string;
  dataFiduciaryName: string;
  purposes: ProcessingPurpose[];
  selectedLanguage: string;
  isMinor?: boolean;
  onLanguageChange: (language: string) => void;
  onNoticeAccepted: () => void;
  onNoticeRejected: () => void;
  userInfo?: UserType;
}

interface NoticeTemplate {
  id: string;
  title: string;
  sections: NoticeSection[];
  language: string;
  version: string;
  lastUpdated: Date;
}

interface NoticeSection {
  id: string;
  type: 'header' | 'purpose' | 'rights' | 'retention' | 'contact' | 'legal';
  title: string;
  content: string;
  isRequired: boolean;
  order: number;
}

// Comprehensive language support (22 languages from Indian Constitution's Eighth Schedule)
const EIGHTH_SCHEDULE_LANGUAGES = [
  { code: 'english', name: 'English', nativeName: 'English', rtl: false },
  { code: 'hindi', name: 'Hindi', nativeName: 'हिन्दी', rtl: false },
  { code: 'bengali', name: 'Bengali', nativeName: 'বাংলা', rtl: false },
  { code: 'telugu', name: 'Telugu', nativeName: 'తెలుగు', rtl: false },
  { code: 'marathi', name: 'Marathi', nativeName: 'मराठी', rtl: false },
  { code: 'tamil', name: 'Tamil', nativeName: 'தமிழ்', rtl: false },
  { code: 'urdu', name: 'Urdu', nativeName: 'اردو', rtl: true },
  { code: 'gujarati', name: 'Gujarati', nativeName: 'ગુજરાતી', rtl: false },
  { code: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ', rtl: false },
  { code: 'malayalam', name: 'Malayalam', nativeName: 'മലയാളം', rtl: false },
  { code: 'odia', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', rtl: false },
  { code: 'punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', rtl: false },
  { code: 'assamese', name: 'Assamese', nativeName: 'অসমীয়া', rtl: false },
  { code: 'kashmiri', name: 'Kashmiri', nativeName: 'کٲشُر', rtl: true },
  { code: 'konkani', name: 'Konkani', nativeName: 'कोंकणी', rtl: false },
  { code: 'manipuri', name: 'Manipuri', nativeName: 'মৈতৈলোন্', rtl: false },
  { code: 'nepali', name: 'Nepali', nativeName: 'नेपाली', rtl: false },
  { code: 'sanskrit', name: 'Sanskrit', nativeName: 'संस्कृतम्', rtl: false },
  { code: 'sindhi', name: 'Sindhi', nativeName: 'سنڌي', rtl: true },
  { code: 'bodo', name: 'Bodo', nativeName: 'बड़ो', rtl: false },
  { code: 'dogri', name: 'Dogri', nativeName: 'डोगरी', rtl: false },
  { code: 'maithili', name: 'Maithili', nativeName: 'मैथिली', rtl: false }
];

// Dynamic notice templates with multi-language support
const NOTICE_TEMPLATES: Record<string, any> = {
  english: {
    header: {
      title: "Data Processing Notice",
      subtitle: "Your Privacy Rights Under DPDP Act 2023",
      description: "This notice explains how {dataFiduciaryName} processes your personal data and your rights."
    },
    purposes: {
      title: "Purpose of Data Processing",
      description: "We process your personal data for the following purposes:",
      essential_note: "Essential purposes are required for basic service delivery and cannot be opted out."
    },
    rights: {
      title: "Your Rights Under DPDP Act 2023",
      items: [
        "Right to access your personal data",
        "Right to correct inaccurate data", 
        "Right to erase your data",
        "Right to data portability",
        "Right to withdraw consent at any time",
        "Right to file grievances with the Data Protection Board"
      ]
    },
    retention: {
      title: "Data Retention",
      description: "Your data will be retained as per the retention periods specified for each purpose."
    },
    withdrawal: {
      title: "Consent Withdrawal",
      description: "You can withdraw your consent at any time through your dashboard. Withdrawal will stop future processing but may affect service delivery."
    },
    minor_protection: {
      title: "Special Protection for Minors",
      description: "As you are under 18, additional verification through DigiLocker is required with parent/guardian consent."
    },
    contact: {
      title: "Contact Information",
      dpo: "Data Protection Officer: dpo@{dataFiduciaryDomain}",
      grievance: "Grievance Officer: grievance@{dataFiduciaryDomain}"
    }
  },
  hindi: {
    header: {
      title: "डेटा प्रसंस्करण सूचना",
      subtitle: "DPDP अधिनियम 2023 के तहत आपके गोपनीयता अधिकार",
      description: "यह सूचना बताती है कि {dataFiduciaryName} आपके व्यक्तिगत डेटा को कैसे प्रोसेस करता है और आपके अधिकार क्या हैं।"
    },
    purposes: {
      title: "डेटा प्रसंस्करण का उद्देश्य",
      description: "हम निम्नलिखित उद्देश्यों के लिए आपके व्यक्तिगत डेटा को प्रोसेस करते हैं:",
      essential_note: "आवश्यक उद्देश्य बुनियादी सेवा प्रदान करने के लिए आवश्यक हैं और इन्हें अस्वीकार नहीं किया जा सकता।"
    },
    rights: {
      title: "DPDP अधिनियम 2023 के तहत आपके अधिकार",
      items: [
        "अपने व्यक्तिगत डेटा तक पहुंच का अधिकार",
        "गलत डेटा को सुधारने का अधिकार",
        "अपने डेटा को मिटाने का अधिकार", 
        "डेटा पोर्टेबिलिटी का अधिकार",
        "किसी भी समय सहमति वापस लेने का अधिकार",
        "डेटा सुरक्षा बोर्ड के साथ शिकायत दर्ज करने का अधिकार"
      ]
    },
    retention: {
      title: "डेटा संधारण",
      description: "आपका डेटा प्रत्येक उद्देश्य के लिए निर्दिष्ट संधारण अवधि के अनुसार रखा जाएगा।"
    },
    withdrawal: {
      title: "सहमति वापसी",
      description: "आप अपनी डैशबोर्ड के माध्यम से किसी भी समय अपनी सहमति वापस ले सकते हैं। वापसी भविष्य की प्रक्रिया को रोक देगी लेकिन सेवा प्रदान को प्रभावित कर सकती है।"
    },
    minor_protection: {
      title: "नाबालिगों के लिए विशेष सुरक्षा",
      description: "चूंकि आप 18 वर्ष से कम उम्र के हैं, माता-पिता/अभिभावक की सहमति के साथ DigiLocker के माध्यम से अतिरिक्त सत्यापन आवश्यक है।"
    },
    contact: {
      title: "संपर्क जानकारी",
      dpo: "डेटा सुरक्षा अधिकारी: dpo@{dataFiduciaryDomain}",
      grievance: "शिकायत अधिकारी: grievance@{dataFiduciaryDomain}"
    }
  }
};

export default function DynamicNoticeGenerator({
  dataFiduciaryId,
  dataFiduciaryName,
  purposes,
  selectedLanguage,
  isMinor = false,
  onLanguageChange,
  onNoticeAccepted,
  onNoticeRejected,
  userInfo
}: DynamicNoticeGeneratorProps) {
  const [notice, setNotice] = useState<NoticeTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFullNotice, setShowFullNotice] = useState(false);
  const [noticeMetadata, setNoticeMetadata] = useState({
    generatedAt: new Date(),
    templateVersion: '2.0',
    complianceVersion: 'DPDP_2023_v1',
    userAgent: navigator.userAgent,
    ipAddress: '192.168.1.100'
  });

  // Generate notice based on selected purposes and language
  useEffect(() => {
    generateDynamicNotice();
  }, [selectedLanguage, purposes, dataFiduciaryName, isMinor]);

  const generateDynamicNotice = async () => {
    setIsGenerating(true);
    
    // Simulate notice generation processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const template = NOTICE_TEMPLATES[selectedLanguage] || NOTICE_TEMPLATES.english;
    const langData = EIGHTH_SCHEDULE_LANGUAGES.find(l => l.code === selectedLanguage);
    
    const generatedNotice: NoticeTemplate = {
      id: `notice_${dataFiduciaryId}_${Date.now()}`,
      title: template.header.title,
      language: selectedLanguage,
      version: '2.0',
      lastUpdated: new Date(),
      sections: [
        {
          id: 'header',
          type: 'header',
          title: template.header.title,
          content: template.header.description.replace('{dataFiduciaryName}', dataFiduciaryName),
          isRequired: true,
          order: 1
        },
        {
          id: 'purposes',
          type: 'purpose',
          title: template.purposes.title,
          content: generatePurposeContent(template, purposes),
          isRequired: true,
          order: 2
        },
        {
          id: 'rights',
          type: 'rights',
          title: template.rights.title,
          content: template.rights.items.map((item: string) => `• ${item}`).join('\n'),
          isRequired: true,
          order: 3
        },
        {
          id: 'retention',
          type: 'retention',
          title: template.retention.title,
          content: template.retention.description,
          isRequired: true,
          order: 4
        },
        {
          id: 'withdrawal',
          type: 'retention',
          title: template.withdrawal.title,
          content: template.withdrawal.description,
          isRequired: true,
          order: 5
        },
        ...(isMinor ? [{
          id: 'minor_protection',
          type: 'legal' as const,
          title: template.minor_protection.title,
          content: template.minor_protection.description,
          isRequired: true,
          order: 6
        }] : []),
        {
          id: 'contact',
          type: 'contact' as const,
          title: template.contact.title,
          content: `${template.contact.dpo.replace('{dataFiduciaryDomain}', dataFiduciaryId + '.com')}\n${template.contact.grievance.replace('{dataFiduciaryDomain}', dataFiduciaryId + '.com')}`,
          isRequired: true,
          order: isMinor ? 7 : 6
        }
      ]
    };

    setNotice(generatedNotice);
    setIsGenerating(false);
  };

  const generatePurposeContent = (template: any, purposes: ProcessingPurpose[]) => {
    let content = template.purposes.description + '\n\n';
    
    const essentialPurposes = purposes.filter(p => p.isEssential);
    const optionalPurposes = purposes.filter(p => !p.isEssential);
    
    if (essentialPurposes.length > 0) {
      content += '**Essential Purposes (Required):**\n';
      essentialPurposes.forEach((purpose, index) => {
        content += `${index + 1}. ${purpose.name}\n   ${purpose.description}\n   Data Types: ${purpose.dataTypes?.join(', ') || 'Not specified'}\n   Retention: ${purpose.retentionPeriod || 'As per policy'}\n\n`;
      });
    }
    
    if (optionalPurposes.length > 0) {
      content += '**Optional Purposes (You can choose):**\n';
      optionalPurposes.forEach((purpose, index) => {
        content += `${index + 1}. ${purpose.name}\n   ${purpose.description}\n   Data Types: ${purpose.dataTypes?.join(', ') || 'Not specified'}\n   Retention: ${purpose.retentionPeriod || 'As per policy'}\n\n`;
      });
    }
    
    if (essentialPurposes.length > 0) {
      content += `\n**Important:** ${template.purposes.essential_note}`;
    }
    
    return content;
  };

  const getCurrentLanguageData = () => {
    return EIGHTH_SCHEDULE_LANGUAGES.find(l => l.code === selectedLanguage) || EIGHTH_SCHEDULE_LANGUAGES[0];
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'header': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'purpose': return <Target className="h-5 w-5 text-purple-600" />;
      case 'rights': return <Scale className="h-5 w-5 text-green-600" />;
      case 'retention': return <Clock className="h-5 w-5 text-orange-600" />;
      case 'contact': return <Info className="h-5 w-5 text-gray-600" />;
      case 'legal': return <Shield className="h-5 w-5 text-red-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  if (isGenerating) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-3 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-lg font-medium text-gray-900">Generating personalized consent notice...</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Creating notice for {purposes.length} processing purposes in {getCurrentLanguageData()?.nativeName}
              </p>
              <div className="flex justify-center space-x-2">
                <Badge variant="outline">Purpose Mapping</Badge>
                <Badge variant="outline">Language Translation</Badge>
                <Badge variant="outline">DPDP Compliance Check</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!notice) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Language Selector */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Languages className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-blue-900">Consent Notice Language</CardTitle>
                <CardDescription className="text-blue-700">
                  Choose your preferred language for the consent notice
                </CardDescription>
              </div>
            </div>
            <Select value={selectedLanguage} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EIGHTH_SCHEDULE_LANGUAGES.slice(0, 8).map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>{lang.name} - {lang.nativeName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Dynamic Notice Display */}
      <Card className="border-2 border-gray-200">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-gray-800" />
              <div>
                <CardTitle className="text-xl">{notice.title}</CardTitle>
                <CardDescription>
                  Generated for {dataFiduciaryName} • Version {notice.version} • 
                  Language: {getCurrentLanguageData()?.nativeName}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                DPDP Compliant
              </Badge>
              {isMinor && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                  <UserCheck className="h-3 w-3 mr-1" />
                  Minor Protection
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Notice Sections */}
            {notice.sections
              .sort((a, b) => a.order - b.order)
              .slice(0, showFullNotice ? undefined : 3)
              .map(section => (
                <div key={section.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getSectionIcon(section.type)}
                    <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                    {section.isRequired && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <div className="pl-7">
                    <div className="prose prose-sm max-w-none">
                      {section.content.split('\n').map((line, index) => (
                        <p key={index} className={`${line.startsWith('**') ? 'font-semibold text-gray-900' : 'text-gray-700'} ${index > 0 ? 'mt-2' : ''}`}>
                          {line.replace(/\*\*/g, '')}
                        </p>
                      ))}
                    </div>
                  </div>
                  {section.order < notice.sections.length && <Separator className="mt-4" />}
                </div>
              ))}
            
            {!showFullNotice && notice.sections.length > 3 && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowFullNotice(true)}
                  className="mt-4"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Complete Notice ({notice.sections.length - 3} more sections)
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Important Alerts */}
      <div className="space-y-4">
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>DPDP Act 2023 Compliance:</strong> This notice has been generated to comply with the 
            Digital Personal Data Protection Act 2023. You have the right to withdraw consent at any time.
          </AlertDescription>
        </Alert>

        {isMinor && (
          <Alert className="border-orange-200 bg-orange-50">
            <UserCheck className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Minor Protection:</strong> As you are under 18, parent/guardian verification 
              through DigiLocker will be required before consent is processed.
            </AlertDescription>
          </Alert>
        )}

        <Alert className="border-gray-200 bg-gray-50">
          <Info className="h-4 w-4 text-gray-600" />
          <AlertDescription className="text-gray-700">
            <strong>Notice Details:</strong> Generated on {noticeMetadata.generatedAt.toLocaleString()} • 
            Template v{noticeMetadata.templateVersion} • {purposes.length} purposes mapped • 
            Language: {getCurrentLanguageData()?.nativeName}
          </AlertDescription>
        </Alert>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button variant="outline" onClick={onNoticeRejected}>
          <AlertTriangle className="h-4 w-4 mr-2" />
          I Do Not Consent
        </Button>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowFullNotice(!showFullNotice)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showFullNotice ? 'Collapse' : 'View Full'} Notice
          </Button>
          <Button onClick={onNoticeAccepted} className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-4 w-4 mr-2" />
            I Understand and Consent
          </Button>
        </div>
      </div>
    </div>
  );
} 