
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/dpdp';
import DataPrincipalDashboard from './DataPrincipalDashboard';
import DPODashboard from './DPODashboard';
import SystemAdminDashboard from './SystemAdminDashboard';
import DataFiduciaryDashboard from './DataFiduciaryDashboard';
import DataProcessorDashboard from './DataProcessorDashboard';

const RoleDashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case UserRole.DATA_PRINCIPAL:
      return <DataPrincipalDashboard />;
    case UserRole.DPO:
      return <DPODashboard />;
    case UserRole.SYSTEM_ADMIN:
      return <SystemAdminDashboard />;
    case UserRole.DATA_FIDUCIARY:
      return <DataFiduciaryDashboard />;
    case UserRole.DATA_PROCESSOR:
      return <DataProcessorDashboard />;
    default:
      return <DataPrincipalDashboard />;
  }
};

export default RoleDashboard;
