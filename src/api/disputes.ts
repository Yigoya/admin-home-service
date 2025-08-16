import api from './api';
import type { ApiResponse, Dispute, DisputeStatus, PaginatedResponse } from '../types';

export const disputesApi = {
  // Get all disputes with pagination and optional filters
  getDisputes: async (page = 0, size = 20, status?: string) => {
    const params = { page, size, ...(status ? { status } : {}) };
    const response = await api.get<ApiResponse<PaginatedResponse<Dispute>>>('/admin/disputes', { params });
    return response.data;
  },
  
  // Get a specific dispute by ID
  getDisputeById: async (id: number) => {
    const response = await api.get<ApiResponse<Dispute>>(`/admin/disputes/${id}`);
    return response.data;
  },
  
  // Update dispute status
  updateDisputeStatus: async (disputeId: number, status: DisputeStatus) => {
    const response = await api.put<ApiResponse<Dispute>>('/admin/disputes/update-status', { disputeId, status });
    return response.data;
  },
  
  // Resolve dispute
  resolveDispute: async (disputeId: number, resolution: string) => {
    const response = await api.put<ApiResponse<Dispute>>('/admin/disputes/resolve', { disputeId, resolution });
    return response.data;
  }
};

export default disputesApi; 