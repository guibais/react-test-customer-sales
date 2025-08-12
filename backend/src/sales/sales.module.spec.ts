import { Test, TestingModule } from '@nestjs/testing';
import { SalesModule } from './sales.module';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { PrismaService } from '../database/prisma.service';

describe('SalesModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [SalesModule],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  describe('Module Compilation', () => {
    it('should compile the module', () => {
      expect(module).toBeDefined();
    });

    it('should provide SalesService', () => {
      const service = module.get<SalesService>(SalesService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(SalesService);
    });

    it('should provide SalesController', () => {
      const controller = module.get<SalesController>(SalesController);
      expect(controller).toBeDefined();
      expect(controller).toBeInstanceOf(SalesController);
    });

    it('should provide PrismaService', () => {
      const service = module.get<PrismaService>(PrismaService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(PrismaService);
    });
  });

  describe('Dependencies Injection', () => {
    it('should inject dependencies correctly in SalesService', () => {
      const service = module.get<SalesService>(SalesService);
      expect(service).toBeDefined();
    });

    it('should inject SalesService in SalesController', () => {
      const controller = module.get<SalesController>(SalesController);
      expect(controller).toBeDefined();
    });
  });
});
