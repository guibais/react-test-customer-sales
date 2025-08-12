import { Test, TestingModule } from '@nestjs/testing';
import { CustomersModule } from './customers.module';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { PrismaService } from '../database/prisma.service';

describe('CustomersModule', () => {
  let module: TestingModule;
  let customersService: CustomersService;
  let customersController: CustomersController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      customer: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    module = await Test.createTestingModule({
      imports: [CustomersModule],
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    customersService = module.get<CustomersService>(CustomersService);
    customersController = module.get<CustomersController>(CustomersController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('Module Compilation', () => {
    it('should compile the module', () => {
      expect(module).toBeDefined();
    });

    it('should provide CustomersService', () => {
      expect(customersService).toBeDefined();
      expect(customersService).toBeInstanceOf(CustomersService);
    });

    it('should provide CustomersController', () => {
      expect(customersController).toBeDefined();
      expect(customersController).toBeInstanceOf(CustomersController);
    });

    it('should provide PrismaService', () => {
      expect(prismaService).toBeDefined();
    });
  });

  describe('Dependencies Injection', () => {
    it('should inject PrismaService in CustomersService', () => {
      expect(customersService).toBeDefined();
      expect((customersService as any).prisma).toBeDefined();
    });

    it('should inject CustomersService in CustomersController', () => {
      expect(customersController).toBeDefined();
      expect((customersController as any).customersService).toBeDefined();
    });
  });

  describe('Module Structure', () => {
    it('should have correct controllers', () => {
      const controllers = Reflect.getMetadata('controllers', CustomersModule);
      expect(controllers).toContain(CustomersController);
    });

    it('should have correct providers', () => {
      const providers = Reflect.getMetadata('providers', CustomersModule);
      expect(providers).toContain(CustomersService);
      expect(providers).toContain(PrismaService);
    });
  });
});
