import { Component, Element, Event, EventEmitter, Listen, Prop, State, Watch, h } from '@stencil/core/internal';
import { v4 as uuidv4 } from 'uuid';

import { MESSAGE_TYPES, Message, CsatMessage, QuickReply, QuickReplyMessage, Rasa, SENDER } from '@rasahq/chat-widget-sdk';

import { Messenger } from '../components/messenger';
import { configStore, setConfigStore } from '../store/config-store';
import { messageQueueService } from '../store/message-queue';
import { widgetState } from '../store/widget-state-store';
import { isValidURL } from '../utils/validate-url';
import { broadcastChatHistoryEvent, receiveChatHistoryEvent } from '../utils/eventChannel';
import { isMobile } from '../utils/isMobile';
import { debounce } from '../utils/debounce';
import { DEBOUNCE_THRESHOLD, DISCONNECT_TIMEOUT } from './constants';

@Component({
  tag: 'rasa-chatbot-widget',
  styleUrl: 'rasa-chatbot-widget.scss',
  shadow: true,
})
export class RasaChatbotWidget {
  private client: Rasa;
  private messageDelayQueue: Promise<void> = Promise.resolve();
  private disconnectTimeout: NodeJS.Timeout | null = null;
  private sentMessage = false;

  @Element() el: HTMLRasaChatbotWidgetElement;
  @State() isOpen: boolean = false;
  @State() isFullScreen: boolean = isMobile();
  @State() messageHistory: Message[] = [];
  @State() messages: Message[] = [];
  @State() typingIndicator: boolean = false;
  @State() cachedMessages: Element[] = [];
  @State() isConnected = false;
  @State() showFeedback = false;
  @State() feedbackSubmitted = false;
  @State() csatQuestion = '';
  @State() csatThankYou = '';

  /**
   * Default payloads sent to the channel when the user picks a rating. These
   * fill the CALM `csat_score` slot via the response-button `/SetSlots` syntax.
   * A CSAT request from the bot can override these per-message.
   */
  private csatPayloads: { satisfied: string; unsatisfied: string } = {
    satisfied: '/SetSlots{"csat_score": "satisfied"}',
    unsatisfied: '/SetSlots{"csat_score": "unsatisfied"}',
  };

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
   * Emitted when conversation feedback is submitted. The `rating` value
   * matches the Rasa CALM `csat_score` slot vocabulary (`satisfied` /
   * `unsatisfied`).
   */
  @Event() chatWidgetFeedbackSubmitted: EventEmitter<{ rating: 'satisfied' | 'unsatisfied'; helpful: boolean }>;

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

  /**
   * If set to True, shows conversation feedback component at the bottom of the chat.
   * */
  @Prop() enableFeedback: boolean = false;

  /**
   * Text for the feedback question. If empty, feedback component will not be shown.
   * */
  @Prop() feedbackQuestionText: string = '';

  /**
   * Text for the thank you message after feedback submission. If empty, no thank you message will be shown.
   * */
  @Prop() feedbackThankYouText: string = '';

  /**
   * Text to display before the session start date in session divider
   * */
  @Prop() sessionStartedText: string = 'Session started on';

  /**
   * Font family to use for the widget. Defaults to 'Lato, sans-serif'
   * */
  @Prop() fontFamily: string = 'Lato, sans-serif';

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
    
    // Set the font family CSS custom property
    this.el.style.setProperty('--widget-font-family', this.fontFamily);
    
    const protocol = this.restEnabled ? 'http' : 'ws';

    this.client = new Rasa({ url: this.serverUrl, protocol, initialPayload, authenticationToken, senderId });

    this.client.on('connect', () => {
      this.isConnected = true;
      // widgetState connected needed for enabling input
      widgetState.getState().state.connected = true;
    });
    this.client.on('message', this.onNewMessage);
    this.client.on('loadHistory', this.loadHistory);
    this.client.on('sessionConfirm', this.sessionConfirm);
    this.client.on('disconnect', () => {
      this.isConnected = false;
      // widgetState connected needed for disabling input
      widgetState.getState().state.connected = false;
    });

    if (this.autoOpen) {
      this.toggleOpenState();
    }

    // If senderID is configured watch for storage change event (localStorage) and override chat history (sessionStorage)
    // This happens on tabs that are not in focus nor message was sent from that tab
    if (this.senderId) {
      window.onstorage = ev => {
        receiveChatHistoryEvent(ev, this.client.overrideChatHistory, this.senderId);
      };
    }
  }

  private scrollToBottom(): void {
    const container = this.el.shadowRoot.querySelector('.messenger__content-wrapper');

    if (container) {
      container.scrollTop = 0;
    }
  }

  private sessionConfirm = () => {
    this.chatSessionStarted.emit({ sessionId: this.client.sessionId });
  };

  private onNewMessage = (data: Message) => {
    // If senderID is configured (continuous session), tab is not in focus and user message was not sent from this tab do not render new server message
    if (this.senderId && !document.hasFocus() && !this.sentMessage) return;

    // Don't skip "no_feedback" messages - we need to add them to messages array to check for them
    // They will be filtered out in renderMessage so they don't display

    this.chatWidgetReceivedMessage.emit(data);
    const delay = data.type === MESSAGE_TYPES.SESSION_DIVIDER || data.sender === SENDER.USER ? 0 : configStore().messageDelay;
    
    // Reset feedback state on new session
    if (data.type === MESSAGE_TYPES.SESSION_DIVIDER) {
      this.feedbackSubmitted = false;
    }

    this.messageDelayQueue = this.messageDelayQueue.then(() => {
      return new Promise<void>(resolve => {
        // CSAT request: the bot is asking for a satisfaction rating
        // (e.g. via pattern_customer_satisfaction). Don't render it as a chat
        // bubble - trigger the thumbs feedback component instead.
        if (data.type === MESSAGE_TYPES.CSAT) {
          this.typingIndicator = false;
          this.handleCsatRequest(data as CsatMessage);
          resolve();
          return;
        }

        // CSAT request sent as a standard buttons message (the bot's
        // `utter_ask_csat_score` with `csat_score` button payloads). Intercept
        // it so it renders as the thumbs popup instead of in-chat buttons.
        if (data.type === MESSAGE_TYPES.QUICK_REPLY) {
          // TEMP DEBUG: surface the exact button payloads so CSAT detection can
          // be tuned to the bot's actual payload format.
          // eslint-disable-next-line no-console
          console.debug('[csat-debug] button payloads:', (data as QuickReplyMessage).replies?.map(reply => reply.reply));
        }
        if (this.enableFeedback && data.type === MESSAGE_TYPES.QUICK_REPLY && this.handleCsatButtons(data as QuickReplyMessage)) {
          this.typingIndicator = false;
          resolve();
          return;
        }

        // Check if this is a "no_feedback" message - if so, skip delay and clear typing indicator immediately
        const isNoFeedback = 'text' in data && data.text && (data.text as string).trim() === 'no_feedback';
        
        if (isNoFeedback) {
          // For "no_feedback" messages, don't show typing indicator and process immediately
          this.typingIndicator = false;
          messageQueueService.enqueueMessage(data);
          resolve();
          return;
        }

        this.typingIndicator = delay > 0;

        setTimeout(() => {
          messageQueueService.enqueueMessage(data);
          this.typingIndicator = false;
          
          // If senderID is configured and message was sent from this tab, broadcast event to share chat history with other tabs with same senderID 
          if (this.senderId && this.sentMessage) {
            debounce(() => {
              broadcastChatHistoryEvent(this.client.getChatHistory(), this.senderId);
              this.sentMessage = false;
            }, DEBOUNCE_THRESHOLD)();
          }
          resolve();
        }, delay);
      });
    });
  };

  /**
   * Activates the thumbs feedback component in response to a bot-driven CSAT
   * request. The question and thank-you text default to the widget props but
   * can be overridden per-request by the bot. Option payloads (sent to the
   * channel on submit) can likewise be overridden by the bot.
   */
  private handleCsatRequest(message: CsatMessage): void {
    // `enableFeedback` is the integrator's master opt-in for the CSAT UI. When
    // disabled, the request is ignored (and never rendered as a chat bubble).
    if (!this.enableFeedback) {
      return;
    }

    const satisfied = message.options?.find(option => option.value === 'satisfied');
    const unsatisfied = message.options?.find(option => option.value === 'unsatisfied');
    this.csatPayloads = {
      satisfied: satisfied?.payload || this.csatPayloads.satisfied,
      unsatisfied: unsatisfied?.payload || this.csatPayloads.unsatisfied,
    };
    this.csatQuestion = message.question || this.feedbackQuestionText;
    this.csatThankYou = message.thankYou || this.feedbackThankYouText;
    this.feedbackSubmitted = false;
    this.showFeedback = true;
  }

  /**
   * Detects a standard buttons message that is actually a CSAT request (its
   * button payloads set the `csat_score` slot, e.g. from the bot's
   * `utter_ask_csat_score`). When matched, the thumbs popup is shown using the
   * bot's own button payloads, and the buttons are NOT rendered in the chat.
   * Returns true when handled as CSAT, false otherwise.
   */
  private handleCsatButtons(message: QuickReplyMessage): boolean {
    if (!message.replies?.length) {
      return false;
    }

    let satisfiedPayload: string | undefined;
    let unsatisfiedPayload: string | undefined;
    for (const reply of message.replies) {
      const payload = reply.reply || '';
      const haystack = `${payload} ${reply.text || ''}`.toLowerCase();
      // Order matters: check the negative case first so "not satisfied" /
      // "unsatisfied" / "dissatisfied" don't get caught by the "satisfied" check.
      if (/unsatisf|dissatisf|not[_\s-]?satisf|negative/.test(haystack)) {
        unsatisfiedPayload = payload;
      } else if (/satisf|positive/.test(haystack)) {
        satisfiedPayload = payload;
      }
    }

    // Not a CSAT buttons message - let it render as normal quick replies.
    if (!satisfiedPayload && !unsatisfiedPayload) {
      return false;
    }

    this.csatPayloads = {
      satisfied: satisfiedPayload || this.csatPayloads.satisfied,
      unsatisfied: unsatisfiedPayload || this.csatPayloads.unsatisfied,
    };
    // Prefer the integrator's configured question/thank-you text; fall back to
    // the bot's button-message text.
    this.csatQuestion = this.feedbackQuestionText || message.text || '';
    this.csatThankYou = this.feedbackThankYouText;
    this.feedbackSubmitted = false;
    this.showFeedback = true;
    return true;
  }

  private loadHistory = (data: Message[]): void => {
    this.messages = data;
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
    const nextValue = !this.isOpen;
    this.isOpen = nextValue;
    this.client.reconnection(nextValue);
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
    this.sentMessage = true;
    // Reset feedback state when user sends a new message (new interaction turn)
    this.feedbackSubmitted = false;
    this.showFeedback = false;
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
    this.sentMessage = true;
    // Reset feedback state when user selects a quick reply (new interaction turn)
    this.feedbackSubmitted = false;
    this.showFeedback = false;
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

  @Listen('feedbackSubmitted')
  // @ts-ignore-next-line
  private handleFeedbackSubmitted(event: CustomEvent<{ rating: 'satisfied' | 'unsatisfied'; helpful: boolean }>) {
    // Set feedbackSubmitted to prevent showing feedback again in this conversation
    this.feedbackSubmitted = true;
    
    // Allow time for thank you message to show, then hide the component
    setTimeout(() => {
      this.showFeedback = false;
    }, 3500); // 3.5 seconds to allow thank you message to show and fade

    // Send the rating to the bot through the normal channel so the active CSAT
    // flow advances and the `csat_score` slot is filled. The payload is sent
    // silently: it does not appear as a user message bubble in the chat.
    const payload = this.csatPayloads[event.detail.rating];
    if (payload) {
      this.client.sendSilentMessage(payload);
    }

    // Emit the event safely
    try {
      if (this.chatWidgetFeedbackSubmitted && this.chatWidgetFeedbackSubmitted.emit) {
        this.chatWidgetFeedbackSubmitted.emit(event.detail);
      }
    } catch (error) {
      // Silently handle event emission errors
    }
  }

  private getAltText() {
    return this.isOpen ? 'Close Chat' : 'Open Chat';
  }

  private toggleFullscreenMode = () => {
    this.isFullScreen = !this.isFullScreen;
  };

  /**
   * Reacts to runtime changes of the `authentication-token` attribute / prop.
   *
   * Without this watcher, the token is captured once in `componentWillLoad`
   * and locked into the underlying Rasa client. Host pages that set the token
   * asynchronously (after the custom element is already in the DOM) would end
   * up with an empty/stale token for the entire lifetime of the widget,
   * causing every request to be sent without the `Authorization` header.
   */
  @Watch('authenticationToken')
  onAuthenticationTokenChange(newToken: string, oldToken: string) {
    if (newToken === oldToken) return;
    setConfigStore({ authenticationToken: newToken });
    if (this.client) {
      this.client.updateAuthenticationToken(newToken);
    }
  }

  @Watch('messages')
  onMessagesChange() {
    if (this.cachedMessages.length !== this.messages.length) {
      const previousLength = this.cachedMessages.length;
      const renderedMessages = this.messages.map((message, key) => {
        const rendered = this.renderMessage(message, false, key);
        // If message was filtered out (no_feedback) and it's the newly added message, complete rendering to unblock the queue
        if (rendered === null && 'text' in message && message.text && (message.text as string).trim() === 'no_feedback' && key >= previousLength) {
          // Complete rendering for filtered messages to prevent queue from getting stuck
          setTimeout(() => {
            messageQueueService.completeRendering();
          }, 0);
        }
        return rendered;
      });
      this.cachedMessages = renderedMessages;
    }
  }

  private renderMessage(message: Message, isHistory = false, key) {
    // Always filter out "no_feedback" messages - these are control messages from Rasa
    // This filtering is independent of feedback settings (enableFeedback prop)
    if ('text' in message && message.text && (message.text as string).trim() === 'no_feedback') {
      return null;
    }

    switch (message.type) {
      case MESSAGE_TYPES.SESSION_DIVIDER:
        return <rasa-session-divider sessionStartDate={message.startDate} sessionStartedText={this.sessionStartedText} key={key}></rasa-session-divider>;
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
        case MESSAGE_TYPES.RATING:
          return (
            <chat-message sender={message.sender} key={key} timestamp={message.timestamp}>
              <rasa-rating
                text={message.text}
                options={JSON.stringify(message.options)}
                message={message.message}
                onRatingSelected={(_event) => {
                  // Handle rating selection if needed
                }}
              ></rasa-rating>
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
            <Messenger 
              isOpen={this.isOpen} 
              toggleFullScreenMode={this.toggleFullscreenMode} 
              isFullScreen={this.isFullScreen}
              hasFeedback={this.showFeedback && this.isOpen}
            >
              {this.messageHistory.map((message, key) => this.renderMessage(message, true, key))}
              {this.cachedMessages}
              {this.typingIndicator && <rasa-typing-indicator></rasa-typing-indicator>}
              {this.showFeedback && this.isOpen && (
                <rasa-conversation-feedback 
                  show={this.showFeedback}
                  submitted={this.feedbackSubmitted}
                  questionText={this.csatQuestion}
                  thankYouText={this.csatThankYou}
                  onFeedbackSubmitted={this.handleFeedbackSubmitted}
                ></rasa-conversation-feedback>
              )}
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
