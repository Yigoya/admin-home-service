import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { Service, ServiceCategory, LanguageOption } from '../../api/services';

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  service?: Service;
  categories: ServiceCategory[];
  parentServiceId?: number;
  isLoading: boolean;
  title: string;
  currentLanguage: LanguageOption;
}

export default function ServiceForm({
  isOpen,
  onClose,
  onSubmit,
  service,
  categories,
  parentServiceId,
  isLoading,
  title,
  currentLanguage
}: ServiceFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showParentSearch, setShowParentSearch] = useState(false);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [selectedParentService, setSelectedParentService] = useState<Service | null>(null);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      serviceFee: '',
      estimatedDuration: '',
      categoryId: parentServiceId ? '' : '',
      serviceId: service?.serviceId || service?.id || undefined,
      lang: currentLanguage,
      parentServiceId: parentServiceId?.toString() || ''
    }
  });
  
  // Reset form when service changes
  useEffect(() => {
    if (service) {
      setValue('name', service.name || '');
      setValue('description', service.description || '');
      setValue('serviceFee', service.serviceFee?.toString() || '');
      setValue('estimatedDuration', service.estimatedDuration || '');
      setValue('categoryId', service.categoryId?.toString() || '');
      
      if (service.icon) {
        setPreviewImage(`${service.icon.startsWith('http') ? '' : import.meta.env.VITE_API_URL_FILE}/${service.icon}`);
      } else {
        setPreviewImage(null);
      }
    } else {
      reset({
        name: '',
        description: '',
        serviceFee: '',
        estimatedDuration: '',
        categoryId: parentServiceId ? '' : '',
        serviceId: undefined,
        lang: currentLanguage,
        parentServiceId: parentServiceId?.toString() || ''
      });
      setPreviewImage(null);
    }
    
    // If parent service ID is provided, use it for the categoryId
    if (parentServiceId) {
      setValue('parentServiceId', parentServiceId.toString());
      setSelectedParentService(null);
    }

    // Collect all services from all categories for the parent service search
    const allServices: Service[] = [];
    categories.forEach(category => {
      if (category.services) {
        collectServices(category.services, allServices);
      }
    });
    setAvailableServices(allServices);
  }, [service, reset, setValue, parentServiceId, currentLanguage, categories]);
  
  // Helper function to recursively collect all services
  const collectServices = (services: Service[], result: Service[]) => {
    services.forEach(service => {
      result.push(service);
      if (service.services && service.services.length > 0) {
        collectServices(service.services, result);
      }
    });
  };

  // Filter services based on search term
  const filteredServices = availableServices.filter(s => {
    const serviceId = s.id || s.serviceId;
    // Don't show current service in search results
    if (serviceId && service && (service.id === serviceId || service.serviceId === serviceId)) {
      return false;
    }
    return s.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const processSubmit = (data: any) => {
    const formData = new FormData();
    
    // Add all form fields to FormData
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
        formData.append(key, data[key]);
      }
    });
    
    // If a parent service was selected via search, add its ID
    if (selectedParentService) {
      const parentId = selectedParentService.id || selectedParentService.serviceId;
      if (parentId) {
        formData.append('parentServiceId', parentId.toString());
      }
    }
    
    // Handle icon file
    const iconInput = document.getElementById('icon') as HTMLInputElement;
    if (iconInput.files && iconInput.files.length > 0) {
      formData.append('icon', iconInput.files[0]);
    }
    
    onSubmit(formData);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectParentService = (service: Service) => {
    setSelectedParentService(service);
    setShowParentSearch(false);
    setSearchTerm('');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-5 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(processSubmit)} className="p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 pb-2 border-b">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Name*
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter service name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <select
                    {...register('categoryId', { required: 'Category is required' })}
                    className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={!!parentServiceId || !!selectedParentService}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option 
                        key={category.categoryId || category.id} 
                        value={category.categoryId || category.id}
                      >
                        {category.name || category.categoryName}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>
                  )}
                </div>
              </div>

              {/* Parent Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Service (optional)
                </label>
                
                {parentServiceId ? (
                  <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
                    This will be added as a sub-service
                  </div>
                ) : selectedParentService ? (
                  <div className="flex items-center justify-between px-3 py-2 border rounded-lg bg-blue-50">
                    <span className="text-blue-800">
                      {selectedParentService.name}
                    </span>
                    <button 
                      type="button"
                      onClick={() => setSelectedParentService(null)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowParentSearch(!showParentSearch)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 px-3 py-2 border border-gray-300 rounded-lg w-full text-left"
                    >
                      <MagnifyingGlassIcon className="h-4 w-4" />
                      Search for parent service
                    </button>
                    
                    {showParentSearch && (
                      <div className="mt-2 border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-2 border-b">
                          <div className="relative">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Search services..."
                              className="pl-9 pr-3 py-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="max-h-40 overflow-y-auto">
                          {filteredServices.length > 0 ? (
                            <ul className="divide-y">
                              {filteredServices.map((service) => (
                                <li key={service.id || service.serviceId} className="hover:bg-gray-50">
                                  <button
                                    type="button"
                                    onClick={() => selectParentService(service)}
                                    className="px-3 py-2 text-left w-full"
                                  >
                                    {service.name}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="p-3 text-gray-500 text-sm text-center">
                              No matching services found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                rows={3}
                {...register('description', { required: 'Description is required' })}
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter service description"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>
            
            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="icon"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {previewImage && (
                  <div className="flex-shrink-0">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="h-16 w-16 object-contain border rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                {...register('lang')}
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="ENGLISH">English</option>
                <option value="AMHARIC">Amharic</option>
                <option value="OROMO">Oromo</option>
              </select>
            </div>
            
            {/* Price and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Fee
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('serviceFee')}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  placeholder="HH:MM"
                  {...register('estimatedDuration', {
                    pattern: {
                      value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                      message: 'Duration must be in the format HH:MM'
                    }
                  })}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.estimatedDuration && (
                  <p className="text-red-500 text-xs mt-1">{errors.estimatedDuration.message}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 