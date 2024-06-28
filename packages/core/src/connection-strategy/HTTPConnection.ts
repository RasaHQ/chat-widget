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

export class HTTPConnection implements ConnectionStrategy {
  url: string;

  constructor(options: ConnectionParams) {
    this.url = options.url;
  }

  connect(): void {
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

  async sendMessage(message: string, sessionId: string, cb: (data: MessageResponse[]) => void) {
    fetch(`${this.url}/webhooks/rest/webhook`, {
      method: 'POST',
      body: JSON.stringify({ sender: sessionId, message }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json() as Promise<HttpResponse[]>;
      })
      .then(data => {
        cb(this.normalizeResponse(data));
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  disconnect(): void {
    // There is no disconnection in HTTP.
  }

  sessionRequest(_sessionId: string): void {
    // There is no sessionRequest in HTTP.
  }
}
