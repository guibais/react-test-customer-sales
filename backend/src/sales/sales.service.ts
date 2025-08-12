import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateSaleDto, UpdateSaleDto, SaleFiltersDto } from '../dto/sale.dto';
import { Sale, DailySalesStats, TopCustomersResponse } from '../types';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, filters: SaleFiltersDto) {
    const { customerId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      customer: { userId },
      ...(customerId && { customerId }),
    };

    const [sales, total] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        skip,
        take: limit,
        orderBy: { saleDate: 'desc' },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.sale.count({ where }),
    ]);

    return {
      sales: sales.map((sale) => ({
        ...sale,
        customerName: sale.customer.name,
        customerEmail: sale.customer.email,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, id: string): Promise<Sale> {
    const sale = await this.prisma.sale.findFirst({
      where: {
        id,
        customer: { userId },
      },
      include: {
        customer: true,
      },
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return sale;
  }

  async create(userId: string, createSaleDto: CreateSaleDto): Promise<Sale> {
    const customer = await this.prisma.customer.findFirst({
      where: { id: createSaleDto.customerId, userId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const data = {
      ...createSaleDto,
      userId,
      saleDate: new Date(createSaleDto.saleDate),
    };

    return this.prisma.sale.create({ data });
  }

  async update(
    userId: string,
    id: string,
    updateSaleDto: UpdateSaleDto,
  ): Promise<Sale> {
    const existingSale = await this.prisma.sale.findFirst({
      where: {
        id,
        customer: { userId },
      },
    });

    if (!existingSale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    const data = {
      amount: updateSaleDto.amount,
      ...(updateSaleDto.saleDate && {
        saleDate: new Date(updateSaleDto.saleDate),
      }),
    };

    return this.prisma.sale.update({
      where: { id },
      data,
    });
  }

  async remove(userId: string, id: string): Promise<Sale> {
    const existingSale = await this.prisma.sale.findFirst({
      where: {
        id,
        customer: { userId },
      },
    });

    if (!existingSale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return await this.prisma.sale.delete({
      where: { id },
    });
  }

  async getDailySalesStats(userId: string): Promise<DailySalesStats[]> {
    const sales = await this.prisma.sale.groupBy({
      by: ['saleDate'],
      where: {
        customer: { userId },
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

    return sales.map((sale) => ({
      date: sale.saleDate.toISOString().split('T')[0],
      totalSales: sale._count.id,
      totalAmount: sale._sum.amount || 0,
    }));
  }

  async getTopCustomers(userId: string): Promise<TopCustomersResponse> {
    const customerStats = await this.prisma.sale.groupBy({
      by: ['customerId'],
      where: {
        customer: { userId },
      },
      _count: {
        id: true,
      },
      _sum: {
        amount: true,
      },
      _avg: {
        amount: true,
      },
    });

    const customerIds = customerStats.map((stat) => stat.customerId);
    const customers = await this.prisma.customer.findMany({
      where: {
        id: { in: customerIds },
        userId,
      },
      select: { id: true, name: true },
    });

    const customerMap = new Map(customers.map((c) => [c.id, c.name]));

    const statsWithDetails = await Promise.all(
      customerStats.map(async (stat) => {
        const customerSaleDates = await this.prisma.sale.groupBy({
          by: ['saleDate'],
          where: {
            customerId: stat.customerId,
            customer: { userId },
          },
        });

        let exclusiveDays = 0;
        for (const dateGroup of customerSaleDates) {
          const salesOnThisDate = await this.prisma.sale.groupBy({
            by: ['customerId'],
            where: {
              saleDate: dateGroup.saleDate,
              customer: { userId },
            },
          });

          if (salesOnThisDate.length === 1) {
            exclusiveDays++;
          }
        }

        return {
          customerId: stat.customerId,
          customerName: customerMap.get(stat.customerId) || 'Unknown',
          totalVolume: stat._sum.amount || 0,
          averageValue: stat._avg.amount || 0,
          totalSales: stat._count.id,
          exclusiveDays,
        };
      }),
    );

    const totalCustomers = await this.prisma.customer.count({
      where: { userId },
    });

    if (statsWithDetails.length === 0) {
      return {
        highestVolume: null,
        highestAverage: null,
        mostFrequent: null,
        totalCustomers,
      };
    }

    const highestVolume = statsWithDetails.reduce((prev, current) =>
      prev.totalVolume > current.totalVolume ? prev : current,
    );

    const highestAverage = statsWithDetails.reduce((prev, current) =>
      prev.averageValue > current.averageValue ? prev : current,
    );

    const mostFrequent = statsWithDetails.reduce((prev, current) =>
      prev.exclusiveDays > current.exclusiveDays ? prev : current,
    );

    return {
      highestVolume,
      highestAverage,
      mostFrequent,
      totalCustomers,
    };
  }
}
