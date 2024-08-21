import { chatbotWidgetPage } from '@rasa-cypress-POM/chatbotWidgetPOM';
import { generateMixedString } from '@rasa-cypress-utils/utils';
import { invoke } from 'cypress/types/lodash';

describe('Miscellaneous test cases for Rasa Chat Widget', () => {
  const mockedServerUrl = Cypress.env('mockedServerUrl');

  beforeEach(() => {
    cy.setPropertiesAndOpenThePage([
      { key: 'server-url', value: mockedServerUrl },
    ]);
  });

  afterEach(() => {
    cy.resetWsMessages(mockedServerUrl);
  });

  it('TC012 - User input max number of characters 500', () => {
    const userInputOver500Chars = generateMixedString(501);

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetHeader
      .get('span')
      .should('contain.text', 'Rasa Widget');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');

    cy.userSendMessage(userInputOver500Chars);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    chatbotWidgetPage.widgetSessionDivider.should('be.visible');

    cy.get('chat-message')
      .find('span.text')
      .invoke('text')
      .then((text) => {
        expect(text.length).to.eq(500);
      });
  });
});
