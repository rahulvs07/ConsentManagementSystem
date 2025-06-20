
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface ConsentPurpose {
  id: string;
  title: string;
  description: string;
  essential: boolean;
  legalBasis: string;
  retentionPeriod: string;
  dataTypes: string[];
}

const ConsentNotice = () => {
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const purposes: ConsentPurpose[] = [
    {
      id: 'account',
      title: 'Account Management',
      description: 'Processing necessary for account creation, login, and basic service delivery',
      essential: true,
      legalBasis: 'Contractual necessity under DPDP Act 2023',
      retentionPeriod: 'Until account deletion + 3 years for legal compliance',
      dataTypes: ['Name', 'Email', 'Phone Number', 'Account Preferences']
    },
    {
      id: 'marketing',
      title: 'Marketing Communications',
      description: 'Sending promotional emails, newsletters, and personalized offers',
      essential: false,
      legalBasis: 'Consent under Section 7 of DPDP Act 2023',
      retentionPeriod: '2 years from last interaction or until consent withdrawal',
      dataTypes: ['Email', 'Communication Preferences', 'Interaction History']
    },
    {
      id: 'analytics',
      title: 'Analytics & Performance',
      description: 'Analyzing usage patterns to improve our services and user experience',
      essential: false,
      legalBasis: 'Legitimate interest with consent under DPDP Act 2023',
      retentionPeriod: '13 months from collection date',
      dataTypes: ['Usage Data', 'Device Information', 'Performance Metrics']
    },
    {
      id: 'personalization',
      title: 'Content Personalization',
      description: 'Customizing content and recommendations based on your preferences',
      essential: false,
      legalBasis: 'Consent under Section 7 of DPDP Act 2023',
      retentionPeriod: '24 months or until consent withdrawal',
      dataTypes: ['Behavioral Data', 'Preferences', 'Interaction Patterns']
    }
  ];

  const handleConsentChange = (purposeId: string, granted: boolean) => {
    setConsents(prev => ({
      ...prev,
      [purposeId]: granted
    }));
  };

  const toggleDetails = (purposeId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [purposeId]: !prev[purposeId]
    }));
  };

  const handleSubmit = () => {
    // Here you would typically send the consent data to your backend
    console.log('Consent preferences:', consents);
    setSubmitted(true);
  };

  const allEssentialConsented = purposes
    .filter(p => p.essential)
    .every(p => consents[p.id] !== false);

  if (submitted) {
    return (
      <Card className="glass-card border-0 shadow-2xl max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Consent Preferences Saved</h2>
          <p className="text-slate-600 mb-6">
            Your privacy preferences have been recorded in compliance with DPDP Act 2023.
            You can update these preferences at any time from your account settings.
          </p>
          <Button onClick={() => setSubmitted(false)} className="bg-gradient-to-r from-blue-600 to-indigo-600">
            Update Preferences
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Privacy Notice Header */}
      <Card className="glass-card border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Privacy Notice & Consent Management
            </span>
          </CardTitle>
          <CardDescription className="text-slate-600">
            In compliance with the Digital Personal Data Protection Act 2023, we need your consent for specific data processing activities. Please review each purpose carefully.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Your Rights:</strong> You can withdraw consent at any time, request data deletion, 
              access your data, or file a grievance. Essential services marked below are required for basic functionality.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Consent Purposes */}
      <div className="space-y-4">
        {purposes.map((purpose) => (
          <Card key={purpose.id} className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{purpose.title}</h3>
                    {purpose.essential && (
                      <Badge className="status-badge-info">
                        <Shield className="w-3 h-3 mr-1" />
                        Essential
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-600 mb-3">{purpose.description}</p>
                  
                  {/* Consent Toggle */}
                  <div className="flex items-center space-x-4 mb-3">
                    {purpose.essential ? (
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          checked={true} 
                          disabled 
                          className="bg-blue-100 border-blue-300"
                        />
                        <Label className="text-sm text-slate-700">
                          Required for service delivery (cannot be disabled)
                        </Label>
                      </div>
                    ) : (
                      <RadioGroup
                        value={consents[purpose.id] === true ? 'grant' : consents[purpose.id] === false ? 'deny' : ''}
                        onValueChange={(value) => handleConsentChange(purpose.id, value === 'grant')}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="grant" id={`${purpose.id}-grant`} />
                          <Label htmlFor={`${purpose.id}-grant`} className="text-sm font-medium text-green-700">
                            I consent
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="deny" id={`${purpose.id}-deny`} />
                          <Label htmlFor={`${purpose.id}-deny`} className="text-sm font-medium text-red-700">
                            I do not consent
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  </div>

                  {/* Details Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDetails(purpose.id)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    {showDetails[purpose.id] ? 'Hide Details' : 'Show Details'}
                  </Button>
                </div>
              </div>

              {/* Detailed Information */}
              {showDetails[purpose.id] && (
                <div className="mt-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Legal Basis</h4>
                      <p className="text-slate-600">{purpose.legalBasis}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Data Retention</h4>
                      <p className="text-slate-600">{purpose.retentionPeriod}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-slate-800 mb-2">Data Types Processed</h4>
                      <div className="flex flex-wrap gap-2">
                        {purpose.dataTypes.map((dataType, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {dataType}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit Actions */}
      <Card className="glass-card border-0 shadow-xl">
        <CardContent className="p-6">
          {!allEssentialConsented && (
            <Alert className="mb-4 border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Please note that essential services are required for basic platform functionality and cannot be disabled.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-600">
              <p>By submitting, you acknowledge that you have read and understand our privacy practices.</p>
              <p className="mt-1">You can modify these preferences at any time from your account settings.</p>
            </div>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-2"
            >
              Save Consent Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentNotice;
