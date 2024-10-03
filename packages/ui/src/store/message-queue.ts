import { Message } from '@rasahq/chat-widget-sdk';
import { createStore } from '@stencil/store';

const { state, onChange } = createStore({
  messageQueue: [] as Message[],
  isRendering: false,
  messageToRender: null as Message | null,
});

export const messageQueueService = {
  enqueueMessage: (message: Message) => {
    state.messageQueue = [...state.messageQueue, message];
    processQueue();
  },

  getState: () => ({ state, onChange }),

  completeRendering: () => {
    state.isRendering = false;
    processQueue();
  },
};

function processQueue() {
  if (!state.isRendering && state.messageQueue.length > 0) {
    state.isRendering = true;
    state.messageToRender = state.messageQueue[0];
    state.messageQueue.shift();
  }
}

onChange('messageQueue', processQueue);
