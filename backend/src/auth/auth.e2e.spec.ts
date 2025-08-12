import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth.module';
import { PrismaService } from '../database/prisma.service';
import { ConfigModule } from '@nestjs/config';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const createTestUser = (suffix = '') => ({
    name: `Test User${suffix}`,
    email: `test${suffix}@example.com`,
    password: 'password123',
  });

  const testUser = createTestUser();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await prismaService.user.deleteMany({
      where: { email: { contains: 'test' } },
    });
    await app.close();
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany({
      where: { email: { contains: 'test' } },
    });
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.name).toBe(testUser.name);
      expect(response.body.user).not.toHaveProperty('password');

      const decoded = jwtService.decode(response.body.access_token);
      expect(decoded).toHaveProperty('sub');
      expect(decoded).toHaveProperty('email', testUser.email);
      expect(decoded).toHaveProperty('name', testUser.name);
    });

    it('should return 400 for invalid email format', async () => {
      const invalidUser = {
        ...testUser,
        email: 'invalid-email',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('email must be an email');
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteUser = {
        email: testUser.email,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(incompleteUser)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBe(true);
    });

    it('should return 400 for password too short', async () => {
      const shortPasswordUser = {
        ...testUser,
        password: '123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(shortPasswordUser)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain(
        'password must be longer than or equal to 6 characters',
      );
    });

    it('should return 400 for empty name', async () => {
      const emptyNameUser = {
        ...testUser,
        name: '',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(emptyNameUser)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('name should not be empty');
    });

    it('should return 400 for empty email', async () => {
      const emptyEmailUser = {
        ...testUser,
        email: '',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(emptyEmailUser)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('email should not be empty');
    });

    it('should return 400 for duplicate email registration', async () => {
      const duplicateUser = createTestUser('-duplicate');

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(duplicateUser)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(duplicateUser)
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      await request(app.getHttpServer()).post('/auth/register').send(testUser);
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: testUser.email,
        password: testUser.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.name).toBe(testUser.name);
      expect(response.body.user).not.toHaveProperty('password');

      const decoded = jwtService.decode(response.body.access_token);
      expect(decoded).toHaveProperty('sub');
      expect(decoded).toHaveProperty('email', testUser.email);
    });

    it('should return 401 for invalid email', async () => {
      const invalidLogin = {
        email: 'nonexistent@example.com',
        password: testUser.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLogin)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 401 for invalid password', async () => {
      const invalidLogin = {
        email: testUser.email,
        password: 'wrongpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLogin)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 400 for missing email', async () => {
      const incompleteLogin = {
        password: testUser.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(incompleteLogin)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('email should not be empty');
    });

    it('should return 400 for missing password', async () => {
      const incompleteLogin = {
        email: testUser.email,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(incompleteLogin)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('password should not be empty');
    });

    it('should return 400 for invalid email format', async () => {
      const invalidEmailLogin = {
        email: 'invalid-email-format',
        password: testUser.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidEmailLogin)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('email must be an email');
    });

    it('should return 400 for empty email', async () => {
      const emptyEmailLogin = {
        email: '',
        password: testUser.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(emptyEmailLogin)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('email should not be empty');
    });

    it('should return 400 for empty password', async () => {
      const emptyPasswordLogin = {
        email: testUser.email,
        password: '',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(emptyPasswordLogin)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('password should not be empty');
    });
  });

  describe('JWT Token Validation', () => {
    let validToken: string;

    beforeEach(async () => {
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);

      validToken = registerResponse.body.access_token;
    });

    it('should generate valid JWT tokens', () => {
      expect(validToken).toBeDefined();
      expect(typeof validToken).toBe('string');

      const decoded = jwtService.decode(validToken);
      expect(decoded).toHaveProperty('sub');
      expect(decoded).toHaveProperty('email');
      expect(decoded).toHaveProperty('name');
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
    });

    it('should verify JWT tokens correctly', () => {
      expect(() => jwtService.verify(validToken)).not.toThrow();

      const payload = jwtService.verify(validToken);
      expect(payload).toHaveProperty('sub');
      expect(payload).toHaveProperty('email', testUser.email);
      expect(payload).toHaveProperty('name', testUser.name);
    });
  });
});
