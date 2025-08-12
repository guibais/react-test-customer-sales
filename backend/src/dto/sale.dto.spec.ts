import { validate } from 'class-validator';
import { CreateSaleDto, UpdateSaleDto, SaleFiltersDto } from './sale.dto';

describe('Sale DTOs', () => {
  describe('CreateSaleDto', () => {
    it('should validate valid sale data', async () => {
      const dto = new CreateSaleDto();
      dto.customerId = 'customer-123';
      dto.amount = 100.50;
      dto.saleDate = '2024-01-15';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty customerId', async () => {
      const dto = new CreateSaleDto();
      dto.customerId = '';
      dto.amount = 100.50;
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
      dto.amount = 100.50;
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
    it('should validate valid filters', async () => {
      const dto = new SaleFiltersDto();
      dto.customerId = 'customer-123';
      dto.page = 1;
      dto.limit = 10;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with all fields empty', async () => {
      const dto = new SaleFiltersDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should transform string page to number', () => {
      const dto = new SaleFiltersDto();
      expect(dto.page).toBeUndefined();
    });

    it('should transform string limit to number', () => {
      const dto = new SaleFiltersDto();
      expect(dto.limit).toBeUndefined();
    });
  });
});
