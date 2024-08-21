import { chatbotWidgetPage } from '@rasa-cypress-POM/chatbotWidgetPOM';
import {
  userInputs,
  widgetProps,
} from '@rasa-cypress-fixtures/chatbotWidgetData';

describe('Property Settings for Chatbot Widget test suite', () => {
  const mockedServerUrl = Cypress.env('mockedServerUrl');

  afterEach(() => {
    cy.resetWsMessages(mockedServerUrl);
  });

  it('TC014 - When auto-open property set, widget is opened automatically', () => {
    cy.setPropertiesAndOpenThePage([
      { key: 'server-url', value: mockedServerUrl },
      widgetProps.autoOpen,
    ]);

    chatbotWidgetPage.rasaChatbotWidget.should('have.attr', 'auto-open');

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetHeader
      .get('span')
      .should('contain.text', 'Rasa Widget');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');
  });

  it('TC015 - Required prop not set', () => {
    //TODO Investigate if it is possible to capture browsers console log message when required prop is not set and if it is available in headless mode
    cy.visit('/');

    chatbotWidgetPage.widgetLauncher.should('not.exist');
  });

  it('TC016 - Change bot-icon property', () => {
    cy.setPropertiesAndOpenThePage([
      { key: 'server-url', value: mockedServerUrl },
      widgetProps.botIcon,
    ]);

    chatbotWidgetPage.rasaChatbotWidget.should('have.attr', 'bot-icon');

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetHeader
      .get('span')
      .should('contain.text', 'Rasa Widget');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');

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

    chatbotWidgetPage.botChatIcon
      .should('be.visible')
      .and('have.attr', 'src', widgetProps.botIcon.value);

    chatbotWidgetPage.botChatIcon.matchImage({
      title: 'botChatIcon',
    });
  });

  it('TC017 - Change widget-icon property', () => {
    cy.setPropertiesAndOpenThePage([
      { key: 'server-url', value: mockedServerUrl },
      widgetProps.widgetIcon,
    ]);

    chatbotWidgetPage.rasaChatbotWidget.should('have.attr', 'widget-icon');

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncherImage
      .should('be.visible')
      .and('have.attr', 'src', widgetProps.widgetIcon.value);

    chatbotWidgetPage.widgetLauncherImage.matchImage({
      title: 'widgetLauncherImage',
    });
  });

  it('TC018 - Change chat widget title property', () => {
    cy.setPropertiesAndOpenThePage([
      { key: 'server-url', value: mockedServerUrl },
      widgetProps.widgetTitle,
    ]);

    chatbotWidgetPage.rasaChatbotWidget.should('have.attr', 'widget-title');

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetHeader
      .get('span')
      .should('contain.text', widgetProps.widgetTitle.value);

    chatbotWidgetPage.widgetHeader.matchImage({
      title: 'chatWidgetHeader',
    });
  });

  it('TC019 - Change input field message placeholder', () => {
    cy.setPropertiesAndOpenThePage([
      { key: 'server-url', value: mockedServerUrl },
      widgetProps.inputMessagePlaceholder,
    ]);

    chatbotWidgetPage.rasaChatbotWidget.should(
      'have.attr',
      'input-message-placeholder'
    );

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetInputField
      .should('be.visible')
      .and(
        'have.attr',
        'placeholder',
        widgetProps.inputMessagePlaceholder.value
      );
  });

  it('TC020 - Display message timestamp property', () => {
    cy.setPropertiesAndOpenThePage([
      { key: 'server-url', value: mockedServerUrl },
      widgetProps.displayTimestamp,
    ]);

    chatbotWidgetPage.rasaChatbotWidget.should(
      'have.attr',
      'display-timestamp'
    );

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');

    cy.userSendMessage(userInputs.textMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    chatbotWidgetPage.widgetSessionDivider.should('be.visible');

    cy.checkUserMessageIsSent(userInputs.textMessage);

    chatbotWidgetPage.messageTimestamp.should('be.visible');

    chatbotWidgetPage.messageTimestamp.contains(
      /\b(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{4}),\s(\d{1,2}):(\d{2}):(\d{2})\s(AM|PM)\b/
    );

    chatbotWidgetPage.botChatTextMessage.should('be.visible');

    chatbotWidgetPage.botChatTextMessage
      .get('span')
      .should(
        'contain.text',
        "I understand you want to be connected to a human agent, but that's something I cannot help you with at the moment. Is there something else I can help you with?"
      );

    chatbotWidgetPage.messageTimestamp
      .eq(1)
      .contains(
        /\b(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{4}),\s(\d{1,2}):(\d{2}):(\d{2})\s(AM|PM)\b/
      );
  });
});
