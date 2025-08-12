export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  birthDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type JwtPayload = {
  sub: string;
  email: string;
  name: string;
};

export type CustomerFilters = {
  name?: string;
  email?: string;
  page?: number;
  limit?: number;
};

export type Sale = {
  id: string;
  customerId: string;
  amount: number;
  saleDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthResponse = {
  access_token: string;
  user: Omit<User, 'password'>;
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
  highestVolume: CustomerStats | null;
  highestAverage: CustomerStats | null;
  mostFrequent: CustomerStats | null;
  totalCustomers: number;
};
