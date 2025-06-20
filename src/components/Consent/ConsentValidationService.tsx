import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Shield, 
  Clock, 
  Activity,
  Database,
  Zap,
  FileText,
  Globe,
  Lock
} from 'lucide-react';
import { ConsentRecord, ConsentStatus, AuditEntry } from '@/types/dpdp';

interface ValidationRequest {
  id: string;
  userId: string;
  dataFiduciaryId: string;
  purpose: string;
  timestamp: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  response?: {
    isValid: boolean;
    reason?: string;
    consentId?: string;
    expiresAt?: Date;
  };
}

interface ConsentValidationServiceProps {
  consentRecords: ConsentRecord[];
  onValidationComplete: (validationId: string, result: any) => void;
}

export default function ConsentValidationService({ 
  consentRecords, 
  onValidationComplete 
}: ConsentValidationServiceProps) {
  const [validationRequests, setValidationRequests] = useState<ValidationRequest[]>([]);
  const [activeValidations, setActiveValidations] = useState<number>(0);
  const [validationStats, setValidationStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0
  });
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);

  // Simulate real-time validation requests
  useEffect(() => {
    const simulateValidationRequests = () => {
      const purposes = [
        'account_management',
        'marketing_communications', 
        'usage_analytics',
        'personalization',
        'security_monitoring'
      ];
      
      const fiduciaries = [
        'df_ecommerce', 
        'df_fintech', 
        'df_healthcare', 
        'df_education'
      ];

      const newRequest: ValidationRequest = {
        id: `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: 'dp_001',
        dataFiduciaryId: fiduciaries[Math.floor(Math.random() * fiduciaries.length)],
        purpose: purposes[Math.floor(Math.random() * purposes.length)],
        timestamp: new Date(),
        status: 'PENDING'
      };

      setValidationRequests(prev => [...prev, newRequest].slice(-20)); // Keep last 20 requests
      setActiveValidations(prev => prev + 1);

      // Process validation after a short delay
      setTimeout(() => {
        processValidationRequest(newRequest.id);
      }, Math.random() * 3000 + 1000); // 1-4 seconds delay
    };

    const interval = setInterval(simulateValidationRequests, 5000); // Every 5 seconds
    return () => clearInterval(interval);
  }, [consentRecords]);

  // Update validation stats
  useEffect(() => {
    const stats = validationRequests.reduce((acc, req) => {
      acc.total++;
      switch (req.status) {
        case 'APPROVED': acc.approved++; break;
        case 'REJECTED': acc.rejected++; break;
        case 'PENDING': acc.pending++; break;
      }
      return acc;
    }, { total: 0, approved: 0, rejected: 0, pending: 0 });
    
    setValidationStats(stats);
  }, [validationRequests]);

  const processValidationRequest = async (requestId: string) => {
    const request = validationRequests.find(r => r.id === requestId);
    if (!request) return;

    // Find matching consent record
    const matchingConsent = consentRecords.find(consent => 
      consent.dataFiduciaryId === request.dataFiduciaryId &&
      consent.purposes.some(p => p.id === request.purpose) &&
      (consent.status === ConsentStatus.GRANTED || consent.status === ConsentStatus.RENEWED)
    );

    let validationResult: ValidationRequest['response'];

    if (matchingConsent) {
      // Check if consent is still valid (not expired)
      const now = new Date();
      const isExpired = matchingConsent.expiresAt && matchingConsent.expiresAt < now;
      
      if (isExpired) {
        validationResult = {
          isValid: false,
          reason: 'Consent has expired',
          consentId: matchingConsent.id,
          expiresAt: matchingConsent.expiresAt
        };
      } else {
        validationResult = {
          isValid: true,
          consentId: matchingConsent.id,
          expiresAt: matchingConsent.expiresAt
        };
      }
    } else {
      validationResult = {
        isValid: false,
        reason: 'No valid consent found for this purpose',
      };
    }

    // Update validation request
    setValidationRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: validationResult.isValid ? 'APPROVED' : 'REJECTED',
            response: validationResult
          }
        : req
    ));

    setActiveValidations(prev => Math.max(0, prev - 1));

    // Create audit log entry
    const auditEntry: AuditEntry = {
      id: `audit_${Date.now()}`,
      userId: request.userId,
      action: 'CONSENT_VALIDATED',
      resource: 'consent_validation',
      resourceId: requestId,
      timestamp: new Date(),
      ipAddress: '192.168.1.100',
      userAgent: 'System/ValidationService',
      description: `Consent validation ${validationResult.isValid ? 'approved' : 'rejected'} for purpose: ${request.purpose}`,
      hash: `hash_${Date.now()}`,
      blockIndex: auditLogs.length + 1
    };

    setAuditLogs(prev => [...prev, auditEntry]);

    // Notify completion
    onValidationComplete(requestId, validationResult);
  };

  const getStatusIcon = (status: ValidationRequest['status']) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'REJECTED': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'PENDING': return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: ValidationRequest['status']) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-300';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-300';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Consent Validation Service
          </h2>
          <p className="text-gray-600">
            Real-time consent validation for data processing requests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Activity className="h-3 w-3 mr-1" />
            {activeValidations} Active
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            {validationStats.approved} Approved
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{validationStats.total}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{validationStats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{validationStats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-yellow-600">{validationStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Feed */}
      <Tabs defaultValue="live-feed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="live-feed">Live Validation Feed</TabsTrigger>
          <TabsTrigger value="api-docs">API Documentation</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="live-feed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Real-time Validation Requests
              </CardTitle>
              <CardDescription>
                Live feed of consent validation requests from Data Fiduciaries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {validationRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No validation requests yet. They will appear here as they come in.</p>
                  </div>
                ) : (
                  validationRequests.slice().reverse().map(request => (
                    <div key={request.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {getStatusIcon(request.status)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{request.dataFiduciaryId}</span>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(request.status)}`}>
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Purpose: <span className="font-medium">{request.purpose.replace('_', ' ')}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {request.timestamp.toLocaleString()}
                        </p>
                        {request.response && (
                          <p className="text-xs text-gray-600 mt-1">
                            {request.response.isValid ? 
                              `✓ Valid until ${request.response.expiresAt?.toLocaleDateString()}` :
                              `✗ ${request.response.reason}`
                            }
                          </p>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-400">
                        {request.id.substring(0, 8)}...
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Consent Validation API
              </CardTitle>
              <CardDescription>
                API endpoints for real-time consent validation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                <h4 className="font-medium text-green-400 mb-2">POST /api/consent/validate</h4>
                <pre className="text-sm text-gray-300">
{`{
  "userId": "dp_001",
  "dataFiduciaryId": "df_ecommerce", 
  "purpose": "marketing_communications",
  "sessionId": "sess_abc123"
}`}
                </pre>
              </div>

              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                <h4 className="font-medium text-blue-400 mb-2">Response (200 OK)</h4>
                <pre className="text-sm text-gray-300">
{`{
  "isValid": true,
  "consentId": "consent_001",
  "expiresAt": "2024-07-15T10:30:00Z",
  "grantedPurposes": ["marketing_communications"],
  "validationId": "val_123456789",
  "timestamp": "2024-01-15T15:30:00Z"
}`}
                </pre>
              </div>

              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security:</strong> All validation requests are logged in an immutable audit trail 
                  and require proper authentication. Rate limiting is enforced to prevent abuse.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Validation Audit Logs
              </CardTitle>
              <CardDescription>
                Immutable audit trail of all validation activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {auditLogs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No audit logs yet. Validation activities will be logged here.</p>
                  </div>
                ) : (
                  auditLogs.slice().reverse().map(log => (
                    <div key={log.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500">#{log.blockIndex}</div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{log.action.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-600">{log.description}</p>
                        <p className="text-xs text-gray-500">{log.timestamp.toLocaleString()}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        Hash: {log.hash.substring(0, 8)}...
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 