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
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerFiltersDto,
} from '../dto/customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  async findAll(@Query() filters: CustomerFiltersDto) {
    const result = await this.customersService.findAll(filters);

    const transformedData = {
      data: {
        clientes: result.customers.map((customer) => ({
          id: customer.id,
          info: {
            nomeCompleto: customer.name,
            detalhes: {
              email: customer.email,
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
          ...(Math.random() > 0.5 && {
            duplicado: {
              nomeCompleto: customer.name,
            },
          }),
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
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
