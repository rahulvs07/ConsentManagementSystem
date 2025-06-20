import { useState, useEffect, createContext, useContext } from 'react';
import { User, UserRole } from '@/types/dpdp';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userInfo?: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('dpdp_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, userInfo?: any) => {
    setIsLoading(true);
    
    // Simulate API call - replace with actual authentication
    const mockUser: User = {
      id: '1',
      email,
      name: userInfo?.name || email.split('@')[0],
      role: email.includes('dpo') ? UserRole.DPO : 
            email.includes('admin') ? UserRole.SYSTEM_ADMIN :
            email.includes('fiduciary') ? UserRole.DATA_FIDUCIARY :
            email.includes('processor') ? UserRole.DATA_PROCESSOR :
            UserRole.DATA_PRINCIPAL,
      createdAt: new Date(),
      lastLogin: new Date(),
      // Add additional user info if provided
      ...(userInfo && {
        phone: userInfo.phone,
        age: userInfo.age,
        isMinor: userInfo.isMinor,
        parentEmail: userInfo.parentEmail,
        digiLockerVerified: userInfo.digiLockerVerified,
        preferences: userInfo.preferences
      })
    };
    
    localStorage.setItem('dpdp_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('dpdp_user');
    setUser(null);
  };

  const hasRole = (role: UserRole) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
