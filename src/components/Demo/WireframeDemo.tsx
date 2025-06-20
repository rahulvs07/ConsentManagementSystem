import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Monitor, 
  Smartphone, 
  Layout, 
  Target, 
  CheckCircle, 
  Globe, 
  Shield, 
  FileText,
  RefreshCw,
  XCircle,
  Eye,
  Code,
  Zap,
  Settings
} from 'lucide-react';
import LoginConsentBanner from '@/components/Consent/LoginConsentBanner';

export default function WireframeDemo() {
  const [displayMode, setDisplayMode] = useState<'banner' | 'modal'>('banner');
  const [showConsent, setShowConsent] = useState(true);
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [language, setLanguage] = useState('english');
  const [completedConsents, setCompletedConsents] = useState<any[]>([]);

  const handleConsentCompleted = (artifact: any) => {
    setCompletedConsents(prev => [...prev, artifact]);
    setShowConsent(false);
    setTimeout(() => {
      alert(`✅ Consent Successfully Submitted!\n\nPurposes: ${artifact.purposes.length}\nLanguage: ${artifact.language}\nTimestamp: ${artifact.timestamp.toLocaleString()}`);
    }, 500);
  };

  const handleConsentDismissed = () => {
    setShowConsent(false);
    setTimeout(() => {
      alert('⚠️ Consent Notice Dismissed\n\nSome features may be limited without proper consent.');
    }, 500);
  };

  const resetDemo = () => {
    setShowConsent(true);
    setCompletedConsents([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Layout className="h-8 w-8 text-purple-600" />
                Wireframe Implementation Demo
              </h1>
              <p className="text-gray-600 mt-2">
                Live demonstration of the BRD-compliant login consent banner implementation
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                BRD Section 4.1.1 Compliant
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                <Shield className="h-3 w-3 mr-1" />
                DPDP Act 2023 Ready
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="demo" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
            <TabsTrigger value="wireframe">Wireframe Spec</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="compliance">BRD Compliance</TabsTrigger>
          </TabsList>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            {/* Demo Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Demo Configuration
                </CardTitle>
                <CardDescription>
                  Configure the consent banner display and interaction settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <Label className="text-sm font-medium">Display Mode</Label>
                    <select
                      value={displayMode}
                      onChange={(e) => setDisplayMode(e.target.value as 'banner' | 'modal')}
                      className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option value="banner">Banner (Wireframe Default)</option>
                      <option value="modal">Modal Dialog</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Device View</Label>
                    <select
                      value={deviceView}
                      onChange={(e) => setDeviceView(e.target.value as 'desktop' | 'mobile')}
                      className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option value="desktop">Desktop</option>
                      <option value="mobile">Mobile</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Language</Label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                      <option value="telugu">Telugu</option>
                      <option value="tamil">Tamil</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={resetDemo}
                      className="w-full flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reset Demo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wireframe Simulation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {deviceView === 'desktop' ? <Monitor className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
                  Wireframe Simulation - {deviceView === 'desktop' ? 'Desktop' : 'Mobile'} View
                </CardTitle>
                <CardDescription>
                  Simulated login dashboard with consent banner integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`border-2 border-gray-300 rounded-lg overflow-hidden ${
                  deviceView === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
                }`}>
                  {/* Simulated Header */}
                  <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-600 rounded"></div>
                        <nav className="hidden md:flex space-x-6 text-sm">
                          <span className="text-blue-600 font-medium">Home</span>
                          <span className="text-gray-600">Consent History</span>
                          <span className="text-gray-600">Settings</span>
                        </nav>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">Profile</span>
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Welcome Section */}
                  <div className="bg-gray-50 px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-900">Welcome back, Alice Smith!</h2>
                    <p className="text-gray-600 text-sm mt-1">Manage your data consents and privacy preferences.</p>
                  </div>

                  {/* Consent Banner Integration */}
                  <div className="px-6 py-4 bg-white">
                    {showConsent ? (
                      <LoginConsentBanner
                        userId="demo_user_001"
                        userName="Alice Smith"
                        displayMode={displayMode}
                        onConsentCompleted={handleConsentCompleted}
                        onConsentDismissed={handleConsentDismissed}
                      />
                    ) : (
                      <div className="text-center py-8 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-green-900">Consent Process Complete</h3>
                        <p className="text-green-700 text-sm mt-1">
                          You can now access all dashboard features
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetDemo}
                          className="mt-3"
                        >
                          Reset Demo
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Simulated Main Content */}
                  <div className="px-6 py-4 bg-gray-50 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-medium text-gray-900">Account Details</h4>
                        <p className="text-gray-600 text-sm mt-1">Personal information</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-medium text-gray-900">Notifications</h4>
                        <p className="text-gray-600 text-sm mt-1">Recent updates</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo Results */}
            {completedConsents.length > 0 && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    Consent Artifacts Created
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Successfully processed consent submissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {completedConsents.map((consent, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">Artifact #{index + 1}</span>
                          <Badge variant="outline" className="bg-green-100 text-green-700">
                            {consent.purposes.length} Purposes
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Language: {consent.language}</p>
                          <p>Timestamp: {consent.timestamp.toLocaleString()}</p>
                          <p>Method: {consent.consentMethod}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Wireframe Spec Tab */}
          <TabsContent value="wireframe" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Original Wireframe Specification
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of the wireframe requirements and implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                    <pre>{`+--------------------------------------------------------------+
|                         HEADER                             |
|  [Logo]  |  Home  |  Consent History  |  Settings  | Profile  |
+--------------------------------------------------------------+
|                                                              |
|     Welcome back, [User]!                                    |
|                                                              |
+--------------------------------------------------------------+
|                                                              |
|  [Consent Notice Banner / Modal]                             |
|  +--------------------------------------------------------+  |
|  | [Icon] Important Consent Notice                      |  |
|  |--------------------------------------------------------|  |
|  | Data Collection Notice:                                |  |
|  |                                                        |  |
|  | • Purpose: Account Creation (Mandatory)              |  |
|  |   [☑] I Agree                                          |  |
|  |                                                        |  |
|  | • Purpose: Marketing (Optional)                        |  |
|  |   [☐] I Agree                                          |  |
|  |                                                        |  |
|  | [Learn More about how we use your data]                |  |
|  |                                                        |  |
|  | [Submit Consent]               [Dismiss/Close]         |  |
|  +--------------------------------------------------------+  |
|                                                              |
+--------------------------------------------------------------+
|                                                              |
|  [Main Dashboard Content]                                    |
|  - Account details                                           |
|  - Notifications                                             |
|  - Quick links, etc.                                         |
|                                                              |
+--------------------------------------------------------------+`}</pre>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Implementation Features</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Header navigation with logo and menu items
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Personalized welcome message
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Consent notice banner with icon and title
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Purpose-specific consent controls
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Mandatory/Optional purpose classification
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Learn More informational links
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Submit and Dismiss action buttons
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Dashboard content below consent notice
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Adaptive Considerations</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Mobile-responsive full-screen modal
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Touch-friendly controls for mobile
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          WCAG accessibility compliance
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Multi-language support integration
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Real-time API integration
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Audit trail logging
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Dashboard state refresh post-consent
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Layout className="h-5 w-5 text-blue-600" />
                    Wireframe Fidelity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Exact layout reproduction
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Component positioning
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Visual hierarchy
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Interactive elements
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                    BRD Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Section 4.1.1 requirements
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Purpose-specific consent
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      No pre-selection policy
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Explicit affirmative action
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="h-5 w-5 text-purple-600" />
                    Multi-language
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      22 scheduled languages
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Dynamic translation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Language selector UI
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      RTL support ready
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* BRD Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  BRD Section 4.1.1 Compliance Matrix
                </CardTitle>
                <CardDescription>
                  Detailed mapping of implementation features to BRD requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">BRD Requirement</th>
                        <th className="text-left p-3 font-medium">Implementation</th>
                        <th className="text-center p-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-3">User-Friendly Interface</td>
                        <td className="p-3">Intuitive banner/modal with clear visual hierarchy</td>
                        <td className="p-3 text-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3">Purpose-Specific Consent</td>
                        <td className="p-3">Individual controls for each purpose (P-001, P-002)</td>
                        <td className="p-3 text-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3">Granular Consent</td>
                        <td className="p-3">Separate toggle switches for each purpose</td>
                        <td className="p-3 text-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3">Explicit and Affirmative Action</td>
                        <td className="p-3">No pre-checked options, explicit submit button</td>
                        <td className="p-3 text-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3">Multi-Language Support</td>
                        <td className="p-3">Language selector with scheduled languages</td>
                        <td className="p-3 text-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3">Consent Metadata Logging</td>
                        <td className="p-3">Complete artifact creation with all required fields</td>
                        <td className="p-3 text-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 