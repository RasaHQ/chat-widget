/// <reference types="cypress" />

import { chatbotWidgetPage } from '@rasa-cypress-POM/chatbotWidgetPOM';
import { addCommands } from 'cypress/plugins/mockSocketIO/commands';
import { rasaChatbotPropertySettings } from './types';
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
/**
 * Command sends user message in the widget
 * @param message: string
 * @example
 * cy.userSendMessage('test message')
 */
Cypress.Commands.add('userSendMessage', (message: string) => {
  chatbotWidgetPage.widgetInputField.should('be.visible');
  chatbotWidgetPage.widgetInputField.type(message);
  chatbotWidgetPage.widgetSendButton.wait(2000).click();
});

/**
 * Check if User message has been sent and visible in the session window
 * @param message: string
 * @example
 * cy.checkUserMessageIsSent(userInputs.textMessage)
 */
Cypress.Commands.add('checkUserMessageIsSent', (message: string) => {
  chatbotWidgetPage.userChatMessage.get('span').should('contain.text', message);
});

/**
 * Visit a baseUrl page with setting a property if passed as an argument
 * @param rasaChatbotPropertySettings[] Array of key/value pairs, where key is a prop name
 */
Cypress.Commands.add(
  'setPropertiesAndOpenThePage',
  (rasaWidgetProps?: rasaChatbotPropertySettings[]) => {
    if (!rasaWidgetProps || rasaWidgetProps.length === 0) {
      cy.visit('/');
    } else {
      cy.visit('/', {
        onBeforeLoad() {
          cy.document().then((document) => {
            for (const rasaProp of rasaWidgetProps) {
              document
                .getElementsByTagName('rasa-chatbot-widget')[0]
                .setAttribute(rasaProp.key, rasaProp.value);
              console.log(rasaProp.key);
              console.log(rasaProp.value);
            }
          });
        },
      });
    }
  }
);

addCommands();

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
