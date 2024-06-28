import { MESSAGE_TYPES, SENDER } from '@rasa-widget/core';
import { messageQueueService } from './message-queue';

describe('messageQueueService', () => {
  beforeEach(() => {
    messageQueueService.getState().state.messageQueue = [];
    messageQueueService.getState().state.isRendering = false;
    messageQueueService.getState().state.messageToRender = null;
  });

  it('should enqueue a message and start rendering', () => {
    const testMessage = { type: "sessionDivider", startDate: new Date() } as const;

    messageQueueService.enqueueMessage(testMessage);
    const { state } = messageQueueService.getState();

    expect(state.messageQueue).toHaveLength(0);
    expect(state.isRendering).toBe(true);
    expect(state.messageToRender).toEqual(testMessage);
  });

  it('should complete rendering and process next message in queue', () => {
    const testMessage1 = { text: 'Test message 1', sender: 'user', type: 'text' } as const;
    const testMessage2 = { text: 'Test message 1', sender: 'bot', type: 'text' } as const;

    messageQueueService.enqueueMessage(testMessage1);
    messageQueueService.enqueueMessage(testMessage2);

    const { state } = messageQueueService.getState();
    
    expect(state.isRendering).toBe(true);
    expect(state.messageToRender).toEqual(testMessage1);
    expect(state.messageQueue).toEqual([testMessage2]);

    messageQueueService.completeRendering();

    const { state: newState } = messageQueueService.getState();

    expect(newState.isRendering).toBe(true);
    expect(newState.messageToRender).toEqual(testMessage2);
    expect(newState.messageQueue).toEqual([]);

    messageQueueService.completeRendering();

    const { state: finalState } = messageQueueService.getState();

    expect(finalState.isRendering).toBe(false);
    expect(finalState.messageToRender).toEqual(testMessage2);
    expect(finalState.messageQueue).toEqual([]);
  });
});
