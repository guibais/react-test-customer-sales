import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateSaleDto, UpdateSaleDto, SaleFiltersDto } from '../dto/sale.dto';

describe('SalesService', () => {
  let service: SalesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    sale: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    customer: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockSale = {
    id: 'sale-id-123',
    customerId: 'customer-id-123',
    amount: 150.50,
    saleDate: new Date('2024-01-01'),
    customer: {
      name: 'João Silva',
      email: 'joao@example.com',
    },
  };

  const mockCustomer = {
    id: 'customer-id-123',
    name: 'João Silva',
    email: 'joao@example.com',
    userId: 'user-id-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated sales with customer info', async () => {
      const filters: SaleFiltersDto = {
        page: 1,
        limit: 10,
        customerId: 'customer-id-123',
      };

      mockPrismaService.sale.findMany.mockResolvedValue([mockSale]);
      mockPrismaService.sale.count.mockResolvedValue(1);

      const result = await service.findAll('user-id-123', filters);

      expect(prisma.sale.findMany).toHaveBeenCalledWith({
        where: {
          customer: { userId: 'user-id-123' },
          customerId: 'customer-id-123',
        },
        skip: 0,
        take: 10,
        orderBy: { saleDate: 'desc' },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      expect(result).toEqual({
        sales: [
          {
            ...mockSale,
            customerName: 'João Silva',
            customerEmail: 'joao@example.com',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
    });

    it('should return sales without customerId filter', async () => {
      const filters: SaleFiltersDto = {
        page: 2,
        limit: 5,
      };

      mockPrismaService.sale.findMany.mockResolvedValue([mockSale]);
      mockPrismaService.sale.count.mockResolvedValue(10);

      const result = await service.findAll('user-id-123', filters);

      expect(prisma.sale.findMany).toHaveBeenCalledWith({
        where: {
          customer: { userId: 'user-id-123' },
        },
        skip: 5,
        take: 5,
        orderBy: { saleDate: 'desc' },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      expect(result.pagination).toEqual({
        page: 2,
        limit: 5,
        total: 10,
        totalPages: 2,
      });
    });
  });

  describe('findOne', () => {
    it('should return a sale when found', async () => {
      mockPrismaService.sale.findFirst.mockResolvedValue(mockSale);

      const result = await service.findOne('user-id-123', 'sale-id-123');

      expect(prisma.sale.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'sale-id-123',
          customer: { userId: 'user-id-123' },
        },
        include: {
          customer: true,
        },
      });

      expect(result).toEqual(mockSale);
    });

    it('should throw NotFoundException when sale not found', async () => {
      mockPrismaService.sale.findFirst.mockResolvedValue(null);

      await expect(service.findOne('user-id-123', 'non-existent-id')).rejects.toThrow(
        new NotFoundException('Sale with ID non-existent-id not found'),
      );
    });
  });

  describe('create', () => {
    it('should create a sale successfully', async () => {
      const createSaleDto: CreateSaleDto = {
        customerId: 'customer-id-123',
        amount: 150.50,
        saleDate: '2024-01-01',
      };

      mockPrismaService.customer.findFirst.mockResolvedValue(mockCustomer);
      mockPrismaService.sale.create.mockResolvedValue(mockSale);

      const result = await service.create('user-id-123', createSaleDto);

      expect(prisma.customer.findFirst).toHaveBeenCalledWith({
        where: { id: 'customer-id-123', userId: 'user-id-123' },
      });

      expect(prisma.sale.create).toHaveBeenCalledWith({
        data: {
          customerId: 'customer-id-123',
          amount: 150.50,
          userId: 'user-id-123',
          saleDate: new Date('2024-01-01'),
        },
      });

      expect(result).toEqual(mockSale);
    });

    it('should throw NotFoundException when customer not found', async () => {
      const createSaleDto: CreateSaleDto = {
        customerId: 'non-existent-customer',
        amount: 150.50,
        saleDate: '2024-01-01',
      };

      mockPrismaService.customer.findFirst.mockResolvedValue(null);

      await expect(service.create('user-id-123', createSaleDto)).rejects.toThrow(
        new NotFoundException('Customer not found'),
      );
    });
  });

  describe('update', () => {
    it('should update a sale successfully', async () => {
      const updateSaleDto: UpdateSaleDto = {
        amount: 200.75,
        saleDate: '2024-01-02',
      };

      const updatedSale = { ...mockSale, ...updateSaleDto };

      mockPrismaService.sale.findFirst.mockResolvedValue(mockSale);
      mockPrismaService.sale.update.mockResolvedValue(updatedSale);

      const result = await service.update('user-id-123', 'sale-id-123', updateSaleDto);

      expect(prisma.sale.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'sale-id-123',
          customer: { userId: 'user-id-123' },
        },
      });

      expect(prisma.sale.update).toHaveBeenCalledWith({
        where: { id: 'sale-id-123' },
        data: {
          amount: 200.75,
          saleDate: new Date('2024-01-02'),
        },
      });

      expect(result).toEqual(updatedSale);
    });

    it('should update sale without saleDate', async () => {
      const updateSaleDto: UpdateSaleDto = {
        amount: 200.75,
      };

      mockPrismaService.sale.findFirst.mockResolvedValue(mockSale);
      mockPrismaService.sale.update.mockResolvedValue(mockSale);

      await service.update('user-id-123', 'sale-id-123', updateSaleDto);

      expect(prisma.sale.update).toHaveBeenCalledWith({
        where: { id: 'sale-id-123' },
        data: {
          amount: 200.75,
        },
      });
    });

    it('should throw NotFoundException when sale not found', async () => {
      const updateSaleDto: UpdateSaleDto = {
        amount: 200.75,
      };

      mockPrismaService.sale.findFirst.mockResolvedValue(null);

      await expect(service.update('user-id-123', 'non-existent-id', updateSaleDto)).rejects.toThrow(
        new NotFoundException('Sale with ID non-existent-id not found'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a sale successfully', async () => {
      mockPrismaService.sale.findFirst.mockResolvedValue(mockSale);
      mockPrismaService.sale.delete.mockResolvedValue(mockSale);

      const result = await service.remove('user-id-123', 'sale-id-123');

      expect(prisma.sale.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'sale-id-123',
          customer: { userId: 'user-id-123' },
        },
      });

      expect(prisma.sale.delete).toHaveBeenCalledWith({
        where: { id: 'sale-id-123' },
      });

      expect(result).toEqual(mockSale);
    });

    it('should throw NotFoundException when sale not found', async () => {
      mockPrismaService.sale.findFirst.mockResolvedValue(null);

      await expect(service.remove('user-id-123', 'non-existent-id')).rejects.toThrow(
        new NotFoundException('Sale with ID non-existent-id not found'),
      );
    });
  });

  describe('getDailySalesStats', () => {
    it('should return daily sales statistics', async () => {
      const mockGroupByResult = [
        {
          saleDate: new Date('2024-01-01'),
          _count: { id: 5 },
          _sum: { amount: 750.50 },
        },
        {
          saleDate: new Date('2024-01-02'),
          _count: { id: 3 },
          _sum: { amount: 450.25 },
        },
      ];

      mockPrismaService.sale.groupBy.mockResolvedValue(mockGroupByResult);

      const result = await service.getDailySalesStats('user-id-123');

      expect(prisma.sale.groupBy).toHaveBeenCalledWith({
        by: ['saleDate'],
        where: {
          customer: { userId: 'user-id-123' },
        },
        _count: {
          id: true,
        },
        _sum: {
          amount: true,
        },
        orderBy: {
          saleDate: 'desc',
        },
      });

      expect(result).toEqual([
        {
          date: '2024-01-01',
          totalSales: 5,
          totalAmount: 750.50,
        },
        {
          date: '2024-01-02',
          totalSales: 3,
          totalAmount: 450.25,
        },
      ]);
    });

    it('should handle null sum amount', async () => {
      const mockGroupByResult = [
        {
          saleDate: new Date('2024-01-01'),
          _count: { id: 1 },
          _sum: { amount: null },
        },
      ];

      mockPrismaService.sale.groupBy.mockResolvedValue(mockGroupByResult);

      const result = await service.getDailySalesStats('user-id-123');

      expect(result[0].totalAmount).toBe(0);
    });
  });

  describe('getTopCustomers', () => {
    it('should return top customers statistics', async () => {
      const mockCustomerStats = [
        {
          customerId: 'customer-1',
          _count: { id: 5 },
          _sum: { amount: 1000 },
          _avg: { amount: 200 },
        },
        {
          customerId: 'customer-2',
          _count: { id: 2 },
          _sum: { amount: 800 },
          _avg: { amount: 400 },
        },
      ];

      const mockCustomers = [
        { id: 'customer-1', name: 'João Silva' },
        { id: 'customer-2', name: 'Maria Santos' },
      ];

      mockPrismaService.sale.groupBy
        .mockResolvedValueOnce(mockCustomerStats)
        .mockResolvedValueOnce([{ saleDate: new Date('2024-01-01') }])
        .mockResolvedValueOnce([{ customerId: 'customer-1' }])
        .mockResolvedValueOnce([{ saleDate: new Date('2024-01-02') }])
        .mockResolvedValueOnce([{ customerId: 'customer-2' }]);

      mockPrismaService.customer.findMany.mockResolvedValue(mockCustomers);
      mockPrismaService.customer.count.mockResolvedValue(10);

      const result = await service.getTopCustomers('user-id-123');

      expect(result).toEqual({
        highestVolume: {
          customerId: 'customer-1',
          customerName: 'João Silva',
          totalVolume: 1000,
          averageValue: 200,
          totalSales: 5,
          exclusiveDays: 1,
        },
        highestAverage: {
          customerId: 'customer-2',
          customerName: 'Maria Santos',
          totalVolume: 800,
          averageValue: 400,
          totalSales: 2,
          exclusiveDays: 1,
        },
        mostFrequent: {
          customerId: 'customer-2',
          customerName: 'Maria Santos',
          totalVolume: 800,
          averageValue: 400,
          totalSales: 2,
          exclusiveDays: 1,
        },
        totalCustomers: 10,
      });
    });

    it('should handle null values in customer stats', async () => {
      const mockCustomerStats = [
        {
          customerId: 'customer-1',
          _count: { id: 1 },
          _sum: { amount: null },
          _avg: { amount: null },
        },
      ];

      const mockCustomers = [
        { id: 'customer-1', name: 'João Silva' },
      ];

      mockPrismaService.sale.groupBy
        .mockResolvedValueOnce(mockCustomerStats)
        .mockResolvedValue([{ saleDate: new Date('2024-01-01') }])
        .mockResolvedValue([{ customerId: 'customer-1' }]);

      mockPrismaService.customer.findMany.mockResolvedValue(mockCustomers);
      mockPrismaService.customer.count.mockResolvedValue(1);

      const result = await service.getTopCustomers('user-id-123');

      expect(result.highestVolume).not.toBeNull();
      expect(result.highestAverage).not.toBeNull();
      expect(result.highestVolume!.totalVolume).toBe(0);
      expect(result.highestAverage!.averageValue).toBe(0);
    });

    it('should return null values when no customer stats exist', async () => {
      mockPrismaService.sale.groupBy.mockResolvedValue([]);
      mockPrismaService.customer.count.mockResolvedValue(5);

      const result = await service.getTopCustomers('user-id-123');

      expect(result).toEqual({
        highestVolume: null,
        highestAverage: null,
        mostFrequent: null,
        totalCustomers: 5,
      });
    });

    it('should handle unknown customer names', async () => {
      const mockCustomerStats = [
        {
          customerId: 'unknown-customer',
          _count: { id: 1 },
          _sum: { amount: 100 },
          _avg: { amount: 100 },
        },
      ];

      mockPrismaService.sale.groupBy
        .mockResolvedValueOnce(mockCustomerStats)
        .mockResolvedValue([{ saleDate: new Date('2024-01-01') }])
        .mockResolvedValue([{ customerId: 'unknown-customer' }]);

      mockPrismaService.customer.findMany.mockResolvedValue([]);
      mockPrismaService.customer.count.mockResolvedValue(1);

      const result = await service.getTopCustomers('user-id-123');

      expect(result.highestVolume).not.toBeNull();
      expect(result.highestVolume!.customerName).toBe('Unknown');
    });
  });
});
