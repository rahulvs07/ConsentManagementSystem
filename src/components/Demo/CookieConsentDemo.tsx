import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Cookie, 
  Shield, 
  User, 
  Server, 
  Settings, 
  Eye,
  FileText,
  History,
  Globe,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Bell
} from 'lucide-react';
import CookieConsentManager from '@/components/Consent/CookieConsentManager';
import { CookieCategory, CookieConsent } from '@/types/dpdp';

// Enhanced demo interfaces
interface CookieAuditEntry {
  id: string;
  userId: string;
  sessionId: string;
  action: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  categories: CookieCategory[];
  preferences: Record<CookieCategory, boolean>;
  policyVersion: string;
  language: string;
  metadata: Record<string, any>;
}

interface RoleScenario {
  role: 'data_principal' | 'data_fiduciary' | 'data_processor' | 'admin' | 'dpo';
  name: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
}

const CookieConsentDemo = () => {
  const [currentRole, setCurrentRole] = useState<'data_principal' | 'data_fiduciary' | 'data_processor' | 'admin' | 'dpo'>('data_principal');
  const [currentConsent, setCurrentConsent] = useState<CookieConsent | undefined>();
  const [auditLog, setAuditLog] = useState<CookieAuditEntry[]>([]);
  const [showBanner, setShowBanner] = useState(true);
  const [policyVersion, setPolicyVersion] = useState('1.0');
  const [language, setLanguage] = useState('en');
  const [realTimeSync, setRealTimeSync] = useState(true);

  // BRD Section 4.2 Role Scenarios
  const roleScenarios: RoleScenario[] = [
    {
      role: 'data_principal',
      name: 'Data Principal (User)',
      description: 'End user experiencing cookie consent flow with granular control',
      features: [
        'Cookie banner on first visit',
        'Granular category selection',
        'Multi-language support',
        'Real-time preference updates',
        'Consent history viewing',
        'Policy change notifications'
      ],
      icon: <User className="h-6 w-6" />,
      color: 'blue'
    },
    {
      role: 'data_fiduciary',
      name: 'Data Fiduciary',
      description: 'Organization implementing and enforcing cookie consent policies',
      features: [
        'Policy configuration',
        'Consent enforcement',
        'Downstream API integration',
        'Notification triggers',
        'Compliance monitoring',
        'Multi-language content management'
      ],
      icon: <Shield className="h-6 w-6" />,
      color: 'green'
    },
    {
      role: 'data_processor',
      name: 'Data Processor',
      description: 'Third-party services validating consent before tag execution',
      features: [
        'Real-time consent validation',
        'Tag enforcement decisions',
        'Audit logging of all actions',
        'Consent status API calls',
        'Automatic processing halt',
        'Session data purging'
      ],
      icon: <Server className="h-6 w-6" />,
      color: 'purple'
    },
    {
      role: 'admin',
      name: 'Administrator',
      description: 'System admin configuring cookie categories and policies',
      features: [
        'Category definition & ordering',
        'Auto-expiry configuration',
        'Translation management',
        'Retention policy setup',
        'Default state configuration',
        'Policy versioning'
      ],
      icon: <Settings className="h-6 w-6" />,
      color: 'orange'
    },
    {
      role: 'dpo',
      name: 'Data Protection Officer',
      description: 'DPO monitoring compliance and auditing cookie consent',
      features: [
        'Immutable audit log review',
        'Compliance reporting',
        'Policy change monitoring',
        'Consent statistics analysis',
        'DPDP Act compliance verification',
        'Training & oversight'
      ],
      icon: <Eye className="h-6 w-6" />,
      color: 'red'
    }
  ];

  const handleConsentChange = (consent: CookieConsent) => {
    setCurrentConsent(consent);
    setShowBanner(false);
    console.log('Consent updated:', consent);
  };

  const handleAuditLog = (entry: CookieAuditEntry) => {
    setAuditLog(prev => [entry, ...prev]);
    console.log('Audit entry:', entry);
  };

  const simulatePolicyChange = () => {
    const newVersion = (parseFloat(policyVersion) + 0.1).toFixed(1);
    setPolicyVersion(newVersion);
    setShowBanner(true);
    setCurrentConsent(undefined);
  };

  const simulateConsentExpiry = () => {
    if (currentConsent) {
      const expiredConsent = {
        ...currentConsent,
        expiryDate: new Date(Date.now() - 86400000) // 1 day ago
      };
      setCurrentConsent(expiredConsent);
      setShowBanner(true);
    }
  };

  const resetDemo = () => {
    setCurrentConsent(undefined);
    setShowBanner(true);
    setAuditLog([]);
    setPolicyVersion('1.0');
  };

  const getCurrentScenario = () => {
    return roleScenarios.find(scenario => scenario.role === currentRole);
  };

  const getConsentStats = () => {
    if (!currentConsent) return null;
    
    const enabledCategories = Object.values(currentConsent.preferences).filter(Boolean).length;
    const totalCategories = Object.keys(currentConsent.preferences).length;
    
    return {
      enabledCategories,
      totalCategories,
      complianceRate: Math.round((enabledCategories / totalCategories) * 100),
      lastUpdated: currentConsent.timestamp,
      expiryDate: currentConsent.expiryDate,
      version: currentConsent.version
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Demo Header */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-3">
              <Cookie className="h-8 w-8" />
              BRD Section 4.2: Cookie Consent Compliance Demo
            </CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Comprehensive demonstration of DPDP Act 2023 compliant cookie consent management
              with role-based functionality and real-time enforcement
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Role Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Role-Based Demonstration
            </CardTitle>
            <CardDescription>
              Select a role to see how cookie consent works from different perspectives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {roleScenarios.map((scenario) => (
                <Card 
                  key={scenario.role}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    currentRole === scenario.role 
                      ? `border-${scenario.color}-500 bg-${scenario.color}-50` 
                      : 'border-gray-200'
                  }`}
                  onClick={() => setCurrentRole(scenario.role)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`mx-auto mb-3 p-3 rounded-full bg-${scenario.color}-100 text-${scenario.color}-600 w-fit`}>
                      {scenario.icon}
                    </div>
                    <h3 className="font-semibold text-sm mb-2">{scenario.name}</h3>
                    <Badge 
                      variant={currentRole === scenario.role ? "default" : "outline"}
                      className="text-xs"
                    >
                      {currentRole === scenario.role ? 'Active' : 'Select'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Role Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getCurrentScenario()?.icon}
                {getCurrentScenario()?.name}
              </CardTitle>
              <CardDescription>
                {getCurrentScenario()?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Role Capabilities:</h4>
                  <ul className="space-y-1">
                    {getCurrentScenario()?.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Demo Controls:</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={simulatePolicyChange}
                      className="w-full"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Simulate Policy Change
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={simulateConsentExpiry}
                      className="w-full"
                      disabled={!currentConsent}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Simulate Consent Expiry
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetDemo}
                      className="w-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset Demo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Consent Manager */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cookie className="h-5 w-5" />
                  Cookie Consent Manager
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">v{policyVersion}</Badge>
                  <Badge variant={realTimeSync ? "default" : "outline"}>
                    {realTimeSync ? 'Live Sync' : 'Offline'}
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>
                Interactive cookie consent interface with BRD Section 4.2 compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Consent Status */}
                {currentConsent && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Consent Active:</strong> {getConsentStats()?.enabledCategories}/{getConsentStats()?.totalCategories} categories enabled 
                      • Expires: {getConsentStats()?.expiryDate.toLocaleDateString()}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Cookie Consent Component */}
                <div className="min-h-[400px] border rounded-lg p-4 bg-white">
                  <CookieConsentManager
                    userId={`demo_user_${currentRole}`}
                    domain="demo.dpdp-compliance.com"
                    showBanner={showBanner}
                    onConsentChange={handleConsentChange}
                    onAuditLog={handleAuditLog}
                    currentConsent={currentConsent}
                    language={language}
                    userRole={currentRole}
                    policyVersion={policyVersion}
                    apiEndpoint="/api/cookie-consent"
                    enableRealTimeSync={realTimeSync}
                    autoExpiryMonths={6}
                    showAdvancedControls={currentRole !== 'data_principal'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics & Audit */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="api">API Demo</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Consent Rate</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {currentConsent ? `${getConsentStats()?.complianceRate}%` : '0%'}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Audit Entries</p>
                      <p className="text-2xl font-bold text-green-600">{auditLog.length}</p>
                    </div>
                    <History className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Policy Version</p>
                      <p className="text-2xl font-bold text-purple-600">v{policyVersion}</p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Real-time Sync</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {realTimeSync ? 'ON' : 'OFF'}
                      </p>
                    </div>
                    <Globe className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Cookie Consent Audit Trail
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </CardTitle>
                <CardDescription>
                  Immutable log of all cookie consent activities for DPDP Act compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLog.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No audit entries yet. Interact with the cookie consent to generate logs.</p>
                    </div>
                  ) : (
                    auditLog.map((entry) => (
                      <Card key={entry.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant={entry.action.includes('GRANTED') ? 'default' : 'outline'}>
                              {entry.action.replace('_', ' ')}
                            </Badge>
                            <span className="text-sm font-medium">
                              {entry.timestamp.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {entry.categories.length} categories • {entry.language} • v{entry.policyVersion}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {entry.userId}
                          </Badge>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>DPDP Act 2023 Compliance</CardTitle>
                  <CardDescription>
                    Verification of compliance with Indian data protection regulations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      'Granular consent categories',
                      'Multi-language support (Eighth Schedule)',
                      'Affirmative action requirement',
                      'Real-time consent updates',
                      'Immutable audit logging',
                      'Auto-expiry with renewal',
                      'Policy change notifications',
                      'Data minimization enforcement'
                    ].map((requirement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>BRD Section 4.2 Features</CardTitle>
                  <CardDescription>
                    Implementation of Business Requirements Document specifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      'Role-based functionality',
                      'Cookie category management',
                      'Policy versioning system',
                      'Real-time enforcement',
                      'Third-party integration',
                      'Consent validation API',
                      'Tag enforcement controls',
                      'Compliance reporting'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API Demo Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cookie Consent API Integration</CardTitle>
                <CardDescription>
                  Demonstration of API endpoints for real-time consent validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    <div className="mb-2">// Data Processor consent validation</div>
                    <div className="text-blue-400">GET</div> /api/cookie-consent/status?userId=demo_user_{currentRole}
                    <div className="mt-2 text-gray-300">
                      Response: {currentConsent ? JSON.stringify({
                        userId: currentConsent.userId,
                        categories: currentConsent.categories,
                        preferences: currentConsent.preferences,
                        version: currentConsent.version,
                        expiryDate: currentConsent.expiryDate
                      }, null, 2) : '{ "error": "No active consent" }'}
                    </div>
                  </div>

                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    <div className="mb-2">// Real-time consent update</div>
                    <div className="text-yellow-400">POST</div> /api/cookie-consent/update
                    <div className="mt-2 text-gray-300">
                      Payload: {JSON.stringify({
                        userId: `demo_user_${currentRole}`,
                        categories: ['essential', 'analytics'],
                        source: 'user_preferences',
                        timestamp: new Date().toISOString()
                      }, null, 2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CookieConsentDemo;