import api, { handleApiError } from './api';
import authApi from './auth';
import bookingsApi from './bookings';

export { api, handleApiError, authApi, bookingsApi };

// Users API
export const usersApi = {
  // Customers
  getCustomers: async (page = 0, size = 10, search?: string) => {
    const params = { page, size, ...(search ? { name: search } : {}) };
    const response = await api.get('/admin/customers', { params });
    return response.data;
  },
  
  getCustomerById: async (id: number) => {
    const response = await api.get(`/profile/customer/${id}`);
    return response.data;
  },
  
  suspendCustomer: async (id: number) => {
    const response = await api.post(`/admin/suspend/${id}`);
    return response.data;
  },
  
  deleteCustomer: async (id: number) => {
    const response = await api.delete(`/admin/customer/${id}`);
    return response.data;
  },
  
  // Technicians
  getTechnicians: async (page = 0, size = 10, search?: string) => {
    const params = { page, size, ...(search ? { name: search } : {}) };
    const response = await api.get('/admin/technicians', { params });
    return response.data;
  },
  
  getTechnicianById: async (id: number) => {
    const response = await api.get(`/technicians/${id}`);
    return response.data;
  },
  
  verifyTechnician: async (id: number) => {
    const response = await api.get(`/admin/technicians/verify/${id}`);
    return response.data;
  },
  
  declineTechnician: async (id: number) => {
    const response = await api.get(`/admin/technicians/decline/${id}`);
    return response.data;
  },
  
  suspendTechnician: async (id: number) => {
    const response = await api.post(`/admin/suspend/${id}`);
    return response.data;
  },
  
  deleteTechnician: async (id: number) => {
    const response = await api.delete(`/admin/technician/${id}`);
    return response.data;
  },
  
  getUnverifiedTechnicians: async () => {
    const response = await api.get('/admin/unverified-technicians');
    return response.data;
  },
  
  // Operators
  getOperators: async (page = 0, size = 10) => {
    const params = { page, size };
    const response = await api.get('/admin/operators', { params });
    return response.data;
  },
  
  getOperatorById: async (id: number) => {
    const response = await api.get(`/admin/operators/${id}`);
    return response.data;
  },
  
  deleteOperator: async (id: number) => {
    const response = await api.delete(`/admin/operator/${id}`);
    return response.data;
  }
};

// Services API
export const servicesApi = {
  // Service Categories
  getServiceCategories: async (lang?: string) => {
    const params = lang ? { lang } : {};
    const response = await api.get('/service-categories', { params });
    return response.data;
  },
  
  getServiceCategoryById: async (id: number, lang?: string) => {
    const params = lang ? { lang } : {};
    const response = await api.get(`/service-categories/${id}`, { params });
    return response.data;
  },
  
  createServiceCategory: async (formData: FormData) => {
    const response = await api.post('/admin/service-categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  updateServiceCategory: async (id: number, formData: FormData) => {
    const response = await api.put(`/admin/service-categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  addServiceCategoryLanguage: async (id: number, data: { name: string; description: string; lang: string }) => {
    const response = await api.post(`/admin/service-categories/${id}/language`, data);
    return response.data;
  },
  
  // Services
  getServices: async (lang?: string) => {
    const params = lang ? { lang } : {};
    const response = await api.get('/services', { params });
    return response.data;
  },
  
  getServiceById: async (id: number, lang?: string) => {
    const params = lang ? { lang } : {};
    const response = await api.get(`/services/${id}`, { params });
    return response.data;
  },
  
  createService: async (formData: FormData) => {
    const response = await api.post('/admin/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  updateService: async (id: number, formData: FormData) => {
    const response = await api.put(`/admin/services/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  addServiceLanguage: async (id: number, data: { name: string; description: string; lang: string }) => {
    const response = await api.put(`/admin/services/${id}/language`, data);
    return response.data;
  },
  
  deleteService: async (id: number) => {
    const response = await api.delete(`/admin/service/${id}`);
    return response.data;
  },
  
  // Import services from Excel
  importServicesFromExcel: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/admin/services/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

// Comment out the duplicate bookingsApi declaration
/*
// Bookings API
export const bookingsApi = {
  getBookings: async (page = 0, size = 10, service?: string, status?: string) => {
    const params = { page, size, ...(service ? { service } : {}), ...(status ? { status } : {}) };
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  },
  
  getBookingById: async (id: number) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  
  updateBookingStatus: async (bookingId: number, status: string) => {
    const response = await api.put('/booking/update-status', { bookingId, status });
    return response.data;
  }
};
*/

// Disputes API
export const disputesApi = {
  getDisputes: async (status?: string, customerName?: string) => {
    const params = { ...(status ? { status } : {}), ...(customerName ? { customerName } : {}) };
    const response = await api.get('/admin/disputes', { params });
    return response.data;
  },
  
  updateDisputeStatus: async (id: number, status: string) => {
    const response = await api.put(`/admin/disputes/${id}?status=${status}`);
    return response.data;
  }
};

// Tenders API
export const tendersApi = {
  getTenders: async () => {
    const response = await api.get('/tenders');
    return response.data;
  },
  
  getTenderById: async (id: number) => {
    const response = await api.get(`/tenders/${id}`);
    return response.data;
  },
  
  getTendersByStatus: async (status: string) => {
    const response = await api.get(`/tenders/status?status=${status}`);
    return response.data;
  },
  
  changeTenderStatus: async (id: number, status: string) => {
    const response = await api.put(`/tenders/${id}/status?status=${status}`);
    return response.data;
  }
};

// Business API
export const businessApi = {
  getBusinesses: async () => {
    const response = await api.get('/businesses');
    return response.data;
  },
  
  getBusinessById: async (id: number) => {
    const response = await api.get(`/businesses/${id}`);
    return response.data;
  },
  
  getBusinessDetails: async (id: number) => {
    const response = await api.get(`/businesses/${id}/details`);
    return response.data;
  }
};

// Dashboard API
export const dashboardApi = {
  getStatistics: async () => {
    // This endpoint might need to be implemented in the backend
    const response = await api.get('/admin/dashboard/statistics');
    return response.data;
  }
}; 