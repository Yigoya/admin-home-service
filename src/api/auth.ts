import { api } from './api';
import type { User, LoginRequest, LoginResponse, PasswordResetRequest, PasswordReset } from '../types';
import type { ApiResponse } from '../types';

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
  },
  
  // New functions for technician and operator registration
  registerTechnician: async (formData: FormData) => {
    const response = await api.post<ApiResponse<User>>('/auth/technician/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  registerOperator: async (formData: FormData) => {
    const response = await api.post<ApiResponse<User>>('/auth/operator/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default authApi; 