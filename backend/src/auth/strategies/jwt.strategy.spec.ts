import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from '../../types';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue('test-secret-key'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(strategy).toBeDefined();
    });

    it('should configure strategy with correct JWT secret', () => {
      expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
    });
  });

  describe('validate', () => {
    it('should return user object from JWT payload', async () => {
      const payload: JwtPayload = {
        sub: 'user-id-123',
        email: 'test@example.com',
        name: 'Test User',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: payload.sub,
        email: payload.email,
        name: payload.name,
      });
    });

    it('should handle different payload values', async () => {
      const payload: JwtPayload = {
        sub: 'different-user-id',
        email: 'different@example.com',
        name: 'Different User',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: 'different-user-id',
        email: 'different@example.com',
        name: 'Different User',
      });
    });

    it('should preserve all payload fields in result', async () => {
      const payload: JwtPayload = {
        sub: 'test-id',
        email: 'test@test.com',
        name: 'Test Name',
      };

      const result = await strategy.validate(payload);

      expect(Object.keys(result)).toEqual(['id', 'email', 'name']);
      expect(result.id).toBe(payload.sub);
      expect(result.email).toBe(payload.email);
      expect(result.name).toBe(payload.name);
    });
  });
});
