import { TextMessage } from '@rasahq/chat-widget-sdk';
import { createStore } from '@stencil/store';

export type StreamedTextMessage = TextMessage & { streamId: string };

// Text of server-streamed bot messages, keyed by stream id. Components reading a key re-render when it changes.
const { state } = createStore<Record<string, string>>({});

export const streamStore = {
  getText: (streamId: string): string | undefined => state[streamId],
  setText: (streamId: string, text: string) => {
    state[streamId] = text;
  },
};
