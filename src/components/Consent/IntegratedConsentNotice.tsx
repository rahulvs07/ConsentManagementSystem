import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Clock, 
  Eye, 
  FileText, 
  Globe, 
  Zap,
  Lock,
  UserCheck,
  Bell,
  RefreshCw,
  ArrowRight,
  Info
} from 'lucide-react';
import { 
  ConsentRequirement, 
  ConsentCheckResponse, 
  NoticeRenderingData, 
  ConsentWorkflowState,
  NoticeIntegrationConfig,
  ConsentArtifact
} from '@/types/dpdp';
import ConsentManagementService from '@/services/ConsentManagementService';

interface IntegratedConsentNoticeProps {
  userId: string;
  onConsentCompleted?: (artifact: ConsentArtifact) => void;
  onConsentDismissed?: () => void;
  config?: Partial<NoticeIntegrationConfig>;
}

// Integrated Consent Notice - BRD Section 4.1 Implementation
export default function IntegratedConsentNotice({ 
  userId, 
  onConsentCompleted, 
  onConsentDismissed,
  config = {}
}: IntegratedConsentNoticeProps) {
  const [consentService] = useState(() => ConsentManagementService.getInstance());
  const [consentCheck, setConsentCheck] = useState<ConsentCheckResponse | null>(null);
  const [activeRequirement, setActiveRequirement] = useState<ConsentRequirement | null>(null);
  const [noticeData, setNoticeData] = useState<NoticeRenderingData | null>(null);
  const [workflowState, setWorkflowState] = useState<ConsentWorkflowState>({
    currentStep: 'DETECTION',
    requirementId: '',
    userSelections: {},
    validationErrors: [],
    submissionStatus: 'IDLE'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Default configuration
  const integrationConfig: NoticeIntegrationConfig = {
    displayMode: 'MODAL',
    position: 'CENTER',
    dismissible: false,
    requiresImmediateAction: true,
    showProgressIndicator: true,
    enableRealTimeFeedback: true,
    accessibilityFeatures: {
      screenReaderSupport: true,
      keyboardNavigation: true,
      highContrast: false,
      fontSize: 'MEDIUM'
    },
    ...config
  };

  // 1. Detect Consent Requirements Upon Login
  useEffect(() => {
    const detectConsentRequirements = async () => {
      try {
        setIsLoading(true);
        setWorkflowState(prev => ({ ...prev, currentStep: 'DETECTION' }));

        const checkResponse = await consentService.checkConsentRequirements(userId);
        setConsentCheck(checkResponse);

        if (checkResponse.hasPendingConsents) {
          // Find the highest priority requirement that requires immediate action
          const immediateRequirement = checkResponse.requirements
            .filter(req => req.isBlocking)
            .sort((a, b) => {
              const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
              return priorityOrder[b.priority] - priorityOrder[a.priority];
            })[0];

          if (immediateRequirement) {
            setActiveRequirement(immediateRequirement);
            setWorkflowState(prev => ({
              ...prev,
              currentStep: 'PRESENTATION',
              requirementId: immediateRequirement.id
            }));

            // Generate notice rendering data
            const renderingData = await consentService.generateNoticeRenderingData(
              immediateRequirement.id,
              immediateRequirement.language
            );
            setNoticeData(renderingData);

            // Show appropriate UI based on configuration
            if (integrationConfig.displayMode === 'MODAL') {
              setShowModal(true);
            } else if (integrationConfig.displayMode === 'BANNER') {
              setShowBanner(true);
            }
          } else {
            // Show non-blocking requirements in banner
            setShowBanner(true);
          }
        }
      } catch (error) {
        console.error('Error detecting consent requirements:', error);
        setWorkflowState(prev => ({
          ...prev,
          validationErrors: ['Failed to check consent requirements']
        }));
      } finally {
        setIsLoading(false);
      }
    };

    detectConsentRequirements();
  }, [userId, consentService]);

  // 2. Handle User Interaction with Notice
  const handlePurposeToggle = (purposeId: string, granted: boolean) => {
    setWorkflowState(prev => ({
      ...prev,
      currentStep: 'INTERACTION',
      userSelections: {
        ...prev.userSelections,
        [purposeId]: granted
      }
    }));

    // Real-time UI feedback
    if (integrationConfig.enableRealTimeFeedback) {
      // Add visual feedback for the selection
      console.log(`Purpose ${purposeId} ${granted ? 'granted' : 'denied'}`);
    }
  };

  // 3. Submit Consent Decisions
  const handleSubmitConsent = async () => {
    if (!activeRequirement || !noticeData) return;

    try {
      setWorkflowState(prev => ({
        ...prev,
        currentStep: 'SUBMISSION',
        submissionStatus: 'SUBMITTING'
      }));

      // Validate required essential purposes are granted
      const essentialPurposes = activeRequirement.purposes.filter(p => p.isEssential);
      const unselectedEssential = essentialPurposes.filter(p => !workflowState.userSelections[p.id]);
      
      if (unselectedEssential.length > 0) {
        setWorkflowState(prev => ({
          ...prev,
          validationErrors: [`Essential purposes must be granted: ${unselectedEssential.map(p => p.name).join(', ')}`],
          submissionStatus: 'ERROR'
        }));
        return;
      }

      // Submit consent decisions
      const consentArtifact = await consentService.submitConsentDecisions(
        activeRequirement.id,
        workflowState.userSelections,
        {
          ipAddress: '192.168.1.100', // In real app, get from request
          userAgent: navigator.userAgent,
          sessionId: `session_${Date.now()}`,
          timestamp: new Date()
        }
      );

      // Update consent status
      await consentService.updateConsentStatus(activeRequirement.id, 'COMPLETED');

      setWorkflowState(prev => ({
        ...prev,
        currentStep: 'CONFIRMATION',
        submissionStatus: 'SUCCESS',
        artifactId: consentArtifact.id
      }));

      // Close modal after successful submission
      setTimeout(() => {
        setShowModal(false);
        setShowBanner(false);
        onConsentCompleted?.(consentArtifact);
      }, 2000);

    } catch (error) {
      console.error('Error submitting consent:', error);
      setWorkflowState(prev => ({
        ...prev,
        submissionStatus: 'ERROR',
        validationErrors: ['Failed to submit consent decisions']
      }));
    }
  };

  // 4. Render Progress Indicator
  const renderProgressIndicator = () => {
    if (!integrationConfig.showProgressIndicator) return null;

    const steps = ['DETECTION', 'PRESENTATION', 'INTERACTION', 'SUBMISSION', 'CONFIRMATION'];
    const currentIndex = steps.indexOf(workflowState.currentStep);
    const progressPercentage = ((currentIndex + 1) / steps.length) * 100;

    return (
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Consent Process</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
    );
  };

  // 5. Render Notice Content
  const renderNoticeContent = () => {
    if (!noticeData || !activeRequirement) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {noticeData.languageData.title}
          </h2>
          <p className="text-gray-600">
            {noticeData.dynamicContent.description}
          </p>
        </div>

        <Separator />

        {/* Data Processing Information */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="font-semibold text-blue-900">Legal Basis</Label>
              <p className="text-blue-700">{noticeData.dynamicContent.legalBasis}</p>
            </div>
            <div>
              <Label className="font-semibold text-blue-900">Retention Period</Label>
              <p className="text-blue-700">{noticeData.dynamicContent.retentionPeriod}</p>
            </div>
            <div>
              <Label className="font-semibold text-blue-900">Data Categories</Label>
              <p className="text-blue-700">{noticeData.dynamicContent.dataCategories.join(', ')}</p>
            </div>
            <div>
              <Label className="font-semibold text-blue-900">Third Party Sharing</Label>
              <p className="text-blue-700">
                {noticeData.dynamicContent.thirdPartySharing ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>

        {/* Purpose Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            Processing Purposes - Make Your Selection
          </h3>
          
          {noticeData.dynamicContent.purposes.map((purpose) => (
            <Card key={purpose.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Label className="text-base font-medium text-gray-900">
                        {purpose.name}
                      </Label>
                      {purpose.isEssential && (
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          <Lock className="h-3 w-3 mr-1" />
                          Essential
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Purpose ID: {purpose.id} | Category: {purpose.category}
                    </p>
                    {purpose.isEssential && (
                      <Alert className="mb-3">
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          This purpose is essential for service delivery and cannot be declined.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={purpose.id}
                      checked={workflowState.userSelections[purpose.id] || purpose.isEssential}
                      onCheckedChange={(checked) => handlePurposeToggle(purpose.id, checked)}
                      disabled={purpose.isEssential}
                    />
                    <Label 
                      htmlFor={purpose.id}
                      className={`text-sm font-medium ${
                        workflowState.userSelections[purpose.id] || purpose.isEssential
                          ? 'text-green-600' 
                          : 'text-gray-500'
                      }`}
                    >
                      {(workflowState.userSelections[purpose.id] || purpose.isEssential) ? 'Granted' : 'Denied'}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Validation Errors */}
        {workflowState.validationErrors.length > 0 && (
          <Alert className="border-red-500 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {workflowState.validationErrors.join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {workflowState.submissionStatus === 'SUCCESS' && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Consent successfully recorded! Artifact ID: {workflowState.artifactId}
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  // 6. Render Action Buttons
  const renderActionButtons = () => {
    if (!activeRequirement) return null;

    return (
      <div className="flex justify-end space-x-3 pt-6 border-t">
        {integrationConfig.dismissible && workflowState.submissionStatus !== 'SUCCESS' && (
          <Button 
            variant="outline" 
            onClick={() => {
              setShowModal(false);
              setShowBanner(false);
              onConsentDismissed?.();
            }}
          >
            Dismiss
          </Button>
        )}
        
        {workflowState.submissionStatus !== 'SUCCESS' && (
          <Button 
            onClick={handleSubmitConsent}
            disabled={workflowState.submissionStatus === 'SUBMITTING'}
            className="min-w-32"
          >
            {workflowState.submissionStatus === 'SUBMITTING' ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                Submit Consent
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking consent requirements...</p>
        </div>
      </div>
    );
  }

  // No pending consents
  if (!consentCheck?.hasPendingConsents) {
    return null;
  }

  // Render Modal
  if (showModal && integrationConfig.displayMode === 'MODAL') {
    return (
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              Consent Required
            </DialogTitle>
            <DialogDescription>
              Please review and provide your consent for data processing activities.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {renderProgressIndicator()}
            {renderNoticeContent()}
            {renderActionButtons()}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Render Banner
  if (showBanner && integrationConfig.displayMode === 'BANNER') {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5" />
              <span className="font-medium">
                You have {consentCheck?.summary.newConsents || 0} new consent request(s) pending
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setShowModal(true)}
              >
                Review Now
              </Button>
              {integrationConfig.dismissible && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowBanner(false)}
                  className="text-white hover:text-gray-200"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
