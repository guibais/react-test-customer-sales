/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<Element>;
      createTestUser(userData: TestUser): Chainable<Element>;
      clearTestData(): Chainable<Element>;
      getAuthToken(): Chainable<string>;
    }
  }
}

type TestUser = {
  email: string;
  password: string;
  name?: string;
};

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/login");
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

Cypress.Commands.add("createTestUser", (userData: TestUser) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("BACKEND_URL")}/auth/register`,
    body: {
      email: userData.email,
      password: userData.password,
      name: userData.name || "Test User",
    },
  });
});

Cypress.Commands.add("clearTestData", () => {
  cy.request({
    method: "DELETE",
    url: `${Cypress.env("BACKEND_URL")}/test/cleanup`,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("getAuthToken", () => {
  return cy
    .request({
      method: "POST",
      url: `${Cypress.env("BACKEND_URL")}/auth/login`,
      body: {
        email: "test@example.com",
        password: "password123",
      },
    })
    .then((response) => {
      return response.body.access_token;
    });
});
