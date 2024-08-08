/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    userSendMessage(message: string): Chainable<void>;
    resetWsMessages(): Chainable<void>;
    overrideWsOptions(options: Object): Chainable<void>;
  }
}
