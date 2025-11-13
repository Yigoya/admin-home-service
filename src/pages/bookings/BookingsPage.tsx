import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { bookingsApi } from '../../api';
import type { Booking, BookingStatus, ApiResponse, PaginatedResponse } from '../../types';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

// Status badge component
const StatusBadge = ({ status }: { status: BookingStatus }) => {
  const statusConfig: Record<BookingStatus, { color: string; text: string }> = {
    'PENDING': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
    'ACCEPTED': { color: 'bg-blue-100 text-blue-800', text: 'Accepted' },
    'ASSIGNED': { color: 'bg-indigo-100 text-indigo-800', text: 'Assigned' },
    'IN_PROGRESS': { color: 'bg-purple-100 text-purple-800', text: 'In Progress' },
    'COMPLETED': { color: 'bg-green-100 text-green-800', text: 'Completed' },
    'CANCELED': { color: 'bg-gray-100 text-gray-800', text: 'Canceled' },
    'CANCELLED': { color: 'bg-gray-100 text-gray-800', text: 'Cancelled' },
    'REJECTED': { color: 'bg-red-100 text-red-800', text: 'Rejected' }
  };

  const { color, text } = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {text}
    </span>
  );
};

const BookingsPage = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch bookings with filters
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['bookings', page, size, serviceFilter, statusFilter],
    queryFn: () => bookingsApi.getBookings(page, size, serviceFilter, statusFilter),
    placeholderData: (previousData) => previousData
  });

  const apiData = (data as ApiResponse<PaginatedResponse<Booking>> | undefined)?.data;
  const bookings = apiData?.content || [];
  const totalPages = apiData?.totalPages || 0;
  const totalElements = apiData?.totalElements || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we're not using the search term as the API doesn't support it
    // We could filter by service name instead
    setServiceFilter(searchTerm);
    setPage(0);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setServiceFilter('');
    setStatusFilter('');
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
        
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search by service..."
              value={searchTerm}
              onChange={handleServiceChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </form>
          
          <button
            onClick={handleFilterToggle}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FunnelIcon className="h-4 w-4 mr-1" />
            Filter
          </button>
          
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            Refresh
          </button>
        </div>
      </div>
      
      {isFilterOpen && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/3">
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={handleStatusChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELED">Canceled</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-10">
          <p className="text-red-500">Error loading bookings. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retry
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {serviceFilter || statusFilter 
              ? "No bookings match your current filters." 
              : "There are no bookings in the system yet."}
          </p>
          {(serviceFilter || statusFilter) && (
            <button
              onClick={handleClearFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Technician
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking: Booking) => (
                  <tr key={(booking as any).bookingId ?? booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{(booking as any).bookingId ?? booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {booking.customer?.profileImage ? (
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={booking.customer?.profileImage} 
                              alt={booking.customer?.name || 'Customer'} 
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{booking.customer?.name || 'N/A'}</div>
                          <div className="flex items-center text-sm text-gray-500">
                            <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {booking.customer?.email || '—'}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <PhoneIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {booking.customer?.phoneNumber || '—'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{typeof booking.service === 'string' ? booking.service : booking.service?.name ?? 'N/A'}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{booking.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {formatDate(booking.createdAt)}
                      </div>
                      {booking.timeSchedule && (
                        <div className="text-sm text-gray-500">
                          Scheduled: {formatDate(booking.timeSchedule)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.technician ? (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            {booking.technician.profileImage ? (
                              <img 
                                className="h-8 w-8 rounded-full object-cover" 
                                src={booking.technician.profileImage} 
                                alt={booking.technician.name} 
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{booking.technician.name}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link
                        to={`/admin/bookings/${(booking as any).bookingId ?? booking.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                  page === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                  page >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{page * size + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min((page + 1) * size, totalElements)}
                  </span>{' '}
                  of <span className="font-medium">{totalElements}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                      page === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        page === i
                          ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                      page >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingsPage; 