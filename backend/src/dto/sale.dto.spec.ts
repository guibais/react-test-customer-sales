import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateSaleDto, UpdateSaleDto, SaleFiltersDto } from './sale.dto';

describe('Sale DTOs', () => {
  describe('CreateSaleDto', () => {
    it('should validate valid sale data', async () => {
      const dto = new CreateSaleDto();
      dto.customerId = 'customer-123';
      dto.amount = 100.5;
      dto.saleDate = '2024-01-15';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty customerId', async () => {
      const dto = new CreateSaleDto();
      dto.customerId = '';
      dto.amount = 100.5;
      dto.saleDate = '2024-01-15';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('customerId');
    });

    it('should fail validation with negative amount', async () => {
      const dto = new CreateSaleDto();
      dto.customerId = 'customer-123';
      dto.amount = -10;
      dto.saleDate = '2024-01-15';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('amount');
    });

    it('should fail validation with invalid date format', async () => {
      const dto = new CreateSaleDto();
      dto.customerId = 'customer-123';
      dto.amount = 100.5;
      dto.saleDate = 'invalid-date';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('saleDate');
    });
  });

  describe('UpdateSaleDto', () => {
    it('should validate valid update data', async () => {
      const dto = new UpdateSaleDto();
      dto.amount = 150.75;
      dto.saleDate = '2024-02-20';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with all fields empty', async () => {
      const dto = new UpdateSaleDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with negative amount', async () => {
      const dto = new UpdateSaleDto();
      dto.amount = -5;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('amount');
    });

    it('should fail validation with invalid date format', async () => {
      const dto = new UpdateSaleDto();
      dto.saleDate = 'invalid-date';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('saleDate');
    });
  });

  describe('SaleFiltersDto', () => {
    it('should pass validation with valid optional filters', async () => {
      const dto = plainToClass(SaleFiltersDto, {
        customerId: '123',
        page: 1,
        limit: 10,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
      expect(dto.customerId).toBe('123');
      expect(dto.page).toBe(1);
      expect(dto.limit).toBe(10);
    });

    it('should pass validation with empty object', async () => {
      const dto = plainToClass(SaleFiltersDto, {});

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
      expect(dto.customerId).toBeUndefined();
      expect(dto.page).toBeUndefined();
      expect(dto.limit).toBeUndefined();
    });

    it('should transform string numbers to integers for page and limit', async () => {
      const dto = plainToClass(SaleFiltersDto, {
        page: '5',
        limit: '20',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
      expect(dto.page).toBe(5);
      expect(dto.limit).toBe(20);
      expect(typeof dto.page).toBe('number');
      expect(typeof dto.limit).toBe('number');
    });

    it('should handle undefined and null values in transform', async () => {
      const dto = plainToClass(SaleFiltersDto, {
        page: undefined,
        limit: null,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
      expect(dto.page).toBeUndefined();
      expect(dto.limit).toBeUndefined();
    });

    it('should fail validation with invalid page type', async () => {
      const dto = plainToClass(SaleFiltersDto, {
        page: 'invalid',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('page');
    });

    it('should fail validation with invalid limit type', async () => {
      const dto = plainToClass(SaleFiltersDto, {
        limit: 'invalid',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('limit');
    });
  });
});
