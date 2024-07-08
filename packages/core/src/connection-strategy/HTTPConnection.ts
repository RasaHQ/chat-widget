import { ConnectionParams, ConnectionStrategy } from './ConnectionStrategy';
import { HttpResponse, MessageResponse } from '../types/server-response.types';
import {
  hasCustomAttribute,
  isHttpImageResponse,
  isHttpQuickReplyResponse,
  isHttpTextResponse,
  normalizeHttpImageResponse,
  normalizeHttpQuickReplyResponse,
} from './HTTPConnection.utils';
import { CustomErrorClass, ErrorSeverity } from '../errors';

export class HTTPConnection implements ConnectionStrategy {
  url: string;
  authorizationToken?: string;

  constructor(options: ConnectionParams) {
    this.url = options.url;
    this.authorizationToken = options.authorizationToken;
  }

  public connect(): void {
    // There is no connect in HTTP.
  }

  private normalizeResponse(data: HttpResponse[]): MessageResponse[] {
    return data.map(message => {
      if (isHttpQuickReplyResponse(message)) {
        return normalizeHttpQuickReplyResponse(message);
      }

      if (hasCustomAttribute(message) && !isHttpQuickReplyResponse(message)) {
        return message.custom;
      }

      if (isHttpImageResponse(message)) {
        return normalizeHttpImageResponse(message);
      }

      if (isHttpTextResponse(message)) {
        return { text: message.text };
      }

      return message;
    });
  }

  public async sendMessage(message: string, sessionId: string, cb: (data: MessageResponse[]) => void): Promise<void> {
    const headers = new Headers();
    if (this.authorizationToken) {
      headers.append('Authorization', `Bearer ${this.authorizationToken}`)
    }
    return fetch(`${this.url}/webhooks/rest/webhook`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ sender: sessionId, message }),
    })
      .then(response => {
        if (!response.ok) {
          throw new CustomErrorClass(ErrorSeverity.Error, 'Network response error', response.statusText);
        }
        return response.json() as Promise<HttpResponse[]>;
      })
      .then(data => {
        cb(this.normalizeResponse(data));
      })
      .catch(_ => {
        throw new CustomErrorClass(ErrorSeverity.Error, 'Server error');
      });
  }

  public disconnect(): void {
    // There is no disconnection in HTTP.
  }

  public sessionRequest(_sessionId: string): void {
    // There is no sessionRequest in HTTP.
  }
}
