/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    userSendMessage(message: string): Chainable<void>;
    resetWsMessages(mockedServerURL: string): Chainable<void>;
    overrideWsOptions(
      mockedServerURL: string,
      options: Object
    ): Chainable<void>;
    expectWsMessages(
      mockedServerURL: string,
      expected: Object,
      options: Object
    ): Chainable<Object>;
  }
}
