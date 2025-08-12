# 🧸 Toy Store Admin - Sistema de Gestão de Loja de Brinquedos

https://github.com/user-attachments/assets/70967d5f-ebeb-4838-805b-518ed819f5a7

Sistema completo de gestão para loja de brinquedos desenvolvido como desafio técnico. Inclui API REST com autenticação, dashboard interativo e testes automatizados.

## 🚀 Tecnologias

### Backend

- **NestJS** - Framework Node.js
- **Prisma** - ORM para PostgreSQL
- **JWT** - Autenticação
- **Bun** - Runtime JavaScript
- **Jest** - Testes unitários e E2E

### Frontend

- **React 19** - Interface de usuário
- **TanStack Router** - Roteamento type-safe
- **TanStack Query** - Gerenciamento de estado servidor
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos interativos
- **Cypress** - Testes E2E

## 📋 Funcionalidades

### 🔐 Autenticação

- Login/registro com JWT
- Rotas protegidas
- Validação de formulários

### 👥 Gestão de Clientes

- CRUD completo de clientes
- Filtros por nome e email
- Normalização de dados da API
- Campo especial: primeira letra ausente no nome

### 📊 Vendas e Estatísticas

- Registro de vendas por cliente
- Gráfico de vendas diárias
- Top clientes por volume, média e frequência
- Dashboard com métricas em tempo real

### 🧪 Qualidade de Código

- **100% cobertura** de testes no backend
- Testes E2E com Cypress
- CI/CD automatizado
- Princípios DRY, KISS e Clean Code

## 🛠️ Como Executar

### Pré-requisitos

- **Bun** >= 1.0
- **PostgreSQL** >= 14
- **Node.js** >= 18

### Backend

```bash
cd backend

# Instalar dependências
bun install

# Configurar banco de dados
cp .env.example .env
# Editar .env com suas credenciais do PostgreSQL

# Executar migrações
bunx prisma migrate dev

# Iniciar servidor
bun run dev
```

O backend estará disponível em `http://localhost:3001`

### Frontend

```bash
cd frontend

# Instalar dependências
bun install

# Iniciar aplicação
bun run dev
```

O frontend estará disponível em `http://localhost:3000`

## 🧪 Executar Testes

### Backend - Testes Unitários

```bash
cd backend

# Executar todos os testes
bun test

# Testes com cobertura
bun run test:cov

# Testes em modo watch
bun run test:watch
```

### Frontend - Testes E2E (Cypress)

```bash
cd frontend

# Interface visual do Cypress
bun run cypress:open

# Executar testes headless
bun run cypress:run

# Testes específicos de autenticação
bun run test:e2e:direct
```

### Executar Todos os Testes

```bash
# No frontend
bun run test:all
```

## 🔄 CI/CD

Pipeline automatizado com GitHub Actions:

- ✅ **Testes unitários** (backend)
- ✅ **Testes E2E** (Cypress)
- ✅ **Build** e validação
- ✅ **Cobertura de código**
- ✅ **Deploy automático**

## 📁 Estrutura do Projeto

```
├── backend/
│   ├── src/
│   │   ├── auth/          # Autenticação JWT
│   │   ├── customers/     # CRUD de clientes
│   │   ├── sales/         # Gestão de vendas
│   │   └── stats/         # Estatísticas
│   ├── prisma/            # Schema e migrações
│   └── test/              # Testes E2E
├── frontend/
│   ├── src/
│   │   ├── routes/        # Páginas (TanStack Router)
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── services/      # API calls
│   │   └── utils/         # Utilitários
│   └── cypress/           # Testes E2E
└── .github/workflows/     # CI/CD
```

## 🎯 Desafio Técnico

Este projeto foi desenvolvido como resposta a um desafio técnico que avaliou:

- **Domínio de stack** - React, NestJS, Prisma
- **Boas práticas** - Clean Code, testes, CI/CD
- **Raciocínio lógico** - Normalização de dados, algoritmos
- **Estruturação** - Arquitetura modular e escalável

### Destaques da Implementação

- **Normalização de dados** - Tratamento da API desorganizada conforme especificação
- **Campo especial** - Algoritmo para encontrar primeira letra ausente no nome
- **Testes robustos** - 99% cobertura statements no backend
- **UX moderna** - Interface responsiva com Tailwind CSS
- **Performance** - TanStack Query para cache inteligente

## 🚀 Deploy

O sistema está configurado para deploy automático via CI/CD. Basta fazer push para a branch `main`.

---

**Desenvolvido com ❤️ usando as melhores práticas de desenvolvimento**
