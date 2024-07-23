class ChatbotWidget {
  get widgetLauncher() {
    return cy
      .get('rasa-chatbot-widget.hydrated')
      .shadow()
      .find('.rasa-chatbot-widget__launcher');
  }

  get widgetInputField() {
    return cy
      .get('rasa-chatbot-widget.hydrated')
      .find('.rasa-chat-input__input', { includeShadowDom: true });
  }

  get widgetSendButton() {
    return cy
      .get('rasa-chatbot-widget.hydrated')
      .shadow()
      .find('.rasa-chat-input__button', { includeShadowDom: true });
  }

  sendMessage(text: string) {
    this.widgetInputField.type(text);
    this.widgetSendButton.click();
  }
}

export const chatbotWidgetPage = new ChatbotWidget();
