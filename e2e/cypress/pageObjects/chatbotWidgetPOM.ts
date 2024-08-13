class ChatbotWidget {
  get rasaChatbotWidget() {
    return cy.get('rasa-chatbot-widget');
  }

  get widgetOpened() {
    return cy.get('div.messenger.messenger--open');
  }

  get widgetSessionDivider() {
    return cy.get('rasa-session-divider');
  }

  get widgetHeader() {
    return cy.get('div.messenger__header');
  }

  get widgetLauncher() {
    return cy.get('div.rasa-chatbot-widget__launcher');
  }

  get widgetInputField() {
    return cy.get('input.rasa-chat-input__input');
  }

  get widgetSendButton() {
    return cy.get('button.rasa-chat-input__button');
  }

  get userChatMessage() {
    return cy.get('chat-message rasa-text-message.text-message--user');
  }

  get botChatTextMessage() {
    return cy.get('chat-message rasa-text-message.text-message--bot');
  }

  get botChatImageMessage() {
    return cy.get('rasa-image.image-message__image');
  }

  get botChatAccordionMessage() {
    return cy.get('rasa-accordion');
  }

  get botChatAccordionChevronDownIcon() {
    return cy.get('rasa-icon-chevron-down.accordion__header__icon');
  }

  get botChatCarouselMessage() {
    return cy.get('rasa-carousel');
  }

  get botChatCarouselRightIcon() {
    return cy.get('div.carousel__icon.carousel__icon--right');
  }

  get botChatCarouselLeftIcon() {
    return cy.get('div.carousel__icon.carousel__icon--left');
  }

  get botChatFileDownloadMessage() {
    return cy.get('rasa-file-download-message');
  }

  get botChatQuickRepliesMessage() {
    return cy.get('chat-message rasa-text.quick-reply__text');
  }

  get botChatQuickRepliesButtons() {
    return cy.get('div.quick-reply__buttons rasa-button');
  }

  get botChatVideoMessage() {
    return cy.get('rasa-video');
  }

  get errorToastMessage() {
    return cy.get('error-toast.hydrated');
  }

  get toggleFullScreen() {
    return cy.get('rasa-icon-arrows-expand');
  }
}

export const chatbotWidgetPage = new ChatbotWidget();
