import { chatbotWidgetPage } from '@rasa-cypress-POM/chatbotWidgetPOM';
import { userInputs } from '@rasa-cypress-fixtures/chatbotWidgetData';

describe('Response messages types', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3333', {
      onBeforeLoad() {
        cy.document().then((document) => {
          document
            .getElementsByTagName('rasa-chatbot-widget')[0]
            .setAttribute('server-url', 'https://pro.vortexwe.com');
        });
      },
    });
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

    chatbotWidgetPage.sendMessage(userInputs.textMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    chatbotWidgetPage.userChatMessage
      .get('span')
      .should('contain.text', userInputs.textMessage);

    chatbotWidgetPage.botChatTextMessage.should('be.visible');

    chatbotWidgetPage.botChatTextMessage
      .get('span')
      .should(
        'contain.text',
        "I understand you want to be connected to a human agent, but that's something I cannot help you with at the moment. Is there something else I can help you with?"
      );
  });

  it('TC002 - Response message type: Image', () => {
    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');

    chatbotWidgetPage.sendMessage(userInputs.imageMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    chatbotWidgetPage.userChatMessage
      .get('span')
      .should('contain.text', userInputs.imageMessage);

    chatbotWidgetPage.botChatTextMessage.should('be.visible');

    chatbotWidgetPage.botChatTextMessage
      .get('span')
      .should('contain.text', 'No country for old men');

    chatbotWidgetPage.botChatImageMessage.should('be.visible');

    chatbotWidgetPage.botChatTextMessage
      .last()
      .get('span')
      .should('contain.text', 'What else I can help you with?');
  });

  it('TC003 - Response message type: Accordion', () => {
    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');

    chatbotWidgetPage.sendMessage(userInputs.accordionMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    chatbotWidgetPage.userChatMessage
      .get('span')
      .should('contain.text', userInputs.accordionMessage);

    chatbotWidgetPage.botChatAccordionMessage.should('have.length', 3);

    chatbotWidgetPage.botChatAccordionChevronDownIcon.should('have.length', 3);

    chatbotWidgetPage.botChatAccordionChevronDownIcon.eq(0).click();

    chatbotWidgetPage.botChatTextMessage
      .get('span')
      .should('contain.text', 'What else I can help you with?');
  });

  it('TC004 - Response message type: Carousel', () => {
    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');

    chatbotWidgetPage.sendMessage(userInputs.carouselMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    chatbotWidgetPage.userChatMessage
      .get('span')
      .should('contain.text', userInputs.carouselMessage);

    chatbotWidgetPage.botChatCarouselMessage.should('be.visible');

    chatbotWidgetPage.botChatCarouselRightIcon.should('be.visible');

    chatbotWidgetPage.botChatCarouselRightIcon.click();

    chatbotWidgetPage.botChatCarouselLeftIcon.should('be.visible');

    chatbotWidgetPage.botChatCarouselLeftIcon.click();

    chatbotWidgetPage.botChatCarouselLeftIcon.should('not.exist');

    chatbotWidgetPage.botChatTextMessage
      .get('span')
      .should('contain.text', 'What else I can help you with?');
  });

  it('TC005 - Response message type: File download', () => {
    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');

    chatbotWidgetPage.sendMessage(userInputs.fileDownloadMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    chatbotWidgetPage.userChatMessage
      .get('span')
      .should('contain.text', userInputs.fileDownloadMessage);

    chatbotWidgetPage.botChatFileDownloadMessage.should('be.visible');

    chatbotWidgetPage.botChatFileDownloadMessage
      .find('a.file-download')
      .should('have.attr', 'target', '_blank');

    chatbotWidgetPage.botChatTextMessage
      .get('span')
      .should('contain.text', 'What else I can help you with?');
  });

  it('TC006 - Response message type: Quick replies', () => {
    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');

    chatbotWidgetPage.sendMessage(userInputs.quickRepliesMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    chatbotWidgetPage.userChatMessage
      .get('span')
      .should('contain.text', userInputs.quickRepliesMessage);

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
  });

  it('TC007 - Response message type: Video Message', () => {
    chatbotWidgetPage.widgetLauncher.should('be.visible');

    chatbotWidgetPage.widgetLauncher.click();

    chatbotWidgetPage.widgetOpened.should('be.visible');

    chatbotWidgetPage.widgetHeader.should('be.visible');

    chatbotWidgetPage.widgetInputField.should('be.visible');

    chatbotWidgetPage.widgetSendButton.should('be.visible');

    chatbotWidgetPage.sendMessage(userInputs.videoMessage);

    chatbotWidgetPage.userChatMessage.should('be.visible');

    chatbotWidgetPage.userChatMessage
      .get('span')
      .should('contain.text', userInputs.videoMessage);

    chatbotWidgetPage.botChatVideoMessage.should('be.visible');

    chatbotWidgetPage.botChatVideoMessage.find('iframe').should('be.visible');

    chatbotWidgetPage.botChatVideoMessage
      .find('iframe')
      .should('have.attr', 'src')
      .and('match', /https:\/\/www.youtube.com\/embed\/.*/);

    chatbotWidgetPage.botChatTextMessage
      .get('span')
      .should('contain.text', 'What else I can help you with?');
  });
});
