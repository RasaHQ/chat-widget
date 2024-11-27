import { chatbotWidgetPage } from '@rasa-cypress-POM/chatbotWidgetPOM';
import { userInputs } from '@rasa-cypress-fixtures/chatbotWidgetData';

describe('Response messages types', () => {
  const mockedServerUrl = Cypress.env('mockedServerUrl');

  beforeEach(() => {
    cy.setPropertiesAndOpenThePage([
      { key: 'server-url', value: mockedServerUrl },
    ]);
  });

  afterEach(() => {
    cy.resetWsMessages(mockedServerUrl);
  });

  it('TC001 - Response message type: Text message', () => {
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

    chatbotWidgetPage.widgetOpened.matchImage({
      title: 'textMessageResponse',
    });
  });

  it('TC002 - Response message type: Image', () => {
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

    chatbotWidgetPage.botChatImageMessage
      .find('img')
      .should(
        'have.attr',
        'src',
        'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Anton_Chigurh.jpg/220px-Anton_Chigurh.jpg'
      );

    chatbotWidgetPage.widgetOpened.wait(1000).matchImage({
      title: 'imageMessageResponse',
    });
  });

  it('TC003 - Response message type: Accordion', () => {
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

    chatbotWidgetPage.botChatAccordionChevronDownIcon.should('have.length', 3);

    chatbotWidgetPage.botChatAccordionChevronDownIcon.eq(0).click();

    chatbotWidgetPage.widgetOpened.matchImage({
      title: 'accordionMessageResponse',
    });
  });

  it('TC004 - Response message type: Carousel', () => {
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

    chatbotWidgetPage.botChatCarouselRightIcon.click();

    chatbotWidgetPage.botChatCarouselLeftIcon.should('be.visible');

    chatbotWidgetPage.botChatCarouselLeftIcon.click();

    chatbotWidgetPage.botChatCarouselLeftIcon.should('not.exist');

    chatbotWidgetPage.widgetOpened.matchImage({
      title: 'carouselMessageResponse',
    });
  });

  it('TC005 - Response message type: File download', () => {
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

    chatbotWidgetPage.botChatFileDownloadMessage
      .find('a.file-download')
      .should('have.attr', 'target', '_blank');

    chatbotWidgetPage.botChatFileDownloadMessage
      .find('a.file-download')
      .should(
        'have.attr',
        'href',
        'https://codeload.github.com/RasaHQ/rasa-sdk/zip/refs/heads/main'
      );

    chatbotWidgetPage.widgetOpened.wait(1000).matchImage({
      title: 'fileDownloadMessageResponse',
    });
  });

  it('TC006 - Response message type: Quick replies', () => {
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

    chatbotWidgetPage.botChatQuickRepliesButtons
      .eq(0)
      .should('have.attr', 'text', 'Hyperlink');

    chatbotWidgetPage.botChatQuickRepliesButtons
      .eq(1)
      .should('have.attr', 'text', 'Bold');

    chatbotWidgetPage.botChatQuickRepliesButtons
      .eq(2)
      .should('have.attr', 'text', 'Italic');

    chatbotWidgetPage.botChatQuickRepliesButtons
      .eq(3)
      .should('have.attr', 'text', 'Bold_Italic');

    chatbotWidgetPage.botChatQuickRepliesButtons
      .eq(4)
      .should('have.attr', 'text', 'New_Line');

    chatbotWidgetPage.botChatQuickRepliesButtons.eq(0).click();

    chatbotWidgetPage.userChatMessage.eq(1).should('be.visible');

    chatbotWidgetPage.userChatMessage
      .get('span')
      .should('contain.text', 'Hyperlink');

    chatbotWidgetPage.botChatQuickRepliesMessage
      .get('span')
      .should('contain.text', 'For more information, visit Google Website');

    chatbotWidgetPage.widgetOpened.matchImage({
      title: 'quickRepliesMessageResponse',
    });
  });

  it('TC007 - Response message type: Video Message', () => {
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

    chatbotWidgetPage.botChatVideoMessage
      .find('iframe')
      .should(
        'have.attr',
        'src',
        'https://www.youtube.com/embed/dQw4w9WgXcQ?si=T5VhguqLo5F0q7R0'
      );

    chatbotWidgetPage.widgetOpened.wait(1000).matchImage({
      title: 'videoMessageResponse',
    });
  });

  it('TC023 - Response message type: High resolution image', () => {
    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');

    cy.userSendMessage(userInputs.highResolutionImageMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    cy.checkUserMessageIsSent(userInputs.highResolutionImageMessage);

    chatbotWidgetPage.botChatImageMessage.should('be.visible');

    chatbotWidgetPage.botChatImageMessage
      .find('img')
      .should(
        'have.attr',
        'src',
        'https://store.hrblock.com/shoppingcart/assets/Win_H2.png'
      );

    cy.wait(1000);

    chatbotWidgetPage.widgetOpened.wait(1000).matchImage({
      title: 'highResolutionImageMessageResponse',
    });
  });

  it('TC024 - Response message type: Carousel with high resolution image', () => {
    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');

    cy.userSendMessage(userInputs.highResolutionImageCarouselMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    cy.checkUserMessageIsSent(userInputs.highResolutionImageCarouselMessage);

    chatbotWidgetPage.botChatCarouselMessage.should('be.visible');

    chatbotWidgetPage.botChatCarouselRightIcon.should('be.visible');

    chatbotWidgetPage.botChatCarouselRightIcon.click();

    chatbotWidgetPage.botChatCarouselLeftIcon.should('be.visible');

    chatbotWidgetPage.botChatCarouselLeftIcon.click();

    chatbotWidgetPage.botChatCarouselLeftIcon.should('not.exist');

    cy.wait(2000);

    chatbotWidgetPage.widgetOpened.matchImage({
      title: 'carouselWithHighResolutionImageMessageResponse',
    });
  });
});
