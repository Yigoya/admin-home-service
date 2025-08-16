import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/auth';

const RegisterOperatorPage = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    bio: '',
    availability: 'yes',
    password: '',
  });
  
  // File state
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [documents, setDocuments] = useState<FileList | null>(null);
  const [idCardImage, setIdCardImage] = useState<File | null>(null);
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Success message
  const [successMessage, setSuccessMessage] = useState('');
  
  // Register operator mutation
  const registerMutation = useMutation({
    mutationFn: authApi.registerOperator,
    onSuccess: () => {
      setSuccessMessage('Operator registered successfully!');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        bio: '',
        availability: 'yes',
        password: '',
      });
      setProfileImage(null);
      setDocuments(null);
      setIdCardImage(null);
      
      // Navigate back to operators page after 2 seconds
      setTimeout(() => {
        navigate('/users/operators');
      }, 2000);
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        // Set form errors
        const serverErrors = error.response.data.errors.reduce(
          (acc: Record<string, string>, curr: string) => {
            const [field, message] = curr.split(':');
            return { ...acc, [field]: message };
          },
          {}
        );
        setErrors(serverErrors);
      } else {
        setErrors({ general: 'Failed to register operator. Please try again.' });
      }
    },
  });
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle file inputs
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    
    if (files && files.length > 0) {
      if (name === 'profileImage') {
        setProfileImage(files[0]);
      } else if (name === 'documents') {
        setDocuments(files);
      } else if (name === 'idCardImage') {
        setIdCardImage(files[0]);
      }
    }
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors: Record<string, string> = {};
    
    if (!formData.name) validationErrors.name = 'Name is required';
    if (!formData.email) validationErrors.email = 'Email is required';
    if (!formData.phoneNumber) validationErrors.phoneNumber = 'Phone number is required';
    if (!formData.password) validationErrors.password = 'Password is required';
    if (formData.password && formData.password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters';
    }
    if (!profileImage) validationErrors.profileImage = 'Profile image is required';
    if (!idCardImage) validationErrors.idCardImage = 'ID card image is required';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Create FormData
    const submitFormData = new FormData();
    submitFormData.append('name', formData.name);
    submitFormData.append('email', formData.email);
    submitFormData.append('phoneNumber', formData.phoneNumber);
    submitFormData.append('bio', formData.bio);
    submitFormData.append('availability', formData.availability);
    submitFormData.append('password', formData.password);
    
    // Append files
    if (profileImage) {
      submitFormData.append('profileImage', profileImage);
    }
    
    if (idCardImage) {
      submitFormData.append('idCardImage', idCardImage);
    }
    
    // Append documents
    if (documents) {
      for (let i = 0; i < documents.length; i++) {
        submitFormData.append('documents', documents[i]);
      }
    }
    
    // Submit form
    registerMutation.mutate(submitFormData);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Register New Operator</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new operator to the platform
        </p>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* General error */}
      {errors.general && (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{errors.general}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>
            
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            
            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {/* Availability */}
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                Availability
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="yes">Available</option>
                <option value="no">Not Available</option>
              </select>
            </div>
            
            {/* Profile Image */}
            <div>
              <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
                Profile Image *
              </label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.profileImage && (
                <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>
              )}
            </div>
            
            {/* ID Card Image */}
            <div>
              <label htmlFor="idCardImage" className="block text-sm font-medium text-gray-700">
                ID Card Image *
              </label>
              <input
                type="file"
                id="idCardImage"
                name="idCardImage"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.idCardImage && (
                <p className="mt-1 text-sm text-red-600">{errors.idCardImage}</p>
              )}
            </div>
            
            {/* Documents */}
            <div>
              <label htmlFor="documents" className="block text-sm font-medium text-gray-700">
                Documents (certificates, licenses, etc.)
              </label>
              <input
                type="file"
                id="documents"
                name="documents"
                multiple
                onChange={handleFileChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/users/operators')}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {registerMutation.isPending ? 'Registering...' : 'Register Operator'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterOperatorPage;
