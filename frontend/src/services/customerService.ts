import { apiClient, type CustomerApiResponse, type Customer } from "./api";

export type NormalizedCustomer = {
  id: string;
  name: string;
  email: string;
  birthDate: string | null;
  sales: Array<{
    date: string;
    amount: number;
  }>;
  totalSales: number;
  totalAmount: number;
  missingLetter: string;
};

export const normalizeCustomerData = (
  apiResponse: CustomerApiResponse
): {
  customers: NormalizedCustomer[];
  pagination: {
    total: number;
    page: number;
  };
} => {
  const customers = apiResponse.data.clientes.map((cliente) => {
    const id = cliente.id;
    const name = cliente.info.nomeCompleto;
    const email = cliente.info.detalhes.email;
    const birthDate = cliente.info.detalhes.nascimento;

    const sales = cliente.estatisticas.vendas.map((venda) => ({
      date: venda.data,
      amount: venda.valor,
    }));

    const totalSales = sales.length;
    const totalAmount = sales.reduce((sum, sale) => sum + sale.amount, 0);

    const missingLetter = findMissingLetter(name);

    return {
      id: id.toString(),
      name,
      email,
      birthDate,
      sales,
      totalSales,
      totalAmount,
      missingLetter,
    };
  });

  return {
    customers,
    pagination: {
      total: apiResponse.meta.registroTotal,
      page: apiResponse.meta.pagina,
    },
  };
};

const findMissingLetter = (name: string): string => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const nameLetters = new Set(name.toLowerCase().replace(/[^a-z]/g, ""));

  for (const letter of alphabet) {
    if (!nameLetters.has(letter)) {
      return letter.toUpperCase();
    }
  }

  return "-";
};

export const customerService = {
  async getCustomers(filters?: {
    name?: string;
    email?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.getCustomers(filters);
    return normalizeCustomerData(response);
  },

  async getCustomer(id: string) {
    return apiClient.getCustomer(id);
  },

  async createCustomer(data: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    birthDate?: string;
  }) {
    return apiClient.createCustomer(data);
  },

  async updateCustomer(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      address: string;
      birthDate: string;
    }>
  ) {
    return apiClient.updateCustomer(id, data);
  },

  async deleteCustomer(id: string) {
    return apiClient.deleteCustomer(id);
  },
};
