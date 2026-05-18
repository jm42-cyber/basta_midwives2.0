import { useQuery } from '@tanstack/react-query';
import { barangayService } from '@/services/barangayService';
import { Barangay } from '@/types';

export const useBarangays = () => {
  return useQuery<{ data: Barangay[] }>({
    queryKey: ['barangays'],
    queryFn: async () => {
      const response = await barangayService.getAll();
      return response.data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - barangays rarely change
    gcTime: 60 * 60 * 1000, // 1 hour cache
  });
};
