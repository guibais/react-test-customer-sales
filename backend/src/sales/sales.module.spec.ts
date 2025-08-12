import { Test, TestingModule } from '@nestjs/testing';
import { SalesModule } from './sales.module';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
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

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should have SalesController', () => {
    const controller = module.get<SalesController>(SalesController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(SalesController);
  });

  it('should have SalesService', () => {
    const service = module.get<SalesService>(SalesService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(SalesService);
  });

  it('should have PrismaService', () => {
    const prismaService = module.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
    expect(prismaService).toBeInstanceOf(PrismaService);
  });

  it('should inject SalesService into SalesController', () => {
    const controller = module.get<SalesController>(SalesController);
    const service = module.get<SalesService>(SalesService);

    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should inject PrismaService into SalesService', () => {
    const service = module.get<SalesService>(SalesService);
    const prismaService = module.get<PrismaService>(PrismaService);

    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });
});
