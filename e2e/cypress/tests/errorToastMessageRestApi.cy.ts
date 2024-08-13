import { chatbotWidgetPage } from '@rasa-cypress-POM/chatbotWidgetPOM';
import { userInputs } from '@rasa-cypress-fixtures/chatbotWidgetData';
import { response } from 'express';
import { request } from 'https';

describe('Error Toast message on Network Connectivity issues with REST API connection', () => {
  const mockedServerUrl = 'https://pro.vortexwe.com'; // Cypress.env('mockedServerUrl');

  beforeEach(() => {
    cy.visit('http://localhost:3333', {
      onBeforeLoad() {
        cy.document().then((document) => {
          document
            .getElementsByTagName('rasa-chatbot-widget')[0]
            .setAttribute('server-url', mockedServerUrl);
          document
            .getElementsByTagName('rasa-chatbot-widget')[0]
            .setAttribute('rest-enabled', 'true');
        });
      },
    });
  });

  it('TC008 - Error toast message on Network connectivity issue - REST API', () => {
    cy.intercept('POST', '/webhooks/rest/webhook', {
      forceNetworkError: true,
    }).as('networkIssue');

    cy.fixture('restApiResponses').then((body) => {
      cy.intercept('POST', '/webhooks/rest/webhook', {
        statusCode: 200,
        body: [body],
      }).as('textMessage');
    });

    cy.get('rasa-chatbot-widget').should('have.attr', 'rest-enabled');

    chatbotWidgetPage.widgetLauncher.click();

    // cy.userSendMessage(userInputs.textMessage);

    chatbotWidgetPage.widgetInputField.should('be.visible');
    chatbotWidgetPage.widgetInputField.type(userInputs.textMessage);
    chatbotWidgetPage.widgetSendButton.click();

    cy.wait('@textMessage');
    // chatbotWidgetPage.errorToastMessage.should('be.visible');

    // cy.userSendMessage(userInputs.imageMessage);
    chatbotWidgetPage.widgetInputField.should('be.visible');
    chatbotWidgetPage.widgetInputField.type(userInputs.imageMessage);
    chatbotWidgetPage.widgetSendButton.click();

    cy.wait('@networkIssue');
  });
});
