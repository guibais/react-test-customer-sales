import * as Types from './index';

describe('Types Index', () => {
  describe('User type', () => {
    it('should have correct structure', () => {
      const user: Types.User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(user.id).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.name).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });
  });

  describe('Customer type', () => {
    it('should have correct structure with nullable fields', () => {
      const customer: Types.Customer = {
        id: '1',
        name: 'Customer Name',
        email: 'customer@example.com',
        phone: null,
        address: null,
        birthDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(customer.id).toBeDefined();
      expect(customer.name).toBeDefined();
      expect(customer.email).toBeDefined();
      expect(customer.phone).toBeNull();
      expect(customer.address).toBeNull();
      expect(customer.birthDate).toBeNull();
    });

    it('should allow non-null optional fields', () => {
      const customer: Types.Customer = {
        id: '1',
        name: 'Customer Name',
        email: 'customer@example.com',
        phone: '123456789',
        address: 'Test Address',
        birthDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(customer.phone).toBe('123456789');
      expect(customer.address).toBe('Test Address');
      expect(customer.birthDate).toBeInstanceOf(Date);
    });
  });

  describe('JwtPayload type', () => {
    it('should have correct structure', () => {
      const payload: Types.JwtPayload = {
        sub: 'user-id',
        email: 'user@example.com',
        name: 'User Name',
      };

      expect(payload.sub).toBe('user-id');
      expect(payload.email).toBe('user@example.com');
      expect(payload.name).toBe('User Name');
    });
  });

  describe('CustomerFilters type', () => {
    it('should have correct structure with optional fields', () => {
      const filters: Types.CustomerFilters = {};

      expect(filters.name).toBeUndefined();
      expect(filters.email).toBeUndefined();
      expect(filters.page).toBeUndefined();
      expect(filters.limit).toBeUndefined();
    });

    it('should allow all optional fields', () => {
      const filters: Types.CustomerFilters = {
        name: 'John',
        email: 'john@example.com',
        page: 1,
        limit: 10,
      };

      expect(filters.name).toBe('John');
      expect(filters.email).toBe('john@example.com');
      expect(filters.page).toBe(1);
      expect(filters.limit).toBe(10);
    });
  });

  describe('Sale type', () => {
    it('should have correct structure', () => {
      const sale: Types.Sale = {
        id: '1',
        customerId: 'customer-1',
        amount: 100.50,
        saleDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(sale.id).toBe('1');
      expect(sale.customerId).toBe('customer-1');
      expect(sale.amount).toBe(100.50);
      expect(sale.saleDate).toBeInstanceOf(Date);
    });
  });

  describe('AuthResponse type', () => {
    it('should have correct structure', () => {
      const authResponse: Types.AuthResponse = {
        access_token: 'jwt-token',
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'User Name',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      expect(authResponse.access_token).toBe('jwt-token');
      expect(authResponse.user.id).toBe('1');
      expect(authResponse.user.email).toBe('user@example.com');
    });
  });

  describe('DailySalesStats type', () => {
    it('should have correct structure', () => {
      const stats: Types.DailySalesStats = {
        date: '2023-01-01',
        totalSales: 5,
        totalAmount: 500.00,
      };

      expect(stats.date).toBe('2023-01-01');
      expect(stats.totalSales).toBe(5);
      expect(stats.totalAmount).toBe(500.00);
    });
  });

  describe('CustomerStats type', () => {
    it('should have correct structure', () => {
      const stats: Types.CustomerStats = {
        customerId: '1',
        customerName: 'Customer Name',
        totalVolume: 1000.00,
        averageValue: 200.00,
        totalSales: 5,
        exclusiveDays: 3,
      };

      expect(stats.customerId).toBe('1');
      expect(stats.customerName).toBe('Customer Name');
      expect(stats.totalVolume).toBe(1000.00);
      expect(stats.averageValue).toBe(200.00);
      expect(stats.totalSales).toBe(5);
      expect(stats.exclusiveDays).toBe(3);
    });
  });

  describe('TopCustomersResponse type', () => {
    it('should have correct structure with null values', () => {
      const response: Types.TopCustomersResponse = {
        highestVolume: null,
        highestAverage: null,
        mostFrequent: null,
        totalCustomers: 0,
      };

      expect(response.highestVolume).toBeNull();
      expect(response.highestAverage).toBeNull();
      expect(response.mostFrequent).toBeNull();
      expect(response.totalCustomers).toBe(0);
    });

    it('should have correct structure with customer stats', () => {
      const customerStats: Types.CustomerStats = {
        customerId: '1',
        customerName: 'Top Customer',
        totalVolume: 2000.00,
        averageValue: 400.00,
        totalSales: 5,
        exclusiveDays: 4,
      };

      const response: Types.TopCustomersResponse = {
        highestVolume: customerStats,
        highestAverage: customerStats,
        mostFrequent: customerStats,
        totalCustomers: 10,
      };

      expect(response.highestVolume).toEqual(customerStats);
      expect(response.highestAverage).toEqual(customerStats);
      expect(response.mostFrequent).toEqual(customerStats);
      expect(response.totalCustomers).toBe(10);
    });
  });

  describe('Module exports', () => {
    it('should import module successfully', () => {
      expect(Types).toBeDefined();
      expect(typeof Types).toBe('object');
    });

    it('should execute all export statements', () => {
      import('./index').then((indexModule) => {
        expect(indexModule).toBeDefined();
      });
      
      import('./auth.types').then((authModule) => {
        expect(authModule).toBeDefined();
      });
    });
  });
});
