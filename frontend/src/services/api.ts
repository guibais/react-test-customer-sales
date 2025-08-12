import axios, { type AxiosInstance } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type AuthResponse = {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  birthDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Sale = {
  data: string;
  valor: number;
};

export type CustomerApiResponse = {
  data: {
    clientes: Array<{
      id: number;
      info: {
        nomeCompleto: string;
        detalhes: {
          email: string;
          nascimento: string | null;
        };
      };
      estatisticas: {
        vendas: Sale[];
      };
      duplicado?: {
        nomeCompleto: string;
      };
    }>;
  };
  meta: {
    registroTotal: number;
    pagina: number;
  };
  redundante: {
    status: string;
  };
};

export type DailySalesStats = {
  date: string;
  totalSales: number;
  totalAmount: number;
};

export type CustomerStats = {
  customerId: string;
  customerName: string;
  totalVolume: number;
  averageValue: number;
  totalSales: number;
  exclusiveDays: number;
};

export type TopCustomersResponse = {
  highestVolume: CustomerStats;
  highestAverage: CustomerStats;
  mostFrequent: CustomerStats;
  totalCustomers: number;
};

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("auth-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const message =
          error.response?.data?.message || error.message || "An error occurred";
        throw new Error(message);
      }
    );
  }

  setToken(token: string) {
    localStorage.setItem("auth-token", token);
  }

  clearToken() {
    localStorage.removeItem("auth-token");
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  }

  async getCustomers(filters?: {
    name?: string;
    email?: string;
    page?: number;
    limit?: number;
  }): Promise<CustomerApiResponse> {
    const response = await this.client.get<CustomerApiResponse>("/customers", {
      params: filters,
    });
    return response.data;
  }

  async getCustomer(id: string): Promise<Customer> {
    const response = await this.client.get<Customer>(`/customers/${id}`);
    return response.data;
  }

  async createCustomer(data: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    birthDate?: string;
  }): Promise<Customer> {
    const response = await this.client.post<Customer>("/customers", data);
    return response.data;
  }

  async updateCustomer(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      address: string;
      birthDate: string;
    }>
  ): Promise<Customer> {
    const response = await this.client.patch<Customer>(
      `/customers/${id}`,
      data
    );
    return response.data;
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.client.delete(`/customers/${id}`);
  }

  async getDailySalesStats(): Promise<DailySalesStats[]> {
    const response =
      await this.client.get<DailySalesStats[]>("/sales/stats/daily");
    return response.data;
  }

  async getTopCustomers(): Promise<TopCustomersResponse> {
    const response = await this.client.get<TopCustomersResponse>(
      "/sales/stats/top-customers"
    );
    return response.data;
  }

  async getSales(filters?: {
    customerId?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const response = await this.client.get("/sales", {
      params: filters,
    });
    return response.data;
  }

  async getSale(id: string): Promise<Sale> {
    const response = await this.client.get<Sale>(`/sales/${id}`);
    return response.data;
  }

  async createSale(data: {
    customerId: string;
    amount: number;
    saleDate: string;
  }): Promise<Sale> {
    const response = await this.client.post<Sale>("/sales", data);
    return response.data;
  }

  async updateSale(
    id: string,
    data: Partial<{
      customerId: string;
      amount: number;
      saleDate: string;
    }>
  ): Promise<Sale> {
    const response = await this.client.patch<Sale>(`/sales/${id}`, data);
    return response.data;
  }

  async deleteSale(id: string): Promise<void> {
    await this.client.delete(`/sales/${id}`);
  }

  async getTopCustomersStats(): Promise<TopCustomersResponse> {
    return this.getTopCustomers();
  }
}

export const apiClient = new ApiClient();
