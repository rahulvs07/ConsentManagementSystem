import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/Auth/LoginForm';
import Header from '@/components/Layout/Header';
import RoleDashboard from '@/components/Dashboard/RoleDashboard';

const Index = () => {
  const { user, isLoading, login } = useAuth();

  const handleLogin = async (userType: 'DATA_PRINCIPAL' | 'DPO' | 'SYSTEM_ADMIN' | 'DATA_FIDUCIARY' | 'DATA_PROCESSOR', userInfo?: any) => {
    // Handle different login types
    if (userType === 'DATA_PRINCIPAL' && userInfo) {
      // For data principal with detailed info
      await login(userInfo.email, 'demo123', userInfo);
    } else {
      // For other roles, use demo credentials
      const demoCredentials = {
        'DATA_PRINCIPAL': 'alice@example.com',
        'DPO': 'dpo@company.com',
        'SYSTEM_ADMIN': 'admin@company.com',
        'DATA_FIDUCIARY': 'fiduciary@company.com',
        'DATA_PROCESSOR': 'processor@company.com'
      };
      
      await login(demoCredentials[userType], 'demo123');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <p className="text-slate-700 text-lg font-medium">Loading CMS...</p>
          <p className="text-slate-500 text-sm mt-2">Securing your privacy experience</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoleDashboard />
      </main>
    </div>
  );
};

export default Index;
