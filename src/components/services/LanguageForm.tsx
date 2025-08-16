import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { LanguageOption } from '../../api/services';

interface LanguageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; lang: LanguageOption }) => void;
  isLoading: boolean;
  title: string;
  currentLanguage?: LanguageOption;
  name?: string;
  description?: string;
}

export default function LanguageForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  title,
  currentLanguage = 'ENGLISH',
  name = '',
  description = ''
}: LanguageFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name,
      description,
      lang: currentLanguage
    }
  });
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                {...register('lang', { required: 'Language is required' })}
                className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ENGLISH">English</option>
                <option value="AMHARIC">Amharic</option>
                <option value="OROMO">Oromo</option>
              </select>
              {errors.lang && (
                <p className="text-red-500 text-xs mt-1">{errors.lang.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name*
              </label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                rows={3}
                {...register('description', { required: 'Description is required' })}
                className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Saving...' : 'Save Translation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 