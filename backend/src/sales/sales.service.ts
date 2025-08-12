import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateSaleDto, UpdateSaleDto, SaleFiltersDto } from '../dto/sale.dto';
import {
  Sale,
  DailySalesStats,
  CustomerStats,
  TopCustomersResponse,
} from '../types';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: SaleFiltersDto) {
    const { customerId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
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
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
      },
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return sale;
  }

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const data = {
      ...createSaleDto,
      saleDate: new Date(createSaleDto.saleDate),
    };

    return this.prisma.sale.create({ data });
  }

  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const existingSale = await this.prisma.sale.findUnique({
      where: { id },
    });

    if (!existingSale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    const data = {
      ...updateSaleDto,
      ...(updateSaleDto.saleDate && {
        saleDate: new Date(updateSaleDto.saleDate),
      }),
    };

    return this.prisma.sale.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<void> {
    const existingSale = await this.prisma.sale.findUnique({
      where: { id },
    });

    if (!existingSale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    await this.prisma.sale.delete({
      where: { id },
    });
  }

  async getDailySalesStats(): Promise<DailySalesStats[]> {
    const sales = await this.prisma.sale.groupBy({
      by: ['saleDate'],
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

  async getTopCustomers(): Promise<TopCustomersResponse> {
    const customerStats = await this.prisma.sale.groupBy({
      by: ['customerId'],
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

    const statsWithDetails = await Promise.all(
      customerStats.map(async (stat) => {
        const customer = await this.prisma.customer.findUnique({
          where: { id: stat.customerId },
        });

        const uniqueDaysCount = await this.prisma.sale.groupBy({
          by: ['saleDate'],
          where: { customerId: stat.customerId },
          _count: {
            saleDate: true,
          },
        });

        return {
          customerId: stat.customerId,
          customerName: customer?.name || 'Unknown',
          totalVolume: stat._sum.amount || 0,
          averageValue: stat._avg.amount || 0,
          uniqueDays: uniqueDaysCount.length,
        };
      }),
    );

    const totalCustomers = await this.prisma.customer.count();

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
      prev.uniqueDays > current.uniqueDays ? prev : current,
    );

    return {
      highestVolume,
      highestAverage,
      mostFrequent,
      totalCustomers,
    };
  }
}
