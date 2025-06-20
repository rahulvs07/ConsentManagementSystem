import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Shield, 
  AlertTriangle, 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock,
  ExternalLink,
  Smartphone,
  User,
  Mail,
  Phone,
  Upload as UploadIcon,
  Info,
  Lock
} from 'lucide-react';

interface ParentAuthenticationUIProps {
  minorName: string;
  minorEmail: string;
  minorAge: number;
  onDigiLockerVerification: (verificationData: DigiLockerVerificationData) => void;
  onManualSubmission: (submissionData: ManualSubmissionData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface DigiLockerVerificationData {
  parentAadhaar: string;
  verificationToken: string;
  parentName: string;
  relationship: string;
}

interface ManualSubmissionData {
  parentName: string;
  relationship: 'Mother' | 'Father' | 'Guardian';
  email: string;
  phone: string;
  idProofFile: File | null;
  consentFormFile: File | null;
}

interface ParentConsentRequest {
  id: string;
  requestId: string;
  childId: string;
  childName: string;
  childEmail: string;
  childAge: number;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  relationship: string;
  submittedAt: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  method: 'DIGILOCKER' | 'MANUAL';
  idProofFileName?: string;
  consentFormFileName?: string;
  dpoNotes?: string;
  processedAt?: Date;
  processedBy?: string;
}

export const ParentAuthenticationUI: React.FC<ParentAuthenticationUIProps> = ({
  minorName,
  minorEmail,
  minorAge,
  onDigiLockerVerification,
  onManualSubmission,
  onCancel,
  isLoading = false
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'digilocker' | 'manual' | null>(null);
  const [digiLockerData, setDigiLockerData] = useState<Partial<DigiLockerVerificationData>>({});
  const [manualData, setManualData] = useState<Partial<ManualSubmissionData>>({
    relationship: 'Father'
  });
  const [showDigiLockerDialog, setShowDigiLockerDialog] = useState(false);
  const [digiLockerStep, setDigiLockerStep] = useState<'connect' | 'otp' | 'verified'>('connect');
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');

  const handleDigiLockerConnect = () => {
    setShowDigiLockerDialog(true);
    setDigiLockerStep('connect');
  };

  const handleDigiLockerOTP = () => {
    setDigiLockerStep('otp');
    // Simulate DigiLocker OTP process
    setTimeout(() => {
      setDigiLockerStep('verified');
      setTimeout(() => {
        setShowDigiLockerDialog(false);
        const verificationData: DigiLockerVerificationData = {
          parentAadhaar: '****-****-' + Math.floor(Math.random() * 9000 + 1000),
          verificationToken: 'DL_' + Date.now(),
          parentName: 'Demo Parent Name',
          relationship: 'Father'
        };
        onDigiLockerVerification(verificationData);
      }, 2000);
    }, 3000);
  };

  const handleManualSubmission = () => {
    if (!manualData.parentName || !manualData.email || !manualData.phone || 
        !manualData.idProofFile || !manualData.consentFormFile) {
      alert('Please fill all required fields and upload both documents');
      return;
    }

    setSubmissionStatus('submitting');
    
    // Simulate submission process
    setTimeout(() => {
      const submissionData: ManualSubmissionData = {
        parentName: manualData.parentName!,
        relationship: manualData.relationship!,
        email: manualData.email!,
        phone: manualData.phone!,
        idProofFile: manualData.idProofFile!,
        consentFormFile: manualData.consentFormFile!
      };
      
      setSubmissionStatus('submitted');
      onManualSubmission(submissionData);
    }, 2000);
  };

  const handleFileUpload = (type: 'idProof' | 'consentForm', file: File | null) => {
    setManualData(prev => ({
      ...prev,
      [type === 'idProof' ? 'idProofFile' : 'consentFormFile']: file
    }));
  };

  if (submissionStatus === 'submitted') {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-xl">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <span className="text-green-800">Manual Consent Submitted</span>
          </CardTitle>
          <CardDescription className="text-green-700">
            Your parent/guardian consent request has been submitted for DPO approval
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>What happens next:</strong> Our Data Protection Officer will review the submitted documents 
              within 24-48 hours. You'll receive an email notification once the review is complete.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Submission Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Request ID:</span>
                  <span className="ml-2 font-mono">MINOR-{Date.now().toString().slice(-8)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Submitted:</span>
                  <span className="ml-2">{new Date().toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Parent Name:</span>
                  <span className="ml-2">{manualData.parentName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700">Pending Review</Badge>
                </div>
              </div>
            </div>
            
            <Button onClick={onCancel} className="w-full">
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-xl">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <Shield className="h-6 w-6 text-orange-600" />
            <span className="text-orange-800">Minor Consent Verification Required</span>
          </CardTitle>
          <CardDescription className="text-orange-700">
            You are signing up as a minor (under 18). To proceed, a parent or guardian must verify consent.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Minor Information */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Minor Information</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Name:</span>
                <span className="ml-2 font-medium">{minorName}</span>
              </div>
              <div>
                <span className="text-blue-600">Email:</span>
                <span className="ml-2 font-medium">{minorEmail}</span>
              </div>
              <div>
                <span className="text-blue-600">Age:</span>
                <span className="ml-2 font-medium">{minorAge} years</span>
              </div>
            </div>
          </div>

          {/* Method 1: DigiLocker Verification */}
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Smartphone className="h-5 w-5" />
                [1] Verify via DigiLocker (Recommended)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-green-700 space-y-2">
                <p>• Click "Connect DigiLocker"</p>
                <p>• You will be redirected to DigiLocker for OTP/Fingerprint verification of your parent/guardian</p>
                <p>• Instant verification with government-verified identity</p>
              </div>
              
              <Button 
                onClick={handleDigiLockerConnect}
                disabled={isLoading || submissionStatus === 'submitting'}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Connect DigiLocker
              </Button>
            </CardContent>
          </Card>

          <div className="text-center text-gray-500 font-medium">OR</div>

          {/* Method 2: Manual Upload */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Upload className="h-5 w-5" />
                [2] Manual Consent Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-blue-700 space-y-2">
                <p>• Fill parent/guardian info below</p>
                <p>• Upload scanned ID (e.g., Passport, Driver's License, Aadhaar)</p>
                <p>• Upload signed consent form</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentName">Parent Name *</Label>
                  <Input
                    id="parentName"
                    placeholder="Enter parent/guardian name"
                    value={manualData.parentName || ''}
                    onChange={(e) => setManualData(prev => ({ ...prev, parentName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship *</Label>
                  <Select 
                    value={manualData.relationship} 
                    onValueChange={(value: 'Mother' | 'Father' | 'Guardian') => 
                      setManualData(prev => ({ ...prev, relationship: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mother">Mother</SelectItem>
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Guardian">Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="parent@example.com"
                    value={manualData.email || ''}
                    onChange={(e) => setManualData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    placeholder="+91-XXXXXXXXXX"
                    value={manualData.phone || ''}
                    onChange={(e) => setManualData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="idProof">Upload ID Proof *</Label>
                  <div className="mt-1">
                    <Input
                      id="idProof"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('idProof', e.target.files?.[0] || null)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {manualData.idProofFile ? `Selected: ${manualData.idProofFile.name}` : 'No file chosen'}
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="consentForm">Upload Consent Form *</Label>
                  <div className="mt-1">
                    <Input
                      id="consentForm"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('consentForm', e.target.files?.[0] || null)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {manualData.consentFormFile ? `Selected: ${manualData.consentFormFile.name}` : 'No file chosen'}
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleManualSubmission}
                disabled={isLoading || submissionStatus === 'submitting'}
                className="w-full"
              >
                {submissionStatus === 'submitting' ? (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Submitting for Approval...
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Submit for Approval
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* DigiLocker Verification Dialog */}
      <Dialog open={showDigiLockerDialog} onOpenChange={setShowDigiLockerDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
              DigiLocker Verification
            </DialogTitle>
            <DialogDescription>
              Connecting to DigiLocker for parent/guardian verification
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {digiLockerStep === 'connect' && (
              <div className="text-center space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Lock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-blue-700">
                    You will be redirected to DigiLocker to verify your parent/guardian's identity
                  </p>
                </div>
                <Button onClick={handleDigiLockerOTP} className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Continue to DigiLocker
                </Button>
              </div>
            )}
            
            {digiLockerStep === 'otp' && (
              <div className="text-center space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm text-yellow-700">
                    Please complete OTP/Biometric verification on DigiLocker...
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </div>
            )}
            
            {digiLockerStep === 'verified' && (
              <div className="text-center space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-green-700">
                    Parent/Guardian identity verified successfully!
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParentAuthenticationUI; 