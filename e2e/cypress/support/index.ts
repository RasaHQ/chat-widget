/// <reference types="cypress" />

import { rasaChatbotPropertySettings } from './types';

declare global {
  namespace Cypress {
    interface Chainable {
      userSendMessage(message: string): Chainable<void>;
      setPropertiesAndOpenThePage(
        rasaChatbotPropertySettings?: rasaChatbotPropertySettings[]
      ): Chainable<void>;
      checkUserMessageIsSent(message: string): Chainable<void>;
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
      checkA11yAndReport(context, options?): Chainable<void>;
    }
  }
}
