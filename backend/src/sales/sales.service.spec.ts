import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SalesService } from './sales.service';
import { PrismaService } from '../database/prisma.service';
import { CreateSaleDto } from '../dto/sale.dto';

describe('SalesService', () => {
  let service: SalesService;
  let prismaService: any;

  const userId = 'user-123';
  const customerId = 'customer-123';
  
  const mockSale = {
    id: '1',
    amount: 100.50,
    saleDate: new Date('2023-01-01'),
    customerId,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    customer: {
      id: customerId,
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '(11) 99999-9999',
      address: 'Test Address',
      birthDate: new Date('1990-01-01'),
      userId,
    },
  };

  const mockPrismaService = {
    sale: {
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      groupBy: jest.fn(),
    },
    customer: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
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
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated sales with customer info', async () => {
      const mockSales = [mockSale];
      const mockCount = 1;

      prismaService.sale.findMany.mockResolvedValue(mockSales);
      prismaService.sale.count.mockResolvedValue(mockCount);

      const result = await service.findAll(userId, {
        page: 1,
        limit: 10,
        customerId,
      });

      expect(prismaService.sale.findMany).toHaveBeenCalledWith({
        where: { userId, customerId },
        include: { customer: true },
        skip: 0,
        take: 10,
        orderBy: { saleDate: 'desc' },
      });
      expect(result).toEqual({
        sales: mockSales,
        total: mockCount,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should use default pagination when not provided', async () => {
      const mockSales = [mockSale];
      const mockCount = 1;

      prismaService.sale.findMany.mockResolvedValue(mockSales);
      prismaService.sale.count.mockResolvedValue(mockCount);

      const result = await service.findAll(userId, {});

      expect(prismaService.sale.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: { customer: true },
        skip: 0,
        take: 10,
        orderBy: { saleDate: 'desc' },
      });
      expect(result.sales).toEqual(mockSales);
    });

    it('should filter by customerId when provided', async () => {
      const mockSales = [mockSale];
      const mockCount = 1;

      prismaService.sale.findMany.mockResolvedValue(mockSales);
      prismaService.sale.count.mockResolvedValue(mockCount);

      await service.findAll(userId, { customerId });

      expect(prismaService.sale.findMany).toHaveBeenCalledWith({
        where: { userId, customerId },
        include: { customer: true },
        skip: 0,
        take: 10,
        orderBy: { saleDate: 'desc' },
      });
    });

    it('should calculate correct pagination with multiple pages', async () => {
      const mockSales = [mockSale, mockSale];
      const mockCount = 25;

      prismaService.sale.findMany.mockResolvedValue(mockSales);
      prismaService.sale.count.mockResolvedValue(mockCount);

      const result = await service.findAll(userId, { page: 2, limit: 10 });

      expect(result.sales).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.totalPages).toBe(1);
      expect(result.pagination.page).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return sale with customer when found', async () => {
      prismaService.sale.findFirst.mockResolvedValue(mockSale);

      const result = await service.findOne(userId, '1');

      expect(prismaService.sale.findFirst).toHaveBeenCalledWith({
        where: { id: '1', userId },
        include: { customer: true },
      });
      expect(result).toEqual(mockSale);
    });

    it('should throw NotFoundException when sale not found', async () => {
      prismaService.sale.findFirst.mockResolvedValue(null);

      await expect(service.findOne(userId, '1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createSaleDto: CreateSaleDto = {
      amount: 100.50,
      saleDate: '2023-01-01',
      customerId,
    };

    it('should create sale successfully', async () => {
      prismaService.customer.findFirst.mockResolvedValue(mockSale.customer);
      prismaService.sale.create.mockResolvedValue(mockSale);

      const result = await service.create(userId, createSaleDto);

      expect(prismaService.customer.findFirst).toHaveBeenCalledWith({
        where: { id: customerId, userId },
      });
      expect(prismaService.sale.create).toHaveBeenCalledWith({
        data: {
          amount: 100.50,
          saleDate: new Date('2023-01-01'),
          customerId,
          userId,
        },
        include: { customer: true },
      });
      expect(result).toEqual(mockSale);
    });

    it('should convert saleDate string to Date object', async () => {
      prismaService.customer.findFirst.mockResolvedValue(mockSale.customer);
      prismaService.sale.create.mockResolvedValue(mockSale);

      await service.create(userId, createSaleDto);

      expect(prismaService.sale.create).toHaveBeenCalledWith({
        data: {
          amount: 100.50,
          saleDate: new Date('2023-01-01'),
          customerId,
          userId,
        },
        include: { customer: true },
      });
    });
  });

  describe('update', () => {
    const updateSaleDto = {
      amount: 200.75,
      saleDate: '2023-02-01',
    };

    it('should update sale successfully', async () => {
      const updatedSale = { ...mockSale, ...updateSaleDto, saleDate: new Date('2023-02-01') };
      
      prismaService.sale.findFirst.mockResolvedValue(mockSale);
      prismaService.sale.update.mockResolvedValue(updatedSale);

      const result = await service.update(userId, '1', updateSaleDto);

      expect(prismaService.sale.findFirst).toHaveBeenCalledWith({
        where: { id: '1', userId },
      });
      expect(prismaService.sale.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          amount: 200.75,
          saleDate: new Date('2023-02-01'),
        },
        include: { customer: true },
      });
      expect(result).toEqual(updatedSale);
    });

    it('should update only amount when saleDate not provided', async () => {
      const updateDto = { amount: 150.25 };
      const updatedSale = { ...mockSale, amount: 150.25 };

      prismaService.sale.findFirst.mockResolvedValue(mockSale);
      prismaService.sale.update.mockResolvedValue(updatedSale);

      const result = await service.update(userId, '1', updateDto);

      expect(prismaService.sale.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { amount: 150.25 },
        include: { customer: true },
      });
      expect(result).toEqual(updatedSale);
    });

    it('should throw NotFoundException when sale not found', async () => {
      prismaService.sale.findFirst.mockResolvedValue(null);

      await expect(service.update(userId, '1', updateSaleDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove sale successfully', async () => {
      prismaService.sale.findFirst.mockResolvedValue(mockSale);
      prismaService.sale.delete.mockResolvedValue(mockSale);

      const result = await service.remove(userId, '1');

      expect(prismaService.sale.findFirst).toHaveBeenCalledWith({
        where: { id: '1', userId },
      });
      expect(prismaService.sale.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockSale);
    });

    it('should throw NotFoundException when sale not found', async () => {
      prismaService.sale.findFirst.mockResolvedValue(null);

      await expect(service.remove(userId, '1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getDailySalesStats', () => {
    it('should return daily sales statistics', async () => {
      const mockStats = [
        {
          saleDate: new Date('2023-01-01'),
          _sum: { amount: 500.0 },
          _count: { id: 5 },
        },
        {
          saleDate: new Date('2023-01-02'),
          _sum: { amount: 750.0 },
          _count: { id: 8 },
        },
      ];

      prismaService.sale.groupBy.mockResolvedValue(mockStats);

      const result = await service.getDailySalesStats(userId);

      expect(prismaService.sale.groupBy).toHaveBeenCalledWith({
        by: ['saleDate'],
        where: {
          userId,
          saleDate: {
            gte: expect.any(Date),
          },
        },
        _sum: { amount: true },
        _count: { id: true },
        orderBy: { saleDate: 'asc' },
      });

      expect(result).toEqual([
        {
          date: new Date('2023-01-01'),
          totalAmount: 500.0,
          totalSales: 5,
        },
        {
          date: new Date('2023-01-02'),
          totalAmount: 750.0,
          totalSales: 8,
        },
      ]);
    });
  });

  describe('getTopCustomers', () => {
    it('should return top customers by sales', async () => {
      const mockTopCustomers = [
        {
          customerId,
          _sum: { amount: 1000.0 },
          _count: { id: 10 },
          customer: {
            id: customerId,
            name: 'Top Customer',
            email: 'top@example.com',
          },
        },
      ];

      prismaService.sale.groupBy.mockResolvedValue(mockTopCustomers);

      const result = await service.getTopCustomers(userId);

      expect(prismaService.sale.groupBy).toHaveBeenCalledWith({
        by: ['customerId'],
        where: { userId },
        _sum: { amount: true },
        _count: { id: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 5,
      });

      expect(result).toEqual([
        {
          customerId,
          totalAmount: 1000.0,
          totalSales: 10,
          customer: {
            id: customerId,
            name: 'Top Customer',
            email: 'top@example.com',
          },
        },
      ]);
    });
  });
});
