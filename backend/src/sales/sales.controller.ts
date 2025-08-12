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
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto, UpdateSaleDto, SaleFiltersDto } from '../dto/sale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  findAll(@Query() filters: SaleFiltersDto) {
    return this.salesService.findAll(filters);
  }

  @Get('stats/daily')
  getDailySalesStats() {
    return this.salesService.getDailySalesStats();
  }

  @Get('stats/top-customers')
  getTopCustomers() {
    return this.salesService.getTopCustomers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto,
  ) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
