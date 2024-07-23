import { EventEmitter } from './EventEmitter';
import { HTTPConnection } from './connection-strategy/HTTPConnection';
import { MessageResponse } from './types/server-response.types';
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
    this._sessionId = senderId ? senderId : uuidv4();
    this.initialPayload = initialPayload;
    this.storageService = new StorageService();
    this.isInitialConnection = true;
    this.isSessionConfirmed = false;
    const Connection = protocol === 'ws' ? WebSocketConnection : HTTPConnection;
    const { onConnect, onDisconnect, onBotResponse, onSessionConfirm } = this;
    this.connection = new Connection({
      url,
      authenticationToken,
      onConnect,
      onDisconnect,
      onBotResponse,
      onSessionConfirm,
    });
  }

  public get sessionId(): string {
    return this._sessionId;
  }

  private set sessionId(value) {
    this._sessionId = value;
  }

  private onBotResponse = (data: unknown): void => {
    const timestamp = new Date();
    this.storageService.setMessage({ sender: SENDER.BOT, ...(data as object), timestamp }, this.sessionId);
    this.trigger('message', messageParser({ ...(data as object), timestamp }, SENDER.BOT));
  };

  private loadChatHistory(): void {
    const chatHistory = this.storageService.getChatHistory() || [];
    this.trigger('loadHistory', parseChatHistory(chatHistory));
  }

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
        this.connection.sendMessage(this.initialPayload, this.sessionId, this.onMessageReceive);
      }
    }
  };

  private onConnect = () => {
    this.sessionId = this.senderId ? this.senderId : uuidv4();
    this.connection.sessionRequest(this.sessionId);
    if (this.isInitialConnection) {
      this.loadChatHistory();
      this.isInitialConnection = false;
    }
    this.trigger('connect');
  };

  private onDisconnect = () => {
    this.isSessionConfirmed = false;
    this.isInitialConnection = true;
    this.trigger('disconnect');
  };

  private onMessageReceive = (messages: MessageResponse[]): void => {
    if (!messages) return;
    messages.forEach(message => {
      this.onBotResponse(message);
    });
  };

  public connect(): void {
    this.connection.connect();
    // this.initHttpSession();
  }

  public disconnect(): void {
    this.connection.disconnect();
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

  public reconnection(value: boolean): void {
    this.connection.reconnection(value);
  }
}

export * from './errors';
export * from './message-parser';
export * from './constants';
