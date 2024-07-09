import { Component, Event, EventEmitter, Listen, Prop, State, h } from '@stencil/core/internal';
import { DISCONNECT_TIMEOUT, WIDGET_DEFAULT_CONFIGURATION } from './constants';
import { MESSAGE_TYPES, Message, QuickReplyMessage, Rasa, SENDER } from '@rasa-widget/core';
import { configStore, setConfigStore } from '../store/config-store';

import { Messenger } from '../components/messenger';
import { isValidURL } from '../utils/validate-url';
import { messageQueueService } from '../store/message-queue';
import { widgetState } from '../store/widget-state-store';

@Component({
  tag: 'rasa-chatbot-widget',
  styleUrl: 'rasa-chatbot-widget.scss',
  shadow: true,
})
export class RasaChatbotWidget {
  private client: Rasa;
  private messageDelayQueue: Promise<void> = Promise.resolve();
  private disconnectTimeout: NodeJS.Timeout | null = null;
  private isConnected = false;

  @State() isOpen: boolean = false;
  @State() isFullScreen: boolean = false;
  @State() messageHistory: Message[] = [];
  @State() messages: Message[] = [];
  @State() typingIndicator: boolean = false;

  /**
   * Emitted when the user receives a message
   */
  @Event() chatWidgetReceivedMessage: EventEmitter<unknown>;

  /**
   * Emitted when the user sends a message
   */
  @Event() chatWidgetSentMessage: EventEmitter<string>;

  /**
   * Emitted when the user click on quick reply
   */
  @Event() chatWidgetQuickReply: EventEmitter<string>;

  /**
   * Emitted when the Chat Widget is opened by the user
   */
  @Event() chatWidgetOpened: EventEmitter<undefined>;

  /**
   * Emitted when the Chat Widget is closed by the user
   */
  @Event() chatWidgetClosed: EventEmitter<undefined>;

  /**
   * Emitted when a user clicks on a hyperlink option.
   */
  @Event() chatWidgetHyperlinkClicked: EventEmitter<undefined>;

  /**
   * Emitted when a user is starting to download a file.
   */
  @Event() chatWidgetFileStartedDownload: EventEmitter<undefined>;

  /**
   * Url of the Rasa chatbot backend server (example: https://example.com)
   */
  @Prop() serverUrl: string = WIDGET_DEFAULT_CONFIGURATION.SERVER_URL;

  /**
   * User authentication token
   */
  @Prop() authenticationToken: string = WIDGET_DEFAULT_CONFIGURATION.AUTHENTICATION_TOKEN;

  /**
   * Title of the Chat Widget
   */
  @Prop() widgetTitle: string = WIDGET_DEFAULT_CONFIGURATION.WIDGET_TITLE;

  /**
   * Static icon for the chatbot
   */
  @Prop() botIcon: string = WIDGET_DEFAULT_CONFIGURATION.BOT_ICON;

  /**
   * Static icon for the widget
   */
  @Prop() widgetIcon: string = WIDGET_DEFAULT_CONFIGURATION.WIDGET_ICON;

  /**
   * Indicates if a message timestamp should be displayed
   */
  @Prop() displayTimestamp: boolean = WIDGET_DEFAULT_CONFIGURATION.DISPLAY_TIMESTAMP;

  /**
   * Format of the message timestamp
   */
  @Prop() messageTimestamp: string = WIDGET_DEFAULT_CONFIGURATION.MESSAGE_TIMESTAMP;

  /**
   * Data that should be sent on Chat Widget initialization
   */
  @Prop() initialPayload: string = WIDGET_DEFAULT_CONFIGURATION.INITIAL_PAYLOAD;

  /**
   * ID of a user engaged with the Chat Widget
   */
  @Prop() senderId: string = WIDGET_DEFAULT_CONFIGURATION.SENDER_ID;

  /**
   * Indicates time between message is received and printed.
   * */
  @Prop() messageDelay: number = WIDGET_DEFAULT_CONFIGURATION.MESSAGE_DELAY;

  /**
   * If set to True, bot messages will be received as stream (printing word by word).
   * */
  @Prop() streamMessages: boolean = WIDGET_DEFAULT_CONFIGURATION.STREAM_MESSAGES;

  /**
   * If set to True, it will open the chat, triggering the 'initialPayload' immediately if set.
   * */
  @Prop() autoOpen: boolean = WIDGET_DEFAULT_CONFIGURATION.AUTO_OPEN;

  /**
   * Message that should be displayed if an error occurs
   */
  @Prop() errorMessage: string = WIDGET_DEFAULT_CONFIGURATION.ERROR_MESSAGE;

  /**
   * Indicates whether the chat messenger can be toggled to full screen mode.
   * */
  @Prop() toggleFullScreen: boolean = WIDGET_DEFAULT_CONFIGURATION.TOGGLE_FULLSCREEN;

  /**
   * Message placeholder for input
   */
  @Prop() inputMessagePlaceholder: string = WIDGET_DEFAULT_CONFIGURATION.INPUT_MESSAGE_PLACEHOLDER;

  /**
   * If set to True, instead of the default WebSocket communication, the widget will use the HTTP protocol.
   * */
  @Prop() restEnabled: boolean = WIDGET_DEFAULT_CONFIGURATION.REST_ENABLED;

  componentWillLoad() {
    const {
      serverUrl,
      authenticationToken,
      widgetTitle,
      botIcon,
      widgetIcon,
      displayTimestamp,
      messageTimestamp,
      initialPayload,
      senderId,
      messageDelay,
      streamMessages,
      autoOpen,
      errorMessage,
      toggleFullScreen,
      inputMessagePlaceholder,
      restEnabled,
    } = this;
    setConfigStore({
      serverUrl,
      authenticationToken,
      widgetTitle,
      botIcon,
      widgetIcon,
      displayTimestamp,
      messageTimestamp,
      initialPayload,
      senderId,
      streamMessages,
      messageDelay: streamMessages ? 0 : messageDelay,
      autoOpen,
      errorMessage,
      toggleFullScreen,
      inputMessagePlaceholder,
      restEnabled,
    });
    const protocol = this.restEnabled ? 'http' : 'ws';

    this.client = new Rasa({ url: this.serverUrl, protocol, initialPayload: this.initialPayload, authenticationToken: this.authenticationToken });

    this.client.on('connect', () => {
      this.isConnected = true;
    });
    this.client.on('message', this.onNewMessage);
    this.client.on('loadHistory', this.loadHistory);
    this.client.on('disconnect', () => {
      this.isConnected = false;
    });

    if (this.autoOpen) {
      this.toggleOpenState();
    }
  }

  private onNewMessage = (data: Message) => {
    this.chatWidgetReceivedMessage.emit(data);
    const delay = data.type === MESSAGE_TYPES.SESSION_DIVIDER || data.sender === SENDER.USER ? 0 : configStore().messageDelay;

    this.messageDelayQueue = this.messageDelayQueue.then(() => {
      return new Promise<void>(resolve => {
        this.typingIndicator = delay > 0;

        setTimeout(() => {
          messageQueueService.enqueueMessage(data);
          this.typingIndicator = false;
          resolve();
        }, delay);
      });
    });
  };

  private loadHistory = (data: Message[]): void => {
    this.messageHistory = data;
  };

  private connect(): void {
    if (this.isConnected) return;
    this.client.connect();
  }

  private disconnect(): void {
    if (!this.isConnected) return;
    this.disconnectTimeout = setTimeout(() => {
      if (!this.isOpen) {
        this.client.disconnect();
        this.messageHistory = [];
        this.messages = [];
      }
    }, DISCONNECT_TIMEOUT);
  }

  private emitChatWidgetOpenCloseEvents(): void {
    this.isOpen ? this.chatWidgetOpened.emit() : this.chatWidgetClosed.emit();
  }

  private toggleOpenState = (): void => {
    this.isOpen = !this.isOpen;
    clearTimeout(this.disconnectTimeout);
    this.disconnectTimeout = null;
    this.isOpen ? this.connect() : this.disconnect();
    this.emitChatWidgetOpenCloseEvents();
  };

  connectedCallback() {
    messageQueueService.getState().onChange('messageToRender', message => {
      this.messages = [...this.messages, message];
    });
  }

  @Listen('sendMessageHandler')
  // @ts-ignore-next-line
  private sendMessageHandler(event: CustomEvent<string>) {
    const timestamp = new Date();
    this.client.sendMessage({text: event.detail, timestamp});
    this.chatWidgetSentMessage.emit(event.detail);
    this.messages = [...this.messages, { type: 'text', text: event.detail, sender: 'user', timestamp }];
  }

  @Listen('quickReplySelected')
  // @ts-ignore-next-line
  private quickReplySelected({ detail: { value, key } }: CustomEvent<{ value: string; key: number }>) {
    const timestamp = new Date();
    this.messages = [...this.messages, { type: 'text', text: value, sender: 'user', timestamp }];
    const updatedMessage = this.messages[key] as QuickReplyMessage;
    updatedMessage.replies.find(quickReply => quickReply.reply === value).isSelected = true;
    this.messages[key] = updatedMessage;
    this.client.sendMessage({text: value, timestamp}, true, key - 1);
    this.chatWidgetQuickReply.emit(value);
  }

  @Listen('linkClicked')
  // @ts-ignore-next-line
  private linkClickedHanlder() {
    this.chatWidgetHyperlinkClicked.emit();
  }

  @Listen('fileDownloadStarted')
  // @ts-ignore-next-line
  private linkClickedHanlder() {
    this.chatWidgetFileStartedDownload.emit();
  }

  private getAltText() {
    return this.isOpen ? 'Close Chat' : 'Open Chat';
  }

  private toggleFullscreenMode = () => {
    this.isFullScreen = !this.isFullScreen;
  };

  private renderMessage(message: Message, isHistory = false, key) {
    switch (message.type) {
      case MESSAGE_TYPES.SESSION_DIVIDER:
        return <rasa-session-divider sessionStartDate={message.startDate} key={key}></rasa-session-divider>;
      case MESSAGE_TYPES.TEXT:
        return (
          <chat-message sender={message.sender} key={key} timestamp={message.timestamp}>
            <rasa-text-message sender={message.sender} value={message.text} isHistory={isHistory}></rasa-text-message>
          </chat-message>
        );
      case MESSAGE_TYPES.IMAGE:
        return (
          <chat-message sender={message.sender} key={key} timestamp={message.timestamp}>
            <rasa-image-message imageSrc={message.imageSrc} text={message.text} imageAlt={message.alt}></rasa-image-message>
          </chat-message>
        );
      case MESSAGE_TYPES.VIDEO:
        return (
          <chat-message sender={message.sender} key={key} timestamp={message.timestamp}>
            <rasa-video src={message.src}></rasa-video>
          </chat-message>
        );
      case MESSAGE_TYPES.FILE_DOWNLOAD:
        return (
          <chat-message sender={message.sender} key={key} timestamp={message.timestamp}>
            <rasa-file-download-message fileUrl={message.fileUrl} fileName={message.fileName} text={message.text}></rasa-file-download-message>
          </chat-message>
        );
      case MESSAGE_TYPES.ACCORDION:
        return (
          <chat-message sender={message.sender} key={key} timestamp={message.timestamp}>
            {message.elements.map(element => (
              <rasa-accordion label={element.title}>
                <rasa-text value={element.text}></rasa-text>
              </rasa-accordion>
            ))}
          </chat-message>
        );
      case MESSAGE_TYPES.QUICK_REPLY:
        let activeQuickReplyId = '';
        if (!isHistory) {
          activeQuickReplyId = crypto.randomUUID();
          widgetState.getState().state.activeQuickReply = activeQuickReplyId;
        }
        return <rasa-quick-reply message={message} elementKey={key} key={key} isHistory={isHistory}></rasa-quick-reply>;
      case MESSAGE_TYPES.CAROUSEL:
        return (
          <chat-message sender={message.sender} timestamp={message.timestamp}>
            <rasa-carousel elements={message.elements}></rasa-carousel>
          </chat-message>
        );
    }
  }

  render() {
    if (!isValidURL(this.serverUrl)) {
      console.error("Widget misconfigured. Missing property 'serverUrl'");
      return null;
    }
    const widgetClassList = {
      'rasa-chatbot-widget': true,
      'fullscreen': this.isFullScreen
    }
    return (
      <global-error-handler>
        <slot />
        <div class={widgetClassList}>
          <div class="rasa-chatbot-widget__container">
            <Messenger isOpen={this.isOpen} toggleFullScreenMode={this.toggleFullscreenMode} isFullScreen={this.isFullScreen}>
              {this.messageHistory.map((message, key) => this.renderMessage(message, true, key))}
              {this.messages.map((message, key) => this.renderMessage(message, false, key))}
              {this.typingIndicator && <rasa-typing-indicator></rasa-typing-indicator>}
            </Messenger>
            <div role="button" onClick={this.toggleOpenState} class="rasa-chatbot-widget__launcher" aria-label={this.getAltText()}>
              {configStore().widgetIcon ? (
                <img src={configStore().widgetIcon} class="rasa-chatbot-widget__launcher-image"></img>
              ) : this.isOpen ? (
                <rasa-icon-close-chat size={18} />
              ) : (
                <rasa-icon-chat />
              )}
            </div>
          </div>
        </div>
      </global-error-handler>
    );
  }
}
