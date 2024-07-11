import { CustomErrorClass, ErrorSeverity } from './errors';

import { EventEmitter } from './EventEmitter';
import { HTTPConnection } from './connection-strategy/HTTPConnection';
import { MessageResponse } from './types/server-response.types';
import { SENDER } from './constants';
import { StorageService } from './services/storage.service';
import { WebSocketConnection } from './connection-strategy/WebSocketConnection';
import { messageParser } from './message-parser/messageParser';
import { parseChatHistory } from './message-parser/utils/parse-chat-history';

interface Options {
  url: string;
  protocol?: 'http' | 'ws';
  initialPayload?: string;
  authenticationToken?: string;
  senderId?: string;
}

export class Rasa extends EventEmitter {
  private _sessionId: string;
  private storageService: StorageService;
  private connection: HTTPConnection | WebSocketConnection;
  private initialPayload: string | undefined;
  private isInitialConnection: boolean;
  private isSessionConfirmed: boolean;
  private senderId?: string;

  public constructor({ url, protocol = 'ws', initialPayload, authenticationToken, senderId }: Options) {
    super();
    this.senderId = senderId;
    this._sessionId = senderId ? senderId : window.crypto.randomUUID();
    this.initialPayload = initialPayload;
    this.storageService = new StorageService();
    this.isInitialConnection = true;
    this.isSessionConfirmed = false;
    const Connection = protocol === 'ws' ? WebSocketConnection : HTTPConnection;
    this.connection = new Connection({ url, authenticationToken });
    this.initSocketEvents();
  }

  public get sessionId(): string {
    return this._sessionId;
  }

  private set sessionId(value) {
    this._sessionId = value;
  }

  private onBotResponse(data: unknown): void {
    const timestamp = new Date();
    this.storageService.setMessage({ sender: SENDER.BOT, ...(data as object), timestamp }, this.sessionId);
    this.trigger('message', messageParser({ ...(data as object), timestamp }, SENDER.BOT));
  }

  private loadChatHistory(): void {
    const chatHistory = this.storageService.getChatHistory() || [];
    this.trigger('loadHistory', parseChatHistory(chatHistory));
  }

  private onSessionConfirm(): void {
    const sessionStart = new Date();
    const isContinuesSession = this.storageService.setSession(this.sessionId, sessionStart);
    if (!isContinuesSession) {
      this.trigger('message', {
        type: 'sessionDivider',
        startDate: sessionStart,
      });
      // @TODO ask Tom about this behavior
      if (this.initialPayload) {
        this.connection.sendMessage(this.initialPayload, this.sessionId, this.onMessageReceive);
      }
    }
  }

  private initHttpSession(): void {
    if (this.connection instanceof HTTPConnection) {
      this.onSessionConfirm();
      this.loadChatHistory();
    }
  }

  private initSocketEvents(): void {
    if (this.connection instanceof HTTPConnection) return;

    this.connection.socket.on('connect', () => {
      this.connection.sessionRequest(this.sessionId);
      if (this.isInitialConnection) {
        this.loadChatHistory();
        this.isInitialConnection = false;
      }
      this.trigger('connect');
    });

    this.connection.socket.on('disconnect', () => {
      this.trigger('disconnect');
    });

    this.connection.socket.on('bot_uttered', (data: unknown) => {
      this.onBotResponse(data);
    });

    this.connection.socket.on('session_confirm', () => {
      if (!this.isSessionConfirmed) {
        this.onSessionConfirm();
        this.isSessionConfirmed = true;
      }
    });

    this.connection.socket.on('connect_error', () => {
      // The setTimeout function schedules the error to be thrown after the current execution context,
      // allowing the reconnection logic of Socket.IO to continue.
      setTimeout(() => {
        throw new CustomErrorClass(ErrorSeverity.Error, 'Server error');
      }, 0);
    });

    this.connection.socket.on('reconnect_attempt', attemptNumber => {
      console.log(`Reconnection attempt #${attemptNumber}`);
    });
  }

  private onMessageReceive = (messages: MessageResponse[]): void => {
    if (!messages) return;
    messages.forEach(message => {
      this.onBotResponse(message);
    });
  };

  public connect(): void {
    this.sessionId = this.senderId ? this.senderId : window.crypto.randomUUID();
    this.connection.connect();
    this.initHttpSession();
  }

  public disconnect(): void {
    this.connection.disconnect();
    this.isSessionConfirmed = false;
    this.isInitialConnection = true;
  }

  public sendMessage(
    { text, reply, timestamp }: { text: string; reply?: string; timestamp?: Date },
    isQuickReply = false,
    messageKey?: number,
  ): void {
    this.connection.sendMessage(reply ?? text, this.sessionId, this.onMessageReceive);
    this.storageService.setMessage({ sender: SENDER.USER, text, timestamp }, this.sessionId);
    if (isQuickReply && messageKey && reply) {
      this.storageService.setQuickReplyValue(reply, messageKey, this.sessionId);
    }
  }
}

export * from './errors';
export * from './message-parser';
export * from './constants';
