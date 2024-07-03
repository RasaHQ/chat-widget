import { Component, Event, EventEmitter, Fragment, Listen, Prop, State, h } from '@stencil/core/internal';
import { MESSAGE_TYPES, Message, Rasa, SENDER } from '@rasa-widget/core';
import { configStore, setConfigStore } from '../store/config-store';

import { Messenger } from '../components/messenger';
import { messageQueueService } from '../store/message-queue';

@Component({
  tag: 'rasa-chatbot-widget',
  styleUrl: 'rasa-chatbot-widget.scss',
  shadow: true,
})
export class RasaChatbotWidget {
  private client: Rasa;
  private storedPromise: Promise<void> | null = null;
  private resolveStoredPromise: (() => void) | null = null;

  @State() isOpen: boolean = false;
  @State() isFullScreen: boolean = false;
  @State() messageHistory: Message[] = [];
  @State() messages: Message[] = [];
  @State() typingIndicator: boolean = false;

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

  /**
   * If set to True, instead of the default WebSocket communication, the widget will use the HTTP protocol.
   * */
  @Prop() restEnabled: boolean = false;

  /**
   * Data that should be sent on Chat Widget initialization
   */
  @Prop() initialPayload?: string;

  componentWillLoad() {
    setConfigStore({
      toggleFullScreen: this.toggleFullScreen,
      autoOpen: this.autoOpen,
      streamMessages: this.messageDelay > 0 ? false : this.streamMessages,
      messageDelay: this.messageDelay,
    });
    const protocol = this.restEnabled ? 'http' : 'ws';

    this.client = new Rasa({ url: this.serverUrl, protocol, initialPayload: this.initialPayload });

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

  private onNewMessage = async (data: Message) => {
    this.chatWidgetReceivedMessage.emit(data);

    const delay = data.type === MESSAGE_TYPES.SESSION_DIVIDER || data.sender === SENDER.USER ? 0 : configStore().messageDelay;

    if (this.storedPromise) {
      await this.storedPromise;
    }

    this.storedPromise = new Promise<void>(resolve => {
      this.resolveStoredPromise = resolve;
    });

    this.typingIndicator = true;

    setTimeout(() => {
      messageQueueService.enqueueMessage(data);
      this.typingIndicator = false;

      if (this.resolveStoredPromise) {
        this.resolveStoredPromise();
        this.resolveStoredPromise = null;
      }
      this.storedPromise = null;
    }, delay);
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
    messageQueueService.getState().onChange('messageToRender', message => {
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

  private renderMessage(message: Message, isHistory = false) {
    switch (message.type) {
      case MESSAGE_TYPES.SESSION_DIVIDER:
        return <rasa-session-divider sessionStartDate={message.startDate}></rasa-session-divider>;
      case MESSAGE_TYPES.TEXT:
        return (
          <chat-message sender={message.sender}>
            <rasa-text-message sender={message.sender} value={message.text} isHistory={isHistory}></rasa-text-message>
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
              <rasa-text-message sender={message.sender} value={message.text} isHistory={isHistory}></rasa-text-message>
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
      <global-error-handler>
        <slot />
        <div class="rasa-chatbot-widget">
          <div class="rasa-chatbot-widget__container">
            <Messenger isOpen={this.isOpen} toggleFullScreenMode={this.toggleFullscreenMode} isFullScreen={this.isFullScreen}>
              {this.messageHistory.map(message => this.renderMessage(message, true))}
              {this.messages.map(message => this.renderMessage(message))}
              {this.typingIndicator && <rasa-typing-indicator></rasa-typing-indicator>}
            </Messenger>
            <div role="button" onClick={this.toggleOpenState} class="rasa-chatbot-widget__launcher" aria-label={this.getAltText()}>
              {this.isOpen ? <rasa-icon-close-chat size={18} /> : <rasa-icon-chat />}
            </div>
          </div>
        </div>
      </global-error-handler>
    );
  }
}
