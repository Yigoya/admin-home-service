import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, PencilIcon, TrashIcon, PlusIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import type { Service } from '../../api/services';

interface ServiceItemProps {
  service: Service;
  depth: number;
  isExpanded: boolean;
  onToggleExpand: (serviceId: number) => void;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: number) => void;
  onAddSubService: (parentId: number, categoryId: number) => void;
  onAddLanguage: (service: Service) => void;
}

export default function ServiceItem({
  service,
  depth,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddSubService,
  onAddLanguage
}: ServiceItemProps) {
  const hasChildren = service.services && service.services.length > 0;
  const indentPadding = `${depth * 1.5}rem`;
  
  return (
    <div className="service-item">
      <div 
        className="flex items-center py-2 px-4 hover:bg-gray-50 border-b"
        style={{ paddingLeft: indentPadding }}
      >
        <div 
          className="cursor-pointer mr-2"
          onClick={() => hasChildren && onToggleExpand(service.serviceId || service.id!)}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            )
          ) : (
            <div className="w-5" />
          )}
        </div>
        
        <div className="flex-1 flex items-center gap-3">
          {service.icon && (
            <img 
              src={`${service.icon.startsWith('http') ? '' : import.meta.env.VITE_API_URL_FILE}/${service.icon}`} 
              alt={service.name} 
              className="h-8 w-8 object-contain rounded"
            />
          )}
          <div className="flex-1">
            <h4 className="font-medium">{service.name}</h4>
            <p className="text-sm text-gray-500 truncate max-w-md">{service.description}</p>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 gap-6">
            {service.serviceFee !== null && (
              <div className="w-24 text-right">
                <p>Price</p>
                <p className="font-semibold">${service.serviceFee}</p>
              </div>
            )}
            
            {service.estimatedDuration && (
              <div className="w-24 text-right">
                <p>Duration</p>
                <p className="font-semibold">{service.estimatedDuration}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onAddLanguage(service)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
            title="Add Language"
          >
            <GlobeAltIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onAddSubService(service.serviceId || service.id!, service.categoryId)}
            className="p-1 text-green-600 hover:bg-green-50 rounded-full"
            title="Add Sub-Service"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onEdit(service)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
            title="Edit Service"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(service.serviceId || service.id!)}
            className="p-1 text-red-600 hover:bg-red-50 rounded-full"
            title="Delete Service"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Nested Services */}
      {isExpanded && hasChildren && (
        <div className="nested-services">
          {service.services!.map((childService) => (
            <ServiceItem
              key={childService.serviceId || childService.id}
              service={childService}
              depth={depth + 1}
              isExpanded={false}
              onToggleExpand={onToggleExpand}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddSubService={onAddSubService}
              onAddLanguage={onAddLanguage}
            />
          ))}
        </div>
      )}
    </div>
  );
} 