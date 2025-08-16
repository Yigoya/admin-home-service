import api from './api';
import type { ApiResponse, Booking, BookingStatus, PaginatedResponse } from '../types';

export const bookingsApi = {
  // Get all bookings with pagination and optional filters
  getBookings: async (page = 0, size = 20, service?: string, status?: string) => {
    const params = { page, size, ...(service ? { service } : {}), ...(status ? { status } : {}) };
    const response = await api.get<ApiResponse<PaginatedResponse<Booking>>>('/admin/bookings', { params });
    console.log(response);
    return response.data;
  },
  
  // Get a specific booking by ID
  getBookingById: async (id: number) => {
    const response = await api.get<ApiResponse<Booking>>(`/admin/bookings/${id}`);
    return response.data;
  },
  
  // Update booking status
  updateBookingStatus: async (bookingId: number, status: BookingStatus) => {
    const response = await api.put<ApiResponse<Booking>>('/admin/bookings/update-status', { bookingId, status });
    return response.data;
  },
  
  // Assign technician to booking
  assignTechnician: async (bookingId: number, technicianId: number) => {
    const response = await api.put<ApiResponse<Booking>>('/admin/bookings/assign-technician', { bookingId, technicianId });
    return response.data;
  }
};

export default bookingsApi; 