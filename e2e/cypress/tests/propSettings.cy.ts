import { chatbotWidgetPage } from '@rasa-cypress-POM/chatbotWidgetPOM';
import { userInputs } from '@rasa-cypress-fixtures/chatbotWidgetData';

describe('Property Settings for Chatbot Widget test suite', () => {
  const mockedServerUrl = Cypress.env('mockedServerUrl');

  it('TC014 - When auto-open property set, widget is opened automatically', () => {
    cy.setPropertiesAndOpenThePage([
      { key: 'server-url', value: mockedServerUrl },
      { key: 'auto-open', value: 'true' },
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

  it('TC016 - Change bot-icon property', () => {
    cy.setPropertiesAndOpenThePage([
      { key: 'server-url', value: mockedServerUrl },
      {
        key: 'bot-icon',
        value:
          'https://thumbs.dreamstime.com/z/beagle-cute-cartoon-dog-logo-pet-shop-pet-care-animal-logo-pet-shop-pet-care-your-own-dog-beagle-dog-214081813.jpg',
      },
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
      .and(
        'have.attr',
        'src',
        'https://thumbs.dreamstime.com/z/beagle-cute-cartoon-dog-logo-pet-shop-pet-care-animal-logo-pet-shop-pet-care-your-own-dog-beagle-dog-214081813.jpg'
      );

    chatbotWidgetPage.botChatIcon.matchImage({
      title: 'botChatIcon',
    });
  });

  it('TC017 - Change widget-icon property', () => {
    cy.setPropertiesAndOpenThePage([
      { key: 'server-url', value: mockedServerUrl },
      {
        key: 'widget-icon',
        value:
          'https://media.licdn.com/dms/image/D4D0BAQHBFuh4xBFctw/company-logo_200_200/0/1690455513485/vortexwest_logo?e=2147483647&v=beta&t=ZvvBLCPVJ0-aysJgse0Jo-hpQpUlB2Cfa5Z7BodIk5g',
      },
    ]);

    chatbotWidgetPage.rasaChatbotWidget.should('have.attr', 'widget-icon');

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncherImage
      .should('be.visible')
      .and(
        'have.attr',
        'src',
        'https://media.licdn.com/dms/image/D4D0BAQHBFuh4xBFctw/company-logo_200_200/0/1690455513485/vortexwest_logo?e=2147483647&v=beta&t=ZvvBLCPVJ0-aysJgse0Jo-hpQpUlB2Cfa5Z7BodIk5g'
      );

    chatbotWidgetPage.widgetLauncherImage.matchImage({
      title: 'widgetLauncherImage',
    });
  });

  it('TC018 - Change chat widget title property', () => {
    cy.setPropertiesAndOpenThePage([
      { key: 'server-url', value: mockedServerUrl },
      {
        key: 'widget-title',
        value: 'Rasa HQ Chatbot Widget QA automation title',
      },
    ]);

    chatbotWidgetPage.rasaChatbotWidget.should('have.attr', 'widget-title');

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetHeader
      .get('span')
      .should('contain.text', 'Rasa HQ Chatbot Widget QA automation title');

    chatbotWidgetPage.widgetHeader.matchImage({
      title: 'chatWidgetHeader',
    });
  });

  it('TC019 - Change input field message placeholder', () => {
    cy.setPropertiesAndOpenThePage([
      { key: 'server-url', value: mockedServerUrl },
      {
        key: 'input-message-placeholder',
        value: 'Rasa HQ Chatbot Widget QA automation input message placeholder',
      },
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
        'Rasa HQ Chatbot Widget QA automation input message placeholder'
      );
  });

  it('TC020 - Display message timestamp property', () => {
    cy.setPropertiesAndOpenThePage([
      { key: 'server-url', value: mockedServerUrl },
      {
        key: 'display-timestamp',
        value: 'true',
      },
    ]);

    chatbotWidgetPage.rasaChatbotWidget.should(
      'have.attr',
      'display-timestamp'
    );

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
