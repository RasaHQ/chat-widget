import { chatbotWidgetPage } from '@rasa-cypress-POM/chatbotWidgetPOM';
import {
  userInputs,
  widgetProps,
} from '@rasa-cypress-fixtures/chatbotWidgetData';

describe('Error Toast message on Network Connectivity issues with REST API connection', () => {
  const mockedServerUrl = Cypress.env('mockedServerUrl');

  beforeEach(() => {
    cy.setPropertiesAndOpenThePage([
      { key: 'server-url', value: mockedServerUrl },
      widgetProps.toggleFullScreen,
      widgetProps.restEnabled,
    ]);
  });

  it('TC008 - Error toast message on Network connectivity issue - REST API', () => {
    cy.fixture('restApiResponses').then((resBody) => {
      cy.intercept('POST', '/webhooks/rest/webhook', (req) => {
        const body = JSON.parse(req.body);
        if (body.message === 'Hello') {
          req.alias = 'textMessage';
          req.reply({
            STATUS_CODES: 200,
            body: [resBody],
          });
        } else {
          req.alias = 'networkError';
          req.reply({
            STATUS_CODES: 500,
          });
        }
      }).as('requestInterception');
    });

    chatbotWidgetPage.rasaChatbotWidget.should('have.attr', 'rest-enabled');

    chatbotWidgetPage.widgetLauncher.click();

    cy.userSendMessage(userInputs.textMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    chatbotWidgetPage.widgetSessionDivider.should('be.visible');

    cy.checkUserMessageIsSent(userInputs.textMessage);

    cy.userSendMessage(userInputs.imageMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    chatbotWidgetPage.widgetSessionDivider.should('be.visible');

    cy.checkUserMessageIsSent(userInputs.imageMessage);

    chatbotWidgetPage.errorToastMessage.should('be.visible');

    cy.matchImage({
      title: 'errorToastMessage',
    });
  });

  it('TC009 - Error toast message on Network connectivity issue - REST API - Full screen mode', () => {
    cy.fixture('restApiResponses').then((resBody) => {
      cy.intercept('POST', '/webhooks/rest/webhook', (req) => {
        const body = JSON.parse(req.body);
        if (body.message === 'Hello') {
          req.alias = 'textMessage';
          req.reply({
            STATUS_CODES: 200,
            body: [resBody],
          });
        } else {
          req.alias = 'networkError';
          req.reply({
            STATUS_CODES: 500,
          });
        }
      }).as('requestInterception');
    });

    chatbotWidgetPage.rasaChatbotWidget.should(
      'have.attr',
      'toggle-full-screen'
    );

    chatbotWidgetPage.rasaChatbotWidget.should('have.attr', 'rest-enabled');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.toggleFullScreen.should('be.visible');

    chatbotWidgetPage.toggleFullScreen.click();

    chatbotWidgetPage.widgetOpened.should(
      'have.class',
      'messenger--fullscreen'
    );

    cy.userSendMessage(userInputs.textMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    chatbotWidgetPage.widgetSessionDivider.should('be.visible');

    cy.checkUserMessageIsSent(userInputs.textMessage);

    cy.userSendMessage(userInputs.imageMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    chatbotWidgetPage.widgetSessionDivider.should('be.visible');

    cy.checkUserMessageIsSent(userInputs.imageMessage);

    chatbotWidgetPage.errorToastMessage.should('be.visible');

    cy.matchImage({
      title: 'errorToastMessageFullScreen',
    });
  });
});
