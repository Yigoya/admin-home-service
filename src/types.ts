// TYPES INDEX.TS
// =============================================================

// API Response type
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
};

// Pagination types
export type PaginatedResponse<T> = {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  empty: boolean;
};

// User Types
export type User = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  profileImage?: string | null;
  role: 'ADMIN' | 'OPERATOR' | 'CUSTOMER' | 'TECHNICIAN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';
  language?: 'ENGLISH' | 'AMHARIC';
  createdAt?: string;
  updatedAt?: string;
};

// Booking related types
export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'REJECTED';

export type ServiceLocation = {
  street: string;
  city: string;
  subcity: string;
  wereda: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: number | null;
  longitude: number | null;
};

export type Customer = {
  customerId: number | null;
  name: string;
  email: string;
  phoneNumber: string;
  profileImage: string | null;
};

export type Technician = {
  technicianId: number | null;
  name: string;
  email: string;
  phoneNumber: string;
  profileImage: string | null;
};

export type Review = {
  reviewId: number;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Booking = {
  bookingId: number;
  description: string;
  createdAt: string;
  timeSchedule: string | null;
  service: string;
  status: BookingStatus;
  serviceLocation: ServiceLocation;
  customer: Customer | null;
  technician: Technician | null;
  review: Review | null;
};

// Dispute related types
export type DisputeStatus = 'PENDING' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED';

export type Dispute = {
  disputeId: number;
  reason: string;
  description: string;
  createdAt: string;
  status: DisputeStatus;
  booking: Booking;
  customer: Customer;
  technician: Technician;
  resolution?: string | null;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
};

// Password reset types
export type PasswordResetRequest = {
  email: string;
};

export type PasswordReset = {
  token: string;
  password: string;
};

// Auth related types
export type LoginRequest = {
  email: string;
  password: string;
  FCMToken: string;
  deviceType: string;
  deviceModel: string;
  operatingSystem: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

// =============================================================
// API AUTH.TS
// =============================================================

// import { api } from './api';
// import type { ApiResponse, User, LoginRequest, LoginResponse, PasswordResetRequest, PasswordReset } from '../types';

export const authApi = {
  login: async (credentials: LoginRequest) => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
  
  logout: async () => {
    // Clear local storage
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user');
  },

  requestPasswordReset: async (email: string) => {
    const response = await api.get<ApiResponse<null>>(`/auth/password-reset-request?email=${email}`);
    return response.data;
  },

  resetPassword: async (resetData: PasswordReset) => {
    const response = await api.post<ApiResponse<null>>('/auth/reset-password', resetData);
    return response.data;
  }
};

// =============================================================
// CONTEXTS AUTHCONTEXT.TSX
// =============================================================

// import { createContext, useContext, useState, useEffect } from 'react';
// import type { ReactNode } from 'react';
// import { authApi } from '../api';
// import type { User, LoginRequest, PasswordReset } from '../types';

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
      
      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('admin_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      } else {
        setError(response.message || 'Login failed');
        throw new Error(response.message || 'Login failed');
      }
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

// =============================================================
// PAGES LOGINPAGE.TSX
// =============================================================

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState({
    deviceType: '',
    deviceModel: '',
    operatingSystem: '',
    FCMToken: ''
  });
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get basic device information
    const userAgent = navigator.userAgent;
    let deviceType = 'Unknown';
    let deviceModel = 'Unknown';
    let operatingSystem = 'Unknown';
    
    // Detect operating system
    if (/Windows/.test(userAgent)) {
      operatingSystem = 'WINDOWS';
    } else if (/Macintosh|Mac OS X/.test(userAgent)) {
      operatingSystem = 'MACOS';
    } else if (/Linux/.test(userAgent)) {
      operatingSystem = 'LINUX';
    } else if (/Android/.test(userAgent)) {
      operatingSystem = 'ANDROID';
    } else if (/iPhone|iPad|iPod/.test(userAgent)) {
      operatingSystem = 'IOS';
    }
    
    // Detect device type
    if (/Mobi|Android|iPhone|iPad|iPod/.test(userAgent)) {
      deviceType = userAgent.match(/iPhone|iPad|iPod/) ? 'Apple' : 'Android';
      
      // Try to get device model
      const matches = userAgent.match(/\(([^)]+)\)/);
      if (matches && matches[1]) {
        deviceModel = matches[1].split(';')[1]?.trim() || 'Unknown Model';
      }
    } else {
      deviceType = 'Desktop';
      deviceModel = operatingSystem;
    }
    
    setDeviceInfo({
      deviceType,
      deviceModel,
      operatingSystem,
      FCMToken: 'dKB-Qr1oRlKZmcpB5bM7Ng:APA91bEDkEgF_hC8y6NgIFWBQ-Tq6w5dSp3ALhleFaPRQ2MDV_cwmP-YVQU2NHZ5y38H76kZrXfhVBRuquK7JLK8XgViuhQvaSpb3UkalYLo-TzsvceQpvg'
    });
  }, []);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await login({
        email,
        password,
        ...deviceInfo
      });
      
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to login. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Home Service Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your admin account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 