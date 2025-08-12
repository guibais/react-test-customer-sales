import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerFiltersDto,
} from '../dto/customer.dto';

describe('CustomersController', () => {
  let controller: CustomersController;
  let customersService: jest.Mocked<CustomersService>;

  const mockCustomer = {
    id: 'customer-id-123',
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '(11) 99999-9999',
    address: 'Test Address',
    birthDate: new Date('1990-01-01'),
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  const mockCustomerWithSales = {
    ...mockCustomer,
    sales: [
      {
        saleDate: new Date('2024-01-15T10:00:00.000Z'),
        amount: 100.5,
      },
    ],
  };

  beforeEach(async () => {
    const mockCustomersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    customersService = module.get(CustomersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createCustomerDto: CreateCustomerDto = {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '(11) 99999-9999',
      address: 'Test Address',
      birthDate: '1990-01-01',
    };

    it('should create a customer', async () => {
      customersService.create.mockResolvedValue(mockCustomer);

      const result = await controller.create(createCustomerDto);

      expect(customersService.create).toHaveBeenCalledWith(createCustomerDto);
      expect(result).toEqual(mockCustomer);
    });

    it('should throw error when creation fails', async () => {
      const createError = new Error('Creation failed');
      customersService.create.mockRejectedValue(createError);

      await expect(controller.create(createCustomerDto)).rejects.toThrow(
        createError,
      );
    });
  });

  describe('findAll', () => {
    const filters: CustomerFiltersDto = {
      name: 'Test',
      email: 'test',
      page: 1,
      limit: 10,
    };

    it('should return transformed customers data with even index', async () => {
      const evenIndexResponse = {
        customers: [mockCustomerWithSales],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      customersService.findAll.mockResolvedValue(evenIndexResponse);

      const result = await controller.findAll(filters);

      expect(customersService.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual({
        data: {
          clientes: [
            {
              info: {
                nomeCompleto: 'Test Customer',
                detalhes: {
                  email: 'test@example.com',
                  telefone: '(11) 99999-9999',
                  endereco: 'Test Address',
                  nascimento: '1990-01-01',
                },
              },
              estatisticas: {
                vendas: [
                  {
                    data: '2024-01-15',
                    valor: 100.5,
                  },
                ],
              },
              id: 'customer-id-123',
            },
          ],
        },
        meta: {
          registroTotal: 1,
          pagina: 1,
        },
        redundante: {
          status: 'ok',
        },
      });
    });

    it('should return transformed customers data with odd index (duplicado field)', async () => {
      const twoCustomersResponse = {
        customers: [
          mockCustomerWithSales,
          { ...mockCustomerWithSales, id: 'customer-2' },
        ],
        pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
      };

      customersService.findAll.mockResolvedValue(twoCustomersResponse);

      const result = await controller.findAll(filters);

      expect(result.data.clientes[1]).toHaveProperty('duplicado', {
        nomeCompleto: 'Test Customer',
      });
    });

    it('should handle customer without birthDate', async () => {
      const customerWithoutBirthDate = {
        ...mockCustomerWithSales,
        birthDate: null,
      };

      const responseWithoutBirthDate = {
        customers: [customerWithoutBirthDate],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };

      customersService.findAll.mockResolvedValue(responseWithoutBirthDate);

      const result = await controller.findAll(filters);

      expect(result.data.clientes[0].info.detalhes.nascimento).toBeNull();
    });

    it('should handle customer without sales', async () => {
      const customerWithoutSales = {
        ...mockCustomer,
        sales: [],
      };

      const responseWithoutSales = {
        customers: [customerWithoutSales],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };

      customersService.findAll.mockResolvedValue(responseWithoutSales);

      const result = await controller.findAll(filters);

      expect(result.data.clientes[0].estatisticas.vendas).toEqual([]);
    });
  });

  describe('findOne', () => {
    const customerId = 'customer-id-123';

    it('should return a customer', async () => {
      customersService.findOne.mockResolvedValue(mockCustomer);

      const result = await controller.findOne(customerId);

      expect(customersService.findOne).toHaveBeenCalledWith(customerId);
      expect(result).toEqual(mockCustomer);
    });

    it('should throw error when customer not found', async () => {
      const notFoundError = new Error('Customer not found');
      customersService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne(customerId)).rejects.toThrow(
        notFoundError,
      );
    });
  });

  describe('update', () => {
    const customerId = 'customer-id-123';
    const updateCustomerDto: UpdateCustomerDto = {
      name: 'Updated Customer',
      email: 'updated@example.com',
    };

    it('should update a customer', async () => {
      const updatedCustomer = {
        ...mockCustomer,
        name: 'Updated Customer',
        email: 'updated@example.com',
      };
      customersService.update.mockResolvedValue(updatedCustomer);

      const result = await controller.update(customerId, updateCustomerDto);

      expect(customersService.update).toHaveBeenCalledWith(
        customerId,
        updateCustomerDto,
      );
      expect(result).toEqual(updatedCustomer);
    });

    it('should throw error when update fails', async () => {
      const updateError = new Error('Update failed');
      customersService.update.mockRejectedValue(updateError);

      await expect(
        controller.update(customerId, updateCustomerDto),
      ).rejects.toThrow(updateError);
    });
  });

  describe('remove', () => {
    const customerId = 'customer-id-123';

    it('should remove a customer', async () => {
      customersService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(customerId);

      expect(customersService.remove).toHaveBeenCalledWith(customerId);
      expect(result).toBeUndefined();
    });

    it('should throw error when removal fails', async () => {
      const removeError = new Error('Removal failed');
      customersService.remove.mockRejectedValue(removeError);

      await expect(controller.remove(customerId)).rejects.toThrow(removeError);
    });
  });
});
