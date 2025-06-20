import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Globe, 
  Plus, 
  Edit, 
  Eye, 
  Send, 
  Save, 
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Languages
} from 'lucide-react';
import { 
  ConsentNotice, 
  NoticeStatus, 
  ProcessingPurpose, 
  PurposeCategory,
  DataCategory,
  DataSensitivity,
  ConsentNoticeTranslation 
} from '@/types/dpdp';

interface NoticeManagerProps {
  userId: string;
  userRole: string;
  onNoticeUpdate?: (notice: ConsentNotice) => void;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' }
];

const NoticeManager = ({ userId, userRole, onNoticeUpdate }: NoticeManagerProps) => {
  const [notices, setNotices] = useState<ConsentNotice[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<ConsentNotice | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentTab, setCurrentTab] = useState('list');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state for notice creation/editing
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    language: 'en',
    purposes: [] as ProcessingPurpose[],
    dataCategories: [] as DataCategory[]
  });
  
  const [translations, setTranslations] = useState<Record<string, ConsentNoticeTranslation>>({});
  const [selectedLanguageForTranslation, setSelectedLanguageForTranslation] = useState('hi');

  // Mock purposes and data categories
  const mockPurposes: ProcessingPurpose[] = [
    {
      id: 'purpose_1',
      name: 'Account Management',
      description: 'Creating and managing user accounts',
      isEssential: true,
      category: PurposeCategory.ACCOUNT_MANAGEMENT,
      retentionPeriod: '3 years',
      legalBasis: 'Contract performance',
      dataTypes: ['Name', 'Email', 'Phone'],
      isActive: true,
      createdBy: userId,
      translations: {}
    },
    {
      id: 'purpose_2',
      name: 'Marketing Communications',
      description: 'Sending promotional materials',
      isEssential: false,
      category: PurposeCategory.MARKETING,
      retentionPeriod: '2 years',
      legalBasis: 'Consent',
      dataTypes: ['Email', 'Preferences'],
      isActive: true,
      createdBy: userId,
      translations: {}
    }
  ];

  const mockDataCategories: DataCategory[] = [
    {
      id: 'data_1',
      name: 'Personal Information',
      description: 'Basic personal details',
      sensitivity: DataSensitivity.PERSONAL,
      examples: ['Name', 'Email', 'Phone'],
      retentionPeriod: '3 years',
      processingBasis: 'Contract'
    },
    {
      id: 'data_2',
      name: 'Usage Analytics',
      description: 'Website usage patterns',
      sensitivity: DataSensitivity.BEHAVIORAL,
      examples: ['Page views', 'Click patterns'],
      retentionPeriod: '1 year',
      processingBasis: 'Legitimate interest'
    }
  ];

  useEffect(() => {
    // Load existing notices
    loadNotices();
  }, []);

  const loadNotices = () => {
    // Mock data - in real app, fetch from API
    const mockNotices: ConsentNotice[] = [
      {
        id: 'notice_1',
        title: 'Data Processing Notice - Account Services',
        content: 'This notice explains how we process your personal data...',
        purposes: mockPurposes,
        dataCategories: mockDataCategories,
        language: 'en',
        version: '1.0',
        createdAt: new Date('2024-01-15'),
        createdBy: userId,
        status: NoticeStatus.PUBLISHED,
        translations: {
          'hi': {
            title: 'डेटा प्रसंस्करण सूचना - खाता सेवाएं',
            content: 'यह सूचना बताती है कि हम आपके व्यक्तिगत डेटा को कैसे प्रोसेस करते हैं...',
            language: 'hi',
            translatedBy: 'translator_1',
            translatedAt: new Date('2024-01-16')
          }
        }
      },
      {
        id: 'notice_2',
        title: 'Cookie Usage Policy',
        content: 'This notice describes our cookie usage...',
        purposes: [mockPurposes[1]],
        dataCategories: [mockDataCategories[1]],
        language: 'en',
        version: '1.1',
        createdAt: new Date('2024-01-20'),
        createdBy: userId,
        status: NoticeStatus.IN_TRANSLATION,
        translations: {}
      }
    ];
    setNotices(mockNotices);
  };

  const handleCreateNotice = () => {
    setIsCreating(true);
    setSelectedNotice(null);
    setNoticeForm({
      title: '',
      content: '',
      language: 'en',
      purposes: [],
      dataCategories: []
    });
    setTranslations({});
    setCurrentTab('create');
  };

  const handleEditNotice = (notice: ConsentNotice) => {
    setSelectedNotice(notice);
    setIsCreating(false);
    setNoticeForm({
      title: notice.title,
      content: notice.content,
      language: notice.language,
      purposes: notice.purposes,
      dataCategories: notice.dataCategories
    });
    setTranslations(notice.translations);
    setCurrentTab('create');
  };

  const handleSaveNotice = () => {
    setIsSubmitting(true);
    
    const notice: ConsentNotice = {
      id: selectedNotice?.id || `notice_${Date.now()}`,
      title: noticeForm.title,
      content: noticeForm.content,
      purposes: noticeForm.purposes,
      dataCategories: noticeForm.dataCategories,
      language: noticeForm.language,
      version: selectedNotice ? `${parseFloat(selectedNotice.version) + 0.1}` : '1.0',
      createdAt: selectedNotice?.createdAt || new Date(),
      createdBy: userId,
      status: Object.keys(translations).length > 0 ? NoticeStatus.IN_TRANSLATION : NoticeStatus.DRAFT,
      translations
    };

    setTimeout(() => {
      if (selectedNotice) {
        setNotices(prev => prev.map(n => n.id === notice.id ? notice : n));
      } else {
        setNotices(prev => [...prev, notice]);
      }
      
      onNoticeUpdate?.(notice);
      setIsSubmitting(false);
      setCurrentTab('list');
    }, 1500);
  };

  const handlePublishNotice = (noticeId: string) => {
    setNotices(prev => prev.map(notice => 
      notice.id === noticeId 
        ? { ...notice, status: NoticeStatus.PUBLISHED }
        : notice
    ));
  };

  const handleAddTranslation = () => {
    if (!selectedLanguageForTranslation) return;
    
    setTranslations(prev => ({
      ...prev,
      [selectedLanguageForTranslation]: {
        title: '',
        content: '',
        language: selectedLanguageForTranslation,
        translatedBy: userId,
        translatedAt: new Date()
      }
    }));
  };

  const updateTranslation = (language: string, field: 'title' | 'content', value: string) => {
    setTranslations(prev => ({
      ...prev,
      [language]: {
        ...prev[language],
        [field]: value
      }
    }));
  };

  const getStatusBadge = (status: NoticeStatus) => {
    switch (status) {
      case NoticeStatus.DRAFT:
        return <Badge variant="outline" className="text-gray-600"><Edit className="w-3 h-3 mr-1" />Draft</Badge>;
      case NoticeStatus.IN_TRANSLATION:
        return <Badge className="bg-orange-100 text-orange-800"><Languages className="w-3 h-3 mr-1" />In Translation</Badge>;
      case NoticeStatus.PUBLISHED:
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Published</Badge>;
      case NoticeStatus.ARCHIVED:
        return <Badge variant="outline" className="text-gray-500"><Clock className="w-3 h-3 mr-1" />Archived</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const NoticeList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Consent Notices</h3>
        <Button onClick={handleCreateNotice} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Notice
        </Button>
      </div>

      {notices.map((notice) => (
        <Card key={notice.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{notice.title}</h4>
                  {getStatusBadge(notice.status)}
                </div>
                <p className="text-gray-600 mb-3 line-clamp-2">{notice.content}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Version {notice.version}</span>
                  <span>•</span>
                  <span>{notice.purposes.length} purposes</span>
                  <span>•</span>
                  <span>{Object.keys(notice.translations).length + 1} languages</span>
                  <span>•</span>
                  <span>Created {notice.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditNotice(notice)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {notice.status === NoticeStatus.DRAFT && (
                  <Button
                    size="sm"
                    onClick={() => handlePublishNotice(notice.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const NoticeEditor = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {isCreating ? 'Create New Notice' : 'Edit Notice'}
        </h3>
        <Button variant="outline" onClick={() => setCurrentTab('list')}>
          Back to List
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Notice Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Notice Title</Label>
              <Input
                id="title"
                value={noticeForm.title}
                onChange={(e) => setNoticeForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter notice title"
              />
            </div>
            <div>
              <Label htmlFor="language">Primary Language</Label>
              <Select 
                value={noticeForm.language}
                onValueChange={(value) => setNoticeForm(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.slice(0, 5).map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="content">Notice Content</Label>
            <Textarea
              id="content"
              value={noticeForm.content}
              onChange={(e) => setNoticeForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter the detailed notice content explaining data processing purposes, legal basis, retention periods, and user rights..."
              className="min-h-40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Translations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Translations (DPDPA Sec 5(3) Compliance)</span>
          </CardTitle>
          <CardDescription>
            Add translations for all 22 scheduled languages as required by DPDP Act 2023
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Select
                value={selectedLanguageForTranslation}
                onValueChange={setSelectedLanguageForTranslation}
              >
                <SelectTrigger className="w-60">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES
                    .filter(lang => lang.code !== noticeForm.language && !translations[lang.code])
                    .map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.nativeName} ({lang.name})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddTranslation}
                disabled={!selectedLanguageForTranslation || !!translations[selectedLanguageForTranslation]}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Translation
              </Button>
            </div>

            {Object.entries(translations).map(([langCode, translation]) => {
              const lang = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
              return (
                <Card key={langCode} className="border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Languages className="h-4 w-4" />
                      <span>{lang?.nativeName} ({lang?.name})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Translated Title</Label>
                      <Input
                        value={translation.title}
                        onChange={(e) => updateTranslation(langCode, 'title', e.target.value)}
                        placeholder={`Translate: ${noticeForm.title}`}
                      />
                    </div>
                    <div>
                      <Label>Translated Content</Label>
                      <Textarea
                        value={translation.content}
                        onChange={(e) => updateTranslation(langCode, 'content', e.target.value)}
                        placeholder={`Translate the notice content to ${lang?.name}...`}
                        className="min-h-32"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end space-x-4">
        <Button variant="outline" onClick={() => setCurrentTab('list')}>
          Cancel
        </Button>
        <Button
          onClick={handleSaveNotice}
          disabled={!noticeForm.title || !noticeForm.content || isSubmitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Saving...' : (isCreating ? 'Create Notice' : 'Update Notice')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <span>Notice Management</span>
            <Badge className="bg-blue-100 text-blue-800">Data Fiduciary</Badge>
          </CardTitle>
          <CardDescription>
            Create and manage consent notices with multi-language support as required by DPDP Act 2023
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Notice List</TabsTrigger>
          <TabsTrigger value="create">
            {isCreating ? 'Create Notice' : selectedNotice ? 'Edit Notice' : 'Create Notice'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          <NoticeList />
        </TabsContent>
        
        <TabsContent value="create" className="mt-6">
          <NoticeEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NoticeManager; 