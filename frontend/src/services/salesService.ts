import { apiClient } from './api';

export type NormalizedSale = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  saleDate: string;
  createdAt: string;
  updatedAt: string;
};

export type SalesResponse = {
  sales: NormalizedSale[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const salesService = {
  async getSales(filters?: {
    customerId?: string;
    page?: number;
    limit?: number;
  }): Promise<SalesResponse> {
    const response = await apiClient.getSales(filters);
    return response;
  },

  async getSale(id: string) {
    return apiClient.getSale(id);
  },

  async createSale(data: {
    customerId: string;
    amount: number;
    saleDate: string;
  }) {
    return apiClient.createSale(data);
  },

  async updateSale(id: string, data: Partial<{
    amount: number;
    saleDate: string;
  }>) {
    return apiClient.updateSale(id, data);
  },

  async deleteSale(id: string) {
    return apiClient.deleteSale(id);
  },

  async getDailySalesStats() {
    return apiClient.getDailySalesStats();
  },

  async getTopCustomersStats() {
    return apiClient.getTopCustomersStats();
  },
};
