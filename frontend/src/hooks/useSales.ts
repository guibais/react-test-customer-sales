import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { salesService } from "../services/salesService";

export const useSales = (filters?: {
  customerId?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["sales", filters],
    queryFn: () => salesService.getSales(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSale = (saleId?: string) => {
  return useQuery({
    queryKey: ["sale", saleId],
    queryFn: () => salesService.getSale(saleId!),
    enabled: !!saleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: salesService.createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
};

export const useUpdateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      salesService.updateSale(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
};

export const useDeleteSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: salesService.deleteSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
};

export const useDailySalesStats = () => {
  return useQuery({
    queryKey: ["sales", "stats", "daily"],
    queryFn: () => salesService.getDailySalesStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTopCustomersStats = () => {
  return useQuery({
    queryKey: ["sales", "stats", "top-customers"],
    queryFn: () => salesService.getTopCustomersStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
