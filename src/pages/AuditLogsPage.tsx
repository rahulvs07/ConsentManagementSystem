import { useAuth } from '@/hooks/useAuth';
import AuditLogViewer from '@/components/Admin/AuditLogViewer';
import Header from '@/components/Layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Database, Lock, Activity } from 'lucide-react';

const AuditLogsPage = () => {
  const { user } = useAuth();

  // Role-based access control
  const hasAuditAccess = user?.role && ['system_admin', 'dpo', 'data_fiduciary'].includes(user.role);

  if (!hasAuditAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <Shield className="h-5 w-5" />
                <span>Access Denied</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  You don't have permission to access audit logs. This feature is restricted to System Administrators, DPOs, and Data Fiduciaries only.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <Database className="h-8 w-8 text-blue-600" />
                <span>Audit Logs</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">Live Monitoring</span>
                </div>
              </h1>
              <p className="mt-2 text-gray-600">
                Comprehensive audit trail with blockchain-style integrity verification for DPDP Act 2023 compliance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Current User</div>
                <div className="font-medium">{user?.name || 'Unknown'}</div>
                <div className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Security Notice */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Lock className="h-4 w-4" />
          <AlertDescription className="text-blue-800">
            <strong>Security Notice:</strong> All audit log entries are cryptographically secured using SHA-256 hashing 
            and blockchain-style integrity verification. Any tampering attempts will be immediately detected and flagged.
          </AlertDescription>
        </Alert>

        {/* Compliance Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-lg font-semibold text-green-600">DPDP Act 2023</div>
                  <div className="text-sm text-gray-600">Section 4.7.1 Compliant</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Database className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-lg font-semibold text-blue-600">Immutable Logs</div>
                  <div className="text-sm text-gray-600">Blockchain Technology</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Activity className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-lg font-semibold text-purple-600">Real-time</div>
                  <div className="text-sm text-gray-600">Live Monitoring</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Log Viewer */}
        <AuditLogViewer 
          userRole={user?.role || ''} 
          userId={user?.id || ''} 
        />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              © 2024 DPDP Compliance System. All audit logs are legally protected and tamper-proof.
            </div>
            <div className="flex items-center space-x-4">
              <span>Powered by Blockchain Technology</span>
              <div className="flex items-center space-x-1">
                <Lock className="h-3 w-3" />
                <span>256-bit Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuditLogsPage; 