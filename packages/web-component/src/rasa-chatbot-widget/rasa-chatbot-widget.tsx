import { Component, Host, Listen, Prop, State, h, Event, EventEmitter, Fragment } from '@stencil/core/internal';

import { Rasa, MESSAGE_TYPES, Message } from '@rasa-widget/core';

import { Messenger } from '../components/messenger';
import { messageQueueService } from '../store/message-queue';

@Component({
  tag: 'rasa-chatbot-widget',
  styleUrl: 'rasa-chatbot-widget.scss',
  shadow: true,
})
export class RasaChatbotWidget {
  private client: Rasa;

  @State() isOpen: boolean = false;
  @State() isFullScreen: boolean = false;
  @State() messageHistory: Message[] = [];
  @State() messages: Message[] = [];

  /**
   * Emitted when the user receives a message
   * */
  @Event() chatWidgetReceivedMessage: EventEmitter<unknown>;

  /**
   * Emitted when the user sends a message
   * */
  @Event() chatWidgetSentMessage: EventEmitter<string>;

  /**
   * Url of the Rasa chatbot backend server
   */
  @Prop() serverUrl: string;

  /**
   * Indicates whether the chat messenger can be toggled to full screen mode.
   * */
  @Prop() toggleFullScreen: boolean = false;

  /**
   * If set to True, it will open the chat, triggering the 'initialPayload' immediately if set.
   * */
  @Prop() autoOpen: boolean = false;

  /**
   * If set to True, bot messages will be received as stream (printing word by word).
   * */
  @Prop() streamMessages: boolean = false;

  /**
   * Indicates time between message is received and printed.
   * */
  @Prop() messageDelay: number = 100;

  componentWillLoad() {
    this.client = new Rasa({ url: this.serverUrl });

    this.client.on('connect', () => {});
    this.client.on('message', this.onNewMessage);
    this.client.on('loadHistory', this.loadHistory);
    this.client.on('disconnect', () => {
      this.messageHistory = [];
    });

    if (this.autoOpen) {
      this.toggleOpenState();
    }
  }

  private onNewMessage = (data: Message) => {
    this.chatWidgetReceivedMessage.emit(data);
    messageQueueService.enqueueMessage(data);
  };

  private loadHistory = (data: Message[]) => {
    this.messageHistory = data;
  };

  private toggleOpenState = () => {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.client.connect();
    } else {
      this.client.disconnect();
    }
  };

  connectedCallback() {
    messageQueueService.getState().onChange('messageToRender', (message) => {
      this.messages = [...this.messages, message];
    });
  }

  @Listen('sendMessageHandler')
  // @ts-ignore
  private sendMessageHandler(event: CustomEvent<string>) {
    this.client.sendMessage(event.detail);
    this.chatWidgetSentMessage.emit(event.detail);
    this.messages = [...this.messages, { type: 'text', text: event.detail, sender: 'user' }];
  }

  private getAltText() {
    return this.isOpen ? 'Close Chat' : 'Open Chat';
  }

  private toggleFullscreenMode = () => {
    this.isFullScreen = !this.isFullScreen;
  };

  private renderMessage(message: Message) {
    switch (message.type) {
      case MESSAGE_TYPES.SESSION_DIVIDER:
        return <rasa-session-divider sessionStartDate={message.startDate}></rasa-session-divider>;
      case MESSAGE_TYPES.TEXT:
        return (
          <chat-message sender={message.sender}>
            <rasa-text-message sender={message.sender} value={message.text}></rasa-text-message>
          </chat-message>
        );
      case MESSAGE_TYPES.IMAGE:
        return (
          <chat-message sender={message.sender}>
            <rasa-image-message imageSrc={message.imageSrc} text={message.text} imageAlt={message.alt}></rasa-image-message>
          </chat-message>
        );
      case MESSAGE_TYPES.VIDEO:
        return (
          <chat-message sender={message.sender}>
            <rasa-video src={message.src}></rasa-video>
          </chat-message>
        );
      case MESSAGE_TYPES.FILE_DOWNLOAD:
        return (
          <chat-message sender={message.sender}>
            <rasa-file-download-message fileUrl={message.fileUrl} fileName={message.fileName} text={message.text}></rasa-file-download-message>
          </chat-message>
        );
      case MESSAGE_TYPES.ACCORDION:
        return (
          <chat-message sender={message.sender}>
            {message.elements.map(element => (
              <rasa-accordion label={element.title}>
                <rasa-text value={element.text}></rasa-text>
              </rasa-accordion>
            ))}
          </chat-message>
        );
      case MESSAGE_TYPES.QUICK_REPLY:
        return (
          <Fragment>
            <chat-message sender={message.sender}>
              <rasa-text-message sender={message.sender} value={message.text}></rasa-text-message>
              <rasa-button-group buttons={message.replies} type="quick-reply"></rasa-button-group>
            </chat-message>
          </Fragment>
        );
      case MESSAGE_TYPES.CAROUSEL:
        return (
          <chat-message sender={message.sender}>
            <rasa-carousel elements={message.elements}></rasa-carousel>
          </chat-message>
        );
    }
  }

  render() {
    return (
      <Host>
        <slot />
        <div class="rasa-chatbot-widget">
          <div class="rasa-chatbot-widget__container">
            <Messenger isOpen={this.isOpen} toggleFullScreen={this.toggleFullScreen} toggleFullScreenMode={this.toggleFullscreenMode} isFullScreen={this.isFullScreen}>
              {this.messageHistory.map(this.renderMessage)}
              {this.messages.map(this.renderMessage)}
            </Messenger>
            <div role="button" onClick={this.toggleOpenState} class="rasa-chatbot-widget__launcher" aria-label={this.getAltText()}>
              {this.isOpen ? <rasa-icon-close-chat size={18} /> : <rasa-icon-chat />}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
