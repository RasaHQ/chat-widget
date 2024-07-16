import { Component, Element, Event, EventEmitter, Listen, Prop, State, Watch, h } from '@stencil/core/internal';
import { MESSAGE_TYPES, Message, QuickReply, QuickReplyMessage, Rasa, SENDER } from '@vortexwest/chat-widget-sdk';
import { configStore, setConfigStore } from '../store/config-store';

import { DISCONNECT_TIMEOUT } from './constants';
import { Messenger } from '../components/messenger';
import { isMobile } from '../utils/isMobile';
import { isValidURL } from '../utils/validate-url';
import { messageQueueService } from '../store/message-queue';
import { v4 as uuidv4 } from 'uuid';
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
  public isConnected = false;

  @Element() el: HTMLRasaChatbotWidgetElement;
  @State() isOpen: boolean = false;
  @State() isFullScreen: boolean = isMobile();
  @State() messageHistory: Message[] = [];
  @State() messages: Message[] = [];
  @State() typingIndicator: boolean = false;
  @State() cachedMessages: Element[] = [];

  /**
   * Emitted when the Chat Widget is opened by the user
   */
  @Event() chatSessionStarted: EventEmitter<{ sessionId: string }>;

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
  @Prop() serverUrl!: string;

  /**
   * User authentication token
   */
  @Prop() authenticationToken: string = '';

  /**
   * Title of the Chat Widget
   */
  @Prop() widgetTitle: string = 'Rasa Widget';

  /**
   * Static icon for the chatbot
   */
  @Prop() botIcon: string = '';

  /**
   * Static icon for the widget
   */
  @Prop() widgetIcon: string = '';

  /**
   * Indicates if a message timestamp should be displayed
   */
  @Prop() displayTimestamp: boolean = false;

  /**
   * Format of the message timestamp
   */
  @Prop() messageTimestamp: string = '';

  /**
   * Data that should be sent on Chat Widget initialization
   */
  @Prop() initialPayload: string = '';

  /**
   * ID of a user engaged with the Chat Widget
   */
  @Prop() senderId: string = '';

  /**
   * Indicates time between message is received and printed.
   * */
  @Prop() messageDelay: number = 600;

  /**
   * If set to True, bot messages will be received as stream (printing word by word).
   * */
  @Prop() streamMessages: boolean = false;

  /**
   * If set to True, it will open the chat, triggering the 'initialPayload' immediately if set.
   * */
  @Prop() autoOpen: boolean = false;

  /**
   * Message that should be displayed if an error occurs
   */
  @Prop() errorMessage: string = 'Something bad happened';

  /**
   * Indicates whether the chat messenger can be toggled to full screen mode.
   * */
  @Prop() toggleFullScreen: boolean = false;

  /**
   * Message placeholder for input
   */
  @Prop() inputMessagePlaceholder: string = 'Type your message here';

  /**
   * If set to True, instead of the default WebSocket communication, the widget will use the HTTP protocol.
   * */
  @Prop() restEnabled: boolean = false;

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

    this.client = new Rasa({ url: this.serverUrl, protocol, initialPayload, authenticationToken, senderId });

    this.client.on('connect', () => {
      this.isConnected = true;
    });
    this.client.on('message', this.onNewMessage);
    this.client.on('loadHistory', this.loadHistory);
    this.client.on('sessionConfirm', this.sessionConfirm);
    this.client.on('disconnect', () => {
      this.isConnected = false;
    });

    if (this.autoOpen) {
      this.toggleOpenState();
    }
  }

  private scrollToBottom(): void {
    const container = this.el.shadowRoot.querySelector('.messenger__content-wrapper');

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  private sessionConfirm = () => {
    this.chatSessionStarted.emit({ sessionId: this.client.sessionId });
  };

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
    console.log('asdasdasd', DISCONNECT_TIMEOUT);
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
    this.client.sendMessage({ text: event.detail, timestamp });
    this.chatWidgetSentMessage.emit(event.detail);
    this.messages = [...this.messages, { type: 'text', text: event.detail, sender: 'user', timestamp }];
    this.scrollToBottom();
  }

  @Listen('quickReplySelected')
  // @ts-ignore-next-line
  private quickReplySelected({ detail: { quickReply, key } }: CustomEvent<{ quickReply: QuickReply; key: number }>) {
    const timestamp = new Date();
    this.messages = [...this.messages, { type: 'text', text: quickReply.text, sender: 'user', timestamp }];
    const updatedMessage = this.messages[key] as QuickReplyMessage;
    updatedMessage.replies.find(qr => qr.reply === quickReply.reply).isSelected = true;
    this.messages[key] = updatedMessage;
    this.client.sendMessage({ text: quickReply.text, reply: quickReply.reply, timestamp }, true, key - 1);
    this.chatWidgetQuickReply.emit(quickReply.reply);
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

  @Watch('messages')
  onMessagesChange() {
    if (this.cachedMessages.length !== this.messages.length) {
      this.cachedMessages = this.messages.map((message, key) => this.renderMessage(message, false, key));
    }
  }

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
          activeQuickReplyId = uuidv4();
          widgetState.getState().state.activeQuickReply = activeQuickReplyId;
        }
        return <rasa-quick-reply quickReplyId={activeQuickReplyId} message={message} elementKey={key} key={key} isHistory={isHistory}></rasa-quick-reply>;
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
      'fullscreen': this.isFullScreen,
    };

    return (
      <global-error-handler>
        <slot />
        <div class={widgetClassList}>
          <div class="rasa-chatbot-widget__container">
            <Messenger isOpen={this.isOpen} toggleFullScreenMode={this.toggleFullscreenMode} isFullScreen={this.isFullScreen}>
              {this.messageHistory.map((message, key) => this.renderMessage(message, true, key))}
              {this.cachedMessages}
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
