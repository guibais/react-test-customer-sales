type ErrorTranslations = {
  [key: string]: string;
};

const errorTranslations: ErrorTranslations = {
  // Auth errors
  'Invalid credentials': 'Credenciais inválidas',
  'User not found': 'Usuário não encontrado',
  'Email already exists': 'Este email já está sendo usado',
  'Este email já está sendo usado por outro usuário': 'Este email já está sendo usado',
  'Password must be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
  'Email is required': 'Email é obrigatório',
  'Password is required': 'Senha é obrigatória',
  'Name is required': 'Nome é obrigatório',
  'Invalid email format': 'Formato de email inválido',
  'Unauthorized': 'Não autorizado',
  'Access denied': 'Acesso negado',
  
  // Network errors
  'Network Error': 'Erro de conexão. Verifique sua internet.',
  'timeout': 'Tempo limite excedido. Tente novamente.',
  'ECONNREFUSED': 'Não foi possível conectar ao servidor',
  
  // HTTP status codes
  'Request failed with status code 400': 'Dados inválidos fornecidos',
  'Request failed with status code 401': 'Credenciais inválidas',
  'Request failed with status code 403': 'Acesso negado',
  'Request failed with status code 404': 'Recurso não encontrado',
  'Request failed with status code 409': 'Este email já está sendo usado',
  'Request failed with status code 422': 'Dados inválidos',
  'Request failed with status code 429': 'Muitas tentativas. Tente novamente em alguns minutos.',
  'Request failed with status code 500': 'Erro interno do servidor',
  'Request failed with status code 502': 'Servidor indisponível',
  'Request failed with status code 503': 'Serviço temporariamente indisponível',
  
  // Validation errors
  'email must be an email': 'Email deve ter um formato válido',
  'password is too short': 'Senha muito curta',
  'name should not be empty': 'Nome não pode estar vazio',
};

export const translateError = (error: any): string => {
  if (!error) return 'Erro desconhecido';
  
  let errorMessage = '';
  
  // Try different error formats
  if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error.response?.data?.error) {
    errorMessage = error.response.data.error;
  } else if (error.message) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Erro desconhecido';
  }
  
  // Check for exact match first
  if (errorTranslations[errorMessage]) {
    return errorTranslations[errorMessage];
  }
  
  // Check for partial matches (case insensitive)
  const lowerErrorMessage = errorMessage.toLowerCase();
  for (const [key, translation] of Object.entries(errorTranslations)) {
    if (lowerErrorMessage.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerErrorMessage)) {
      return translation;
    }
  }
  
  // If no translation found, return the original message or default
  return errorMessage || 'Erro desconhecido';
};
