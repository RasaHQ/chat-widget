import { MessageResponse } from '../types/server-response.types';
import { Socket } from 'socket.io-client';

export interface ConnectionParams {
  url: string;
  authorizationToken?: string;
}

export interface ConnectionStrategy extends ConnectionParams {
  socket?: Socket;
  connect(): void;
  sendMessage(message: string, sessionId: string, cb: (data: MessageResponse[]) => void);
  sessionRequest(sessionId: string): void;
  disconnect(): void;
}
