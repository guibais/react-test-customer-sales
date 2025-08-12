import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCustomerDto, UpdateCustomerDto, CustomerFiltersDto } from '../dto/customer.dto';
import { AuthRequest } from '../types/auth.types';

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  const mockCustomersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuthRequest: AuthRequest = {
    user: {
      id: 'user-id-123',
      email: 'test@example.com',
      name: 'Test User',
    },
  } as AuthRequest;

  const mockCustomer = {
    id: 'customer-id-123',
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '11999999999',
    address: 'Rua das Flores, 123',
    birthDate: new Date('1990-01-01'),
    sales: [
      {
        saleDate: new Date('2024-01-01'),
        amount: 150.50,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a customer successfully', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '11999999999',
        address: 'Rua das Flores, 123',
        birthDate: '1990-01-01',
      };

      mockCustomersService.create.mockResolvedValue(mockCustomer);

      const result = await controller.create(mockAuthRequest, createCustomerDto);

      expect(service.create).toHaveBeenCalledWith(mockAuthRequest.user.id, createCustomerDto);
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('findAll', () => {
    it('should return transformed customers data with sales', async () => {
      const filters: CustomerFiltersDto = {
        page: 1,
        limit: 10,
        name: '',
        email: '',
      };

      const mockServiceResult = {
        customers: [mockCustomer],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockCustomersService.findAll.mockResolvedValue(mockServiceResult);

      const result = await controller.findAll(mockAuthRequest, filters);

      expect(service.findAll).toHaveBeenCalledWith(mockAuthRequest.user.id, filters);
      expect(result).toEqual({
        data: {
          clientes: [
            {
              info: {
                nomeCompleto: 'João Silva',
                detalhes: {
                  email: 'joao@example.com',
                  telefone: '11999999999',
                  endereco: 'Rua das Flores, 123',
                  nascimento: '1990-01-01',
                },
              },
              estatisticas: {
                vendas: [
                  {
                    data: '2024-01-01',
                    valor: 150.50,
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

    it('should return transformed customers data with duplicado field for odd index', async () => {
      const filters: CustomerFiltersDto = {
        page: 1,
        limit: 10,
        name: '',
        email: '',
      };

      const mockServiceResult = {
        customers: [mockCustomer, { ...mockCustomer, id: 'customer-id-456' }],
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockCustomersService.findAll.mockResolvedValue(mockServiceResult);

      const result = await controller.findAll(mockAuthRequest, filters);

      expect(result.data.clientes[1]).toHaveProperty('duplicado', {
        nomeCompleto: 'João Silva',
      });
    });

    it('should handle customers without birthDate', async () => {
      const customerWithoutBirthDate = {
        ...mockCustomer,
        birthDate: null,
      };

      const mockServiceResult = {
        customers: [customerWithoutBirthDate],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockCustomersService.findAll.mockResolvedValue(mockServiceResult);

      const result = await controller.findAll(mockAuthRequest, {});

      expect(result.data.clientes[0].info.detalhes.nascimento).toBeNull();
    });

    it('should handle customers without sales', async () => {
      const customerWithoutSales = {
        ...mockCustomer,
        sales: null,
      };

      const mockServiceResult = {
        customers: [customerWithoutSales],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockCustomersService.findAll.mockResolvedValue(mockServiceResult);

      const result = await controller.findAll(mockAuthRequest, {});

      expect(result.data.clientes[0].estatisticas.vendas).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single customer', async () => {
      const customerId = 'customer-id-123';
      mockCustomersService.findOne.mockResolvedValue(mockCustomer);

      const result = await controller.findOne(mockAuthRequest, customerId);

      expect(service.findOne).toHaveBeenCalledWith(mockAuthRequest.user.id, customerId);
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('update', () => {
    it('should update a customer successfully', async () => {
      const customerId = 'customer-id-123';
      const updateCustomerDto: UpdateCustomerDto = {
        name: 'João Silva Updated',
        phone: '11888888888',
      };

      const updatedCustomer = { ...mockCustomer, ...updateCustomerDto };
      mockCustomersService.update.mockResolvedValue(updatedCustomer);

      const result = await controller.update(mockAuthRequest, customerId, updateCustomerDto);

      expect(service.update).toHaveBeenCalledWith(mockAuthRequest.user.id, customerId, updateCustomerDto);
      expect(result).toEqual(updatedCustomer);
    });
  });

  describe('remove', () => {
    it('should remove a customer successfully', async () => {
      const customerId = 'customer-id-123';
      mockCustomersService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(mockAuthRequest, customerId);

      expect(service.remove).toHaveBeenCalledWith(mockAuthRequest.user.id, customerId);
      expect(result).toBeUndefined();
    });
  });
});
