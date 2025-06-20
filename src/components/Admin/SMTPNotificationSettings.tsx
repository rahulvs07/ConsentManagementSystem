import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Mail, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Settings,
  Eye,
  Edit,
  Copy,
  Trash2,
  Plus,
  TestTube
} from 'lucide-react';

interface SMTPConfiguration {
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: 'none' | 'tls' | 'ssl';
  fromEmail: string;
  fromName: string;
  replyToEmail: string;
  isActive: boolean;
  lastTested?: Date;
  testStatus?: 'success' | 'failed';
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'consent_confirmation' | 'withdrawal_confirmation' | 'renewal_reminder' | 'data_request_confirmation' | 'privacy_notice_update';
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  languages: Record<string, { subject: string; htmlContent: string; textContent: string }>;
}

interface NotificationLog {
  id: string;
  templateId: string;
  templateName: string;
  recipient: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt: Date;
  errorMessage?: string;
  deliveryStatus?: 'delivered' | 'bounced' | 'complained';
}

const NOTIFICATION_TYPES = [
  { value: 'consent_confirmation', label: 'Consent Confirmation', description: 'Sent when user provides consent' },
  { value: 'withdrawal_confirmation', label: 'Withdrawal Confirmation', description: 'Sent when consent is withdrawn' },
  { value: 'renewal_reminder', label: 'Renewal Reminder', description: 'Sent before consent expires' },
  { value: 'data_request_confirmation', label: 'Data Request Confirmation', description: 'Sent when data request is processed' },
  { value: 'privacy_notice_update', label: 'Privacy Notice Update', description: 'Sent when privacy notice is updated' }
];

const TEMPLATE_VARIABLES = [
  '{{user_name}}',
  '{{user_email}}',
  '{{consent_details}}',
  '{{withdrawal_date}}',
  '{{expiry_date}}',
  '{{company_name}}',
  '{{dpo_contact}}',
  '{{unsubscribe_link}}',
  '{{privacy_policy_link}}',
  '{{support_email}}'
];

export const SMTPNotificationSettings: React.FC = () => {
  const [smtpConfig, setSMTPConfig] = useState<SMTPConfiguration>({
    host: 'smtp.gmail.com',
    port: 587,
    username: 'notifications@company.com',
    password: '',
    encryption: 'tls',
    fromEmail: 'notifications@company.com',
    fromName: 'CMS - Consent Management System',
    replyToEmail: 'support@company.com',
    isActive: true,
    lastTested: new Date(Date.now() - 2 * 60 * 60 * 1000),
    testStatus: 'success'
  });

  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: 'template_consent_conf',
      name: 'Consent Confirmation',
      type: 'consent_confirmation',
      subject: 'Consent Confirmation - {{company_name}}',
      htmlContent: `
        <h2>Thank you for providing your consent</h2>
        <p>Dear {{user_name}},</p>
        <p>This email confirms that you have provided consent for the following data processing activities:</p>
        <div>{{consent_details}}</div>
        <p>You can withdraw your consent at any time by clicking <a href="{{unsubscribe_link}}">here</a>.</p>
        <p>Best regards,<br>{{company_name}}</p>
      `,
      textContent: `Thank you for providing your consent\n\nDear {{user_name}},\n\nThis email confirms that you have provided consent for the following data processing activities:\n\n{{consent_details}}\n\nYou can withdraw your consent at any time by visiting: {{unsubscribe_link}}\n\nBest regards,\n{{company_name}}`,
      variables: ['{{user_name}}', '{{consent_details}}', '{{company_name}}', '{{unsubscribe_link}}'],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      usageCount: 1247,
      languages: {
        'hi': {
          subject: 'सहमति पुष्टि - {{company_name}}',
          htmlContent: '<h2>आपकी सहमति के लिए धन्यवाद</h2><p>प्रिय {{user_name}},</p>',
          textContent: 'आपकी सहमति के लिए धन्यवाद\n\nप्रिय {{user_name}},'
        }
      }
    }
  ]);

  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([
    {
      id: 'log_1',
      templateId: 'template_consent_conf',
      templateName: 'Consent Confirmation',
      recipient: 'user@example.com',
      subject: 'Consent Confirmation - ACME Corp',
      status: 'sent',
      sentAt: new Date(Date.now() - 30 * 60 * 1000),
      deliveryStatus: 'delivered'
    }
  ]);

  const [activeTab, setActiveTab] = useState('smtp');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'consent_confirmation' as const,
    subject: '',
    htmlContent: '',
    textContent: ''
  });

  const handleSaveSMTPConfig = () => {
    // Simulate saving SMTP configuration
    setSMTPConfig({ ...smtpConfig, lastTested: undefined, testStatus: undefined });
    alert('SMTP configuration saved successfully!');
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    
    // Simulate SMTP connection test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      setSMTPConfig({
        ...smtpConfig,
        lastTested: new Date(),
        testStatus: success ? 'success' : 'failed'
      });
      setIsTestingConnection(false);
      
      if (success) {
        alert('SMTP connection test successful!');
      } else {
        alert('SMTP connection test failed. Please check your settings.');
      }
    }, 2000);
  };

  const handleSendTestEmail = () => {
    if (!testEmail.trim()) {
      alert('Please enter a test email address');
      return;
    }

    // Simulate sending test email
    const logEntry: NotificationLog = {
      id: `log_${Date.now()}`,
      templateId: 'test',
      templateName: 'Test Email',
      recipient: testEmail,
      subject: 'SMTP Test Email',
      status: 'sent',
      sentAt: new Date(),
      deliveryStatus: 'delivered'
    };

    setNotificationLogs([logEntry, ...notificationLogs]);
    setTestEmail('');
    alert('Test email sent successfully!');
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) return;

    const template: NotificationTemplate = {
      id: `template_${Date.now()}`,
      name: newTemplate.name,
      type: newTemplate.type,
      subject: newTemplate.subject,
      htmlContent: newTemplate.htmlContent,
      textContent: newTemplate.textContent,
      variables: extractVariables(newTemplate.subject + newTemplate.htmlContent + newTemplate.textContent),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      languages: {}
    };

    setTemplates([...templates, template]);
    setNewTemplate({
      name: '',
      type: 'consent_confirmation',
      subject: '',
      htmlContent: '',
      textContent: ''
    });
    setIsCreateTemplateOpen(false);
  };

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{\{[^}]+\}\}/g);
    return matches ? [...new Set(matches)] : [];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
      case 'bounced':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'complained':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'sent':
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
      case 'bounced':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SMTP & Notification Settings</h2>
          <p className="text-gray-600">Configure email delivery and notification templates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleTestConnection} disabled={isTestingConnection}>
            <TestTube className="h-4 w-4 mr-2" />
            {isTestingConnection ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button size="sm" onClick={handleSaveSMTPConfig}>
            <Settings className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="smtp">SMTP Configuration</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="logs">Notification Logs</TabsTrigger>
        </TabsList>

        {/* SMTP Configuration Tab */}
        <TabsContent value="smtp">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  SMTP Server Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={smtpConfig.host}
                      onChange={(e) => setSMTPConfig({ ...smtpConfig, host: e.target.value })}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={smtpConfig.port}
                      onChange={(e) => setSMTPConfig({ ...smtpConfig, port: parseInt(e.target.value) })}
                      placeholder="587"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="smtpUsername">Username</Label>
                  <Input
                    id="smtpUsername"
                    value={smtpConfig.username}
                    onChange={(e) => setSMTPConfig({ ...smtpConfig, username: e.target.value })}
                    placeholder="your-email@domain.com"
                  />
                </div>

                <div>
                  <Label htmlFor="smtpPassword">Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={smtpConfig.password}
                    onChange={(e) => setSMTPConfig({ ...smtpConfig, password: e.target.value })}
                    placeholder="Your SMTP password or app password"
                  />
                </div>

                <div>
                  <Label htmlFor="encryption">Encryption</Label>
                  <Select 
                    value={smtpConfig.encryption} 
                    onValueChange={(value: any) => setSMTPConfig({ ...smtpConfig, encryption: value })}
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

                <div className="flex items-center space-x-2">
                  <Switch
                    id="smtpActive"
                    checked={smtpConfig.isActive}
                    onCheckedChange={(checked) => setSMTPConfig({ ...smtpConfig, isActive: checked })}
                  />
                  <Label htmlFor="smtpActive">Enable SMTP</Label>
                </div>

                {smtpConfig.lastTested && (
                  <Alert>
                    {getStatusIcon(smtpConfig.testStatus || 'pending')}
                    <AlertDescription>
                      Last tested: {smtpConfig.lastTested.toLocaleString()}
                      {smtpConfig.testStatus && (
                        <Badge className={`ml-2 ${getStatusColor(smtpConfig.testStatus)}`}>
                          {smtpConfig.testStatus.toUpperCase()}
                        </Badge>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sender Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    value={smtpConfig.fromEmail}
                    onChange={(e) => setSMTPConfig({ ...smtpConfig, fromEmail: e.target.value })}
                    placeholder="notifications@company.com"
                  />
                </div>

                <div>
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={smtpConfig.fromName}
                    onChange={(e) => setSMTPConfig({ ...smtpConfig, fromName: e.target.value })}
                    placeholder="CMS - Consent Management System"
                  />
                </div>

                <div>
                  <Label htmlFor="replyToEmail">Reply-To Email</Label>
                  <Input
                    id="replyToEmail"
                    value={smtpConfig.replyToEmail}
                    onChange={(e) => setSMTPConfig({ ...smtpConfig, replyToEmail: e.target.value })}
                    placeholder="support@company.com"
                  />
                </div>

                <div className="pt-4">
                  <Label htmlFor="testEmail">Test Email Address</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="testEmail"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="test@example.com"
                    />
                    <Button onClick={handleSendTestEmail}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="templates">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Email Templates</h3>
              <Button onClick={() => setIsCreateTemplateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex gap-1">
                        <Badge variant="outline">
                          {NOTIFICATION_TYPES.find(t => t.value === template.type)?.label}
                        </Badge>
                        {template.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Subject:</p>
                      <p className="text-sm font-medium">{template.subject}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Variables ({template.variables.length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.slice(0, 3).map(variable => (
                          <Badge key={variable} variant="outline" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                        {template.variables.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.variables.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Usage count:</span>
                      <span className="font-medium">{template.usageCount.toLocaleString()}</span>
                    </div>

                    <div className="flex gap-1 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                <strong>Available Template Variables:</strong><br />
                {TEMPLATE_VARIABLES.join(', ')}<br />
                These will be automatically replaced with actual values when emails are sent.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>

        {/* Notification Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Notification Delivery Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Delivery</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notificationLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <span className="font-medium">{log.templateName}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{log.recipient}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{log.subject}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <Badge className={getStatusColor(log.status)}>
                            {log.status.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {log.sentAt.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {log.deliveryStatus && (
                          <Badge className={getStatusColor(log.deliveryStatus)}>
                            {log.deliveryStatus.toUpperCase()}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};