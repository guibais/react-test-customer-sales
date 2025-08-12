import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customerService';

export const useCustomers = (filters?: {
  name?: string;
  email?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: () => customerService.getCustomers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCustomer = (customerId?: string) => {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => customerService.getCustomer(customerId!),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerService.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      customerService.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerService.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
