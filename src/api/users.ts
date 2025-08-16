import api from './api';
import type { PaginatedResponse, Customer, Technician, Operator } from '../types/index';

// Customers API
export const getCustomers = async (
  params: { page?: number; size?: number; name?: string }
): Promise<PaginatedResponse<Customer>> => {
  const { page = 0, size = 10, name } = params;
  const response = await api.get<PaginatedResponse<Customer>>(
    `/admin/customers`,
    { params: { page, size, name } }
  );
  return response.data;
};

export const getCustomerById = async (id: number): Promise<Customer> => {
  const response = await api.get<Customer>(`/admin/customer/${id}`);
  return response.data;
};

export const deleteCustomer = async (id: number): Promise<void> => {
  await api.delete(`/admin/customer/${id}`);
};

// Technicians API
export const getTechnicians = async (
  params: { page?: number; size?: number; name?: string }
): Promise<PaginatedResponse<Technician>> => {
  const { page = 0, size = 10, name } = params;
  const response = await api.get<PaginatedResponse<Technician>>(
    `/admin/technicians`,
    { params: { page, size, name } }
  );
  return response.data;
};

export const getTechnicianById = async (id: number): Promise<Technician> => {
  const response = await api.get<Technician>(`/admin/technician/${id}`);
  return response.data;
};

export const deleteTechnician = async (id: number): Promise<void> => {
  await api.delete(`/admin/technician/${id}`);
};

// Operators API
export const getOperators = async (
  params: { page?: number; size?: number; name?: string }
): Promise<PaginatedResponse<Operator>> => {
  const { page = 0, size = 10, name } = params;
  const response = await api.get<PaginatedResponse<Operator>>(
    `/admin/operators`,
    { params: { page, size, name } }
  );
  return response.data;
};

export const getOperatorById = async (id: number): Promise<Operator> => {
  const response = await api.get<Operator>(`/admin/operator/${id}`);
  return response.data;
};

export const deleteOperator = async (id: number): Promise<void> => {
  await api.delete(`/admin/operator/${id}`);
}; 