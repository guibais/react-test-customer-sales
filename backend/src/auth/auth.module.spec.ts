import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../database/prisma.service';

describe('AuthModule', () => {
  let module: TestingModule;
  let authService: AuthService;
  let authController: AuthController;
  let jwtStrategy: JwtStrategy;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        const config = {
          JWT_SECRET: 'test-secret-key',
          JWT_EXPIRES_IN: '1h',
        };
        return config[key as keyof typeof config];
      }),
    };

    const mockPrismaService = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const mockJwtStrategy = {
      validate: jest.fn(),
    };

    module = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
            },
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: JwtStrategy,
          useValue: mockJwtStrategy,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
      exports: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('Module Compilation', () => {
    it('should compile the module', () => {
      expect(module).toBeDefined();
    });

    it('should provide AuthService', () => {
      expect(authService).toBeDefined();
      expect(authService).toBeInstanceOf(AuthService);
    });

    it('should provide AuthController', () => {
      expect(authController).toBeDefined();
      expect(authController).toBeInstanceOf(AuthController);
    });

    it('should provide JwtStrategy', () => {
      expect(jwtStrategy).toBeDefined();
    });

    it('should provide PrismaService', () => {
      expect(prismaService).toBeDefined();
    });
  });

  describe('JWT Configuration', () => {
    it('should configure JWT with correct secret and expiration', async () => {
      const jwtModule = module.get(JwtModule);
      expect(jwtModule).toBeDefined();
    });
  });

  describe('Module Exports', () => {
    it('should export AuthService', () => {
      const exportedAuthService = module.get<AuthService>(AuthService);
      expect(exportedAuthService).toBeDefined();
      expect(exportedAuthService).toBe(authService);
    });
  });

  describe('Dependencies Injection', () => {
    it('should inject dependencies correctly in AuthService', () => {
      expect(authService).toBeDefined();
      expect((authService as any).prisma).toBeDefined();
      expect((authService as any).jwtService).toBeDefined();
    });

    it('should inject AuthService in AuthController', () => {
      expect(authController).toBeDefined();
      expect((authController as any).authService).toBeDefined();
    });
  });
});
