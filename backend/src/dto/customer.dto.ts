import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;
}

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;
}

export class CustomerFiltersDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  page?: number = 1;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  limit?: number = 10;
}
