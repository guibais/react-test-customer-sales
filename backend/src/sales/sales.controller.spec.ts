import { Test, TestingModule } from '@nestjs/testing';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSaleDto, UpdateSaleDto, SaleFiltersDto } from '../dto/sale.dto';
import { AuthRequest } from '../types/auth.types';

describe('SalesController', () => {
  let controller: SalesController;
  let service: SalesService;

  const mockSalesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getDailySalesStats: jest.fn(),
    getTopCustomers: jest.fn(),
  };

  const mockAuthRequest: AuthRequest = {
    user: {
      id: 'user-id-123',
      email: 'test@example.com',
      name: 'Test User',
    },
  } as AuthRequest;

  const mockSale = {
    id: 'sale-id-123',
    customerId: 'customer-id-123',
    amount: 150.50,
    saleDate: new Date('2024-01-01'),
    customerName: 'João Silva',
    customerEmail: 'joao@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [
        {
          provide: SalesService,
          useValue: mockSalesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SalesController>(SalesController);
    service = module.get<SalesService>(SalesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all sales with filters', async () => {
      const filters: SaleFiltersDto = {
        page: 1,
        limit: 10,
        customerId: 'customer-id-123',
      };

      const mockResult = {
        sales: [mockSale],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockSalesService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(mockAuthRequest, filters);

      expect(service.findAll).toHaveBeenCalledWith(mockAuthRequest.user.id, filters);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getDailySalesStats', () => {
    it('should return daily sales statistics', async () => {
      const mockStats = [
        {
          date: '2024-01-01',
          totalSales: 5,
          totalAmount: 750.50,
        },
      ];

      mockSalesService.getDailySalesStats.mockResolvedValue(mockStats);

      const result = await controller.getDailySalesStats(mockAuthRequest);

      expect(service.getDailySalesStats).toHaveBeenCalledWith(mockAuthRequest.user.id);
      expect(result).toEqual(mockStats);
    });
  });

  describe('getTopCustomers', () => {
    it('should return top customers statistics', async () => {
      const mockTopCustomers = {
        highestVolume: {
          customerId: 'customer-1',
          customerName: 'João Silva',
          totalVolume: 1000,
          averageValue: 200,
          totalSales: 5,
          exclusiveDays: 3,
        },
        highestAverage: {
          customerId: 'customer-2',
          customerName: 'Maria Santos',
          totalVolume: 800,
          averageValue: 400,
          totalSales: 2,
          exclusiveDays: 2,
        },
        mostFrequent: {
          customerId: 'customer-1',
          customerName: 'João Silva',
          totalVolume: 1000,
          averageValue: 200,
          totalSales: 5,
          exclusiveDays: 3,
        },
        totalCustomers: 10,
      };

      mockSalesService.getTopCustomers.mockResolvedValue(mockTopCustomers);

      const result = await controller.getTopCustomers(mockAuthRequest);

      expect(service.getTopCustomers).toHaveBeenCalledWith(mockAuthRequest.user.id);
      expect(result).toEqual(mockTopCustomers);
    });
  });

  describe('findOne', () => {
    it('should return a single sale', async () => {
      const saleId = 'sale-id-123';
      mockSalesService.findOne.mockResolvedValue(mockSale);

      const result = await controller.findOne(mockAuthRequest, saleId);

      expect(service.findOne).toHaveBeenCalledWith(mockAuthRequest.user.id, saleId);
      expect(result).toEqual(mockSale);
    });
  });

  describe('create', () => {
    it('should create a sale successfully', async () => {
      const createSaleDto: CreateSaleDto = {
        customerId: 'customer-id-123',
        amount: 150.50,
        saleDate: '2024-01-01',
      };

      mockSalesService.create.mockResolvedValue(mockSale);

      const result = await controller.create(mockAuthRequest, createSaleDto);

      expect(service.create).toHaveBeenCalledWith(mockAuthRequest.user.id, createSaleDto);
      expect(result).toEqual(mockSale);
    });
  });

  describe('update', () => {
    it('should update a sale successfully', async () => {
      const saleId = 'sale-id-123';
      const updateSaleDto: UpdateSaleDto = {
        amount: 200.75,
        saleDate: '2024-01-02',
      };

      const updatedSale = { ...mockSale, ...updateSaleDto };
      mockSalesService.update.mockResolvedValue(updatedSale);

      const result = await controller.update(mockAuthRequest, saleId, updateSaleDto);

      expect(service.update).toHaveBeenCalledWith(mockAuthRequest.user.id, saleId, updateSaleDto);
      expect(result).toEqual(updatedSale);
    });
  });

  describe('remove', () => {
    it('should remove a sale successfully', async () => {
      const saleId = 'sale-id-123';
      mockSalesService.remove.mockResolvedValue(mockSale);

      const result = await controller.remove(mockAuthRequest, saleId);

      expect(service.remove).toHaveBeenCalledWith(mockAuthRequest.user.id, saleId);
      expect(result).toEqual(mockSale);
    });
  });
});
