import { chatbotWidgetPage } from '@rasa-cypress-POM/chatbotWidgetPOM';
import {
  userInputs,
  widgetProps,
} from '@rasa-cypress-fixtures/chatbotWidgetData';

describe('Error Toast message on Network Connectivity issues with Socket IO connection', () => {
  const mockedServerUrl = Cypress.env('mockedServerUrl');

  beforeEach(() => {
    cy.setPropertiesAndOpenThePage([
      { key: 'server-url', value: mockedServerUrl },
      widgetProps.toggleFullScreen,
    ]);
  });

  afterEach(() => {
    cy.resetWsMessages(mockedServerUrl);
  });

  it('TC010 - Error toast message on Network connectivity issue - Socket IO', () => {
    chatbotWidgetPage.widgetLauncher.click();

    cy.userSendMessage(userInputs.textMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    chatbotWidgetPage.widgetSessionDivider.should('be.visible');

    cy.checkUserMessageIsSent(userInputs.textMessage);

    chatbotWidgetPage.botChatTextMessage.should('be.visible');

    chatbotWidgetPage.botChatTextMessage
      .get('span')
      .should(
        'contain.text',
        "I understand you want to be connected to a human agent, but that's something I cannot help you with at the moment. Is there something else I can help you with?"
      );

    cy.userSendMessage(userInputs.errorConnectionSocketioTest);

    cy.checkUserMessageIsSent(userInputs.errorConnectionSocketioTest);

    chatbotWidgetPage.errorToastMessage.should('be.visible');

    cy.matchImage({
      title: 'errorToastMessageSocketIO',
    });
  });

  it('TC011 - Error toast message on Network connectivity issue - Socket IO - Full screen mode', () => {
    chatbotWidgetPage.rasaChatbotWidget.should(
      'have.attr',
      'toggle-full-screen'
    );

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

    chatbotWidgetPage.botChatTextMessage.should('be.visible');

    chatbotWidgetPage.botChatTextMessage
      .get('span')
      .should(
        'contain.text',
        "I understand you want to be connected to a human agent, but that's something I cannot help you with at the moment. Is there something else I can help you with?"
      );

    cy.userSendMessage(userInputs.errorConnectionSocketioTest);

    cy.checkUserMessageIsSent(userInputs.errorConnectionSocketioTest);

    chatbotWidgetPage.errorToastMessage.should('be.visible');

    cy.matchImage({
      title: 'errorToastMessageSocketIOFullScreen',
    });
  });
});
