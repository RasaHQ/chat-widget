import { MessageResponse } from '../types/server-response.types';
import { Socket } from 'socket.io-client';

export interface ConnectionParams {
  url: string;
  authenticationToken?: string;
  onConnect: () => void;
  onDisconnect: () => void,
  onBotResponse: (data: unknown) => void,
  onSessionConfirm: () => void,
}

export interface ConnectionStrategy extends ConnectionParams {
  socket?: Socket;
  connect(): void;
  sendMessage(message: string, sessionId: string, cb: (data: MessageResponse[]) => void);
  sessionRequest(sessionId: string): void;
  reconnection(value: boolean): void;
  disconnect(): void;
}
