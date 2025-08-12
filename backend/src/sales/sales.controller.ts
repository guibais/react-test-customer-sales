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
  Request,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto, UpdateSaleDto, SaleFiltersDto } from '../dto/sale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthRequest } from '../types/auth.types';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  findAll(@Request() req: AuthRequest, @Query() filters: SaleFiltersDto) {
    return this.salesService.findAll(req.user.id, filters);
  }

  @Get('stats/daily')
  getDailySalesStats(@Request() req: AuthRequest) {
    return this.salesService.getDailySalesStats(req.user.id);
  }

  @Get('stats/top-customers')
  getTopCustomers(@Request() req: AuthRequest) {
    return this.salesService.getTopCustomers(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.salesService.findOne(req.user.id, id);
  }

  @Post()
  create(@Request() req: AuthRequest, @Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(req.user.id, createSaleDto);
  }

  @Patch(':id')
  update(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto,
  ) {
    return this.salesService.update(req.user.id, id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.salesService.remove(req.user.id, id);
  }
}
