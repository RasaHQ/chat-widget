import { Socket } from 'socket.io-client';

import { MessageResponse } from '../types/server-response.types';

export interface ConnectionParams {
  url: string;
  authenticationToken?: string;
  onConnect: (isReconnected?: boolean) => void;
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
