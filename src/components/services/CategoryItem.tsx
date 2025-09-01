import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, PencilIcon, PlusIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import type { ServiceCategory } from '../../api/services';
import ServiceItem from './ServiceItem';

interface CategoryItemProps {
  category: ServiceCategory;
  expandedCategories: Set<number>;
  expandedServices: Set<number>;
  onToggleCategoryExpand: (categoryId: number) => void;
  onToggleServiceExpand: (serviceId: number) => void;
  onEditCategory: (category: ServiceCategory) => void;
  onEditService: (service: any) => void;
  onDeleteService: (serviceId: number) => void;
  onAddService: (categoryId: number) => void;
  onAddSubService: (parentId: number, categoryId: number) => void;
  onAddCategoryLanguage: (category: ServiceCategory) => void;
  onAddServiceLanguage: (service: any) => void;
}

export default function CategoryItem({
  category,
  expandedCategories,
  expandedServices,
  onToggleCategoryExpand,
  onToggleServiceExpand,
  onEditCategory,
  onEditService,
  onDeleteService,
  onAddService,
  onAddSubService,
  onAddCategoryLanguage,
  onAddServiceLanguage
}: CategoryItemProps) {
  const hasServices = category.services && category.services.length > 0;
  const isCategoryExpanded = expandedCategories.has(category.categoryId || category.id!);
  
  return (
    <div className="category-item border rounded-lg mb-4 overflow-hidden shadow-sm">
      <div 
        className="flex items-center py-3 px-4 bg-gray-50 border-b cursor-pointer"
        onClick={() => onToggleCategoryExpand(category.categoryId || category.id!)}
      >
        <div className="cursor-pointer mr-2">
          {hasServices ? (
            isCategoryExpanded ? (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            )
          ) : (
            <div className="w-5" />
          )}
        </div>
        
        <div className="flex-1 flex items-center gap-3">
          {category.icon && (
            <img 
              src={`${category.icon.startsWith('http') ? '' : import.meta.env.VITE_API_URL_FILE}/${category.icon}`} 
              alt={category.name || category.categoryName} 
              className="h-10 w-10 object-contain rounded-md"
            />
          )}
          <div>
            <h3 className="font-semibold text-lg">{category.name || category.categoryName}</h3>
            <p className="text-sm text-gray-600">{category.description}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddCategoryLanguage(category);
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
            title="Add Language"
          >
            <GlobeAltIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddService(category.categoryId || category.id!);
            }}
            className="p-1 text-green-600 hover:bg-green-50 rounded-full"
            title="Add Service"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditCategory(category);
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
            title="Edit Category"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Services */}
      {isCategoryExpanded && hasServices && (
        <div className="services-list">
          {category.services!.map((service) => (
            <ServiceItem
              key={service.serviceId || service.id}
              service={service}
              depth={0}
              isExpanded={expandedServices.has(service.serviceId || service.id!)}
              onToggleExpand={onToggleServiceExpand}
              onEdit={onEditService}
              onDelete={onDeleteService}
              onAddSubService={onAddSubService}
              onAddLanguage={onAddServiceLanguage}
            />
          ))}
        </div>
      )}
    </div>
  );
} 