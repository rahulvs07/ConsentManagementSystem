import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  FileText, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Tag,
  Shield,
  Mail,
  Phone,
  Plus,
  Info
} from 'lucide-react';
import { ConsentStatus } from '@/types/dpdp';

interface ActiveConsent {
  id: string;
  purposeId: string;
  purposeName: string;
  category: 'Essential' | 'Marketing' | 'Analytics' | 'Functional' | 'Performance';
  grantedAt: Date;
  status: ConsentStatus;
  description: string;
}

interface GrievanceFormData {
  selectedConsentId: string;
  complaintCategory: 'CONSENT_VIOLATION' | 'DATA_BREACH' | 'UNAUTHORIZED_SHARING' | 'OTHER';
  otherCategoryDescription: string;
  dataRequestTypes: string[];
  grievanceDescription: string;
  attachedFiles: File[];
  notificationPreference: 'EMAIL' | 'SMS';
  contactEmail: string;
  contactPhone: string;
}

interface GrievanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GrievanceFormData) => void;
  userEmail: string;
  userPhone?: string;
}

const GrievanceForm: React.FC<GrievanceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userEmail,
  userPhone
}) => {
  // Mock active consents for the user
  const activeConsents: ActiveConsent[] = [
    {
      id: 'consent_001',
      purposeId: 'P-001',
      purposeName: 'Account Creation',
      category: 'Essential',
      grantedAt: new Date('2024-05-12'),
      status: ConsentStatus.GRANTED,
      description: 'Essential consent for account creation and management'
    },
    {
      id: 'consent_002',
      purposeId: 'P-002',
      purposeName: 'Marketing Emails',
      category: 'Marketing',
      grantedAt: new Date('2024-02-10'),
      status: ConsentStatus.GRANTED,
      description: 'Consent for marketing communications and promotional emails'
    },
    {
      id: 'consent_003',
      purposeId: 'P-003',
      purposeName: 'Analytics Sharing',
      category: 'Analytics',
      grantedAt: new Date('2024-03-21'),
      status: ConsentStatus.GRANTED,
      description: 'Consent for usage analytics and performance tracking'
    },
    {
      id: 'consent_004',
      purposeId: 'P-004',
      purposeName: 'Personalization',
      category: 'Functional',
      grantedAt: new Date('2024-01-15'),
      status: ConsentStatus.GRANTED,
      description: 'Consent for content personalization and recommendations'
    }
  ];

  const [formData, setFormData] = useState<GrievanceFormData>({
    selectedConsentId: '',
    complaintCategory: 'CONSENT_VIOLATION',
    otherCategoryDescription: '',
    dataRequestTypes: [],
    grievanceDescription: '',
    attachedFiles: [],
    notificationPreference: 'EMAIL',
    contactEmail: userEmail,
    contactPhone: userPhone || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachedFiles: [...prev.attachedFiles, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachedFiles: prev.attachedFiles.filter((_, i) => i !== index)
    }));
  };

  const handleDataRequestTypeChange = (requestType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dataRequestTypes: checked 
        ? [...prev.dataRequestTypes, requestType]
        : prev.dataRequestTypes.filter(type => type !== requestType)
    }));
  };

  const generateReferenceNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `GRV-${timestamp.toString().slice(-6)}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.selectedConsentId || !formData.grievanceDescription.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const refNumber = generateReferenceNumber();
    setReferenceNumber(refNumber);
    setShowSuccess(true);
    
    onSubmit(formData);
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({
      selectedConsentId: '',
      complaintCategory: 'CONSENT_VIOLATION',
      otherCategoryDescription: '',
      dataRequestTypes: [],
      grievanceDescription: '',
      attachedFiles: [],
      notificationPreference: 'EMAIL',
      contactEmail: userEmail,
      contactPhone: userPhone || ''
    });
    setShowSuccess(false);
    setReferenceNumber('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Essential': return 'bg-red-100 text-red-800 border-red-200';
      case 'Marketing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Analytics': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Functional': return 'bg-green-100 text-green-800 border-green-200';
      case 'Performance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const selectedConsent = activeConsents.find(c => c.id === formData.selectedConsentId);

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Grievance Submitted Successfully
            </DialogTitle>
            <DialogDescription>
              Your grievance has been recorded and assigned a reference number for tracking.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-900">Reference Number</span>
              </div>
              <div className="text-lg font-mono font-bold text-green-800">
                {referenceNumber}
              </div>
              <p className="text-sm text-green-700 mt-2">
                Please save this reference number for future correspondence.
              </p>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Our DPO/Grievance Cell will review your submission and update you via your preferred notification method. 
                You can expect an initial response within 72 hours as per DPDP Act requirements.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end gap-2">
              <Button onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Raise a Grievance or Data Request</DialogTitle>
          <DialogDescription>
            Submit a complaint or request related to your personal data processing as per DPDP Act 2023
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Select Related Consent */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                1. Select Related Consent (Active)
              </CardTitle>
              <CardDescription>
                Choose the consent that your grievance or request relates to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select 
                value={formData.selectedConsentId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, selectedConsentId: value }))}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="▼ My Active Consents…" />
                </SelectTrigger>
                <SelectContent>
                  {activeConsents.map((consent) => (
                    <SelectItem key={consent.id} value={consent.id}>
                      <div className="flex flex-col gap-1 py-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{consent.purposeName}</span>
                          <Badge className={`text-xs ${getCategoryBadgeColor(consent.category)}`}>
                            {consent.category}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          PurposeID: {consent.purposeId} | Granted on: {consent.grantedAt.toLocaleDateString()}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedConsent && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Selected Consent Details</span>
                  </div>
                  <div className="text-sm text-blue-800">
                    <p><strong>Purpose:</strong> {selectedConsent.purposeName}</p>
                    <p><strong>Category:</strong> {selectedConsent.category}</p>
                    <p><strong>Description:</strong> {selectedConsent.description}</p>
                    <p><strong>Granted:</strong> {selectedConsent.grantedAt.toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Complaint Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                2. Complaint Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={formData.complaintCategory} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, complaintCategory: value as any }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CONSENT_VIOLATION" id="consent-violation" />
                  <Label htmlFor="consent-violation">Consent Violation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DATA_BREACH" id="data-breach" />
                  <Label htmlFor="data-breach">Data Breach</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="UNAUTHORIZED_SHARING" id="unauthorized-sharing" />
                  <Label htmlFor="unauthorized-sharing">Unauthorized Sharing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="OTHER" id="other" />
                  <Label htmlFor="other">Other (please specify below)</Label>
                </div>
              </RadioGroup>
              
              {formData.complaintCategory === 'OTHER' && (
                <div className="mt-3">
                  <Input
                    placeholder="Please specify the complaint category"
                    value={formData.otherCategoryDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherCategoryDescription: e.target.value }))}
                    required
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. Data Request Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                3. Data Request Type (if applicable)
              </CardTitle>
              <CardDescription>
                Select if you want to exercise your data principal rights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="access-data"
                    checked={formData.dataRequestTypes.includes('ACCESS')}
                    onCheckedChange={(checked) => handleDataRequestTypeChange('ACCESS', checked as boolean)}
                  />
                  <Label htmlFor="access-data">Access My Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="correct-data"
                    checked={formData.dataRequestTypes.includes('CORRECTION')}
                    onCheckedChange={(checked) => handleDataRequestTypeChange('CORRECTION', checked as boolean)}
                  />
                  <Label htmlFor="correct-data">Correct My Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="erase-data"
                    checked={formData.dataRequestTypes.includes('ERASURE')}
                    onCheckedChange={(checked) => handleDataRequestTypeChange('ERASURE', checked as boolean)}
                  />
                  <Label htmlFor="erase-data">Erase My Data</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Describe Your Grievance */}
          <Card>
            <CardHeader>
              <CardTitle>4. Describe Your Grievance / Request</CardTitle>
              <CardDescription>
                Please provide detailed information about your concern
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Please describe what went wrong, when it happened, and any details that might help us understand and resolve your concern..."
                value={formData.grievanceDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, grievanceDescription: e.target.value }))}
                className="min-h-[120px]"
                required
              />
              <div className="text-sm text-gray-500 mt-2">
                {formData.grievanceDescription.length}/1000 characters
              </div>
            </CardContent>
          </Card>

          {/* 5. Attach Supporting Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-600" />
                5. Attach Supporting Documents (optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, JPG, PNG, TXT (Max 10MB per file)
                  </p>
                </div>
                
                {formData.attachedFiles.length > 0 && (
                  <div className="space-y-2">
                    {formData.attachedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 6. Notification Preference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-600" />
                6. Notification Preference
              </CardTitle>
              <CardDescription>
                Choose how you'd like to receive updates about your grievance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={formData.notificationPreference} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, notificationPreference: value as any }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="EMAIL" id="email-notification" />
                  <Label htmlFor="email-notification" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email ({formData.contactEmail})
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SMS" id="sms-notification" />
                  <Label htmlFor="sms-notification" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    SMS
                  </Label>
                </div>
              </RadioGroup>
              
              {formData.notificationPreference === 'SMS' && (
                <div className="mt-3">
                  <Input
                    type="tel"
                    placeholder="+91-XXXXXXXXXX"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    required
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.selectedConsentId || !formData.grievanceDescription.trim()}
              className="min-w-[140px]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Grievance'}
            </Button>
          </div>

          {/* Footer Note */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Upon submission you'll receive a reference number for tracking. 
              Our team (DPO / Grievance Cell) will update you at each stage as per DPDP Act 2023 requirements.
            </AlertDescription>
          </Alert>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GrievanceForm; 