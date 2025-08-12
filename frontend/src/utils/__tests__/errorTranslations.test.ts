import { translateError } from '../errorTranslations';

describe('translateError', () => {
  it('should translate exact error messages', () => {
    expect(translateError({ message: 'Invalid credentials' })).toBe('Credenciais inválidas');
    expect(translateError({ message: 'Email already exists' })).toBe('Este email já está sendo usado');
  });

  it('should handle response data format', () => {
    const error = {
      response: {
        data: {
          message: 'Invalid credentials'
        }
      }
    };
    expect(translateError(error)).toBe('Credenciais inválidas');
  });

  it('should handle HTTP status code errors', () => {
    expect(translateError({ message: 'Request failed with status code 401' })).toBe('Credenciais inválidas');
    expect(translateError({ message: 'Request failed with status code 409' })).toBe('Este email já está sendo usado');
  });

  it('should handle partial matches', () => {
    expect(translateError({ message: 'network error occurred' })).toBe('Erro de conexão. Verifique sua internet.');
  });

  it('should return original message if no translation found', () => {
    expect(translateError({ message: 'Some unknown error' })).toBe('Some unknown error');
  });

  it('should handle null/undefined errors', () => {
    expect(translateError(null)).toBe('Erro desconhecido');
    expect(translateError(undefined)).toBe('Erro desconhecido');
  });

  it('should handle string errors', () => {
    expect(translateError('Invalid credentials')).toBe('Credenciais inválidas');
  });
});
