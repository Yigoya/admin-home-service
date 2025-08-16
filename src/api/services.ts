import api from './api';
import type { ApiResponse, PaginatedResponse } from '../types/index';

// Language types
type LanguageOption = 'ENGLISH' | 'AMHARIC' | 'OROMO';

type ServiceLanguage = {
  name: string;
  description: string;
  lang: LanguageOption;
};

type CategoryLanguage = {
  name: string;
  description: string;
  lang: LanguageOption;
};

// Enhanced service types that support nesting
interface EnhancedServiceCategory {
  id?: number;
  categoryId?: number;
  name: string;
  categoryName?: string;
  description: string;
  icon: string;
  isMobileCategory?: boolean;
  translations?: { [key: string]: { name: string; description: string } };
  services?: EnhancedService[];
}

interface EnhancedService {
  id?: number;
  serviceId?: number;
  name: string;
  description: string;
  icon: string;
  document?: string | null;
  serviceFee?: number | null;
  estimatedDuration?: string | null;
  categoryId: number;
  technicianCount?: number;
  bookingCount?: number;
  category?: EnhancedServiceCategory;
  translations?: { [key: string]: { name: string; description: string } };
  services?: EnhancedService[];
}

export const servicesApi = {
  // Service Categories
  getServiceCategories: async (lang?: string) => {
    const params = lang ? { lang } : {};
    const response = await api.get<ApiResponse<EnhancedServiceCategory[]>>('/service-categories', { params });
    return response.data;
  },
  
  getServiceCategoryById: async (id: number, lang?: string) => {
    const params = lang ? { lang } : {};
    const response = await api.get<ApiResponse<EnhancedServiceCategory>>(`/service-categories/${id}`, { params });
    return response.data;
  },
  
  createServiceCategory: async (formData: FormData) => {
    const response = await api.post<ApiResponse<EnhancedServiceCategory>>('/admin/service-categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  updateServiceCategory: async (id: number, formData: FormData) => {
    const response = await api.put<ApiResponse<EnhancedServiceCategory>>(`/admin/service-categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  addServiceCategoryLanguage: async (id: number, data: CategoryLanguage) => {
    const response = await api.post<ApiResponse<EnhancedServiceCategory>>(`/admin/service-categories/${id}/language`, data);
    return response.data;
  },
  
  // Services
  getServices: async (lang?: string) => {
    const params = lang ? { lang } : {};
    const response = await api.get<ApiResponse<EnhancedService[]>>('/services', { params });
    return response.data;
  },

  // Get nested services structure
  getNestedServices: async (lang?: string) => {
    const params = lang ? { lang } : {};
    const response = await api.get<ApiResponse<EnhancedServiceCategory[]>>('/admin/services', { params });
    return response.data;
  },
  
  getServiceById: async (id: number, lang?: string) => {
    const params = lang ? { lang } : {};
    const response = await api.get<ApiResponse<EnhancedService>>(`/admin/services/${id}`, { params });
    return response.data;
  },
  
  createService: async (formData: FormData) => {
    const response = await api.post<ApiResponse<EnhancedService>>('/admin/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  updateService: async (id: number, formData: FormData) => {
    const response = await api.put<ApiResponse<EnhancedService>>(`/admin/services/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  addServiceLanguage: async (id: number, data: ServiceLanguage) => {
    const response = await api.post<ApiResponse<EnhancedService>>(`/admin/services/${id}/language`, data);
    return response.data;
  },
  
  deleteService: async (id: number) => {
    const response = await api.delete<ApiResponse<boolean>>(`/admin/service/${id}`);
    return response.data;
  },
  
  // Import services from Excel
  importServicesFromExcel: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<ApiResponse<boolean>>('/admin/services/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export type { 
  EnhancedService as Service, 
  EnhancedServiceCategory as ServiceCategory,
  ServiceLanguage,
  CategoryLanguage,
  LanguageOption
};

export default servicesApi;
