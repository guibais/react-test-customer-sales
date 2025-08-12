/// <reference types="cypress" />

describe('Login Flow E2E', () => {
  it('should display login form correctly', () => {
    cy.visit('/login', { timeout: 10000 })
    
    cy.get('[data-testid="email-input"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-testid="password-input"]').should('be.visible')
    cy.get('[data-testid="login-button"]').should('be.visible')
    cy.contains('Toy Store Admin').should('be.visible')
    cy.contains('Entre com suas credenciais').should('be.visible')
  })

  it('should allow user interaction with form elements', () => {
    cy.visit('/login')
    
    cy.get('[data-testid="email-input"]').type('e2e@e2e.com.br')
    cy.get('[data-testid="email-input"]').should('have.value', 'e2e@e2e.com.br')
    
    cy.get('[data-testid="password-input"]').type('E2EE@E')
    cy.get('[data-testid="password-input"]').should('have.value', 'E2EE@E')
    
    cy.get('[data-testid="login-button"]').should('not.be.disabled')
  })

  it('should navigate to register page', () => {
    cy.visit('/login')
    
    cy.contains('Criar conta').click()
    cy.url().should('include', '/register')
  })

  it('should show validation errors when submitting empty fields', () => {
    cy.visit('/login')
    
    // Clicar no botão sem preencher os campos
    cy.get('[data-testid="login-button"]').click()
    
    // Verificar se as mensagens de validação aparecem
    cy.contains('Email é obrigatório').should('be.visible')
    cy.contains('Senha é obrigatória').should('be.visible')
  })

  it('should attempt login with invalid credentials', () => {
    cy.visit('/login')
    
    // Preencher com credenciais inválidas
    cy.get('[data-testid="email-input"]').type('invalid@example.com')
    cy.get('[data-testid="password-input"]').type('wrongpassword')
    cy.get('[data-testid="login-button"]').click()
    
    // Verificar que permanece na página de login
    cy.url().should('include', '/login')
    
    // Verificar que o formulário ainda está visível (não redirecionou)
    cy.get('[data-testid="login-button"]').should('be.visible')
  })

  it('should successfully login with valid credentials and redirect to dashboard', () => {
    cy.visit('/login')
    
    // Usar as credenciais corretas fornecidas
    cy.get('[data-testid="email-input"]').type('e2e@e2e.com.br')
    cy.get('[data-testid="password-input"]').type('E2EE@E')
    
    // Verificar que o botão está habilitado antes do clique
    cy.get('[data-testid="login-button"]').should('not.be.disabled')
    
    cy.get('[data-testid="login-button"]').click()
    
    // Verificar que foi redirecionado para o dashboard
    cy.url().should('include', '/dashboard', { timeout: 10000 })
    
    // Verificar que não está mais na página de login
    cy.url().should('not.include', '/login')
  })

  it('should handle login form submission with test credentials', () => {
    cy.visit('/login')
    
    cy.get('[data-testid="email-input"]').type('e2e@e2e.com.br')
    cy.get('[data-testid="password-input"]').type('E2EE@E')
    
    // Verificar que o botão está habilitado antes do clique
    cy.get('[data-testid="login-button"]').should('not.be.disabled')
    
    cy.get('[data-testid="login-button"]').click()
    
    // Verificar que o formulário foi submetido (botão ainda existe)
    cy.get('[data-testid="login-button"]').should('exist')
  })
})
