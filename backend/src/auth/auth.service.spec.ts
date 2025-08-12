import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: any;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 'user-id-123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword123',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  const mockUserWithoutPassword = {
    id: mockUser.id,
    email: mockUser.email,
    name: mockUser.name,
    createdAt: mockUser.createdAt,
    updatedAt: mockUser.updatedAt,
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully register a new user', async () => {
      const hashedPassword = 'hashedPassword123';
      const accessToken = 'jwt-token-123';

      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      prismaService.user.create.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue(accessToken);

      const result = await service.register(registerDto);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...registerDto,
          password: hashedPassword,
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      });
      expect(result).toEqual({
        access_token: accessToken,
        user: mockUserWithoutPassword,
      });
    });

    it('should throw error when user creation fails', async () => {
      const hashedPassword = 'hashedPassword123';
      const dbError = new Error('Database error');

      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      prismaService.user.create.mockRejectedValue(dbError);

      await expect(service.register(registerDto)).rejects.toThrow(dbError);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...registerDto,
          password: hashedPassword,
        },
      });
    });

    it('should throw error when password hashing fails', async () => {
      const hashError = new Error('Hashing error');
      mockedBcrypt.hash.mockRejectedValue(hashError as never);

      await expect(service.register(registerDto)).rejects.toThrow(hashError);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login with valid credentials', async () => {
      const accessToken = 'jwt-token-123';

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue(accessToken);

      const result = await service.login(loginDto);

      expect(service.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      });
      expect(result).toEqual({
        access_token: accessToken,
        user: mockUserWithoutPassword,
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(service.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw error when validateUser fails', async () => {
      const validationError = new Error('Validation error');
      jest.spyOn(service, 'validateUser').mockRejectedValue(validationError);

      await expect(service.login(loginDto)).rejects.toThrow(validationError);
      expect(service.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    const email = 'test@example.com';
    const password = 'password123';

    it('should return user when credentials are valid', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when user does not exist', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.validateUser(email, password);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
      expect(result).toBeNull();
    });

    it('should throw error when database query fails', async () => {
      const dbError = new Error('Database error');
      prismaService.user.findUnique.mockRejectedValue(dbError);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        dbError,
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw error when password comparison fails', async () => {
      const compareError = new Error('Compare error');
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockRejectedValue(compareError as never);
      await expect(service.validateUser(email, password)).rejects.toThrow(
        compareError,
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
    });
  });
});
