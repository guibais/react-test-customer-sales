import { apiClient, type DailySalesStats, type TopCustomersResponse } from './api';

export const statsService = {
  async getDailySalesStats(): Promise<DailySalesStats[]> {
    return apiClient.getDailySalesStats();
  },

  async getTopCustomers(): Promise<TopCustomersResponse> {
    return apiClient.getTopCustomers();
  },

  async createSale(data: {
    customerId: string;
    amount: number;
    saleDate: string;
  }) {
    return apiClient.createSale(data);
  },
};
