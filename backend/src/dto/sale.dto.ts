import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateSaleDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsDateString()
  saleDate: string;
}

export class UpdateSaleDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsDateString()
  saleDate?: string;
}

export class SaleFiltersDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
