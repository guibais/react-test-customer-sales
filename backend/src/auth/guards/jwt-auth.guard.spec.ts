import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with jwt strategy', () => {
    expect(guard).toBeInstanceOf(JwtAuthGuard);
    expect(guard.constructor.name).toBe('JwtAuthGuard');
  });

  it('should call canActivate method', async () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Bearer valid-token',
          },
        }),
      }),
    } as unknown as ExecutionContext;

    const canActivateSpy = jest
      .spyOn(guard, 'canActivate')
      .mockResolvedValue(true);

    const result = await guard.canActivate(mockContext);

    expect(canActivateSpy).toHaveBeenCalledWith(mockContext);
    expect(result).toBe(true);
  });

  it('should handle canActivate rejection', async () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
        }),
      }),
    } as unknown as ExecutionContext;

    const canActivateSpy = jest
      .spyOn(guard, 'canActivate')
      .mockRejectedValue(new Error('Unauthorized'));

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      'Unauthorized',
    );
    expect(canActivateSpy).toHaveBeenCalledWith(mockContext);
  });

  it('should return false when canActivate returns false', async () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Bearer invalid-token',
          },
        }),
      }),
    } as unknown as ExecutionContext;

    const canActivateSpy = jest
      .spyOn(guard, 'canActivate')
      .mockResolvedValue(false);

    const result = await guard.canActivate(mockContext);

    expect(canActivateSpy).toHaveBeenCalledWith(mockContext);
    expect(result).toBe(false);
  });
});
