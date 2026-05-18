import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { immunizationService } from '@/services/immunizationService';
import { ImmunizationRecord } from '@/types';

export const useImmunizationRecords = (params?: any) => {
  return useQuery({
    queryKey: ['immunization-records', params],
    queryFn: async () => {
      const response = await immunizationService.getAll(params);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateImmunizationRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<ImmunizationRecord>) => immunizationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['immunization-records'] });
    },
  });
};

export const useUpdateImmunizationRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ImmunizationRecord> }) => 
      immunizationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['immunization-records'] });
    },
  });
};

export const useDeleteImmunizationRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => immunizationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['immunization-records'] });
    },
  });
};

export const useToggleImmunizationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => immunizationService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['immunization-records'] });
    },
  });
};
