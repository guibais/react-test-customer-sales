# CI/CD Pipeline

Este projeto utiliza GitHub Actions para automação de testes e deploy.

## Workflows Configurados

### 1. **CI/CD Pipeline** (`ci.yml`)
- **Trigger**: Push/PR para `main` e `develop`
- **Jobs**:
  - **Backend Tests**: Testes unitários, integração e E2E
  - **Frontend Tests**: Testes e build do frontend
  - **Quality Checks**: Auditoria de segurança
  - **Deploy**: Deploy automático (apenas main)

### 2. **Coverage Report** (`coverage.yml`)
- **Trigger**: Push/PR para `main`
- **Objetivo**: Validar 100% de cobertura de statements
- **Features**:
  - Badge de cobertura automática
  - Comentários em PRs com relatório
  - Threshold de cobertura obrigatório

### 3. **PR Checks** (`pr-checks.yml`)
- **Trigger**: PRs para `main` e `develop`
- **Validações**:
  - ✅ Linting
  - ✅ Type checking
  - ✅ 100% cobertura obrigatória
  - ✅ Todos os testes passando

## Requisitos de Cobertura

- **Statements**: 100% (obrigatório)
- **Branches**: 90% (mínimo)
- **Functions**: 100% (obrigatório)
- **Lines**: 100% (obrigatório)

## Configuração do Ambiente

### Variáveis de Ambiente (CI)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/test_db
JWT_SECRET=test-jwt-secret-key-for-ci
JWT_EXPIRES_IN=1h
NODE_ENV=test
```

### Serviços
- **PostgreSQL 15**: Database para testes
- **Node.js**: Versões 18.x e 20.x (matrix)

## Como Funciona

1. **Push/PR**: Workflow é acionado automaticamente
2. **Setup**: Instala dependências e configura ambiente
3. **Database**: Configura PostgreSQL e executa migrations
4. **Tests**: Executa todos os testes com cobertura
5. **Quality**: Verifica linting, tipos e segurança
6. **Coverage**: Valida 100% de cobertura obrigatória
7. **Deploy**: Deploy automático se tudo passar (main apenas)

## Status Badges

Adicione ao README principal:

```markdown
![CI/CD](https://github.com/seu-usuario/teste-tecnico/workflows/CI/CD%20Pipeline/badge.svg)
![Coverage](https://github.com/seu-usuario/teste-tecnico/workflows/Coverage%20Report/badge.svg)
```

## Comandos Locais

```bash
# Backend
cd backend
npm run test:cov    # Testes com cobertura
npm run lint        # Linting
npm run test:e2e    # Testes E2E

# Frontend
cd frontend
npm test            # Testes
npm run lint        # Linting
npm run build       # Build
```

## Falhas Comuns

- **Cobertura < 100%**: PR será rejeitado
- **Testes falhando**: Pipeline para
- **Lint errors**: Build falha
- **Security vulnerabilities**: Deploy bloqueado
