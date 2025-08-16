import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { ServiceCategory, LanguageOption } from '../../api/services';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  category?: ServiceCategory;
  isLoading: boolean;
  title: string;
  currentLanguage: LanguageOption;
}

export default function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  category,
  isLoading,
  title,
  currentLanguage
}: CategoryFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      lang: currentLanguage,
      isMobileCategory: false
    }
  });
  
  // Reset form when category changes
  useEffect(() => {
    if (category) {
      setValue('name', category.name || category.categoryName || '');
      setValue('description', category.description || '');
      
      if (category.icon) {
        setPreviewImage(`${category.icon.startsWith('http') ? '' : import.meta.env.VITE_API_URL}/${category.icon}`);
      } else {
        setPreviewImage(null);
      }
    } else {
      reset({
        name: '',
        description: '',
        lang: currentLanguage
      });
      setPreviewImage(null);
    }
  }, [category, reset, setValue, currentLanguage]);
  
  const processSubmit = (data: any) => {
    const formData = new FormData();
    
    // Add all form fields to FormData
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
        formData.append(key, data[key]);
      }
    });
    
    // Handle icon file
    const iconInput = document.getElementById('categoryIcon') as HTMLInputElement;
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
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-auto">
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
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 pb-2 border-b mb-4">Category Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name*
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter category name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>
                
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
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  rows={3}
                  {...register('description', { required: 'Description is required' })}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter category description"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>
            
            {/* Icon */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="categoryIcon"
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
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isMobileCategory"
                {...register('isMobileCategory')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isMobileCategory" className="ml-2 block text-sm text-gray-700">
                Show in mobile app
              </label>
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
              {isLoading ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 