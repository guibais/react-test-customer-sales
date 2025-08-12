import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  Min,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

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
  @Transform(({ value }) => (value ? parseInt(value as string) : undefined))
  @IsNumber()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value as string) : undefined))
  @IsNumber()
  limit?: number;
}
