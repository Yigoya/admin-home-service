import { useState } from 'react';
import { useServicesData } from '../../hooks/useServicesData';
import CategoryItem from '../../components/services/CategoryItem';
import ServiceForm from '../../components/services/ServiceForm';
import CategoryForm from '../../components/services/CategoryForm';
import LanguageForm from '../../components/services/LanguageForm';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { PlusIcon, ArrowPathIcon, LanguageIcon } from '@heroicons/react/24/outline';
import type { Service, ServiceCategory, LanguageOption } from '../../api/services';
import type { ApiResponse } from '../../types/index';

export default function ServicesPage() {
  // States for modals
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [languageType, setLanguageType] = useState<'service' | 'category'>('service');
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);
  const [parentServiceId, setParentServiceId] = useState<number | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>('ENGLISH');
  
  // Fetch services data
  const {
    servicesData,
    isLoading,
    isError,
    error,
    refetch,
    expandedCategories,
    expandedServices,
    toggleCategoryExpansion,
    toggleServiceExpansion,
    createCategory,
    updateCategory,
    addCategoryLanguage,
    createService,
    updateService,
    addServiceLanguage,
    deleteService,
    isCreatingCategory,
    isUpdatingCategory,
    isAddingCategoryLanguage,
    isCreatingService,
    isUpdatingService,
    isAddingServiceLanguage,
    isDeletingService,
  } = useServicesData(currentLanguage);
  
  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentLanguage(e.target.value as LanguageOption);
  };
  
  // Open modals
  const openAddCategoryModal = () => {
    setSelectedCategory(null);
    setModalTitle('Add New Category');
    setIsCategoryModalOpen(true);
  };
  
  const openEditCategoryModal = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setModalTitle('Edit Category');
    setIsCategoryModalOpen(true);
  };
  
  const openAddServiceModal = (categoryId: number) => {
    setSelectedService(null);
    setModalTitle('Add New Service');
    setIsServiceModalOpen(true);
    setParentServiceId(null);
    // Pre-select the category
    const dummyService: Service = {
      name: '',
      description: '',
      icon: '',
      categoryId
    };
    setSelectedService(dummyService);
  };
  
  const openEditServiceModal = (service: Service) => {
    setSelectedService(service);
    setModalTitle('Edit Service');
    setIsServiceModalOpen(true);
    setParentServiceId(null);
  };
  
  const openAddSubServiceModal = (parentId: number, categoryId: number) => {
    setSelectedService(null);
    setModalTitle('Add Sub-Service');
    setIsServiceModalOpen(true);
    setParentServiceId(parentId);
        const dummyService: Service = {
      name: '',
      description: '',
      icon: '',
      categoryId
    };
    setSelectedService(dummyService);
  };
  
  const openAddCategoryLanguageModal = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setLanguageType('category');
    setModalTitle('Add Category Translation');
    setIsLanguageModalOpen(true);
  };
  
  const openAddServiceLanguageModal = (service: Service) => {
    setSelectedService(service);
    setLanguageType('service');
    setModalTitle('Add Service Translation');
    setIsLanguageModalOpen(true);
  };
  
  const openDeleteServiceModal = (serviceId: number) => {
    setServiceToDelete(serviceId);
    setIsDeleteModalOpen(true);
  };
  
  // Handle form submissions
  const handleCategorySubmit = (formData: FormData) => {
    if (selectedCategory?.id || selectedCategory?.categoryId) {
      const id = selectedCategory.id || selectedCategory.categoryId!;
      updateCategory({ id, formData });
    } else {
      createCategory(formData);
    }
    setIsCategoryModalOpen(false);
  };
  
  const handleServiceSubmit = (formData: FormData) => {
    // If adding a sub-service
    if (parentServiceId) {
      formData.append('parentServiceId', parentServiceId.toString());
    }
    
    if (selectedService?.id || selectedService?.serviceId) {
      const id = selectedService.id || selectedService.serviceId!;
      updateService({ id, formData });
    } else {
      createService(formData);
    }
    setIsServiceModalOpen(false);
  };
  
  const handleLanguageSubmit = (data: { name: string; description: string; lang: LanguageOption }) => {
    if (languageType === 'category' && selectedCategory) {
      const id = selectedCategory.id || selectedCategory.categoryId!;
      addCategoryLanguage({ id, data });
    } else if (languageType === 'service' && selectedService) {
      const id = selectedService.id || selectedService.serviceId!;
      addServiceLanguage({ id, data });
    }
    setIsLanguageModalOpen(false);
  };
  
  const handleDeleteConfirm = () => {
    if (serviceToDelete !== null) {
      deleteService(serviceToDelete);
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
    }
  };
  
  if (isError) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Services</h2>
        <p className="text-gray-700 mb-4">{error?.message || 'An error occurred while loading services.'}</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Access the data property to get the array of categories
  const categories: ServiceCategory[] = (servicesData as ApiResponse<ServiceCategory[]> | undefined)?.data ?? [];
  
  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Services Management</h1>
        
        <div className="flex gap-4">
          <div>
            <label htmlFor="language" className="mr-2 text-gray-700">
              Language:
            </label>
            <select
              id="language"
              value={currentLanguage}
              onChange={handleLanguageChange}
              className="border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ENGLISH">English</option>
              <option value="AMHARIC">Amharic</option>
              <option value="OROMO">Oromo</option>
            </select>
          </div>
          
          <button
            onClick={openAddCategoryModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Category
          </button>
          
          <button
            onClick={() => refetch()}
            className="p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            title="Refresh"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
          <LanguageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Categories Found</h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first service category.
          </p>
          <button
            onClick={openAddCategoryModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Category
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category: ServiceCategory) => (
            <CategoryItem
              key={category.categoryId || category.id}
              category={category}
              expandedCategories={expandedCategories}
              expandedServices={expandedServices}
              onToggleCategoryExpand={toggleCategoryExpansion}
              onToggleServiceExpand={toggleServiceExpansion}
              onEditCategory={openEditCategoryModal}
              onEditService={openEditServiceModal}
              onDeleteService={openDeleteServiceModal}
              onAddService={openAddServiceModal}
              onAddSubService={openAddSubServiceModal}
              onAddCategoryLanguage={openAddCategoryLanguageModal}
              onAddServiceLanguage={openAddServiceLanguageModal}
            />
          ))}
        </div>
      )}
      
      {/* Service Modal */}
      <ServiceForm
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSubmit={handleServiceSubmit}
        service={selectedService || undefined}
        categories={categories}
        parentServiceId={parentServiceId || undefined}
        isLoading={isCreatingService || isUpdatingService}
        title={modalTitle}
        currentLanguage={currentLanguage}
      />
      
      {/* Category Modal */}
      <CategoryForm
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCategorySubmit}
        category={selectedCategory || undefined}
        isLoading={isCreatingCategory || isUpdatingCategory}
        title={modalTitle}
        currentLanguage={currentLanguage}
      />
      
      {/* Language Modal */}
      <LanguageForm
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        onSubmit={handleLanguageSubmit}
        isLoading={isAddingCategoryLanguage || isAddingServiceLanguage}
        title={modalTitle}
        name={languageType === 'category' ? selectedCategory?.name : selectedService?.name}
        description={languageType === 'category' ? selectedCategory?.description : selectedService?.description}
      />
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone, and will remove all sub-services as well."
        confirmText="Delete Service"
        isLoading={isDeletingService}
      />
    </div>
  );
} 