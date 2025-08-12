import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { PrismaService } from '../database/prisma.service';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerFiltersDto,
} from '../dto/customer.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('CustomersService', () => {
  let service: CustomersService;
  let prismaService: any;

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
        saleDate: new Date('2024-01-15'),
        amount: 100.5,
      },
      {
        saleDate: new Date('2024-01-10'),
        amount: 250.75,
      },
    ],
  };

  beforeEach(async () => {
    const mockPrismaService = {
      customer: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    prismaService = module.get(PrismaService);
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

    it('should successfully create a customer', async () => {
      prismaService.customer.create.mockResolvedValue(mockCustomer);

      const result = await service.create(createCustomerDto);

      expect(prismaService.customer.create).toHaveBeenCalledWith({
        data: {
          ...createCustomerDto,
          birthDate: new Date('1990-01-01'),
        },
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should create customer without birthDate', async () => {
      const dtoWithoutBirthDate = {
        name: 'Test Customer',
        email: 'test@example.com',
      };

      prismaService.customer.create.mockResolvedValue(mockCustomer);

      await service.create(dtoWithoutBirthDate);

      expect(prismaService.customer.create).toHaveBeenCalledWith({
        data: {
          ...dtoWithoutBirthDate,
          birthDate: undefined,
        },
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      const prismaError = new PrismaClientKnownRequestError(
        'Unique constraint failed',
        { code: 'P2002', clientVersion: '5.0.0' },
      );

      prismaService.customer.create.mockRejectedValue(prismaError);

      await expect(service.create(createCustomerDto)).rejects.toThrow(
        new ConflictException(
          'Este email já está sendo usado por outro cliente',
        ),
      );
    });

    it('should throw original error when not a unique constraint error', async () => {
      const genericError = new Error('Generic database error');
      prismaService.customer.create.mockRejectedValue(genericError);

      await expect(service.create(createCustomerDto)).rejects.toThrow(
        genericError,
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

    it('should return customers with pagination', async () => {
      const customers = [mockCustomerWithSales];
      const total = 1;

      prismaService.customer.findMany.mockResolvedValue(customers);
      prismaService.customer.count.mockResolvedValue(total);

      const result = await service.findAll(filters);

      expect(prismaService.customer.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: 'Test', mode: 'insensitive' },
          email: { contains: 'test', mode: 'insensitive' },
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          sales: {
            select: {
              saleDate: true,
              amount: true,
            },
            orderBy: { saleDate: 'desc' },
          },
        },
      });

      expect(prismaService.customer.count).toHaveBeenCalledWith({
        where: {
          name: { contains: 'Test', mode: 'insensitive' },
          email: { contains: 'test', mode: 'insensitive' },
        },
      });

      expect(result).toEqual({
        customers,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
    });

    it('should handle empty filters', async () => {
      const emptyFilters = { page: 2, limit: 5 };
      const customers = [mockCustomer];
      const total = 15;

      prismaService.customer.findMany.mockResolvedValue(customers);
      prismaService.customer.count.mockResolvedValue(total);

      const result = await service.findAll(emptyFilters);

      expect(prismaService.customer.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 5,
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          sales: {
            select: {
              saleDate: true,
              amount: true,
            },
            orderBy: { saleDate: 'desc' },
          },
        },
      });

      expect(result.pagination).toEqual({
        page: 2,
        limit: 5,
        total: 15,
        totalPages: 3,
      });
    });

    it('should use default pagination values', async () => {
      const customers = [mockCustomer];
      const total = 1;

      prismaService.customer.findMany.mockResolvedValue(customers);
      prismaService.customer.count.mockResolvedValue(total);

      await service.findAll({});

      expect(prismaService.customer.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          sales: {
            select: {
              saleDate: true,
              amount: true,
            },
            orderBy: { saleDate: 'desc' },
          },
        },
      });
    });
  });

  describe('findOne', () => {
    const customerId = 'customer-id-123';

    it('should return customer when found', async () => {
      prismaService.customer.findUnique.mockResolvedValue(mockCustomer);

      const result = await service.findOne(customerId);

      expect(prismaService.customer.findUnique).toHaveBeenCalledWith({
        where: { id: customerId },
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should throw NotFoundException when customer not found', async () => {
      prismaService.customer.findUnique.mockResolvedValue(null);

      await expect(service.findOne(customerId)).rejects.toThrow(
        new NotFoundException(`Customer with ID ${customerId} not found`),
      );
    });
  });

  describe('update', () => {
    const customerId = 'customer-id-123';
    const updateCustomerDto: UpdateCustomerDto = {
      name: 'Updated Customer',
      email: 'updated@example.com',
      birthDate: '1995-05-05',
    };

    it('should successfully update customer', async () => {
      const updatedCustomer = { ...mockCustomer, ...updateCustomerDto };

      prismaService.customer.findUnique.mockResolvedValue(mockCustomer);
      prismaService.customer.update.mockResolvedValue(updatedCustomer);

      const result = await service.update(customerId, updateCustomerDto);

      expect(prismaService.customer.update).toHaveBeenCalledWith({
        where: { id: customerId },
        data: {
          ...updateCustomerDto,
          birthDate: new Date('1995-05-05'),
        },
      });
      expect(result).toEqual(updatedCustomer);
    });

    it('should update customer without birthDate', async () => {
      const dtoWithoutBirthDate = { name: 'Updated Name' };

      prismaService.customer.findUnique.mockResolvedValue(mockCustomer);
      prismaService.customer.update.mockResolvedValue(mockCustomer);

      await service.update(customerId, dtoWithoutBirthDate);

      expect(prismaService.customer.update).toHaveBeenCalledWith({
        where: { id: customerId },
        data: {
          ...dtoWithoutBirthDate,
          birthDate: undefined,
        },
      });
    });

    it('should throw NotFoundException when customer not found', async () => {
      prismaService.customer.findUnique.mockResolvedValue(null);

      await expect(
        service.update(customerId, updateCustomerDto),
      ).rejects.toThrow(
        new NotFoundException(`Customer with ID ${customerId} not found`),
      );
    });

    it('should throw ConflictException when email already exists', async () => {
      const prismaError = new PrismaClientKnownRequestError(
        'Unique constraint failed',
        { code: 'P2002', clientVersion: '5.0.0' },
      );

      prismaService.customer.findUnique.mockResolvedValue(mockCustomer);
      prismaService.customer.update.mockRejectedValue(prismaError);

      await expect(
        service.update(customerId, updateCustomerDto),
      ).rejects.toThrow(
        new ConflictException(
          'Este email já está sendo usado por outro cliente',
        ),
      );
    });

    it('should throw original error when not a unique constraint error', async () => {
      const genericError = new Error('Generic database error');

      prismaService.customer.findUnique.mockResolvedValue(mockCustomer);
      prismaService.customer.update.mockRejectedValue(genericError);

      await expect(
        service.update(customerId, updateCustomerDto),
      ).rejects.toThrow(genericError);
    });
  });

  describe('remove', () => {
    const customerId = 'customer-id-123';

    it('should successfully remove customer', async () => {
      prismaService.customer.findUnique.mockResolvedValue(mockCustomer);
      prismaService.customer.delete.mockResolvedValue(mockCustomer);

      await service.remove(customerId);

      expect(prismaService.customer.delete).toHaveBeenCalledWith({
        where: { id: customerId },
      });
    });

    it('should throw NotFoundException when customer not found', async () => {
      prismaService.customer.findUnique.mockResolvedValue(null);

      await expect(service.remove(customerId)).rejects.toThrow(
        new NotFoundException(`Customer with ID ${customerId} not found`),
      );

      expect(prismaService.customer.delete).not.toHaveBeenCalled();
    });
  });
});
