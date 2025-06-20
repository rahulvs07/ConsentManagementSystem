import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Shield, 
  Building2, 
  Scale, 
  Settings, 
  UserCheck, 
  Eye,
  Heart,
  Globe,
  CheckCircle,
  AlertTriangle,
  Lock,
  Smartphone
} from 'lucide-react';

interface LoginFormProps {
  onLogin: (userType: 'DATA_PRINCIPAL' | 'DPO' | 'SYSTEM_ADMIN' | 'DATA_FIDUCIARY' | 'DATA_PROCESSOR', userInfo?: any) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showDataPrincipalOptions, setShowDataPrincipalOptions] = useState(false);
  const [dataPrincipalType, setDataPrincipalType] = useState<'new' | 'existing' | 'minor'>('existing');

  const userRoles = [
    {
      id: 'DATA_PRINCIPAL',
      title: 'Data Principal',
      description: 'Individual users managing their personal data and consent preferences',
      icon: <User className="h-6 w-6" />,
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      features: [
        'Complete consent lifecycle management',
        'Granular privacy controls',
        'Data access & portability rights',
        'Real-time consent tracking',
        'Minor protection with guardian verification'
      ],
      demoCredentials: { email: 'alice@example.com', password: 'demo123' }
    },
    {
      id: 'DPO',
      title: 'Data Protection Officer',
      description: 'Ensuring DPDP Act compliance and managing privacy governance',
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-green-50 border-green-200 text-green-800',
      features: [
        'Privacy impact assessments',
        'Compliance monitoring',
        'Breach management',
        'Audit oversight'
      ],
      demoCredentials: { email: 'dpo@company.com', password: 'demo123' }
    },
    {
      id: 'DATA_FIDUCIARY',
      title: 'Data Fiduciary',
      description: 'Organizations collecting and processing personal data',
      icon: <Building2 className="h-6 w-6" />,
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      features: [
        'Consent notice management',
        'Processing purpose tracking',
        'Multi-language support',
        'Integration APIs'
      ],
      demoCredentials: { email: 'fiduciary@company.com', password: 'demo123' }
    },
    {
      id: 'DATA_PROCESSOR',
      title: 'Data Processor',
      description: 'Third-party processors handling data on behalf of fiduciaries',
      icon: <Settings className="h-6 w-6" />,
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      features: [
        'Processing agreement tracking',
        'Consent validation APIs',
        'Data security compliance',
        'Audit trail access'
      ],
      demoCredentials: { email: 'processor@company.com', password: 'demo123' }
    },
    {
      id: 'SYSTEM_ADMIN',
      title: 'System Administrator',
      description: 'Managing the entire DPDP compliance platform',
      icon: <UserCheck className="h-6 w-6" />,
      color: 'bg-red-50 border-red-200 text-red-800',
      features: [
        'User role management',
        'System configuration',
        'Data retention policies',
        'Platform analytics'
      ],
      demoCredentials: { email: 'admin@system.com', password: 'demo123' }
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    if (roleId === 'DATA_PRINCIPAL') {
      setShowDataPrincipalOptions(true);
    } else {
      setShowDataPrincipalOptions(false);
      const role = userRoles.find(r => r.id === roleId);
      if (role) {
        setCredentials(role.demoCredentials);
      }
    }
  };

  const handleDataPrincipalLogin = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const userInfo = {
        id: `dp_${Date.now()}`,
        email: credentials.email || 'demo@example.com',
        name: dataPrincipalType === 'minor' ? 'Alex Smith (Minor)' : 'Alex Smith',
        role: 'DATA_PRINCIPAL',
        isMinor: dataPrincipalType === 'minor',
        isNewUser: dataPrincipalType === 'new',
        digiLockerVerified: dataPrincipalType === 'minor',
        preferredLanguage: 'english',
        createdAt: new Date(),
        notificationPreferences: {
          email: true,
          sms: true,
          inApp: true
        }
      };
      
      onLogin('DATA_PRINCIPAL', userInfo);
      setIsLoading(false);
    }, 1000);
  };

  const handleLogin = () => {
    if (selectedRole === 'DATA_PRINCIPAL') {
      handleDataPrincipalLogin();
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      onLogin(selectedRole as any);
      setIsLoading(false);
    }, 1000);
  };

  const selectedRoleData = userRoles.find(role => role.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">CMS</h1>
          </div>
          <h2 className="text-xl text-gray-700 font-medium">Consent Management System</h2>
          <p className="text-gray-600 mt-3">
            Advanced privacy controls with comprehensive consent management,
            and regulatory adherence under Comply Ark's prototype framework.
          </p>
        </div>

        {!selectedRole ? (
          // Role Selection
          <div className="space-y-6">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-blue-900">Choose Your Role</CardTitle>
                <CardDescription className="text-blue-700">
                  Select your role to access the appropriate dashboard and features
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRoles.map((role) => (
                <Card 
                  key={role.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${role.color} border-2`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-3">
                      {role.icon}
                    </div>
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {role.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Key Features:</h4>
                      <ul className="text-xs space-y-1">
                        {role.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3" />
                            {feature}
                          </li>
                        ))}
                        {role.features.length > 3 && (
                          <li className="text-gray-600">+ {role.features.length - 3} more features</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Data Principal Spotlight */}
            <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900 mb-1">New to Data Protection?</h3>
                    <p className="text-green-700 text-sm">
                      Start as a <strong>Data Principal</strong> to experience the complete consent lifecycle, 
                      granular privacy controls, and your rights under CMS.
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleRoleSelect('DATA_PRINCIPAL')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : showDataPrincipalOptions ? (
          // Data Principal Specific Options
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSelectedRole('');
                      setShowDataPrincipalOptions(false);
                    }}
                  >
                    ← Back
                  </Button>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Data Principal Login
                    </CardTitle>
                    <CardDescription>
                      Choose your experience type to access personalized consent management
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Tabs value={dataPrincipalType} onValueChange={(value) => setDataPrincipalType(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="existing" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Existing User
                </TabsTrigger>
                <TabsTrigger value="new" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  New User
                </TabsTrigger>
                <TabsTrigger value="minor" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Minor (Under 18)
                </TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Welcome Back!
                    </CardTitle>
                    <CardDescription>
                      Access your existing consent dashboard and manage your privacy preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={credentials.email}
                          onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={credentials.password}
                          onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <Alert>
                      <Eye className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Demo Access:</strong> Use alice@example.com / demo123 to explore the full dashboard
                      </AlertDescription>
                    </Alert>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">What You'll Access:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3" />
                          Active consent management
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3" />
                          Data request processing
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3" />
                          Consent renewal notifications
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3" />
                          Complete audit trail
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="new" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      New User Experience
                    </CardTitle>
                    <CardDescription>
                      Start your data protection journey with guided consent collection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert className="border-blue-200 bg-blue-50">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>New User Flow:</strong> You'll experience the complete consent collection process 
                        including purpose selection, language preferences, and consent artifact creation.
                      </AlertDescription>
                    </Alert>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-3">Your Journey Will Include:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">1</div>
                          <span className="text-blue-800">Language selection (22 Indian languages supported)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">2</div>
                          <span className="text-blue-800">Granular consent for 8 processing purposes</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">3</div>
                          <span className="text-blue-800">Tamper-proof consent artifact creation</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">4</div>
                          <span className="text-blue-800">Immediate access to your privacy dashboard</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="new-email">Email Address</Label>
                      <Input
                        id="new-email"
                        type="email"
                        placeholder="Enter your email to begin"
                        value={credentials.email}
                        onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="minor" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-orange-600" />
                      Minor Protection Mode
                    </CardTitle>
                    <CardDescription>
                      Enhanced protections with parent/guardian verification under CMS
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert className="border-orange-200 bg-orange-50">
                      <Lock className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">
                        <strong>Special Protections:</strong> As a minor, additional verification steps ensure 
                        your parent or guardian approves all data processing activities.
                      </AlertDescription>
                    </Alert>

                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h4 className="font-medium text-orange-900 mb-3">Minor-Specific Features:</h4>
                      <div className="space-y-2 text-sm text-orange-800">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          DigiLocker integration for parent verification
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Enhanced consent validation process
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Parental oversight dashboard access
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Automatic age verification at 18
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minor-email">Your Email</Label>
                        <Input
                          id="minor-email"
                          type="email"
                          placeholder="minor@example.com"
                          value={credentials.email}
                          onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Select defaultValue="16">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 18 }, (_, i) => i + 1).map(age => (
                              <SelectItem key={age} value={age.toString()}>{age} years</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Alert>
                      <Smartphone className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Demo Note:</strong> DigiLocker verification will be simulated for demonstration purposes
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-center">
              <Button 
                onClick={handleLogin}
                disabled={isLoading}
                className="px-8 py-3 text-lg"
                size="lg"
              >
                {isLoading ? (
                  'Initializing Dashboard...'
                ) : dataPrincipalType === 'new' ? (
                  'Start Consent Journey'
                ) : dataPrincipalType === 'minor' ? (
                  'Begin with Parent Verification'
                ) : (
                  'Access My Dashboard'
                )}
              </Button>
            </div>
          </div>
        ) : (
          // Standard Login for Other Roles
          <div className="max-w-md mx-auto space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedRole('')}
                  >
                    ← Back
                  </Button>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {selectedRoleData?.icon}
                      {selectedRoleData?.title} Login
                    </CardTitle>
                    <CardDescription>
                      {selectedRoleData?.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                
                <Alert>
                  <Eye className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Demo Access:</strong> Credentials are pre-filled for demonstration
                  </AlertDescription>
                </Alert>

                <Button onClick={handleLogin} disabled={isLoading} className="w-full">
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
