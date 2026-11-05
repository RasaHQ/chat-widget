import { TextMessage } from './parsed-message.types';

export interface StreamStartEvent {
  streamId: string;
  text: string;
  timestamp: Date;
}

export interface StreamChunkEvent {
  streamId: string;
  // Full text received so far, not only the latest chunk
  text: string;
}

export interface StreamEndEvent {
  streamId: string;
  message: TextMessage;
}
