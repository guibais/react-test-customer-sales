import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { PrismaService } from '../database/prisma.service';
import { CreateCustomerDto } from '../dto/customer.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('CustomersService', () => {
  let service: CustomersService;
  let prismaService: any;

  const userId = 'user-123';
  const mockCustomer = {
    id: '1',
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '(11) 99999-9999',
    address: 'Test Address',
    birthDate: new Date('1990-01-01'),
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    sales: [],
  };

  const mockPrismaService = {
    customer: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
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
    jest.clearAllMocks();
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

      const result = await service.create(userId, createCustomerDto);

      expect(prismaService.customer.create).toHaveBeenCalledWith({
        data: {
          ...createCustomerDto,
          userId,
          birthDate: new Date('1990-01-01'),
        },
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should create customer without birthDate', async () => {
      const dtoWithoutBirthDate = {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '(11) 99999-9999',
        address: 'Test Address',
      };
      const customerWithoutBirthDate = { ...mockCustomer, birthDate: null };

      prismaService.customer.create.mockResolvedValue(customerWithoutBirthDate);

      const result = await service.create(userId, dtoWithoutBirthDate);

      expect(prismaService.customer.create).toHaveBeenCalledWith({
        data: {
          ...dtoWithoutBirthDate,
          userId,
          birthDate: undefined,
        },
      });
      expect(result).toEqual(customerWithoutBirthDate);
    });

    it('should throw ConflictException when email already exists', async () => {
      const error = new PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '5.22.0',
          meta: { target: ['email'] },
        },
      );
      prismaService.customer.create.mockRejectedValue(error);

      await expect(service.create(userId, createCustomerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw original error when not a unique constraint error', async () => {
      const error = new Error('Database error');
      prismaService.customer.create.mockRejectedValue(error);

      await expect(service.create(userId, createCustomerDto)).rejects.toThrow(
        error,
      );
    });
  });

  describe('findAll', () => {
    it('should return customers with pagination', async () => {
      const mockCustomers = [mockCustomer];
      const mockCount = 1;

      prismaService.customer.findMany.mockResolvedValue(mockCustomers);
      prismaService.customer.count.mockResolvedValue(mockCount);

      const result = await service.findAll(userId, { page: 1, limit: 10 });

      expect(result.customers).toEqual(mockCustomers);
      expect(result.pagination.total).toBe(mockCount);
      expect(result.pagination.totalPages).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it('should handle empty filters', async () => {
      const mockCustomers = [mockCustomer];
      const mockCount = 1;

      prismaService.customer.findMany.mockResolvedValue(mockCustomers);
      prismaService.customer.count.mockResolvedValue(mockCount);

      await service.findAll(userId, {});

      expect(prismaService.customer.findMany).toHaveBeenCalledWith({
        where: { userId },
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

    it('should use default pagination values', async () => {
      const mockCustomers = [mockCustomer];
      const mockCount = 1;

      prismaService.customer.findMany.mockResolvedValue(mockCustomers);
      prismaService.customer.count.mockResolvedValue(mockCount);

      await service.findAll(userId, {});

      expect(prismaService.customer.findMany).toHaveBeenCalledWith({
        where: { userId },
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

    it('should filter by name and email', async () => {
      const mockCustomers = [mockCustomer];
      const mockCount = 1;

      prismaService.customer.findMany.mockResolvedValue(mockCustomers);
      prismaService.customer.count.mockResolvedValue(mockCount);

      await service.findAll(userId, {
        name: 'Test',
        email: 'test@example.com',
      });

      expect(prismaService.customer.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          name: { contains: 'Test', mode: 'insensitive' },
          email: { contains: 'test@example.com', mode: 'insensitive' },
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
    });
  });

  describe('findOne', () => {
    it('should return customer when found', async () => {
      prismaService.customer.findFirst.mockResolvedValue(mockCustomer);

      const result = await service.findOne(userId, '1');

      expect(prismaService.customer.findFirst).toHaveBeenCalledWith({
        where: { id: '1', userId },
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should throw NotFoundException when customer not found', async () => {
      prismaService.customer.findFirst.mockResolvedValue(null);

      await expect(service.findOne(userId, '1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateCustomerDto = {
      name: 'Updated Customer',
      email: 'updated@example.com',
    };

    it('should successfully update customer', async () => {
      const updatedCustomer = { ...mockCustomer, ...updateCustomerDto };

      prismaService.customer.findFirst.mockResolvedValue(mockCustomer);
      prismaService.customer.update.mockResolvedValue(updatedCustomer);

      const result = await service.update(userId, '1', updateCustomerDto);

      expect(prismaService.customer.findFirst).toHaveBeenCalledWith({
        where: { id: '1', userId },
      });
      expect(prismaService.customer.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateCustomerDto,
      });
      expect(result).toEqual(updatedCustomer);
    });

    it('should update customer without birthDate', async () => {
      const updateDto = { name: 'Updated Name' };
      const updatedCustomer = { ...mockCustomer, name: 'Updated Name' };

      prismaService.customer.findFirst.mockResolvedValue(mockCustomer);
      prismaService.customer.update.mockResolvedValue(updatedCustomer);

      const result = await service.update(userId, '1', updateDto);

      expect(result).toEqual(updatedCustomer);
    });

    it('should throw NotFoundException when customer not found', async () => {
      prismaService.customer.findFirst.mockResolvedValue(null);

      await expect(
        service.update(userId, '1', updateCustomerDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when email already exists', async () => {
      const error = new PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '5.22.0',
          meta: { target: ['email'] },
        },
      );

      prismaService.customer.findFirst.mockResolvedValue(mockCustomer);
      prismaService.customer.update.mockRejectedValue(error);

      await expect(
        service.update(userId, '1', updateCustomerDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw original error when not a unique constraint error', async () => {
      const error = new Error('Database error');

      prismaService.customer.findFirst.mockResolvedValue(mockCustomer);
      prismaService.customer.update.mockRejectedValue(error);

      await expect(
        service.update(userId, '1', updateCustomerDto),
      ).rejects.toThrow(error);
    });
  });

  describe('remove', () => {
    it('should successfully remove customer', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCustomer);
      prismaService.customer.delete.mockResolvedValue(undefined);

      await service.remove(userId, '1');

      expect(service.findOne).toHaveBeenCalledWith(userId, '1');
      expect(prismaService.customer.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException when customer not found', async () => {
      prismaService.customer.findFirst.mockResolvedValue(null);

      await expect(service.remove(userId, '1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
