import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import servicesApi from '../api/services';
import type { Service, ServiceCategory, ServiceLanguage, CategoryLanguage, LanguageOption } from '../api/services';

export function useServicesData(language: LanguageOption = 'ENGLISH') {
  const queryClient = useQueryClient();
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [expandedServices, setExpandedServices] = useState<Set<number>>(new Set());

  // Fetch nested services data
  const { 
    data: servicesData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['services', 'nested', language],
    queryFn: () => servicesApi.getNestedServices(language),
  });

  // Toggle category expansion
  const toggleCategoryExpansion = useCallback((categoryId: number) => {
    setExpandedCategories(prevExpanded => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(categoryId)) {
        newExpanded.delete(categoryId);
      } else {
        newExpanded.add(categoryId);
      }
      return newExpanded;
    });
  }, []);

  // Toggle service expansion
  const toggleServiceExpansion = useCallback((serviceId: number) => {
    setExpandedServices(prevExpanded => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(serviceId)) {
        newExpanded.delete(serviceId);
      } else {
        newExpanded.add(serviceId);
      }
      return newExpanded;
    });
  }, []);

  // Create a new category
  const createCategoryMutation = useMutation({
    mutationFn: (formData: FormData) => servicesApi.createServiceCategory(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  // Update a category
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => 
      servicesApi.updateServiceCategory(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  // Add language to a category
  const addCategoryLanguageMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryLanguage }) => 
      servicesApi.addServiceCategoryLanguage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  // Create a new service
  const createServiceMutation = useMutation({
    mutationFn: (formData: FormData) => servicesApi.createService(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  // Update a service
  const updateServiceMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => 
      servicesApi.updateService(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  // Add language to a service
  const addServiceLanguageMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ServiceLanguage }) => 
      servicesApi.addServiceLanguage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  // Delete a service
  const deleteServiceMutation = useMutation({
    mutationFn: (id: number) => servicesApi.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  // Utility function to find a service by ID in the nested structure
  const findServiceById = useCallback((
    services: Service[] | undefined,
    serviceId: number
  ): Service | undefined => {
    if (!services) return undefined;

    for (const service of services) {
      if (service.id === serviceId || service.serviceId === serviceId) {
        return service;
      }

      // Recursively search in nested services
      if (service.services && service.services.length > 0) {
        const found = findServiceById(service.services, serviceId);
        if (found) return found;
      }
    }

    return undefined;
  }, []);

  // Utility function to find a category by ID
  const findCategoryById = useCallback((
    categories: ServiceCategory[] | undefined,
    categoryId: number
  ): ServiceCategory | undefined => {
    if (!categories) return undefined;

    for (const category of categories) {
      if (category.id === categoryId || category.categoryId === categoryId) {
        return category;
      }
    }

    return undefined;
  }, []);

  // Find service by ID in the entire data structure
  const findService = useCallback((serviceId: number): Service | undefined => {
    if (!servicesData?.data) return undefined;

    for (const category of servicesData.data) {
      if (!category.services) continue;
      
      const found = findServiceById(category.services, serviceId);
      if (found) return found;
    }

    return undefined;
  }, [servicesData?.data, findServiceById]);

  // Find category by ID
  const findCategory = useCallback((categoryId: number): ServiceCategory | undefined => {
    if (!servicesData?.data) return undefined;
    return findCategoryById(servicesData.data, categoryId);
  }, [servicesData?.data, findCategoryById]);

  return {
    servicesData: servicesData || [],
    isLoading,
    isError,
    error,
    refetch,
    expandedCategories,
    expandedServices,
    toggleCategoryExpansion,
    toggleServiceExpansion,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    addCategoryLanguage: addCategoryLanguageMutation.mutate,
    createService: createServiceMutation.mutate,
    updateService: updateServiceMutation.mutate,
    addServiceLanguage: addServiceLanguageMutation.mutate,
    deleteService: deleteServiceMutation.mutate,
    findService,
    findCategory,
    isCreatingCategory: createCategoryMutation.isPending,
    isUpdatingCategory: updateCategoryMutation.isPending,
    isAddingCategoryLanguage: addCategoryLanguageMutation.isPending,
    isCreatingService: createServiceMutation.isPending,
    isUpdatingService: updateServiceMutation.isPending,
    isAddingServiceLanguage: addServiceLanguageMutation.isPending,
    isDeletingService: deleteServiceMutation.isPending,
  };
} 