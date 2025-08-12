import { Test, TestingModule } from '@nestjs/testing';
import { CustomersModule } from './customers.module';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { PrismaService } from '../database/prisma.service';

describe('CustomersModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CustomersModule],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  describe('Module Compilation', () => {
    it('should compile the module', () => {
      expect(module).toBeDefined();
    });

    it('should provide CustomersService', () => {
      const service = module.get<CustomersService>(CustomersService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(CustomersService);
    });

    it('should provide CustomersController', () => {
      const controller = module.get<CustomersController>(CustomersController);
      expect(controller).toBeDefined();
      expect(controller).toBeInstanceOf(CustomersController);
    });

    it('should provide PrismaService', () => {
      const service = module.get<PrismaService>(PrismaService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(PrismaService);
    });
  });

  describe('Dependencies Injection', () => {
    it('should inject dependencies correctly in CustomersService', () => {
      const service = module.get<CustomersService>(CustomersService);
      expect(service).toBeDefined();
    });

    it('should inject CustomersService in CustomersController', () => {
      const controller = module.get<CustomersController>(CustomersController);
      expect(controller).toBeDefined();
    });
  });
});
