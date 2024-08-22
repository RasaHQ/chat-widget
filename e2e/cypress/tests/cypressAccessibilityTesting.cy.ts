import { chatbotWidgetPage } from '@rasa-cypress-POM/chatbotWidgetPOM';
import {
  userInputs,
  widgetProps,
} from '@rasa-cypress-fixtures/chatbotWidgetData';

describe('Cypress Accessibitlity testing', () => {
  const mockedServerUrl = Cypress.env('mockedServerUrl');
  const options = {
    runOnly: {
      type: 'tag',
      values: ['wcag21a'],
    },
  };

  beforeEach(() => {
    cy.setPropertiesAndOpenThePage([
      { key: 'server-url', value: mockedServerUrl },
    ]);
  });

  afterEach(() => {
    cy.resetWsMessages(mockedServerUrl);
  });

  it('Accessibility testing - Widget Launcher button', () => {
    cy.injectAxe();

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.then((el) => {
      cy.checkA11yAndReport(el, options);
    });
  });

  it('Accessibility testing - Widget Close button', () => {
    cy.injectAxe();

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetCloseButton.should('be.visible');

    chatbotWidgetPage.widgetCloseButton.then((el) => {
      cy.checkA11yAndReport(el, options);
    });
  });

  it('Accessibility testing - Widget header', () => {
    cy.injectAxe();

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetHeader.then((el) => {
      cy.checkA11yAndReport(el, options);
    });
  });

  it('Accessibility testing - Widget Input field', () => {
    cy.injectAxe();

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetInputField.then((el) => {
      cy.checkA11yAndReport(el, options);
    });
  });

  it('Accessibility testing - Session divider', () => {
    cy.injectAxe();

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetSessionDivider.should('be.visible');

    chatbotWidgetPage.widgetOpened.then((el) => {
      cy.checkA11yAndReport(el, options);
    });
  });

  it('Accessibility testing - Widget text messages tooltips', () => {
    cy.injectAxe();

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    cy.userSendMessage(userInputs.textMessage);

    cy.checkUserMessageIsSent(userInputs.textMessage);

    chatbotWidgetPage.botChatTextMessage.should('be.visible');

    chatbotWidgetPage.botChatTextMessage
      .get('span')
      .should(
        'contain.text',
        "I understand you want to be connected to a human agent, but that's something I cannot help you with at the moment. Is there something else I can help you with?"
      );

    chatbotWidgetPage.widgetOpened.then((el) => {
      cy.checkA11yAndReport(el, options);
    });
  });

  it('Accessibility testing - Widget image messages tooltips', () => {
    cy.injectAxe();

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');

    cy.userSendMessage(userInputs.imageMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    cy.checkUserMessageIsSent(userInputs.imageMessage);

    chatbotWidgetPage.botChatImageMessage.should('be.visible');

    chatbotWidgetPage.widgetOpened.then((el) => {
      cy.checkA11yAndReport(el, options);
    });
  });

  it('Accessibility testing - Widget accordion messages tooltips', () => {
    cy.injectAxe();

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');

    cy.userSendMessage(userInputs.accordionMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    cy.checkUserMessageIsSent(userInputs.accordionMessage);

    chatbotWidgetPage.botChatAccordionMessage.should('have.length', 3);

    chatbotWidgetPage.botChatAccordionChevronDownIcon.eq(0).click();

    chatbotWidgetPage.widgetOpened.then((el) => {
      cy.checkA11yAndReport(el, options);
    });
  });

  it('Accessibility testing - Widget carousel messages tooltips', () => {
    cy.injectAxe();

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');

    cy.userSendMessage(userInputs.carouselMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    cy.checkUserMessageIsSent(userInputs.carouselMessage);

    chatbotWidgetPage.botChatCarouselMessage.should('be.visible');

    chatbotWidgetPage.botChatCarouselRightIcon.should('be.visible');

    chatbotWidgetPage.widgetOpened.then((el) => {
      cy.checkA11yAndReport(el, options);
    });
  });

  it('Accessibility testing - Widget file download messages tooltips', () => {
    cy.injectAxe();

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');

    cy.userSendMessage(userInputs.fileDownloadMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    cy.checkUserMessageIsSent(userInputs.fileDownloadMessage);

    chatbotWidgetPage.botChatFileDownloadMessage.should('be.visible');

    chatbotWidgetPage.widgetOpened.then((el) => {
      cy.checkA11yAndReport(el, options);
    });
  });

  it('Accessibility testing - Widget quick replies messages tooltips', () => {
    cy.injectAxe();

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');

    cy.userSendMessage(userInputs.quickRepliesMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    cy.checkUserMessageIsSent(userInputs.quickRepliesMessage);

    chatbotWidgetPage.botChatQuickRepliesMessage.should('be.visible');

    chatbotWidgetPage.botChatQuickRepliesMessage
      .get('span')
      .should('contain.text', 'Choose the markdown type you want');

    chatbotWidgetPage.botChatQuickRepliesButtons.should('have.length', 5);

    chatbotWidgetPage.botChatQuickRepliesButtons.eq(0).click();

    chatbotWidgetPage.userChatMessage.eq(1).should('be.visible');

    chatbotWidgetPage.userChatMessage
      .get('span')
      .should('contain.text', 'Hyperlink');

    chatbotWidgetPage.botChatQuickRepliesMessage
      .get('span')
      .should('contain.text', 'For more information, visit Google Website');

    chatbotWidgetPage.widgetOpened.then((el) => {
      cy.checkA11yAndReport(el, options);
    });
  });

  it('Accessibility testing - Widget video messages tooltips', () => {
    cy.injectAxe();

    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');

    cy.userSendMessage(userInputs.videoMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    cy.checkUserMessageIsSent(userInputs.videoMessage);

    chatbotWidgetPage.botChatVideoMessage.should('be.visible');

    chatbotWidgetPage.botChatVideoMessage.find('iframe').should('be.visible');

    chatbotWidgetPage.widgetOpened.then((el) => {
      cy.checkA11yAndReport(el, options);
    });
  });
});
