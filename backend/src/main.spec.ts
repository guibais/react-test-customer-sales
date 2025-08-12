const mockApp = {
  useGlobalPipes: jest.fn(),
  enableCors: jest.fn(),
  listen: jest.fn().mockResolvedValue(undefined),
};

const mockCreate = jest.fn().mockResolvedValue(mockApp);
const mockValidationPipe = jest.fn();

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: mockCreate,
  },
}));

jest.mock('@nestjs/common', () => ({
  ValidationPipe: mockValidationPipe,
}));

jest.mock('./app.module', () => ({
  AppModule: {},
}));

import { bootstrap } from './main';

describe('Main Bootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.PORT;
  });

  it('should create NestJS application', async () => {
    await bootstrap();

    expect(mockCreate).toHaveBeenCalled();
  });

  it('should configure global validation pipe', async () => {
    await bootstrap();

    expect(mockApp.useGlobalPipes).toHaveBeenCalled();
    expect(mockValidationPipe).toHaveBeenCalledWith({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });
  });

  it('should enable CORS', async () => {
    await bootstrap();

    expect(mockApp.enableCors).toHaveBeenCalled();
  });

  it('should listen on default port 9198 when PORT env is not set', async () => {
    await bootstrap();

    expect(mockApp.listen).toHaveBeenCalledWith(9198);
  });

  it('should listen on PORT env variable when set', async () => {
    process.env.PORT = '3000';

    await bootstrap();

    expect(mockApp.listen).toHaveBeenCalledWith('3000');
  });

  it('should handle bootstrap errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const error = new Error('Bootstrap failed');
    mockCreate.mockRejectedValue(error);

    try {
      await bootstrap();
    } catch (e) {
      expect(e).toBe(error);
    }

    consoleSpy.mockRestore();
  });
});
