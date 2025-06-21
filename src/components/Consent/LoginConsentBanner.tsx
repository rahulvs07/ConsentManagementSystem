import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Shield, 
  FileText, 
  Globe, 
  Info,
  X,
  Lock,
  RefreshCw
} from 'lucide-react';

interface LoginConsentBannerProps {
  userId: string;
  userName: string;
  displayMode?: 'banner' | 'modal';
  onConsentCompleted?: (artifact: any) => void;
  onConsentDismissed?: () => void;
}

export default function LoginConsentBanner({ 
  userId, 
  userName,
  displayMode = 'banner',
  onConsentCompleted, 
  onConsentDismissed
}: LoginConsentBannerProps) {
  const [showNotice, setShowNotice] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userSelections, setUserSelections] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const mockRequirements = [
    {
      id: 'req_001',
      purposeId: 'P-001',
      purposeName: 'Account Creation',
      description: 'Essential for creating and managing your account, including identity verification and service delivery.',
      isEssential: true,
      isBlocking: true,
      dataTypes: ['Personal Information', 'Contact Details', 'Identity Documents'],
      retentionPeriod: '3 years'
    },
    {
      id: 'req_002',
      purposeId: 'P-002',
      purposeName: 'Marketing Communications',
      description: 'For sending promotional emails, newsletters, and personalized offers based on your preferences.',
      isEssential: false,
      isBlocking: false,
      dataTypes: ['Email Address', 'Preferences', 'Usage Patterns'],
      retentionPeriod: '2 years'
    }
  ];

  useEffect(() => {
    const detectConsentRequirements = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setShowNotice(true);
        const initialSelections: Record<string, boolean> = {};
        mockRequirements.forEach(req => {
          initialSelections[req.purposeId] = false;
        });
        setUserSelections(initialSelections);
      } catch (error) {
        console.error('Error detecting consent requirements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      detectConsentRequirements();
    }
  }, [userId]);

  const handlePurposeToggle = (purposeId: string, checked: boolean) => {
    setUserSelections(prev => ({
      ...prev,
      [purposeId]: checked
    }));
  };

  const handleSubmitConsent = async () => {
    try {
      setIsSubmitting(true);
      const mandatoryRequirements = mockRequirements.filter(req => req.isEssential);
      const missingMandatory = mandatoryRequirements.filter(req => !userSelections[req.purposeId]);
      
      if (missingMandatory.length > 0) {
        alert('Please provide consent for all mandatory purposes to continue.');
        return;
      }

      const consentArtifact = {
        id: `artifact_${Date.now()}`,
        userId,
        purposes: mockRequirements
          .filter(req => userSelections[req.purposeId])
          .map(req => ({
            id: req.purposeId,
            name: req.purposeName,
            description: req.description,
            isEssential: req.isEssential
          })),
        timestamp: new Date(),
        language: selectedLanguage,
        consentMethod: 'explicit_click'
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowNotice(false);
      onConsentCompleted?.(consentArtifact);
    } catch (error) {
      console.error('Error submitting consent:', error);
      alert('Error submitting consent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    const blockingRequirements = mockRequirements.filter(req => req.isBlocking);
    if (blockingRequirements.length > 0) {
      alert('Please provide consent for mandatory purposes to continue using the service.');
      return;
    }
    setShowNotice(false);
    onConsentDismissed?.();
  };

  const renderConsentNotice = () => (
    <div className="bg-white border border-blue-200 rounded-lg shadow-lg">
      {/* CMS Application Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Consent Management System</h2>
              <p className="text-blue-100 text-sm">Digital Personal Data Protection Act 2023 Compliance</p>
            </div>
          </div>
          {!mockRequirements.some(req => req.isBlocking) && (
            <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-white/70 hover:text-white hover:bg-white/10">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Lock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Important Consent Notice</h3>
              <p className="text-sm text-gray-600">Data Collection Notice</p>
            </div>
          </div>
          
          {/* Data Fiduciary Information */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Data Fiduciary:</span>
                <p className="text-gray-900">Privacy Flow Control System</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">DPO Contact:</span>
                <p className="text-gray-900">dpo@privacyflow.com</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Grievance Officer:</span>
                <p className="text-gray-900">grievance@privacyflow.com</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Notice Version:</span>
                <p className="text-gray-900">v1.0 - {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Globe className="w-4 h-4" />
            <span>Language:</span>
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="telugu">Telugu</option>
              <option value="tamil">Tamil</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {mockRequirements.map((requirement) => (
            <div key={requirement.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">
                      Purpose: {requirement.purposeName} ({requirement.purposeId})
                    </h4>
                    <Badge variant={requirement.isEssential ? "destructive" : "secondary"} className="text-xs">
                      {requirement.isEssential ? "Mandatory" : "Optional"}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{requirement.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">Data Types:</span>
                      <div>{requirement.dataTypes?.join(', ')}</div>
                    </div>
                    <div>
                      <span className="font-medium">Retention:</span>
                      <div>{requirement.retentionPeriod}</div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <Button variant="link" size="sm" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                      <Info className="w-3 h-3 mr-1" />
                      Learn More about how we use your data
                    </Button>
                  </div>
                </div>

                <div className="ml-4 flex flex-col items-center space-y-2">
                  <Switch
                    checked={userSelections[requirement.purposeId] || false}
                    onCheckedChange={(checked) => handlePurposeToggle(requirement.purposeId, checked)}
                    disabled={isSubmitting}
                  />
                  <Label className="text-xs text-center">I Agree</Label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-2">Your Rights Under DPDP Act 2023:</p>
                <div className="space-y-1 text-blue-700">
                  <p>📋 <strong>Access:</strong> Request a copy of your personal data</p>
                  <p>✏️ <strong>Correct:</strong> Update inaccurate or incomplete information</p>
                  <p>🗑️ <strong>Delete:</strong> Request erasure of your personal data</p>
                  <p>📤 <strong>Port:</strong> Transfer your data to another service provider</p>
                  <p>❌ <strong>Withdraw:</strong> Revoke consent at any time</p>
                </div>
              </div>
            </div>
            
            {/* User Rights Exercise URL */}
            <div className="bg-white p-3 rounded border border-blue-300">
              <div className="flex items-center space-x-2 mb-1">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900 text-sm">Exercise Your Rights:</span>
              </div>
              <p className="text-xs text-blue-700 break-all">
                <strong>Portal URL:</strong> https://privacyflow.com/data-rights
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Access this portal anytime to exercise your data protection rights or file grievances
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-white p-3 rounded border border-blue-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-medium text-blue-900">📧 Grievance Email:</span>
                  <p className="text-blue-700">grievance@privacyflow.com</p>
                </div>
                <div>
                  <span className="font-medium text-blue-900">📞 DPO Helpline:</span>
                  <p className="text-blue-700">+91-80-1234-5678</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            {!mockRequirements.some(req => req.isBlocking) && (
              <Button variant="ghost" onClick={handleDismiss} disabled={isSubmitting}>
                Dismiss
              </Button>
            )}
            <Button onClick={handleSubmitConsent} disabled={isSubmitting} className="flex items-center space-x-2">
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Submit Consent</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Checking consent requirements...</span>
      </div>
    );
  }

  if (!showNotice) return null;

  if (displayMode === 'modal') {
    return (
      <Dialog open={showNotice} onOpenChange={() => {}}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Consent Notice</DialogTitle>
            <DialogDescription>Data collection consent requirements</DialogDescription>
          </DialogHeader>
          {renderConsentNotice()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="w-full mb-6">
      {renderConsentNotice()}
    </div>
  );
} 