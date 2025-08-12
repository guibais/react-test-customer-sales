import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerFiltersDto,
} from '../dto/customer.dto';
import { Customer } from '../types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const data = {
      ...createCustomerDto,
      birthDate: createCustomerDto.birthDate
        ? new Date(createCustomerDto.birthDate)
        : undefined,
    };

    try {
      return await this.prisma.customer.create({ data });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Este email já está sendo usado por outro cliente');
      }
      throw error;
    }
  }

  async findAll(filters: CustomerFiltersDto) {
    const { name, email, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      ...(name && { name: { contains: name, mode: 'insensitive' as const } }),
      ...(email && {
        email: { contains: email, mode: 'insensitive' as const },
      }),
    };

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
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
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    await this.findOne(id);

    const data = {
      ...updateCustomerDto,
      birthDate: updateCustomerDto.birthDate
        ? new Date(updateCustomerDto.birthDate)
        : undefined,
    };

    try {
      return await this.prisma.customer.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Este email já está sendo usado por outro cliente');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.customer.delete({
      where: { id },
    });
  }
}
