import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  FileText,
  Plus,
  Edit,
  Eye,
  Save,
  Trash2,
  Settings,
  Globe,
  Hash,
  Tag,
  Code,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Copy,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import {
  ConsentTemplate,
  TemplateType,
  TemplatePlaceholder,
  PlaceholderType,
  PurposeMapping,
  ConsentCategory,
  TriggerEvent,
  EventType,
  TranslationKey,
  TranslationCategory,
  AdminConfiguration,
  NoticeStatus
} from '@/types/dpdp';
import { toast } from '@/components/ui/use-toast';

interface TemplateManagerProps {
  organizationId: string;
  onConfigurationUpdate?: (config: AdminConfiguration) => void;
}

const TEMPLATE_TYPES = [
  { value: TemplateType.CONSENT_NOTICE, label: 'Consent Notice', icon: FileText },
  { value: TemplateType.PRIVACY_NOTICE, label: 'Privacy Notice', icon: FileText },
  { value: TemplateType.COOKIE_NOTICE, label: 'Cookie Notice', icon: FileText },
  { value: TemplateType.DATA_BREACH_NOTICE, label: 'Data Breach Notice', icon: AlertTriangle }
];

const PLACEHOLDER_TYPES = [
  { value: PlaceholderType.TEXT, label: 'Text', icon: FileText },
  { value: PlaceholderType.PURPOSE_LIST, label: 'Purpose List', icon: Tag },
  { value: PlaceholderType.DATA_CATEGORIES, label: 'Data Categories', icon: Tag },
  { value: PlaceholderType.RETENTION_PERIOD, label: 'Retention Period', icon: FileText },
  { value: PlaceholderType.CONTACT_INFO, label: 'Contact Information', icon: FileText },
  { value: PlaceholderType.RIGHTS_LIST, label: 'User Rights List', icon: FileText },
  { value: PlaceholderType.LEGAL_BASIS, label: 'Legal Basis', icon: FileText }
];

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
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर' },
  { code: 'bo', name: 'Tibetan', nativeName: 'བོད་སྐད་' },
  { code: 'mni', name: 'Manipuri', nativeName: 'ꯃꯤꯇꯩ ꯂꯣꯟ' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'gom', name: 'Konkani', nativeName: 'कोंकणी' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' }
];

export default function TemplateManager({ organizationId, onConfigurationUpdate }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<ConsentTemplate[]>([]);
  const [purposeMappings, setPurposeMappings] = useState<PurposeMapping[]>([]);
  const [translationKeys, setTranslationKeys] = useState<TranslationKey[]>([]);
  const [triggerEvents, setTriggerEvents] = useState<TriggerEvent[]>([]);
  
  const [selectedTemplate, setSelectedTemplate] = useState<ConsentTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');
  
  // Template form state
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    type: TemplateType.CONSENT_NOTICE,
    content: ''
  });
  
  const [placeholders, setPlaceholders] = useState<TemplatePlaceholder[]>([]);
  const [currentPlaceholder, setCurrentPlaceholder] = useState<TemplatePlaceholder>({
    key: '',
    name: '',
    description: '',
    type: PlaceholderType.TEXT,
    required: false
  });

  // Purpose mapping form
  const [purposeForm, setPurposeForm] = useState({
    purposeId: '',
    uniqueId: '',
    category: ConsentCategory.ESSENTIAL,
    isEssential: true
  });

  // Translation key form
  const [translationForm, setTranslationForm] = useState({
    key: '',
    englishText: '',
    category: TranslationCategory.TITLE
  });

  useEffect(() => {
    loadConfiguration();
  }, [organizationId]);

  const loadConfiguration = () => {
    // Mock data - in real implementation, load from API
    const mockTemplates: ConsentTemplate[] = [
      {
        id: 'template_1',
        name: 'Standard Consent Notice',
        description: 'Standard template for data processing consent',
        type: TemplateType.CONSENT_NOTICE,
        content: `# Data Processing Consent Notice

Dear {{USER_NAME}},

We, {{ORGANIZATION_NAME}}, are committed to protecting your privacy and ensuring transparency in how we process your personal data under the Digital Personal Data Protection Act, 2023.

## Purpose of Data Processing
We process your personal data for the following purposes:
{{PURPOSE_LIST}}

## Data Categories
The following categories of personal data will be processed:
{{DATA_CATEGORIES}}

## Your Rights
Under the DPDP Act 2023, you have the following rights:
{{RIGHTS_LIST}}

## Contact Information
{{CONTACT_INFO}}

## Legal Basis
{{LEGAL_BASIS}}

## Data Retention
{{RETENTION_PERIOD}}

By clicking "I Agree" below, you provide your explicit consent for the processing of your personal data for the purposes mentioned above.`,
        placeholders: [
          {
            key: 'USER_NAME',
            name: 'User Name',
            description: 'Name of the data principal',
            type: PlaceholderType.TEXT,
            required: true
          },
          {
            key: 'ORGANIZATION_NAME',
            name: 'Organization Name',
            description: 'Name of the data fiduciary',
            type: PlaceholderType.TEXT,
            required: true
          }
        ],
        purposeMapping: [],
        translationKeys: {},
        isActive: true,
        createdBy: 'admin_1',
        createdAt: new Date('2024-01-01'),
        lastUpdated: new Date('2024-01-15'),
        version: '1.0'
      }
    ];

    const mockPurposeMappings: PurposeMapping[] = [
      {
        purposeId: 'account_management',
        uniqueId: 'P-001',
        category: ConsentCategory.ESSENTIAL,
        isEssential: true,
        triggerEvents: [],
        associatedDataCategories: ['personal_info', 'contact_info'],
        templateSections: ['purpose_list', 'data_categories']
      }
    ];

    const mockTranslationKeys: TranslationKey[] = [
      {
        key: 'consent_notice_title',
        englishText: 'Data Processing Consent Notice',
        translations: {
          'hi': 'डेटा प्रसंस्करण सहमति सूचना',
          'bn': 'ডেটা প্রসেসিং সম্মতি নোটিশ'
        },
        category: TranslationCategory.TITLE,
        lastUpdated: new Date()
      }
    ];

    setTemplates(mockTemplates);
    setPurposeMappings(mockPurposeMappings);
    setTranslationKeys(mockTranslationKeys);
  };

  const handleCreateTemplate = () => {
    setIsCreatingTemplate(true);
    setSelectedTemplate(null);
    setTemplateForm({
      name: '',
      description: '',
      type: TemplateType.CONSENT_NOTICE,
      content: ''
    });
    setPlaceholders([]);
  };

  const handleSaveTemplate = () => {
    const newTemplate: ConsentTemplate = {
      id: `template_${Date.now()}`,
      name: templateForm.name,
      description: templateForm.description,
      type: templateForm.type,
      content: templateForm.content,
      placeholders,
      purposeMapping: [],
      translationKeys: {},
      isActive: true,
      createdBy: 'current_user',
      createdAt: new Date(),
      lastUpdated: new Date(),
      version: '1.0'
    };

    if (selectedTemplate) {
      setTemplates(templates.map(t => t.id === selectedTemplate.id ? { ...newTemplate, id: selectedTemplate.id } : t));
    } else {
      setTemplates([...templates, newTemplate]);
    }

    setIsCreatingTemplate(false);
    setSelectedTemplate(null);
  };

  const handleAddPlaceholder = () => {
    if (currentPlaceholder.key && currentPlaceholder.name) {
      setPlaceholders([...placeholders, { ...currentPlaceholder }]);
      setCurrentPlaceholder({
        key: '',
        name: '',
        description: '',
        type: PlaceholderType.TEXT,
        required: false
      });
    }
  };

  const generateUniqueId = () => {
    const count = purposeMappings.length + 1;
    return `P-${count.toString().padStart(3, '0')}`;
  };

  // Template Management Functions
  const saveTemplate = async () => {
    if (!newTemplate.name || !newTemplate.content) {
      toast({
        title: "Validation Error",
        description: "Template name and content are required",
        variant: "destructive"
      });
      return;
    }

    const template: ConsentTemplate = {
      ...newTemplate,
      id: editingTemplate ? editingTemplate.id : `template_${Date.now()}`,
      createdAt: editingTemplate ? editingTemplate.createdAt : new Date(),
      lastUpdated: new Date(),
      status: NoticeStatus.DRAFT, // Always save as draft initially
      version: editingTemplate ? 
        (parseFloat(editingTemplate.version) + 0.1).toFixed(1) : 
        '1.0'
    };

    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
      toast({
        title: "Template Updated",
        description: `Template "${template.name}" has been saved as draft v${template.version}`
      });
    } else {
      setTemplates(prev => [...prev, template]);
      toast({
        title: "Template Created",
        description: `Template "${template.name}" has been created as draft v${template.version}`
      });
    }

    resetForm();
  };

  // New: Template Publishing Workflow
  const submitForApproval = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    try {
      const updatedTemplate = {
        ...template,
        status: NoticeStatus.PENDING_APPROVAL,
        lastUpdated: new Date()
      };

      setTemplates(prev => prev.map(t => t.id === templateId ? updatedTemplate : t));
      
      toast({
        title: "Submitted for Approval",
        description: `Template "${template.name}" has been submitted for approval`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit template for approval",
        variant: "destructive"
      });
    }
  };

  const approveTemplate = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    try {
      const updatedTemplate = {
        ...template,
        status: NoticeStatus.PUBLISHED,
        approvedBy: 'current_admin_user', // In real app, get from auth context
        approvedAt: new Date(),
        publishedBy: 'current_admin_user',
        publishedAt: new Date(),
        lastUpdated: new Date()
      };

      setTemplates(prev => prev.map(t => t.id === templateId ? updatedTemplate : t));
      
      toast({
        title: "Template Published",
        description: `Template "${template.name}" v${template.version} is now live`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish template",
        variant: "destructive"
      });
    }
  };

  const rejectTemplate = async (templateId: string, reason: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    try {
      const updatedTemplate = {
        ...template,
        status: NoticeStatus.DRAFT,
        lastUpdated: new Date()
      };

      setTemplates(prev => prev.map(t => t.id === templateId ? updatedTemplate : t));
      
      toast({
        title: "Template Rejected",
        description: `Template "${template.name}" has been rejected and moved back to draft`,
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject template",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Template & Configuration Manager</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Config
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Config
          </Button>
        </div>
      </div>

      <Alert>
        <Settings className="h-4 w-4" />
        <AlertDescription>
          Configure consent templates, purpose mappings, and translation keys for DPDP Act 2023 compliance.
          All changes are versioned and audited.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="purposes">Purpose Mapping</TabsTrigger>
          <TabsTrigger value="translations">Translations</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={template.isActive ? "default" : "secondary"}>
                        {template.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{template.type}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <p>Version: {template.version}</p>
                      <p>Placeholders: {template.placeholders.length}</p>
                      <p>Last Updated: {template.lastUpdated.toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="purposes" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <Tag className="h-8 w-8 mx-auto mb-2" />
            <p>Purpose mapping configuration...</p>
          </div>
        </TabsContent>

        <TabsContent value="translations" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <Globe className="h-8 w-8 mx-auto mb-2" />
            <p>Translation management...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 