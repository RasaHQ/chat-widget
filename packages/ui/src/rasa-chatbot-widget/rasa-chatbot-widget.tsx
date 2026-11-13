import { Component, Element, Event, EventEmitter, Listen, Prop, State, Watch, h } from '@stencil/core/internal';
import { v4 as uuidv4 } from 'uuid';

import { MESSAGE_TYPES, Message, CsatMessage, QuickReply, QuickReplyMessage, Rasa, SENDER } from '@rasahq/chat-widget-sdk';

import { Messenger } from '../components/messenger';
import { configStore, setConfigStore } from '../store/config-store';
import { errorMessageService } from '../store/error-message';
import { messageQueueService } from '../store/message-queue';
import { widgetState } from '../store/widget-state-store';
import { isValidURL } from '../utils/validate-url';
import { broadcastChatHistoryEvent, receiveChatHistoryEvent } from '../utils/eventChannel';
import { isMobile } from '../utils/isMobile';
import { debounce } from '../utils/debounce';
import { parseSuggestedPrompts } from '../utils/suggested-prompts';
import { WidgetTheme } from '../utils/widget-theme';
import {
  BrandPresence,
  BubbleStyle,
  ButtonStyle,
  Density,
  Elevation,
  HeaderLayout,
  HeadingFont,
  HeadingWeight,
  TextSize,
  WidgetPreset,
  appearanceAttributes,
  appearanceStyle,
  resolveAppearance,
} from '../utils/appearance';
import {
  detectCsatButtons,
  isCsatAnsweredFor,
  markCsatAnswered,
  clearCsatAnswered,
  CsatLikeMessage,
} from '../utils/csat';
import { CONVERSATION_FEEDBACK_TIMINGS } from '../components/conversation-feedback/conversation-feedback.timings';
import { DEBOUNCE_THRESHOLD, DISCONNECT_TIMEOUT, TYPING_INDICATOR_TIMEOUT } from './constants';

/**
 * Wait long enough for both the popup's opacity fade AND the chat's slide
 * (which the SCSS triggers when `--with-feedback` is removed) to fully
 * settle before tearing the popup out of the DOM. Removing it earlier lets
 * a DOM-removal repaint land in the middle of the chat slide, which reads
 * as a small "cut" at the end of the motion. The slide duration here
 * mirrors the CSS `transition: padding-bottom 1s linear` on
 * `.messenger__content`.
 */
const CONTENT_SLIDE_MS = 1000;
const FEEDBACK_UNMOUNT_DELAY_MS =
  CONVERSATION_FEEDBACK_TIMINGS.THANK_YOU_HOLD_MS + CONTENT_SLIDE_MS + 150;

@Component({
  tag: 'rasa-chatbot-widget',
  styleUrl: 'rasa-chatbot-widget.scss',
  shadow: true,
})
export class RasaChatbotWidget {
  private client: Rasa;
  private messageDelayQueue: Promise<void> = Promise.resolve();
  private disconnectTimeout: NodeJS.Timeout | null = null;
  private awaitingBotResponseTimeout: NodeJS.Timeout | null = null;
  // Only the first bot message after a sent message (or at the start of a session) waits for the message delay
  private delayNextBotMessage = true;
  private sentMessage = false;

  /**
   * The CSAT prompt currently driving the thumbs popup. Captured so the
   * `feedbackSubmitted` handler can persist a per-prompt answered hash to
   * sessionStorage, which makes the answered check survive a page refresh
   * even when the server replays the same prompt on reconnect.
   */
  private currentCsatMessage: CsatLikeMessage | null = null;

  @Element() el: HTMLRasaChatbotWidgetElement;
  @State() isOpen: boolean = false;
  @State() isFullScreen: boolean = isMobile();
  @State() messageHistory: Message[] = [];
  @State() messages: Message[] = [];
  @State() typingIndicator: boolean = false;
  @State() awaitingBotResponse: boolean = false;
  @State() cachedMessages: Element[] = [];
  @State() isConnected = false;
  @State() showFeedback = false;
  @State() feedbackSubmitted = false;
  /**
   * True from the moment the thank-you starts fading out until the popup
   * fully unmounts. Used to collapse the chat content's bottom padding in
   * sync with the popup's fade, so the chat bubbles glide down as the popup
   * disappears - one continuous motion instead of fade-then-snap.
   */
  @State() isFeedbackDismissing = false;
  @State() csatQuestion = '';
  @State() csatThankYou = '';
  @State() showScrollToBottom = false;

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
   * Delay between receiving and printing the first message of a bot reply. The rest follow right away.
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
   * Font family to use for the widget. Defaults to the visitor's system font.
   * */
  @Prop() fontFamily: string = '';

  /**
   * Color theme. One of `light` (default), `dark`, `auto` (follows the visitor's OS setting),
   * or a designer preset: `midnight`, `ocean`, `forest`, `sunset`, `mono`.
   * */
  @Prop({ reflect: true }) theme: WidgetTheme = 'light';

  /**
   * Which corner of the page the launcher and chat window are anchored to.
   * */
  @Prop() position: 'bottom-right' | 'bottom-left' = 'bottom-right';

  /**
   * Line shown under the title in the header. When empty, the header shows the connection status.
   * */
  @Prop() widgetSubtitle: string = '';

  /**
   * Text shown next to the launcher icon. When empty, the launcher is icon-only.
   * */
  @Prop() launcherLabel: string = '';

  /**
   * Hides the close button in the chat header.
   * */
  @Prop() hideCloseButton: boolean = false;

  /**
   * Text shown at the top of an empty conversation, above the first messages.
   * */
  @Prop() welcomeMessage: string = '';

  /**
   * Conversation starters shown as tappable chips until the visitor sends a message.
   * Accepts an array, a JSON array string, or a comma separated string.
   * */
  @Prop() suggestedPrompts: string[] | string = [];

  /**
   * Header status text while the widget is connected and no subtitle is set.
   * */
  @Prop() connectedText: string = 'Online';

  /**
   * Header status text while the widget is connecting and no subtitle is set.
   * */
  @Prop() disconnectedText: string = 'Connecting…';

  /**
   * Starting point for the look: `precise` (quiet, monochrome), `balanced` or `bold`
   * (brand-color header, heavy type). Any appearance prop set on its own overrides the preset.
   * */
  @Prop() preset?: WidgetPreset;

  /**
   * Brand color used for the launcher, the visitor's messages, buttons and accents.
   * A hex value also derives readable text colors for use on and around it.
   * */
  @Prop() accentColor?: string;

  /**
   * How much of the window carries the brand color: `subtle` (only the launcher, avatar and
   * send button), `balanced`, or `expressive` (a brand-color header above the conversation).
   * */
  @Prop() brandPresence?: BrandPresence;

  /**
   * Corner radius of the chat window in px. Bubbles, buttons, the composer and the launcher follow it.
   * */
  @Prop() cornerRadius?: number;

  /**
   * Message bubble shape: `tail`, `soft` (evenly rounded) or `minimal` (no bubble behind bot messages).
   * */
  @Prop() bubbleStyle?: BubbleStyle;

  /**
   * Quick reply and suggestion buttons: `outline`, `soft` (tinted), `solid`, or `auto` to follow the brand presence.
   * */
  @Prop() buttonStyle?: ButtonStyle;

  /**
   * Shadow depth of the chat window and launcher: `flat` (border only), `soft` or `lifted`.
   * */
  @Prop() elevation?: Elevation;

  /**
   * Typeface for the header title and greeting: `sans`, `rounded` or `serif` (system fonts).
   * */
  @Prop() headingFont?: HeadingFont;

  /**
   * Weight of the header title and greeting: `regular`, `semibold` or `heavy`.
   * */
  @Prop() headingWeight?: HeadingWeight;

  /**
   * Size of message text: `small`, `medium` or `large`.
   * */
  @Prop() textSize?: TextSize;

  /**
   * Header layout: `compact`, or `hero` with a large greeting under the title.
   * */
  @Prop() headerLayout?: HeaderLayout;

  /**
   * Greeting shown in the header when `headerLayout` is `hero`.
   * */
  @Prop() headerGreeting: string = 'How can we help today?';

  /**
   * Spacing between messages: `comfortable` or `compact`.
   * */
  @Prop() density?: Density;

  private appliedStyleKeys: string[] = [];

  private getAppearance() {
    const { preset, theme, accentColor, fontFamily, brandPresence, cornerRadius, bubbleStyle, buttonStyle, elevation, headingFont, headingWeight, textSize, headerLayout, density } = this;
    const input = { preset, theme, accentColor, fontFamily, brandPresence, cornerRadius, bubbleStyle, buttonStyle, elevation, headingFont, headingWeight, textSize, headerLayout, density };
    return { input, appearance: resolveAppearance(input) };
  }

  private applyAppearance() {
    const { input, appearance } = this.getAppearance();
    Object.entries(appearanceAttributes(appearance)).forEach(([name, value]) => this.el.setAttribute(name, value));
    const style = appearanceStyle(appearance, input);
    this.appliedStyleKeys.filter(key => !(key in style)).forEach(key => this.el.style.removeProperty(key));
    Object.entries(style).forEach(([key, value]) => this.el.style.setProperty(key, value));
    this.appliedStyleKeys = Object.keys(style);
  }

  componentWillRender() {
    this.applyAppearance();
  }

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
      this.stopAwaitingBotResponse();
    });
    // No reply is coming after a failed request, so stop the typing indicator
    errorMessageService.getState().onChange('errorMessage', error => {
      if (error) this.stopAwaitingBotResponse();
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

  // The conversation is a `column-reverse` scroller, so scrollTop is 0 at the bottom and goes negative upwards.
  private handleScroll = (event: Event): void => {
    const target = event.target as HTMLElement;
    const shouldShow = target.scrollTop < -120;
    if (shouldShow !== this.showScrollToBottom) {
      this.showScrollToBottom = shouldShow;
    }
  };

  private handleSuggestedPrompt = (prompt: string): void => {
    if (!this.isConnected) return;
    this.sendMessageHandler(new CustomEvent('sendMessageHandler', { detail: prompt }));
  };

  private get hasUserMessage(): boolean {
    return [...this.messageHistory, ...this.messages].some(message => 'sender' in message && message.sender === SENDER.USER);
  }

  private sessionConfirm = () => {
    this.chatSessionStarted.emit({ sessionId: this.client.sessionId });
  };

  // Shows the typing indicator from the moment a message is sent until the bot replies
  private startAwaitingBotResponse(): void {
    clearTimeout(this.awaitingBotResponseTimeout);
    this.awaitingBotResponse = true;
    this.delayNextBotMessage = true;
    this.awaitingBotResponseTimeout = setTimeout(this.stopAwaitingBotResponse, TYPING_INDICATOR_TIMEOUT);
  }

  private stopAwaitingBotResponse = (): void => {
    clearTimeout(this.awaitingBotResponseTimeout);
    this.awaitingBotResponseTimeout = null;
    this.awaitingBotResponse = false;
  };

  private onNewMessage = (data: Message) => {
    const isBotMessage = 'sender' in data && data.sender === SENDER.BOT;
    // The bot replied, from here on the message delay queue below controls the typing indicator
    if (isBotMessage) {
      this.stopAwaitingBotResponse();
    }

    // If senderID is configured (continuous session), tab is not in focus and user message was not sent from this tab do not render new server message
    if (this.senderId && !document.hasFocus() && !this.sentMessage) return;

    this.chatWidgetReceivedMessage.emit(data);
    // Only the first message of a bot reply waits for the message delay, the rest are printed right away
    if (data.type === MESSAGE_TYPES.SESSION_DIVIDER) this.delayNextBotMessage = true;
    const delay = isBotMessage && this.delayNextBotMessage ? configStore().messageDelay : 0;
    if (isBotMessage) this.delayNextBotMessage = false;

    // Reset feedback state on new session
    if (data.type === MESSAGE_TYPES.SESSION_DIVIDER) {
      this.feedbackSubmitted = false;
      // A new session means the per-prompt "answered" hash from the previous
      // session is stale: the bot will likely reuse the same CSAT template
      // (same question + same option payloads), which would otherwise
      // hash-match the old answer and silently suppress the popup for the
      // user's first CSAT in the fresh conversation. Replay-protection
      // within a single session still works - it only kicks in for prompts
      // marked answered AFTER this point.
      clearCsatAnswered();
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
        if (this.enableFeedback && data.type === MESSAGE_TYPES.QUICK_REPLY) {
          const csatMessage = data as QuickReplyMessage;
          if (detectCsatButtons(csatMessage)) {
            // Server replays of an already-answered prompt (e.g. on reconnect
            // after a refresh) must NOT re-open the popup. We compare a
            // content hash rather than relying on a global boolean so that
            // a genuinely new CSAT request still shows the popup.
            if (isCsatAnsweredFor(csatMessage)) {
              this.typingIndicator = false;
              resolve();
              return;
            }
            // Genuinely fresh CSAT request: clear any stale answered hash so
            // a refresh before the user rates correctly re-opens the popup.
            clearCsatAnswered();
            this.handleCsatButtons(csatMessage);
            this.typingIndicator = false;
            resolve();
            return;
          }
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

    // Replay of an already-rated CSAT (e.g. server re-pushed it after a
    // reconnect): keep the popup closed.
    if (isCsatAnsweredFor(message)) {
      return;
    }

    clearCsatAnswered();
    const satisfied = message.options?.find(option => option.value === 'satisfied');
    const unsatisfied = message.options?.find(option => option.value === 'unsatisfied');
    this.csatPayloads = {
      satisfied: satisfied?.payload || this.csatPayloads.satisfied,
      unsatisfied: unsatisfied?.payload || this.csatPayloads.unsatisfied,
    };
    this.csatQuestion = message.question || this.feedbackQuestionText;
    this.csatThankYou = message.thankYou || this.feedbackThankYouText;
    this.feedbackSubmitted = false;
    this.currentCsatMessage = message;
    this.showFeedback = true;
  }

  /**
   * Detects a standard buttons message that is actually a CSAT request and, if
   * so, shows the thumbs popup using the bot's own button payloads instead of
   * rendering the buttons in the chat. Returns true when handled as CSAT
   * (even if the popup is suppressed because the same prompt was already
   * answered earlier in this tab's session).
   */
  private handleCsatButtons(message: QuickReplyMessage): boolean {
    const detected = detectCsatButtons(message);
    if (!detected) {
      return false;
    }

    // Already answered this exact prompt in this session: still classify as
    // CSAT (so the caller strips the bubble from the chat), but do not
    // re-open the popup.
    if (isCsatAnsweredFor(message)) {
      return true;
    }

    this.csatPayloads = {
      satisfied: detected.satisfied || this.csatPayloads.satisfied,
      unsatisfied: detected.unsatisfied || this.csatPayloads.unsatisfied,
    };
    // Prefer the integrator's configured question/thank-you text; fall back to
    // the bot's button-message text.
    this.csatQuestion = this.feedbackQuestionText || message.text || '';
    this.csatThankYou = this.feedbackThankYouText;
    this.feedbackSubmitted = false;
    this.currentCsatMessage = message;
    this.showFeedback = true;
    return true;
  }

  private loadHistory = (data: Message[]): void => {
    if (!this.enableFeedback) {
      this.messages = data;
      return;
    }

    // Strip CSAT prompts from the rendered history so the bot's raw
    // "Was this helpful? [Yes] [No]" payload (whether sent as a typed CSAT
    // response or as standard quick-reply buttons) never appears as a chat
    // bubble after a page refresh.
    //
    // We intentionally do NOT re-open the thumbs popup from history: a
    // CSAT request belongs to the live conversation in which it was sent,
    // and once the page has been refreshed (rated or not) the prompt is
    // considered expired. The popup will reappear when the bot sends a
    // fresh CSAT in the new session.
    this.messages = data.filter(message => {
      if (message.type === MESSAGE_TYPES.CSAT) return false;
      if (
        message.type === MESSAGE_TYPES.QUICK_REPLY &&
        !!detectCsatButtons(message as QuickReplyMessage)
      ) {
        return false;
      }
      return true;
    });
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
    this.startAwaitingBotResponse();
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
    this.startAwaitingBotResponse();
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
    // Persist a per-prompt answered hash so a refresh - even a refresh that
    // races the bot's silent ack - does not re-open the popup for the prompt
    // the user just rated. Done synchronously, before any async work.
    if (this.currentCsatMessage) {
      markCsatAnswered(this.currentCsatMessage);
    }

    // Flip into the "dismissing" phase immediately. The chat slide is gated
    // on a CSS `transition-delay` (see `.messenger--feedback-dismissing
    // .messenger__content` in rasa-chatbot-widget.scss) that waits out the
    // 1.5s thank-you hold before actually sliding. No JS timer needed to
    // schedule it - the CSS timeline handles the choreography.
    this.isFeedbackDismissing = true;

    // The only timer left in the feedback flow: unmount the popup once
    // the CSS animations (thank-you fade + chat slide) have all settled.
    // CSS can hide an element but can't remove it from the DOM, so this
    // one setTimeout stays.
    setTimeout(() => {
      this.showFeedback = false;
      this.isFeedbackDismissing = false;
      this.currentCsatMessage = null;
    }, FEEDBACK_UNMOUNT_DELAY_MS);

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

  private handleLauncherKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleOpenState();
    }
  };

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

  /**
   * Keeps display settings live when the host page changes them after load.
   */
  @Watch('widgetTitle')
  @Watch('displayTimestamp')
  @Watch('toggleFullScreen')
  @Watch('botIcon')
  @Watch('widgetIcon')
  @Watch('inputMessagePlaceholder')
  onDisplayConfigChange() {
    const { widgetTitle, displayTimestamp, toggleFullScreen, botIcon, widgetIcon, inputMessagePlaceholder } = this;
    setConfigStore({ widgetTitle, displayTimestamp, toggleFullScreen, botIcon, widgetIcon, inputMessagePlaceholder });
  }

  @Watch('messages')
  onMessagesChange() {
    if (this.cachedMessages.length !== this.messages.length) {
      this.cachedMessages = this.messages.map((message, key) => this.renderMessage(message, false, key));
    }
  }

  private renderMessage(message: Message, isHistory = false, key) {
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
      'rasa-chatbot-widget--left': this.position === 'bottom-left',
      'fullscreen': this.isFullScreen,
    };
    const prompts = this.hasUserMessage ? [] : parseSuggestedPrompts(this.suggestedPrompts);
    const greeting = this.getAppearance().appearance.headerLayout === 'hero' ? this.headerGreeting : '';

    return (
      <global-error-handler>
        <slot />
        <div class={widgetClassList}>
          <div class="rasa-chatbot-widget__container">
            <Messenger
              isOpen={this.isOpen}
              toggleFullScreenMode={this.toggleFullscreenMode}
              isFullScreen={this.isFullScreen}
              hasFeedback={this.showFeedback && this.isOpen && !this.isFeedbackDismissing}
              isFeedbackDismissing={this.isFeedbackDismissing}
              isConnected={this.isConnected}
              subtitle={this.widgetSubtitle}
              greeting={greeting}
              connectedText={this.connectedText}
              disconnectedText={this.disconnectedText}
              showCloseButton={!this.hideCloseButton}
              onClose={this.toggleOpenState}
              welcomeMessage={this.welcomeMessage}
              suggestedPrompts={prompts}
              onSuggestedPrompt={this.handleSuggestedPrompt}
              showScrollToBottom={this.showScrollToBottom}
              onScroll={this.handleScroll}
              onScrollToBottom={() => this.scrollToBottom()}
            >
              {this.messageHistory.map((message, key) => this.renderMessage(message, true, key))}
              {this.cachedMessages}
              {(this.typingIndicator || this.awaitingBotResponse) && <rasa-typing-indicator></rasa-typing-indicator>}
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
            <div
              role="button"
              tabindex={0}
              aria-expanded={this.isOpen ? 'true' : 'false'}
              onClick={this.toggleOpenState}
              onKeyDown={this.handleLauncherKeyDown}
              class={{ 'rasa-chatbot-widget__launcher': true, 'rasa-chatbot-widget__launcher--with-label': !!this.launcherLabel && !this.isOpen }}
              aria-label={this.getAltText()}
            >
              {configStore().widgetIcon ? (
                <img src={configStore().widgetIcon} class="rasa-chatbot-widget__launcher-image"></img>
              ) : this.isOpen ? (
                <rasa-icon-close-chat size={18} />
              ) : (
                <rasa-icon-chat />
              )}
              {this.launcherLabel && !this.isOpen && !configStore().widgetIcon && <span class="rasa-chatbot-widget__launcher-label">{this.launcherLabel}</span>}
            </div>
          </div>
        </div>
      </global-error-handler>
    );
  }
}
