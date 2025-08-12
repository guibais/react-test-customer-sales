import { validate } from 'class-validator';
import { LoginDto, RegisterDto } from './auth.dto';

describe('Auth DTOs', () => {
  describe('LoginDto', () => {
    it('should validate valid login data', async () => {
      const dto = new LoginDto();
      dto.email = 'test@example.com';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      const dto = new LoginDto();
      dto.email = 'invalid-email';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with empty email', async () => {
      const dto = new LoginDto();
      dto.email = '';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with empty password', async () => {
      const dto = new LoginDto();
      dto.email = 'test@example.com';
      dto.password = '';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
    });
  });

  describe('RegisterDto', () => {
    it('should validate valid register data', async () => {
      const dto = new RegisterDto();
      dto.name = 'Test User';
      dto.email = 'test@example.com';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty name', async () => {
      const dto = new RegisterDto();
      dto.name = '';
      dto.email = 'test@example.com';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation with invalid email', async () => {
      const dto = new RegisterDto();
      dto.name = 'Test User';
      dto.email = 'invalid-email';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with short password', async () => {
      const dto = new RegisterDto();
      dto.name = 'Test User';
      dto.email = 'test@example.com';
      dto.password = '123';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
    });

    it('should fail validation with empty password', async () => {
      const dto = new RegisterDto();
      dto.name = 'Test User';
      dto.email = 'test@example.com';
      dto.password = '';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
    });
  });
});
