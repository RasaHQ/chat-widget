import { EventEmitter } from './EventEmitter';
import { HTTPConnection } from './connection-strategy/HTTPConnection';
import { SENDER } from './constants';
import { StorageService } from './services/storage.service';
import { WebSocketConnection } from './connection-strategy/WebSocketConnection';
import { messageParser } from './message-parser/messageParser';
import { parseChatHistory } from './message-parser/utils/parse-chat-history';
import { v4 as uuidv4 } from 'uuid';

interface Options {
  url: string;
  protocol?: 'http' | 'ws';
  initialPayload?: string;
  authenticationToken?: string;
  senderId?: string;
  /**
   * Render responses the server streams over the socket (`stream_start` / `stream_chunk` / `stream_end`),
   * as sent by Rasa Mantle and Rasa Pro >= 3.21. Has no effect with the HTTP protocol.
   */
  enableServerStreaming?: boolean;
}

interface ActiveStream {
  id: string;
  text: string;
  // Set once the stream received visible text and was announced with `streamStart`
  timestamp?: Date;
  storageIndex?: number;
}

export class Rasa extends EventEmitter {
  private _sessionId: string;
  private storageService: StorageService;
  private connection: HTTPConnection | WebSocketConnection;
  private initialPayload: string | undefined;
  private isInitialConnection: boolean;
  private isSessionConfirmed: boolean;
  private senderId?: string;
  private activeStream: ActiveStream | null = null;

  public constructor({
    url,
    protocol = 'ws',
    initialPayload,
    authenticationToken,
    senderId,
    enableServerStreaming = false,
  }: Options) {
    super();
    this.senderId = senderId;
    this._sessionId = senderId ? senderId : uuidv4();
    this.initialPayload = initialPayload;
    this.storageService = new StorageService();
    this.isInitialConnection = true;
    this.isSessionConfirmed = false;
    const Connection = protocol === 'ws' ? WebSocketConnection : HTTPConnection;
    const { onConnect, onDisconnect, onBotResponse, onSessionConfirm, onStreamStart, onStreamChunk, onStreamEnd } = this;
    this.connection = new Connection({
      url,
      authenticationToken,
      onConnect,
      onDisconnect,
      onBotResponse,
      onSessionConfirm,
      ...(enableServerStreaming ? { onStreamStart, onStreamChunk, onStreamEnd } : {}),
    });
  }

  public get sessionId(): string {
    return this._sessionId;
  }

  private set sessionId(value) {
    this._sessionId = value;
  }

  private loadChatHistory(): void {
    const chatHistory = this.storageService.getChatHistory() || [];
    this.trigger('loadHistory', parseChatHistory(chatHistory));
  }

  //#region Connection Event Handlers
  private onBotResponse = (data: unknown): void => {
    this.finishStream();
    const timestamp = new Date();
    this.storageService.setMessage({ sender: SENDER.BOT, ...(data as object), timestamp }, this.sessionId);
    this.trigger('message', messageParser({ ...(data as object), timestamp }, SENDER.BOT));
  };

  private onSessionConfirm = (): void => {
    if (this.isSessionConfirmed) {
      return;
    }
    this.isSessionConfirmed = true;
    const sessionStart = new Date();
    const isContinuesSession = this.storageService.setSession(this.sessionId, sessionStart);
    this.trigger('sessionConfirm');
    if (!isContinuesSession) {
      this.trigger('message', {
        type: 'sessionDivider',
        startDate: sessionStart,
      });
      // @TODO ask Tom about this behavior
      if (this.initialPayload) {
        this.connection.sendMessage(this.initialPayload, this.sessionId);
      }
    }
  };

  private onConnect = (isReconnected = false) => {
    if (isReconnected) {
      this.connection.sessionRequest(this.sessionId);
      this.trigger('connect');
      return;
    }

    this.sessionId = this.senderId ? this.senderId : uuidv4();
    this.connection.sessionRequest(this.sessionId);

    if (this.isInitialConnection) {
      this.loadChatHistory();
      this.isInitialConnection = false;
    }
    this.trigger('connect');
  };

  private onDisconnect = () => {
    this.finishStream();
    this.isSessionConfirmed = false;
    this.isInitialConnection = true;
    this.trigger('disconnect');
  };

  private onStreamStart = (): void => {
    // A stream that never received `stream_end` is completed with the text it got so far
    this.finishStream();
    this.activeStream = { id: uuidv4(), text: '' };
  };

  private onStreamChunk = (data: unknown): void => {
    const chunk = (data as { text?: unknown } | null)?.text;
    if (typeof chunk !== 'string' || !chunk) return;
    if (!this.activeStream) {
      this.onStreamStart();
    }
    const stream = this.activeStream as ActiveStream;
    stream.text += chunk;

    if (stream.timestamp) {
      this.trigger('streamChunk', { streamId: stream.id, text: stream.text });
      return;
    }
    // A stream is announced on its first visible text, so whitespace-only streams never render an empty bubble
    if (!stream.text.trim()) return;
    stream.timestamp = new Date();
    stream.storageIndex = this.storageService.setMessage(
      { sender: SENDER.BOT, text: stream.text, timestamp: stream.timestamp },
      this.sessionId,
    );
    this.trigger('streamStart', { streamId: stream.id, text: stream.text, timestamp: stream.timestamp });
  };

  private onStreamEnd = (): void => {
    this.finishStream();
  };

  private finishStream(): void {
    const stream = this.activeStream;
    this.activeStream = null;
    if (!stream?.timestamp) return;
    const response = { text: stream.text, timestamp: stream.timestamp };
    this.storageService.updateBotMessage({ sender: SENDER.BOT, ...response }, stream.storageIndex as number, this.sessionId);
    this.trigger('streamEnd', { streamId: stream.id, message: messageParser(response, SENDER.BOT) });
  }
  //#endregion

  //#region Public Methods
  public connect(): void {
    this.connection.connect();
  }

  public disconnect(): void {
    this.connection.disconnect();
  }

  public sendMessage(
    { text, reply, timestamp }: { text: string; reply?: string; timestamp?: Date },
    isQuickReply = false,
    messageKey?: number,
  ): void {
    this.connection.sendMessage(reply ?? text, this.sessionId);
    this.storageService.setMessage({ sender: SENDER.USER, text, timestamp }, this.sessionId);
    if (isQuickReply && messageKey && reply) {
      this.storageService.setQuickReplyValue(reply, messageKey, this.sessionId);
    }
  }

  /**
   * Sends a payload to the channel without echoing it as a user message or
   * persisting it to the chat history. Used for out-of-band signals such as
   * CSAT feedback, where the user's selection should advance the conversation
   * (e.g. fill the `csat_score` slot) but must not appear as a chat bubble.
   */
  public sendSilentMessage(payload: string): void {
    this.connection.sendMessage(payload, this.sessionId);
  }

  public reconnection(value: boolean): void {
    this.connection.reconnection(value);
  }

  public updateAuthenticationToken(newToken: string): void {
    this.connection.updateAuthenticationToken(newToken);
  }

  public overrideChatHistory = (chatHistoryString: string): void => {
    this.storageService.overrideChatHistory(chatHistoryString);
    this.loadChatHistory();
  }

  public getChatHistory(): string {
    return JSON.stringify(this.storageService.getChatHistory());
  }
  //#endregion
}

export * from './errors';
export * from './message-parser';
export * from './constants';
