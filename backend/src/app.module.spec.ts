import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { SalesModule } from './sales/sales.module';
import { PrismaService } from './database/prisma.service';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should compile successfully', () => {
    expect(module).toBeDefined();
  });

  it('should have AppController', () => {
    const controller = module.get<AppController>(AppController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(AppController);
  });

  it('should have AppService', () => {
    const service = module.get<AppService>(AppService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(AppService);
  });

  it('should have PrismaService', () => {
    const service = module.get<PrismaService>(PrismaService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(PrismaService);
  });

  it('should import ConfigModule globally', () => {
    const configModule = module.get(ConfigModule);
    expect(configModule).toBeDefined();
  });

  it('should import AuthModule', async () => {
    const authModule = module.select(AuthModule);
    expect(authModule).toBeDefined();
  });

  it('should import CustomersModule', async () => {
    const customersModule = module.select(CustomersModule);
    expect(customersModule).toBeDefined();
  });

  it('should import SalesModule', async () => {
    const salesModule = module.select(SalesModule);
    expect(salesModule).toBeDefined();
  });

  it('should have correct module structure', () => {
    expect(AppModule).toBeDefined();
    expect(typeof AppModule).toBe('function');
  });

  it('should provide all required services', () => {
    const appService = module.get<AppService>(AppService);
    const prismaService = module.get<PrismaService>(PrismaService);

    expect(appService).toBeDefined();
    expect(prismaService).toBeDefined();
  });
});
