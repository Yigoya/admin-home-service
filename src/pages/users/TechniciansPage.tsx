import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { getTechnicians, deleteTechnician } from '../../api/users';
import type { Technician, Service } from '../../types/index';

const TechniciansPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  
  const page = parseInt(searchParams.get('page') || '0');
  const size = parseInt(searchParams.get('size') || '10');
  const searchName = searchParams.get('name') || '';
  
  const [searchInput, setSearchInput] = useState(searchName);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [technicianToDelete, setTechnicianToDelete] = useState<Technician | null>(null);
  const [showTechnicianDetails, setShowTechnicianDetails] = useState<Technician | null>(null);
  
  // Fetch technicians
  const { data, isLoading, isError } = useQuery({
    queryKey: ['technicians', page, size, searchName],
    queryFn: () => getTechnicians({ page, size, name: searchName }),
  });
  
  // Delete technician mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTechnician(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      setShowDeleteModal(false);
      setTechnicianToDelete(null);
    },
  });
  
  // Handle search
  const handleSearch = () => {
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set('page', '0'); // Reset to first page
      newParams.set('name', searchInput);
      return newParams;
    });
  };
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set('page', newPage.toString());
      return newParams;
    });
  };
  
  // Handle "Enter" key in search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // Open delete confirmation modal
  const confirmDelete = (technician: Technician) => {
    setTechnicianToDelete(technician);
    setShowDeleteModal(true);
  };
  
  // Open technician details modal
  const viewTechnicianDetails = (technician: Technician) => {
    setShowTechnicianDetails(technician);
  };

  // Render star rating
  const renderRating = (rating: number | null | undefined) => {
    if (!rating) return <span className="text-gray-500 text-sm">No ratings</span>;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarIconSolid key={i} className="h-4 w-4 text-yellow-400 opacity-50" />);
      } else {
        stars.push(<StarIcon key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    
    return (
      <div className="flex items-center">
        <div className="flex">{stars}</div>
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Technicians</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your service technicians
          </p>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search technicians..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={handleSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2"
          >
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* Loading */}
      {isLoading && (
        <div className="w-full h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      )}
      
      {/* Error */}
      {isError && (
        <div className="w-full p-6 text-center text-red-500">
          Failed to load technicians. Please try again.
        </div>
      )}
      
      {/* Technicians Table */}
      {data && !isLoading && !isError && (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Technician
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.content.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No technicians found. Try adjusting your search.
                    </td>
                  </tr>
                ) : (
                  data.content.map((technician: Technician) => (
                    <tr key={technician.technicianId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {technician.profileImage ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={technician.profileImage}
                                alt={technician.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-800 font-medium">
                                  {technician.name.split(' ').map((n: string) => n[0]).join('')}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{technician.name}</div>
                            <div className="text-sm text-gray-500">ID: {technician.technicianId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-900 flex items-center">
                            <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-500" />
                            {technician.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <PhoneIcon className="h-4 w-4 mr-1 text-gray-500" />
                            {technician.phoneNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
                          {technician.address ? (
                            <span>
                              {technician.address.subcity}, {technician.address.city}
                            </span>
                          ) : (
                            <span className="text-gray-500">Not specified</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderRating(technician.rating)}
                        <div className="text-xs text-gray-500 mt-1">
                          {technician.completedJobs ? `${technician.completedJobs} jobs` : 'No jobs yet'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {technician.services && technician.services.length > 0 ? (
                            technician.services.slice(0, 2).map((service: Service) => (
                              <span
                                key={service.id}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {service.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">No services</span>
                          )}
                          {technician.services && technician.services.length > 2 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{technician.services.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => viewTechnicianDetails(technician)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(technician)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {data.totalElements > 0 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{data.number * data.size + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min((data.number + 1) * data.size, data.totalElements)}
                    </span>{' '}
                    of <span className="font-medium">{data.totalElements}</span> technicians
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(data.number - 1)}
                      disabled={data.first}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                        data.first
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                      let pageNumber;
                      if (data.totalPages <= 5) {
                        pageNumber = i;
                      } else if (data.number < 3) {
                        pageNumber = i;
                      } else if (data.number > data.totalPages - 3) {
                        pageNumber = data.totalPages - 5 + i;
                      } else {
                        pageNumber = data.number - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          aria-current={data.number === pageNumber ? 'page' : undefined}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            data.number === pageNumber
                              ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          }`}
                        >
                          {pageNumber + 1}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(data.number + 1)}
                      disabled={data.last}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                        data.last
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && technicianToDelete && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Technician</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete {technicianToDelete.name}? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                  onClick={() => {
                    if (technicianToDelete?.technicianId != null) {
                      deleteMutation.mutate(technicianToDelete.technicianId);
                    }
                  }}
                  disabled={deleteMutation.isPending || technicianToDelete?.technicianId == null}
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Technician Details Modal */}
      {showTechnicianDetails && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowTechnicianDetails(null)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setShowTechnicianDetails(null)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Technician Details</h3>
                  
                  <div className="mt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                      <div className="sm:mr-4 mb-4 sm:mb-0 flex justify-center">
                        {showTechnicianDetails.profileImage ? (
                          <img
                            className="h-24 w-24 rounded-full object-cover"
                            src={showTechnicianDetails.profileImage}
                            alt={showTechnicianDetails.name}
                          />
                        ) : (
                          <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-800 text-2xl font-medium">
                              {showTechnicianDetails.name.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-center sm:text-left">
                        <h4 className="text-xl font-bold">{showTechnicianDetails.name}</h4>
                        <p className="text-gray-500">Technician ID: {showTechnicianDetails.technicianId}</p>
                        <div className="mt-2">
                          {renderRating(showTechnicianDetails.rating)}
                          {showTechnicianDetails.completedJobs && (
                            <p className="text-sm text-gray-500 mt-1">
                              {showTechnicianDetails.completedJobs} completed jobs
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {showTechnicianDetails.bio && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h5 className="text-sm font-medium text-gray-500 mb-2">Bio</h5>
                        <p className="text-sm">{showTechnicianDetails.bio}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h5>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
                            <span>{showTechnicianDetails.email}</span>
                          </div>
                          <div className="flex items-center">
                            <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
                            <span>{showTechnicianDetails.phoneNumber}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-500 mb-2">Location</h5>
                        {showTechnicianDetails.address ? (
                          <div className="space-y-1">
                            <p>
                              {[
                                showTechnicianDetails.address.subcity,
                                showTechnicianDetails.address.wereda && `Wereda ${showTechnicianDetails.address.wereda}`,
                              ].filter(Boolean).join(', ')}
                            </p>
                            <p>
                              {showTechnicianDetails.address.city}
                              {showTechnicianDetails.address.country && `, ${showTechnicianDetails.address.country}`}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-500">No address information</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-500 mb-2">Services Offered</h5>
                      <div className="flex flex-wrap gap-2">
                        {showTechnicianDetails.services && showTechnicianDetails.services.length > 0 ? (
                          showTechnicianDetails.services.map((service: Service) => (
                            <span
                              key={service.id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {service.name}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No services offered</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                        onClick={() => setShowTechnicianDetails(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechniciansPage; 