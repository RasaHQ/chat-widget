/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    userSendMessage(message: string): Chainable<void>;
  }
}
