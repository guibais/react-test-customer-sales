import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerFiltersDto,
} from '../dto/customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthRequest } from '../types/auth.types';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(
    @Request() req: AuthRequest,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    return this.customersService.create(req.user.id, createCustomerDto);
  }

  @Get()
  async findAll(
    @Request() req: AuthRequest,
    @Query() filters: CustomerFiltersDto,
  ) {
    const result = await this.customersService.findAll(req.user.id, filters);

    const transformedData = {
      data: {
        clientes: result.customers.map((customer, index) => ({
          info: {
            nomeCompleto: customer.name,
            detalhes: {
              email: customer.email,
              telefone: customer.phone,
              endereco: customer.address,
              nascimento:
                customer.birthDate?.toISOString().split('T')[0] || null,
            },
          },
          estatisticas: {
            vendas:
              customer.sales?.map((sale: any) => ({
                data: sale.saleDate.toISOString().split('T')[0],
                valor: sale.amount,
              })) || [],
          },
          ...(index % 2 === 1 && {
            duplicado: {
              nomeCompleto: customer.name,
            },
          }),
          id: customer.id,
        })),
      },
      meta: {
        registroTotal: result.pagination.total,
        pagina: result.pagination.page,
      },
      redundante: {
        status: 'ok',
      },
    };

    return transformedData;
  }

  @Get(':id')
  findOne(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.customersService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(req.user.id, id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.customersService.remove(req.user.id, id);
  }
}
