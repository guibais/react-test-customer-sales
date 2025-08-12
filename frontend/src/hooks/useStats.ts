import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { statsService } from "../services/statsService";

export const useDailySalesStats = () => {
  return useQuery({
    queryKey: ["dailySalesStats"],
    queryFn: statsService.getDailySalesStats,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopCustomers = () => {
  return useQuery({
    queryKey: ["topCustomers"],
    queryFn: statsService.getTopCustomers,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: statsService.createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailySalesStats"] });
      queryClient.invalidateQueries({ queryKey: ["topCustomers"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useStats = () => {
  const dailySales = useDailySalesStats();
  const topCustomers = useTopCustomers();

  return {
    data: dailySales.data,
    topCustomers: topCustomers.data,
    isLoading: dailySales.isLoading || topCustomers.isLoading,
    error: dailySales.error || topCustomers.error,
  };
};
