import { Test, TestingModule } from '@nestjs/testing';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { CreateSaleDto, UpdateSaleDto, SaleFiltersDto } from '../dto/sale.dto';

describe('SalesController', () => {
  let controller: SalesController;
  let salesService: any;

  const mockSale = {
    id: 'sale-1',
    customerId: 'customer-1',
    amount: 100.5,
    saleDate: new Date('2024-01-15T10:00:00.000Z'),
    createdAt: new Date('2024-01-10T10:00:00.000Z'),
    updatedAt: new Date('2024-01-10T10:00:00.000Z'),
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
    const mockSalesService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      getDailySalesStats: jest.fn(),
      getTopCustomers: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [
        {
          provide: SalesService,
          useValue: mockSalesService,
        },
      ],
    }).compile();

    controller = module.get<SalesController>(SalesController);
    salesService = module.get(SalesService);
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

    it('should return paginated sales', async () => {
      const expectedResponse = {
        sales: [
          {
            ...mockSale,
            customerName: 'Test Customer',
            customerEmail: 'test@example.com',
            customer: { name: 'Test Customer', email: 'test@example.com' },
          },
        ],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };

      salesService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(filters);

      expect(salesService.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Database error');
      salesService.findAll.mockRejectedValue(serviceError);

      await expect(controller.findAll(filters)).rejects.toThrow(serviceError);
    });
  });

  describe('getDailySalesStats', () => {
    it('should return daily sales statistics', async () => {
      const expectedStats = [
        {
          date: '2024-01-15',
          totalSales: 3,
          totalAmount: 350.5,
        },
      ];

      salesService.getDailySalesStats.mockResolvedValue(expectedStats);

      const result = await controller.getDailySalesStats();

      expect(salesService.getDailySalesStats).toHaveBeenCalled();
      expect(result).toEqual(expectedStats);
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Stats calculation failed');
      salesService.getDailySalesStats.mockRejectedValue(serviceError);

      await expect(controller.getDailySalesStats()).rejects.toThrow(
        serviceError,
      );
    });
  });

  describe('getTopCustomers', () => {
    it('should return top customers statistics', async () => {
      const expectedResponse = {
        highestVolume: {
          customerId: 'customer-1',
          customerName: 'Customer One',
          totalVolume: 500,
          averageValue: 100,
          totalSales: 5,
          exclusiveDays: 2,
        },
        highestAverage: {
          customerId: 'customer-2',
          customerName: 'Customer Two',
          totalVolume: 300,
          averageValue: 150,
          totalSales: 2,
          exclusiveDays: 1,
        },
        mostFrequent: {
          customerId: 'customer-1',
          customerName: 'Customer One',
          totalVolume: 500,
          averageValue: 100,
          totalSales: 5,
          exclusiveDays: 2,
        },
        totalCustomers: 10,
      };

      salesService.getTopCustomers.mockResolvedValue(expectedResponse);

      const result = await controller.getTopCustomers();

      expect(salesService.getTopCustomers).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Customer stats failed');
      salesService.getTopCustomers.mockRejectedValue(serviceError);

      await expect(controller.getTopCustomers()).rejects.toThrow(serviceError);
    });
  });

  describe('findOne', () => {
    it('should return sale by id', async () => {
      salesService.findOne.mockResolvedValue(mockSale);

      const result = await controller.findOne(saleId);

      expect(salesService.findOne).toHaveBeenCalledWith(saleId);
      expect(result).toEqual(mockSale);
    });

    it('should handle service errors', async () => {
      const notFoundError = new Error('Sale not found');
      salesService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne(saleId)).rejects.toThrow(notFoundError);
    });
  });

  describe('create', () => {
    it('should create sale successfully', async () => {
      salesService.create.mockResolvedValue(mockSale);

      const result = await controller.create(createSaleDto);

      expect(salesService.create).toHaveBeenCalledWith(createSaleDto);
      expect(result).toEqual(mockSale);
    });

    it('should handle service errors', async () => {
      const createError = new Error('Creation failed');
      salesService.create.mockRejectedValue(createError);

      await expect(controller.create(createSaleDto)).rejects.toThrow(
        createError,
      );
    });
  });

  describe('update', () => {
    it('should update sale successfully', async () => {
      const updatedSale = {
        ...mockSale,
        amount: updateSaleDto.amount!,
        saleDate: new Date('2024-01-20'),
      };
      salesService.update.mockResolvedValue(updatedSale);

      const result = await controller.update(saleId, updateSaleDto);

      expect(salesService.update).toHaveBeenCalledWith(saleId, updateSaleDto);
      expect(result).toEqual(updatedSale);
    });

    it('should handle service errors', async () => {
      const updateError = new Error('Update failed');
      salesService.update.mockRejectedValue(updateError);

      await expect(controller.update(saleId, updateSaleDto)).rejects.toThrow(
        updateError,
      );
    });
  });

  describe('remove', () => {
    it('should remove sale successfully', async () => {
      salesService.remove.mockResolvedValue(undefined);

      await controller.remove(saleId);

      expect(salesService.remove).toHaveBeenCalledWith(saleId);
    });

    it('should handle service errors', async () => {
      const removeError = new Error('Removal failed');
      salesService.remove.mockRejectedValue(removeError);

      await expect(controller.remove(saleId)).rejects.toThrow(removeError);
    });
  });
});
