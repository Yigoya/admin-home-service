import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { getOperators, deleteOperator } from '../../api/users';
import type { Operator } from '../../types/index';

const OperatorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const page = parseInt(searchParams.get('page') || '0');
  const size = parseInt(searchParams.get('size') || '10');
  const searchName = searchParams.get('name') || '';
  
  const [searchInput, setSearchInput] = useState(searchName);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [operatorToDelete, setOperatorToDelete] = useState<Operator | null>(null);
  const [showOperatorDetails, setShowOperatorDetails] = useState<Operator | null>(null);
  
  // Fetch operators
  const { data, isLoading, isError } = useQuery({
    queryKey: ['operators', page, size, searchName],
    queryFn: () => getOperators({ page, size, name: searchName }),
  });
  
  // Delete operator mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteOperator(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      setShowDeleteModal(false);
      setOperatorToDelete(null);
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
  const confirmDelete = (operator: Operator) => {
    setOperatorToDelete(operator);
    setShowDeleteModal(true);
  };
  
  // Open operator details modal
  const viewOperatorDetails = (operator: Operator) => {
    setShowOperatorDetails(operator);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operators</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your system operators
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search operators..."
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
          
          <button
            onClick={() => navigate('/users/operators/register')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Register New
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
          Failed to load operators. Please try again.
        </div>
      )}
      
      {/* Operators Table */}
      {data && !isLoading && !isError && (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operator
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.content.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No operators found. Try adjusting your search.
                    </td>
                  </tr>
                ) : (
                  data.content.map((operator: Operator) => (
                    <tr key={operator.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {operator.profileImage ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={operator.profileImage}
                                alt={operator.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <UserCircleIcon className="h-6 w-6 text-blue-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{operator.name}</div>
                            <div className="text-sm text-gray-500">ID: {operator.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-500" />
                          {operator.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <PhoneIcon className="h-4 w-4 mr-1 text-gray-500" />
                          {operator.phoneNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => viewOperatorDetails(operator)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(operator)}
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
          {data.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 px-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{data.content.length}</span> of{' '}
                <span className="font-medium">{data.totalElements}</span> operators
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className={`p-2 rounded ${
                    page === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                {[...Array(data.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`p-2 rounded ${
                      page === i
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === data.totalPages - 1}
                  className={`p-2 rounded ${
                    page === data.totalPages - 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && operatorToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Operator</h3>
            <p className="text-gray-500 mb-4">
              Are you sure you want to delete operator <span className="font-medium">{operatorToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(operatorToDelete.id)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Operator Details Modal */}
      {showOperatorDetails && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Operator Details</h3>
              <button
                onClick={() => setShowOperatorDetails(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 mr-4">
                    {showOperatorDetails.profileImage ? (
                      <img
                        className="h-16 w-16 rounded-full object-cover"
                        src={showOperatorDetails.profileImage}
                        alt={showOperatorDetails.name}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserCircleIcon className="h-10 w-10 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">{showOperatorDetails.name}</h4>
                    <p className="text-gray-500">ID: {showOperatorDetails.id}</p>
                    <p className="text-gray-500">Status: {showOperatorDetails.status}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-gray-900">Contact Information</div>
                    <div className="flex items-center mt-1">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{showOperatorDetails.email}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{showOperatorDetails.phoneNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <div className="font-medium text-gray-900 mb-2">Bio</div>
                  <p className="text-gray-700">{showOperatorDetails.bio || 'No bio provided'}</p>
                </div>
                
                <div className="mb-4">
                  <div className="font-medium text-gray-900 mb-2">Account Information</div>
                  <p className="text-gray-700">
                    Created: {new Date(showOperatorDetails.createdAt || '').toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    Last Updated: {new Date(showOperatorDetails.updatedAt || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowOperatorDetails(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorsPage; 