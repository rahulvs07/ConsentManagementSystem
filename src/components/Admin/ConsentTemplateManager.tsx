import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  FileText, 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  Languages, 
  Code, 
  Save,
  Upload,
  Download,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface ConsentTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'draft' | 'active' | 'archived';
  type: 'standard' | 'minor' | 'sensitive' | 'marketing';
  content: {
    title: string;
    introduction: string;
    purposeSection: string;
    rightsSection: string;
    contactSection: string;
    footer: string;
  };
  dynamicFields: string[];
  conditionalSections: ConditionalSection[];
  languages: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  usageCount: number;
}

interface ConditionalSection {
  id: string;
  name: string;
  condition: string;
  content: string;
  languages: Record<string, string>;
}

interface Translation {
  id: string;
  templateId: string;
  language: string;
  languageName: string;
  content: Record<string, string>;
  status: 'pending' | 'completed' | 'reviewed';
  lastUpdated: Date;
  translator: string;
}

const INDIAN_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'ur', name: 'Urdu' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'or', name: 'Odia' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'as', name: 'Assamese' },
  { code: 'mai', name: 'Maithili' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'ne', name: 'Nepali' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'kok', name: 'Konkani' },
  { code: 'mni', name: 'Manipuri' },
  { code: 'bo', name: 'Bodo' },
  { code: 'sat', name: 'Santali' },
  { code: 'doi', name: 'Dogri' }
];

const DYNAMIC_FIELDS = [
  '{{user_name}}',
  '{{user_email}}',
  '{{consent_purpose}}',
  '{{data_categories}}',
  '{{retention_period}}',
  '{{company_name}}',
  '{{dpo_contact}}',
  '{{effective_date}}',
  '{{expiry_date}}',
  '{{withdrawal_link}}'
];

const TEMPLATE_TYPES = [
  { value: 'standard', label: 'Standard Consent', description: 'General data processing consent' },
  { value: 'minor', label: 'Minor Consent', description: 'Consent involving minors with DigiLocker verification' },
  { value: 'sensitive', label: 'Sensitive Data', description: 'Consent for sensitive personal data processing' },
  { value: 'marketing', label: 'Marketing Consent', description: 'Marketing and promotional communications' }
];

export const ConsentTemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<ConsentTemplate[]>([
    {
      id: 'template_1',
      name: 'Standard Data Processing Consent',
      description: 'General consent template for standard data processing activities',
      version: '1.2',
      status: 'active',
      type: 'standard',
      content: {
        title: 'Data Processing Consent Notice',
        introduction: 'We respect your privacy and are committed to protecting your personal data in accordance with the Digital Personal Data Protection Act, 2023.',
        purposeSection: 'We process your personal data for the following purposes: {{consent_purpose}}',
        rightsSection: 'Under the DPDP Act 2023, you have the right to access, correct, erase, and port your data. You may also withdraw consent at any time.',
        contactSection: 'For any data protection queries, contact our DPO at {{dpo_contact}}',
        footer: 'This consent is valid until {{expiry_date}} and can be withdrawn at {{withdrawal_link}}'
      },
      dynamicFields: ['{{consent_purpose}}', '{{dpo_contact}}', '{{expiry_date}}', '{{withdrawal_link}}'],
      conditionalSections: [
        {
          id: 'minor_section',
          name: 'Minor Data Principal',
          condition: 'user.age < 18',
          content: 'Special protections apply as you are under 18. DigiLocker verification is required.',
          languages: {
            'en': 'Special protections apply as you are under 18. DigiLocker verification is required.',
            'hi': 'विशेष सुरक्षा लागू होती है क्योंकि आप 18 वर्ष से कम आयु के हैं। डिजिलॉकर सत्यापन आवश्यक है।'
          }
        }
      ],
      languages: ['en', 'hi', 'bn'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      createdBy: 'admin@company.com',
      usageCount: 1247
    }
  ]);

  const [translations, setTranslations] = useState<Translation[]>([
    {
      id: 'trans_1',
      templateId: 'template_1',
      language: 'hi',
      languageName: 'Hindi',
      content: {
        title: 'डेटा प्रसंस्करण सहमति सूचना',
        introduction: 'हम आपकी गोपनीयता का सम्मान करते हैं और डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 के अनुसार आपके व्यक्तिगत डेटा की सुरक्षा के लिए प्रतिबद्ध हैं।'
      },
      status: 'completed',
      lastUpdated: new Date('2024-01-18'),
      translator: 'translator@company.com'
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<ConsentTemplate | null>(null);
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [isEditTemplateOpen, setIsEditTemplateOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    type: 'standard' as const,
    content: {
      title: '',
      introduction: '',
      purposeSection: '',
      rightsSection: '',
      contactSection: '',
      footer: ''
    }
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) return;

    const template: ConsentTemplate = {
      id: `template_${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description,
      version: '1.0',
      status: 'draft',
      type: newTemplate.type,
      content: newTemplate.content,
      dynamicFields: extractDynamicFields(JSON.stringify(newTemplate.content)),
      conditionalSections: [],
      languages: ['en'],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin@company.com',
      usageCount: 0
    };

    setTemplates([...templates, template]);
    setNewTemplate({
      name: '',
      description: '',
      type: 'standard',
      content: {
        title: '',
        introduction: '',
        purposeSection: '',
        rightsSection: '',
        contactSection: '',
        footer: ''
      }
    });
    setIsCreateTemplateOpen(false);
  };

  const extractDynamicFields = (content: string): string[] => {
    const matches = content.match(/\{\{[^}]+\}\}/g);
    return matches ? [...new Set(matches)] : [];
  };

  const handleDuplicateTemplate = (template: ConsentTemplate) => {
    const duplicated: ConsentTemplate = {
      ...template,
      id: `template_${Date.now()}`,
      name: `${template.name} (Copy)`,
      version: '1.0',
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0
    };
    setTemplates([...templates, duplicated]);
  };

  const handleArchiveTemplate = (templateId: string) => {
    setTemplates(templates.map(t => 
      t.id === templateId 
        ? { ...t, status: 'archived' as const, updatedAt: new Date() }
        : t
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'minor': return 'bg-purple-100 text-purple-800';
      case 'sensitive': return 'bg-red-100 text-red-800';
      case 'marketing': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPreview = (template: ConsentTemplate) => {
    const sampleData = {
      '{{user_name}}': 'John Doe',
      '{{user_email}}': 'john.doe@example.com',
      '{{consent_purpose}}': 'Account management and service delivery',
      '{{company_name}}': 'ACME Corporation',
      '{{dpo_contact}}': 'dpo@acme.com',
      '{{expiry_date}}': '31st December 2025',
      '{{withdrawal_link}}': 'https://acme.com/withdraw-consent'
    };

    const replaceTokens = (text: string) => {
      let result = text;
      Object.entries(sampleData).forEach(([token, value]) => {
        result = result.replace(new RegExp(token.replace(/[{}]/g, '\\$&'), 'g'), value);
      });
      return result;
    };

    return (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">{replaceTokens(template.content.title)}</h3>
          <div className="space-y-3 text-sm">
            <p>{replaceTokens(template.content.introduction)}</p>
            <p><strong>Purpose:</strong> {replaceTokens(template.content.purposeSection)}</p>
            <p><strong>Your Rights:</strong> {replaceTokens(template.content.rightsSection)}</p>
            <p><strong>Contact:</strong> {replaceTokens(template.content.contactSection)}</p>
            <p className="text-xs text-gray-600">{replaceTokens(template.content.footer)}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Consent Template Management</h2>
          <p className="text-gray-600">Create and manage dynamic consent notice templates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Templates
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Templates
          </Button>
          <Dialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Consent Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="templateName">Template Name</Label>
                    <Input
                      id="templateName"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                      placeholder="Enter template name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="templateType">Template Type</Label>
                    <Select 
                      value={newTemplate.type} 
                      onValueChange={(value: any) => setNewTemplate({ ...newTemplate, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TEMPLATE_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-gray-500">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="templateDescription">Description</Label>
                  <Textarea
                    id="templateDescription"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    placeholder="Enter template description"
                    rows={2}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Template Content</h4>
                  
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newTemplate.content.title}
                      onChange={(e) => setNewTemplate({
                        ...newTemplate,
                        content: { ...newTemplate.content, title: e.target.value }
                      })}
                      placeholder="Consent notice title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="introduction">Introduction</Label>
                    <Textarea
                      id="introduction"
                      value={newTemplate.content.introduction}
                      onChange={(e) => setNewTemplate({
                        ...newTemplate,
                        content: { ...newTemplate.content, introduction: e.target.value }
                      })}
                      placeholder="Introduction text"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="purposeSection">Purpose Section</Label>
                    <Textarea
                      id="purposeSection"
                      value={newTemplate.content.purposeSection}
                      onChange={(e) => setNewTemplate({
                        ...newTemplate,
                        content: { ...newTemplate.content, purposeSection: e.target.value }
                      })}
                      placeholder="Purpose description (use {{consent_purpose}} for dynamic content)"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="rightsSection">Rights Section</Label>
                    <Textarea
                      id="rightsSection"
                      value={newTemplate.content.rightsSection}
                      onChange={(e) => setNewTemplate({
                        ...newTemplate,
                        content: { ...newTemplate.content, rightsSection: e.target.value }
                      })}
                      placeholder="User rights under DPDP Act 2023"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactSection">Contact Section</Label>
                    <Textarea
                      id="contactSection"
                      value={newTemplate.content.contactSection}
                      onChange={(e) => setNewTemplate({
                        ...newTemplate,
                        content: { ...newTemplate.content, contactSection: e.target.value }
                      })}
                      placeholder="Contact information (use {{dpo_contact}} for DPO details)"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="footer">Footer</Label>
                    <Textarea
                      id="footer"
                      value={newTemplate.content.footer}
                      onChange={(e) => setNewTemplate({
                        ...newTemplate,
                        content: { ...newTemplate.content, footer: e.target.value }
                      })}
                      placeholder="Footer text with expiry and withdrawal information"
                      rows={2}
                    />
                  </div>
                </div>

                <Alert>
                  <Code className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Available Dynamic Fields:</strong><br />
                    {DYNAMIC_FIELDS.join(', ')}<br />
                    These will be automatically replaced with actual values when the template is used.
                  </AlertDescription>
                </Alert>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateTemplateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate}>
                  Create Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="translations">Translations</TabsTrigger>
          <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {template.name}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Badge className={getTypeColor(template.type)}>
                        {template.type}
                      </Badge>
                      <Badge className={getStatusColor(template.status)}>
                        {template.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Version:</span>
                    <span className="font-medium">v{template.version}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Usage count:</span>
                    <span className="font-medium">{template.usageCount.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Languages:</span>
                    <div className="flex gap-1">
                      {template.languages.slice(0, 3).map(lang => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {INDIAN_LANGUAGES.find(l => l.code === lang)?.name || lang}
                        </Badge>
                      ))}
                      {template.languages.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.languages.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Dynamic fields:</span>
                    <span className="font-medium">{template.dynamicFields.length}</span>
                  </div>

                  <div className="flex gap-1 pt-2">
                    <Dialog open={isPreviewOpen && selectedTemplate?.id === template.id} onOpenChange={setIsPreviewOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Template Preview: {template.name}</DialogTitle>
                        </DialogHeader>
                        {selectedTemplate && renderPreview(selectedTemplate)}
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDuplicateTemplate(template)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    
                    {template.status !== 'archived' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleArchiveTemplate(template.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Translations Tab */}
        <TabsContent value="translations">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Multi-Language Translation Management
                </CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Translation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Translator</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {translations.map((translation) => (
                    <TableRow key={translation.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {templates.find(t => t.id === translation.templateId)?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            v{templates.find(t => t.id === translation.templateId)?.version}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{translation.language.toUpperCase()}</Badge>
                          <span className="text-sm">{translation.languageName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          translation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          translation.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {translation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {translation.lastUpdated.toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{translation.translator}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{templates.length}</div>
                <p className="text-xs text-gray-500">
                  {templates.filter(t => t.status === 'active').length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {templates.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString()}
                </div>
                <p className="text-xs text-gray-500">Consent notices generated</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Languages Supported</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(templates.flatMap(t => t.languages)).size}
                </div>
                <p className="text-xs text-gray-500">Unique languages</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Translation Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((translations.filter(t => t.status === 'completed').length / translations.length) * 100)}%
                </div>
                <p className="text-xs text-gray-500">Translations completed</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Most Used Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templates
                  .sort((a, b) => b.usageCount - a.usageCount)
                  .slice(0, 5)
                  .map((template, index) => (
                    <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-gray-500">{template.type} • v{template.version}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{template.usageCount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">uses</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};