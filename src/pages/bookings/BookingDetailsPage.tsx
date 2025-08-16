import { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeftIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  StarIcon
} from "@heroicons/react/24/outline";
import { bookingsApi } from '../../api';
import type { Booking, BookingStatus } from '../../types';
import { format, parseISO } from 'date-fns';

// Status badge component
const StatusBadge = ({ status }: { status: BookingStatus }) => {
  const statusConfig: Record<BookingStatus, { color: string; text: string }> = {
    'PENDING': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
    'ACCEPTED': { color: 'bg-blue-100 text-blue-800', text: 'Accepted' },
    'ASSIGNED': { color: 'bg-indigo-100 text-indigo-800', text: 'Assigned' },
    'IN_PROGRESS': { color: 'bg-purple-100 text-purple-800', text: 'In Progress' },
    'COMPLETED': { color: 'bg-green-100 text-green-800', text: 'Completed' },
    'CANCELED': { color: 'bg-gray-100 text-gray-800', text: 'Canceled' },
    'REJECTED': { color: 'bg-red-100 text-red-800', text: 'Rejected' }
  };

  const { color, text } = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${color}`}>
      {text}
    </span>
  );
};

const BookingDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  
  const bookingId = parseInt(id || '0', 10);
  
  // Fetch booking details
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingsApi.getBookingById(bookingId),
    enabled: !!bookingId,
  });
  
  const booking = data?.data;
  
  // Update booking status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ status }: { status: BookingStatus }) => 
      bookingsApi.updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setIsUpdateStatusOpen(false);
    }
  });
  
  const handleStatusUpdate = (status: BookingStatus) => {
    updateStatusMutation.mutate({ status });
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (isError || !booking) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-10">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading booking details</h3>
          <p className="mt-1 text-gray-500">
            Unable to load booking with ID #{bookingId}.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => refetch()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/bookings')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/bookings')}
              className="mr-4 p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Booking #{booking.bookingId}
            </h1>
          </div>
          <StatusBadge status={booking.status} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Booking Details */}
        <div className="col-span-2 space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Booking Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Service</p>
                <p className="text-base font-semibold text-gray-900">{booking.service}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <StatusBadge status={booking.status} />
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Created Date</p>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <p className="text-base text-gray-900">{formatDate(booking.createdAt)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Scheduled Time</p>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <p className="text-base text-gray-900">{formatDate(booking.timeSchedule)}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-base text-gray-900 mt-1">{booking.description}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Service Location</h2>
            
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-base text-gray-900">
                  {booking.serviceLocation.street}, {booking.serviceLocation.subcity}
                </p>
                <p className="text-base text-gray-900">
                  {booking.serviceLocation.city}, {booking.serviceLocation.state}, {booking.serviceLocation.country}
                </p>
                <p className="text-base text-gray-900">
                  {booking.serviceLocation.zipCode}
                </p>
                {booking.serviceLocation.wereda && (
                  <p className="text-sm text-gray-500 mt-1">
                    Wereda: {booking.serviceLocation.wereda}
                  </p>
                )}
              </div>
            </div>
            
            {(booking.serviceLocation.latitude && booking.serviceLocation.longitude) && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Coordinates</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Latitude: {booking.serviceLocation.latitude}
                </p>
                <p className="text-sm text-gray-600">
                  Longitude: {booking.serviceLocation.longitude}
                </p>
              </div>
            )}
          </div>
          
          {booking.review && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Review</h2>
              
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    className={`h-5 w-5 ${i < (booking.review?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {booking.review?.rating || 0}/5
                </span>
              </div>
              
              <p className="text-base text-gray-900">{booking.review?.comment || ''}</p>
              <p className="text-sm text-gray-500 mt-2">
                Posted on {formatDate(booking.review?.createdAt || null)}
              </p>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customer</h2>
            
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12">
                {booking.customer.profileImage ? (
                  <img 
                    className="h-12 w-12 rounded-full object-cover" 
                    src={booking.customer.profileImage} 
                    alt={booking.customer.name} 
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h3 className="text-base font-medium text-gray-900">{booking.customer.name}</h3>
                {booking.customer.customerId && (
                  <p className="text-sm text-gray-500">ID: {booking.customer.customerId}</p>
                )}
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-900">{booking.customer.email}</span>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-900">{booking.customer.phoneNumber}</span>
              </div>
            </div>
          </div>
          
          {/* Technician Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Technician</h2>
            
            {booking.technician ? (
              <>
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    {booking.technician.profileImage ? (
                      <img 
                        className="h-12 w-12 rounded-full object-cover" 
                        src={booking.technician.profileImage} 
                        alt={booking.technician.name} 
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-gray-900">{booking.technician.name}</h3>
                    {booking.technician.technicianId && (
                      <p className="text-sm text-gray-500">ID: {booking.technician.technicianId}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{booking.technician.email}</span>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{booking.technician.phoneNumber}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">No technician assigned yet.</p>
            )}
          </div>
          
          {/* Actions */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
            
            <div className="space-y-3">
              <button
                onClick={() => setIsUpdateStatusOpen(!isUpdateStatusOpen)}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Status
              </button>
              
              {isUpdateStatusOpen && (
                <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">
                  <p className="text-sm text-gray-500 mb-2">Select new status:</p>
                  
                  <button
                    onClick={() => handleStatusUpdate('ACCEPTED')}
                    disabled={booking.status === 'ACCEPTED' || updateStatusMutation.isPending}
                    className={`w-full flex justify-between items-center px-3 py-2 text-sm font-medium rounded-md ${
                      booking.status === 'ACCEPTED'
                        ? 'bg-blue-100 text-blue-800 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>Accept</span>
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </button>
                  
                  <button
                    onClick={() => handleStatusUpdate('ASSIGNED')}
                    disabled={booking.status === 'ASSIGNED' || updateStatusMutation.isPending}
                    className={`w-full flex justify-between items-center px-3 py-2 text-sm font-medium rounded-md ${
                      booking.status === 'ASSIGNED'
                        ? 'bg-indigo-100 text-indigo-800 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>Assign</span>
                    <UserIcon className="h-5 w-5 text-indigo-500" />
                  </button>
                  
                  <button
                    onClick={() => handleStatusUpdate('IN_PROGRESS')}
                    disabled={booking.status === 'IN_PROGRESS' || updateStatusMutation.isPending}
                    className={`w-full flex justify-between items-center px-3 py-2 text-sm font-medium rounded-md ${
                      booking.status === 'IN_PROGRESS'
                        ? 'bg-purple-100 text-purple-800 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>In Progress</span>
                    <ClockIcon className="h-5 w-5 text-purple-500" />
                  </button>
                  
                  <button
                    onClick={() => handleStatusUpdate('COMPLETED')}
                    disabled={booking.status === 'COMPLETED' || updateStatusMutation.isPending}
                    className={`w-full flex justify-between items-center px-3 py-2 text-sm font-medium rounded-md ${
                      booking.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>Complete</span>
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </button>
                  
                  <button
                    onClick={() => handleStatusUpdate('CANCELED')}
                    disabled={booking.status === 'CANCELED' || updateStatusMutation.isPending}
                    className={`w-full flex justify-between items-center px-3 py-2 text-sm font-medium rounded-md ${
                      booking.status === 'CANCELED'
                        ? 'bg-gray-100 text-gray-800 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>Cancel</span>
                    <XCircleIcon className="h-5 w-5 text-gray-500" />
                  </button>
                  
                  <button
                    onClick={() => handleStatusUpdate('REJECTED')}
                    disabled={booking.status === 'REJECTED' || updateStatusMutation.isPending}
                    className={`w-full flex justify-between items-center px-3 py-2 text-sm font-medium rounded-md ${
                      booking.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>Reject</span>
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
