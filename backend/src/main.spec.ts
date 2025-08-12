import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { bootstrap } from './main';

jest.mock('@nestjs/core');

describe('Main Bootstrap', () => {
  let mockApp: any;

  beforeEach(() => {
    mockApp = {
      useGlobalPipes: jest.fn(),
      enableCors: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
    delete process.env.PORT;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create NestJS application with AppModule', async () => {
    await bootstrap();
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
  });

  it('should configure global validation pipe', async () => {
    await bootstrap();
    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
      expect.any(ValidationPipe),
    );
  });

  it('should enable CORS', async () => {
    await bootstrap();
    expect(mockApp.enableCors).toHaveBeenCalled();
  });

  it('should listen on default port 9198', async () => {
    await bootstrap();
    expect(mockApp.listen).toHaveBeenCalledWith(9198);
  });

  it('should listen on PORT env var when set', async () => {
    process.env.PORT = '3000';
    await bootstrap();
    expect(mockApp.listen).toHaveBeenCalledWith('3000');
  });

  it('should configure ValidationPipe with correct options', async () => {
    await bootstrap();
    const validationPipe = mockApp.useGlobalPipes.mock.calls[0][0];
    expect(validationPipe).toBeInstanceOf(ValidationPipe);
  });

  it('should handle bootstrap errors', async () => {
    const error = new Error('Bootstrap failed');
    (NestFactory.create as jest.Mock).mockRejectedValue(error);

    try {
      await bootstrap();
    } catch (e) {
      expect(e).toBe(error);
    }
  });

  it('should handle error logging and process exit', () => {
    const error = new Error('Bootstrap failed');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation();

    console.error('Application failed to start:', error);
    process.exit(1);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Application failed to start:',
      error,
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);

    consoleSpy.mockRestore();
    processExitSpy.mockRestore();
  });
});
