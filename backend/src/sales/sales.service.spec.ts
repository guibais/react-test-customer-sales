import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SalesService } from './sales.service';
import { PrismaService } from '../database/prisma.service';
import { CreateSaleDto, UpdateSaleDto, SaleFiltersDto } from '../dto/sale.dto';

describe('SalesService', () => {
  let service: SalesService;
  let prismaService: any;

  const mockSale = {
    id: 'sale-1',
    customerId: 'customer-1',
    amount: 100.5,
    saleDate: new Date('2024-01-15T10:00:00.000Z'),
    createdAt: new Date('2024-01-10T10:00:00.000Z'),
    updatedAt: new Date('2024-01-10T10:00:00.000Z'),
  };

  const mockSaleWithCustomer = {
    ...mockSale,
    customer: {
      id: 'customer-1',
      name: 'Test Customer',
      email: 'test@example.com',
    },
  };

  const createSaleDto: CreateSaleDto = {
    customerId: 'customer-1',
    amount: 100.5,
    saleDate: '2024-01-15',
  };

  const updateSaleDto: UpdateSaleDto = {
    amount: 150.75,
    saleDate: '2024-01-20',
  };

  const saleId = 'sale-1';

  beforeEach(async () => {
    const mockPrismaService = {
      sale: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        groupBy: jest.fn(),
      },
      customer: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

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
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    const filters: SaleFiltersDto = {
      customerId: 'customer-1',
      page: 1,
      limit: 10,
    };

    it('should return paginated sales with customer info', async () => {
      const salesWithCustomer = [
        {
          ...mockSale,
          customer: { name: 'Test Customer', email: 'test@example.com' },
        },
      ];

      (prismaService.sale.findMany as jest.Mock).mockResolvedValue(salesWithCustomer);
      (prismaService.sale.count as jest.Mock).mockResolvedValue(1);

      const result = await service.findAll(filters);

      expect(prismaService.sale.findMany).toHaveBeenCalledWith({
        where: { customerId: 'customer-1' },
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
            customer: { name: 'Test Customer', email: 'test@example.com' },
            customerName: 'Test Customer',
            customerEmail: 'test@example.com',
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

    it('should use default pagination when not provided', async () => {
      const emptyFilters: SaleFiltersDto = {};

      prismaService.sale.findMany.mockResolvedValue([]);
      prismaService.sale.count.mockResolvedValue(0);

      await service.findAll(emptyFilters);

      expect(prismaService.sale.findMany).toHaveBeenCalledWith({
        where: {},
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
    });

    it('should filter by customerId when provided', async () => {
      const filtersWithCustomer: SaleFiltersDto = { customerId: 'customer-2' };

      prismaService.sale.findMany.mockResolvedValue([]);
      prismaService.sale.count.mockResolvedValue(0);

      await service.findAll(filtersWithCustomer);

      expect(prismaService.sale.findMany).toHaveBeenCalledWith({
        where: { customerId: 'customer-2' },
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
    });

    it('should calculate correct pagination with multiple pages', async () => {
      const paginationFilters: SaleFiltersDto = { page: 2, limit: 5 };

      (prismaService.sale.findMany as jest.Mock).mockResolvedValue([]);
      (prismaService.sale.count as jest.Mock).mockResolvedValue(12);

      const result = await service.findAll(paginationFilters);

      expect(prismaService.sale.findMany).toHaveBeenCalledWith({
        where: {},
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
        total: 12,
        totalPages: 3,
      });
    });
  });

  describe('findOne', () => {
    it('should return sale with customer when found', async () => {
      (prismaService.sale.findUnique as jest.Mock).mockResolvedValue(mockSaleWithCustomer);

      const result = await service.findOne(saleId);

      expect(prismaService.sale.findUnique).toHaveBeenCalledWith({
        where: { id: saleId },
        include: { customer: true },
      });
      expect(result).toEqual(mockSaleWithCustomer);
    });

    it('should throw NotFoundException when sale not found', async () => {
      prismaService.sale.findUnique.mockResolvedValue(null);

      await expect(service.findOne(saleId)).rejects.toThrow(
        new NotFoundException(`Sale with ID ${saleId} not found`),
      );
    });
  });

  describe('create', () => {
    it('should create sale successfully', async () => {
      prismaService.sale.create.mockResolvedValue(mockSale);

      const result = await service.create(createSaleDto);

      expect(prismaService.sale.create).toHaveBeenCalledWith({
        data: {
          customerId: 'customer-1',
          amount: 100.5,
          saleDate: new Date('2024-01-15'),
        },
      });
      expect(result).toEqual(mockSale);
    });

    it('should convert saleDate string to Date object', async () => {
      const dtoWithDateString: CreateSaleDto = {
        customerId: 'customer-1',
        amount: 200,
        saleDate: '2024-02-20T15:30:00.000Z',
      };

      prismaService.sale.create.mockResolvedValue(mockSale);

      await service.create(dtoWithDateString);

      expect(prismaService.sale.create).toHaveBeenCalledWith({
        data: {
          customerId: 'customer-1',
          amount: 200,
          saleDate: new Date('2024-02-20T15:30:00.000Z'),
        },
      });
    });
  });

  describe('update', () => {
    it('should update sale successfully', async () => {
      const updatedSale = { ...mockSale, ...updateSaleDto };

      (prismaService.sale.findUnique as jest.Mock).mockResolvedValue(mockSale);
      (prismaService.sale.update as jest.Mock).mockResolvedValue(updatedSale);

      const result = await service.update(saleId, updateSaleDto);

      expect(prismaService.sale.findUnique).toHaveBeenCalledWith({
        where: { id: saleId },
      });
      expect(prismaService.sale.update).toHaveBeenCalledWith({
        where: { id: saleId },
        data: {
          amount: 150.75,
          saleDate: new Date('2024-01-20'),
        },
      });
      expect(result).toEqual(updatedSale);
    });

    it('should update only amount when saleDate not provided', async () => {
      const partialUpdateDto: UpdateSaleDto = { amount: 300 };

      (prismaService.sale.findUnique as jest.Mock).mockResolvedValue(mockSale);
      (prismaService.sale.update as jest.Mock).mockResolvedValue(mockSale);

      await service.update(saleId, partialUpdateDto);

      expect(prismaService.sale.update).toHaveBeenCalledWith({
        where: { id: saleId },
        data: { amount: 300 },
      });
    });

    it('should throw NotFoundException when sale not found', async () => {
      prismaService.sale.findUnique.mockResolvedValue(null);

      await expect(service.update(saleId, updateSaleDto)).rejects.toThrow(
        new NotFoundException(`Sale with ID ${saleId} not found`),
      );

      expect(prismaService.sale.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove sale successfully', async () => {
      (prismaService.sale.findUnique as jest.Mock).mockResolvedValue(mockSale);
      (prismaService.sale.delete as jest.Mock).mockResolvedValue(mockSale);

      await service.remove(saleId);

      expect(prismaService.sale.findUnique).toHaveBeenCalledWith({
        where: { id: saleId },
      });
      expect(prismaService.sale.delete).toHaveBeenCalledWith({
        where: { id: saleId },
      });
    });

    it('should throw NotFoundException when sale not found', async () => {
      prismaService.sale.findUnique.mockResolvedValue(null);

      await expect(service.remove(saleId)).rejects.toThrow(
        new NotFoundException(`Sale with ID ${saleId} not found`),
      );

      expect(prismaService.sale.delete).not.toHaveBeenCalled();
    });
  });

  describe('getDailySalesStats', () => {
    it('should return daily sales statistics', async () => {
      const mockGroupedSales = [
        {
          saleDate: new Date('2024-01-15T00:00:00.000Z'),
          _count: { id: 3 },
          _sum: { amount: 350.5 },
        },
        {
          saleDate: new Date('2024-01-14T00:00:00.000Z'),
          _count: { id: 2 },
          _sum: { amount: 200 },
        },
      ];

      prismaService.sale.groupBy.mockResolvedValue(mockGroupedSales);

      const result = await service.getDailySalesStats();

      expect(prismaService.sale.groupBy).toHaveBeenCalledWith({
        by: ['saleDate'],
        _count: { id: true },
        _sum: { amount: true },
        orderBy: { saleDate: 'desc' },
      });

      expect(result).toEqual([
        {
          date: '2024-01-15',
          totalSales: 3,
          totalAmount: 350.5,
        },
        {
          date: '2024-01-14',
          totalSales: 2,
          totalAmount: 200,
        },
      ]);
    });

    it('should handle null amount in statistics', async () => {
      const mockGroupedSales = [
        {
          saleDate: new Date('2024-01-15T00:00:00.000Z'),
          _count: { id: 1 },
          _sum: { amount: null },
        },
      ];

      prismaService.sale.groupBy.mockResolvedValue(mockGroupedSales);

      const result = await service.getDailySalesStats();

      expect(result).toEqual([
        {
          date: '2024-01-15',
          totalSales: 1,
          totalAmount: 0,
        },
      ]);
    });
  });

  describe('getTopCustomers', () => {
    it('should return top customers statistics', async () => {
      const mockCustomerStats = [
        {
          customerId: 'customer-1',
          _count: { id: 5 },
          _sum: { amount: 500 },
          _avg: { amount: 100 },
        },
        {
          customerId: 'customer-2',
          _count: { id: 3 },
          _sum: { amount: 600 },
          _avg: { amount: 200 },
        },
      ];

      const mockCustomers = [
        { id: 'customer-1', name: 'Customer One' },
        { id: 'customer-2', name: 'Customer Two' },
      ];

      const mockSaleDates = [{ saleDate: new Date('2024-01-15') }];
      const mockExclusiveSales = [{ customerId: 'customer-1' }];

      (prismaService.sale.groupBy as jest.Mock)
        .mockResolvedValueOnce(mockCustomerStats)
        .mockResolvedValueOnce(mockSaleDates)
        .mockResolvedValueOnce(mockExclusiveSales)
        .mockResolvedValueOnce(mockSaleDates)
        .mockResolvedValueOnce([
          { customerId: 'customer-1' },
          { customerId: 'customer-2' },
        ]);

      (prismaService.customer.findMany as jest.Mock).mockResolvedValue(mockCustomers);
      (prismaService.customer.count as jest.Mock).mockResolvedValue(10);

      const result = await service.getTopCustomers();

      expect(result).toEqual({
        highestVolume: {
          customerId: 'customer-2',
          customerName: 'Customer Two',
          totalVolume: 600,
          averageValue: 200,
          totalSales: 3,
          exclusiveDays: 0,
        },
        highestAverage: {
          customerId: 'customer-2',
          customerName: 'Customer Two',
          totalVolume: 600,
          averageValue: 200,
          totalSales: 3,
          exclusiveDays: 0,
        },
        mostFrequent: {
          customerId: 'customer-1',
          customerName: 'Customer One',
          totalVolume: 500,
          averageValue: 100,
          totalSales: 5,
          exclusiveDays: 1,
        },
        totalCustomers: 10,
      });
    });

    it('should return null values when no sales exist', async () => {
      (prismaService.sale.groupBy as jest.Mock).mockResolvedValue([]);
      (prismaService.customer.findMany as jest.Mock).mockResolvedValue([]);
      (prismaService.customer.count as jest.Mock).mockResolvedValue(5);

      const result = await service.getTopCustomers();

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

      const mockSaleDates = [{ saleDate: new Date('2024-01-15') }];
      const mockExclusiveSales = [{ customerId: 'unknown-customer' }];

      (prismaService.sale.groupBy as jest.Mock)
        .mockResolvedValueOnce(mockCustomerStats)
        .mockResolvedValueOnce(mockSaleDates)
        .mockResolvedValueOnce(mockExclusiveSales);

      (prismaService.customer.findMany as jest.Mock).mockResolvedValue([]);
      (prismaService.customer.count as jest.Mock).mockResolvedValue(0);

      const result = await service.getTopCustomers();

      expect(result.highestVolume?.customerName).toBe('Unknown');
    });

    it('should handle null amounts in customer statistics', async () => {
      const mockCustomerStats = [
        {
          customerId: 'customer-1',
          _count: { id: 1 },
          _sum: { amount: null },
          _avg: { amount: null },
        },
      ];

      const mockCustomers = [{ id: 'customer-1', name: 'Customer One' }];
      const mockSaleDates = [{ saleDate: new Date('2024-01-15') }];
      const mockExclusiveSales = [{ customerId: 'customer-1' }];

      (prismaService.sale.groupBy as jest.Mock)
        .mockResolvedValueOnce(mockCustomerStats)
        .mockResolvedValueOnce(mockSaleDates)
        .mockResolvedValueOnce(mockExclusiveSales);

      (prismaService.customer.findMany as jest.Mock).mockResolvedValue(mockCustomers);
      (prismaService.customer.count as jest.Mock).mockResolvedValue(1);

      const result = await service.getTopCustomers();

      expect(result.highestVolume).toEqual({
        customerId: 'customer-1',
        customerName: 'Customer One',
        totalVolume: 0,
        averageValue: 0,
        totalSales: 1,
        exclusiveDays: 1,
      });
    });
  });
});
