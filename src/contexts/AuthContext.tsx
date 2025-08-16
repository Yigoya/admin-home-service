import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../api';
import type { User, LoginRequest, PasswordReset } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (resetData: PasswordReset) => Promise<boolean>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('admin_token');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);
  
  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.login(credentials);
      console.log(response )
      

      const { token, user } = response;
      localStorage.setItem('admin_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

    } catch (err) {
      let errorMessage = 'Failed to login. Please check your credentials.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.requestPasswordReset(email);
      
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Password reset request failed');
        return false;
      }
    } catch (err) {
      let errorMessage = 'Failed to request password reset.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (resetData: PasswordReset): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.resetPassword(resetData);
      
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Password reset failed');
        return false;
      }
    } catch (err) {
      let errorMessage = 'Failed to reset password.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user && (user.role === 'ADMIN' || user.role === 'OPERATOR'),
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    error
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 