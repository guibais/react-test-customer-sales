import { validate } from 'class-validator';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerFiltersDto,
} from './customer.dto';

describe('Customer DTOs', () => {
  describe('CreateCustomerDto', () => {
    it('should validate valid customer data', async () => {
      const dto = new CreateCustomerDto();
      dto.name = 'Test Customer';
      dto.email = 'test@example.com';
      dto.phone = '123456789';
      dto.address = 'Test Address';
      dto.birthDate = '1990-01-01';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with optional fields empty', async () => {
      const dto = new CreateCustomerDto();
      dto.name = 'Test Customer';
      dto.email = 'test@example.com';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty name', async () => {
      const dto = new CreateCustomerDto();
      dto.name = '';
      dto.email = 'test@example.com';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation with invalid email', async () => {
      const dto = new CreateCustomerDto();
      dto.name = 'Test Customer';
      dto.email = 'invalid-email';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with invalid date format', async () => {
      const dto = new CreateCustomerDto();
      dto.name = 'Test Customer';
      dto.email = 'test@example.com';
      dto.birthDate = 'invalid-date';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('birthDate');
    });
  });

  describe('UpdateCustomerDto', () => {
    it('should validate valid update data', async () => {
      const dto = new UpdateCustomerDto();
      dto.name = 'Updated Customer';
      dto.email = 'updated@example.com';
      dto.phone = '987654321';
      dto.address = 'Updated Address';
      dto.birthDate = '1985-05-15';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with all fields empty', async () => {
      const dto = new UpdateCustomerDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      const dto = new UpdateCustomerDto();
      dto.email = 'invalid-email';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with invalid date format', async () => {
      const dto = new UpdateCustomerDto();
      dto.birthDate = 'invalid-date';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('birthDate');
    });
  });

  describe('CustomerFiltersDto', () => {
    it('should validate valid filters', async () => {
      const dto = new CustomerFiltersDto();
      dto.name = 'Test';
      dto.email = 'test@example.com';
      dto.page = 1;
      dto.limit = 10;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with all fields empty', async () => {
      const dto = new CustomerFiltersDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should have default page value', () => {
      const dto = new CustomerFiltersDto();
      expect(dto.page).toBe(1);
    });

    it('should have default limit value', () => {
      const dto = new CustomerFiltersDto();
      expect(dto.limit).toBe(10);
    });
  });
});
