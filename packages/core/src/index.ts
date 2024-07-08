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
  authorizationToken?: string;
}

export class Rasa extends EventEmitter {
  sessionId: string;
  private storageService: StorageService;
  connection: HTTPConnection | WebSocketConnection;
  initialPayload: string | undefined;

  public constructor({ url, protocol = 'ws', initialPayload, authorizationToken }: Options) {
    super();
    this.sessionId = window.crypto.randomUUID();
    this.initialPayload = initialPayload;
    this.storageService = new StorageService();
    const Connection = protocol === 'ws' ? WebSocketConnection : HTTPConnection;
    this.connection = new Connection({ url, authorizationToken });
    this.initSocketEvents();
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
    this.storageService.setSession(this.sessionId, sessionStart);
    this.trigger('message', {
      type: 'sessionDivider',
      startDate: sessionStart,
    });
    if (this.initialPayload) {
      this.connection.sendMessage(this.initialPayload, this.sessionId, this.onMessageReceive);
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
      this.loadChatHistory();
      this.trigger('connect');
    });

    this.connection.socket.on('disconnect', () => {
      this.trigger('disconnect');
    });

    this.connection.socket.on('bot_uttered', (data: unknown) => {
      this.onBotResponse(data);
    });

    this.connection.socket.on('session_confirm', () => {
      this.onSessionConfirm();
    });
  }

  private onMessageReceive = (messages: MessageResponse[]): void => {
    if (!messages) return;
    messages.forEach(message => {
      this.onBotResponse(message);
    });
  };

  public connect(): void {
    this.sessionId = window.crypto.randomUUID();
    this.connection.connect();
    this.initHttpSession();
  }

  public disconnect(): void {
    this.connection.disconnect();
  }

  public sendMessage(message: string, isQuickReply = false, messageKey?: number): void {
    this.connection.sendMessage(message, this.sessionId, this.onMessageReceive);
    this.storageService.setMessage({ sender: SENDER.USER, text: message }, this.sessionId);
    if (isQuickReply && messageKey) {
      this.storageService.setQuickReplyValue(message, messageKey, this.sessionId);
    }
  }
}

export * from './errors';
export * from './message-parser';
export * from './constants';
