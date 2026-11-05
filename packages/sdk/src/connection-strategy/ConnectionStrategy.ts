import { Socket } from 'socket.io-client';

import { MessageResponse } from '../types/server-response.types';

export interface ConnectionParams {
  url: string;
  authenticationToken?: string;
  onConnect: (isReconnected?: boolean) => void;
  onDisconnect: () => void,
  onBotResponse: (data: unknown) => void,
  onSessionConfirm: () => void,
  // Server-side response streaming (`stream_start` / `stream_chunk` / `stream_end`).
  // The events are listened to only when these callbacks are provided.
  onStreamStart?: () => void,
  onStreamChunk?: (data: unknown) => void,
  onStreamEnd?: () => void,
} 

export interface ConnectionStrategy extends ConnectionParams {
  socket?: Socket;
  connect(): void;
  sendMessage(message: string, sessionId: string, cb: (data: MessageResponse[]) => void);
  sessionRequest(sessionId: string): void;
  reconnection(value: boolean): void;
  disconnect(): void;
  updateAuthenticationToken(newToken: string): void;
}
