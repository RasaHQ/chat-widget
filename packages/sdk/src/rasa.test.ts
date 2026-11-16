import { Rasa } from '.';
import { SESSION_STORAGE_KEYS } from './constants';

const eventHandlers = {};
const mockSocketConnect = jest.fn();
const mockSocketDisconnect = jest.fn();
const mockSocketEmit = jest.fn();
const socketReconnection = jest.fn();

jest.mock('socket.io-client', () => ({
  __esModule: true,
  io: () => ({
    connect: mockSocketConnect,
    disconnect: mockSocketDisconnect,
    emit: mockSocketEmit,
    on: (event, handler) => {
      eventHandlers[event] = handler;
    },
    io: {
      on: (event, handler) => {
        eventHandlers[event] = handler;
      },
      reconnection: socketReconnection
    },
  }),
}));

const triggerSocketEvent = (event, data?: unknown) => {
  if (eventHandlers[event]) {
    eventHandlers[event](data);
  }
};

describe('Rasa Client', () => {
  let client: Rasa;
  let triggerSpy;
  let setSessionSpy;
  let sendMessageSpy;
  let sessionRequestSpy;
  let reconnectionSpy;
  let setQuickReplyValueSpy;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
    client = new Rasa({ url: 'localhost:3000' });
    // @ts-expect-error @ts
    setQuickReplyValueSpy = jest.spyOn(client.storageService, 'setQuickReplyValue').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Connection', () => {
    beforeEach(() => {
      // @ts-expect-error @ts
      triggerSpy = jest.spyOn(client, 'trigger');
      // @ts-expect-error @ts
      setSessionSpy = jest.spyOn(client.storageService, 'setSession').mockReturnValue(false);
       // @ts-expect-error @ts
      sendMessageSpy = jest.spyOn(client.connection, 'sendMessage');
      // @ts-expect-error @ts
      sessionRequestSpy = jest.spyOn(client.connection, 'sessionRequest');
      // @ts-expect-error @ts
      reconnectionSpy = jest.spyOn(client.connection, 'reconnection');
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should connect on the socket', () => {
      client.connect();

      expect(mockSocketConnect).toHaveBeenCalled();
    });

    it('should fire connect event', () => {
      // @ts-expect-error @ts
      expect(client.isInitialConnection).toBe(true);

      triggerSocketEvent('connect');
      
      // @ts-expect-error @ts
      expect(client.isInitialConnection).toBe(false);
      expect(sessionRequestSpy).toHaveBeenCalledWith(client.sessionId);
      expect(sessionRequestSpy).toHaveBeenCalledTimes(1);
      expect(mockSocketEmit).toHaveBeenCalledWith('session_request', {
        session_id: client.sessionId,
      });
      expect(triggerSpy).toHaveBeenCalledWith('connect');
      expect(triggerSpy).toHaveBeenCalledWith('loadHistory', []);
      expect(triggerSpy).toHaveBeenCalledTimes(2);
    });

    it('should fire connect event with senderID', () => {
      // @ts-expect-error @ts
      client.senderId = 'senderID';
      // @ts-expect-error @ts
      expect(client.isInitialConnection).toBe(true);

      triggerSocketEvent('connect');
      
      // @ts-expect-error @ts
      expect(client.isInitialConnection).toBe(false);
      expect(sessionRequestSpy).toHaveBeenCalledWith('senderID');
      expect(sessionRequestSpy).toHaveBeenCalledTimes(1);
      expect(mockSocketEmit).toHaveBeenCalledWith('session_request', {
        session_id: 'senderID',
      });
      expect(triggerSpy).toHaveBeenCalledWith('connect');
      expect(triggerSpy).toHaveBeenCalledWith('loadHistory', []);
      expect(triggerSpy).toHaveBeenCalledTimes(2);
    });

    it('should fire connect event on reconnect', () => {
      // Socket io on reconnect fires `reconnect` event first, then fire `connect` event
      triggerSocketEvent('reconnect');
      triggerSocketEvent('connect');
      
      expect(sessionRequestSpy).toHaveBeenCalledWith(client.sessionId);
      expect(sessionRequestSpy).toHaveBeenCalledTimes(1);
      expect(triggerSpy).toHaveBeenCalledWith('connect');
      expect(triggerSpy).toHaveBeenCalledTimes(1);
      expect(triggerSpy).not.toHaveBeenCalledWith('loadHistory');
    });

    it('should disconnect on the socket', () => {
      client.disconnect();

      expect(mockSocketDisconnect).toHaveBeenCalled();
    });

    it('should fire disconnect event', () => {
      const onDisconnect = jest.fn();
      client.on('disconnect', onDisconnect);

      triggerSocketEvent('disconnect');

      expect(onDisconnect).toHaveBeenCalled();
    });

    it('should change reconnection value', () => {
      client.reconnection(true);

      expect(reconnectionSpy).toHaveBeenCalledWith(true);
      expect(socketReconnection).toHaveBeenCalledWith(true);
    });

    it('should confirm session on session_confirm', () => {
      expect(triggerSpy).not.toHaveBeenCalled();
      // @ts-expect-error @ts
      expect(client.isSessionConfirmed).toBe(false);

      triggerSocketEvent('session_confirm');

      // @ts-expect-error @ts
      expect(client.isSessionConfirmed).toBe(true);
      expect(triggerSpy).toHaveBeenCalledTimes(2);
      expect(triggerSpy).toHaveBeenCalledWith('sessionConfirm');
      expect(triggerSpy).toHaveBeenCalledWith('message', {
        type: 'sessionDivider',
        startDate: new Date(),
      });
      expect(setSessionSpy).toHaveBeenCalledWith(client.sessionId, new Date());
    });

    it('should confirm session on session_confirm with existing session', () => {
      // Session ID exists in session storage
      setSessionSpy.mockReturnValue(true);

      triggerSocketEvent('session_confirm');

      // @ts-expect-error @ts
      expect(client.isSessionConfirmed).toBe(true);
      expect(triggerSpy).toHaveBeenCalledWith('sessionConfirm');
      expect(setSessionSpy).toHaveBeenCalledWith(client.sessionId, new Date());
    });

    it('should not confirm session on session_confirm if session is already confirmed', () => {
      // @ts-expect-error @ts
      expect(client.isSessionConfirmed).toBe(false);

      triggerSocketEvent('session_confirm');
      // @ts-expect-error @ts
      expect(client.isSessionConfirmed).toBe(true);
      expect(triggerSpy).toHaveBeenCalledWith('sessionConfirm');
      expect(triggerSpy).toHaveBeenCalledWith('message', {
        type: 'sessionDivider',
        startDate: new Date(),
      });
      expect(triggerSpy).toHaveBeenCalledTimes(2);
      expect(setSessionSpy).toHaveBeenCalledWith(client.sessionId, new Date());
      expect(setSessionSpy).toHaveBeenCalledTimes(1);
  
      triggerSocketEvent('session_confirm');
      // @ts-expect-error @ts
      expect(client.isSessionConfirmed).toBe(true);
      // Same amount of calls
      expect(triggerSpy).toHaveBeenCalledTimes(2);
      expect(setSessionSpy).toHaveBeenCalledTimes(1);
    });

    it('should confirm session on session_confirm with initial payload', () => {
      // @ts-expect-error @ts
      client.initialPayload = '/session_start';
      // @ts-expect-error @ts
      expect(client.isSessionConfirmed).toBe(false);
      
      triggerSocketEvent('session_confirm');

      // @ts-expect-error @ts
      expect(client.isSessionConfirmed).toBe(true);
      expect(triggerSpy).toHaveBeenCalledWith('sessionConfirm');
      expect(triggerSpy).toHaveBeenCalledWith('message', {
        type: 'sessionDivider',
        startDate: new Date(),
      });
      expect(triggerSpy).toHaveBeenCalledTimes(2);
      expect(setSessionSpy).toHaveBeenCalledWith(client.sessionId, new Date());
      expect(setSessionSpy).toHaveBeenCalledTimes(1);
      expect(sendMessageSpy).toHaveBeenCalledWith('/session_start', client.sessionId);
      expect(sendMessageSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Messaging', () => {
    it('should send a new message', () => {
      client.sendMessage({ text: 'Hello' });

      expect(mockSocketEmit).toHaveBeenCalledWith('user_uttered', {
        message: 'Hello',
        session_id: client.sessionId,
      });
    });

    it('should send a new message (quick-reply)', () => {
      client.sendMessage({ text: 'Hello', reply: 'hello', timestamp: new Date() }, true, 1);
      
      expect(mockSocketEmit).toHaveBeenCalledWith('user_uttered', {
        message: 'Hello',
        session_id: client.sessionId,
      });
      expect(setQuickReplyValueSpy).toHaveBeenCalledWith('hello', 1, client.sessionId);
    });

    it('should fire bot_uttered event', () => {
      const onBotResponse = jest.fn();
      client.on('message', onBotResponse);

      triggerSocketEvent('bot_uttered', { text: 'Hello! How can I help you?' });

      expect(onBotResponse).toHaveBeenCalledWith({
        sender: 'bot',
        text: 'Hello! How can I help you?',
        timestamp: new Date(),
        type: 'text',
      });
    });
  });

  describe('Server streaming', () => {
    const sessionId = 'session1';
    const streamId = '3edc172c-c2f6-4211-bfbc-c3a84d190cac';
    let events: [string, unknown][];

    const createClient = (enableServerStreaming: boolean) => {
      Object.keys(eventHandlers).forEach(event => delete eventHandlers[event]);
      const streamingClient = new Rasa({ url: 'localhost:3000', senderId: sessionId, enableServerStreaming });
      events = [];
      (['message', 'streamStart', 'streamChunk', 'streamEnd', 'disconnect'] as const).forEach(eventName => {
        streamingClient.on(eventName, (data?: unknown) => events.push([eventName, data]));
      });
      return streamingClient;
    };

    const storedMessages = () =>
      JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEYS.CHAT_HISTORY) || '{}')[sessionId]?.messages;

    const streamResponse = (...chunks: string[]) => {
      triggerSocketEvent('stream_start', {});
      chunks.forEach(text => triggerSocketEvent('stream_chunk', { text }));
      triggerSocketEvent('stream_end', {});
    };

    const botTextMessage = (text: string) => ({ sender: 'bot', type: 'text', text, timestamp: new Date() });

    beforeEach(() => {
      sessionStorage.clear();
    });

    it('does not listen to stream events by default', () => {
      createClient(false);

      expect(eventHandlers['bot_uttered']).toBeDefined();
      expect(eventHandlers['stream_start']).toBeUndefined();
      expect(eventHandlers['stream_chunk']).toBeUndefined();
      expect(eventHandlers['stream_end']).toBeUndefined();
    });

    it('does not listen to stream events with the HTTP protocol', () => {
      Object.keys(eventHandlers).forEach(event => delete eventHandlers[event]);
      new Rasa({ url: 'localhost:3000', protocol: 'http', enableServerStreaming: true });

      expect(eventHandlers['stream_start']).toBeUndefined();
    });

    it('assembles streamed chunks into one bot message', () => {
      createClient(true);

      streamResponse('Hello', ' wor', 'ld');

      expect(events).toEqual([
        ['streamStart', { streamId, text: 'Hello', timestamp: new Date() }],
        ['streamChunk', { streamId, text: 'Hello wor' }],
        ['streamChunk', { streamId, text: 'Hello world' }],
        ['streamEnd', { streamId, message: botTextMessage('Hello world') }],
      ]);
      expect(storedMessages()).toEqual([{ sender: 'bot', text: 'Hello world', timestamp: new Date().toISOString() }]);
    });

    it('stores the streamed message when it starts, so later messages keep their order', () => {
      const streamingClient = createClient(true);

      triggerSocketEvent('stream_start', {});
      triggerSocketEvent('stream_chunk', { text: 'Hello' });
      streamingClient.sendMessage({ text: 'Hi', timestamp: new Date() });
      triggerSocketEvent('stream_chunk', { text: ' there' });
      triggerSocketEvent('stream_end', {});

      expect(storedMessages()).toEqual([
        { sender: 'bot', text: 'Hello there', timestamp: new Date().toISOString() },
        { sender: 'user', text: 'Hi', timestamp: new Date().toISOString() },
      ]);
    });

    it('does not announce a stream before it has visible text', () => {
      createClient(true);

      streamResponse(' ', '\n');
      expect(events).toEqual([]);
      expect(storedMessages()).toBeUndefined();

      streamResponse('\n', 'Hi');
      expect(events).toEqual([
        ['streamStart', { streamId, text: '\nHi', timestamp: new Date() }],
        ['streamEnd', { streamId, message: botTextMessage('\nHi') }],
      ]);
    });

    it('ignores malformed chunks', () => {
      createClient(true);

      triggerSocketEvent('stream_start', {});
      triggerSocketEvent('stream_chunk');
      triggerSocketEvent('stream_chunk', {});
      triggerSocketEvent('stream_chunk', { text: 5 });
      triggerSocketEvent('stream_chunk', 'Hi');
      triggerSocketEvent('stream_end', {});

      expect(events).toEqual([]);
      expect(storedMessages()).toBeUndefined();
    });

    it('starts a stream when a chunk arrives without stream_start', () => {
      createClient(true);

      triggerSocketEvent('stream_chunk', { text: 'Hi' });
      triggerSocketEvent('stream_end', {});

      expect(events).toEqual([
        ['streamStart', { streamId, text: 'Hi', timestamp: new Date() }],
        ['streamEnd', { streamId, message: botTextMessage('Hi') }],
      ]);
    });

    it('ignores stream_end without an open stream', () => {
      createClient(true);

      triggerSocketEvent('stream_end', {});

      expect(events).toEqual([]);
    });

    it('completes an open stream before the next bot message', () => {
      createClient(true);

      triggerSocketEvent('stream_start', {});
      triggerSocketEvent('stream_chunk', { text: 'Partial' });
      triggerSocketEvent('bot_uttered', { text: 'Next' });

      expect(events).toEqual([
        ['streamStart', { streamId, text: 'Partial', timestamp: new Date() }],
        ['streamEnd', { streamId, message: botTextMessage('Partial') }],
        ['message', botTextMessage('Next')],
      ]);
    });

    it('completes an open stream when the next stream starts', () => {
      createClient(true);

      triggerSocketEvent('stream_start', {});
      triggerSocketEvent('stream_chunk', { text: 'First' });
      streamResponse('Second');

      expect(events).toEqual([
        ['streamStart', { streamId, text: 'First', timestamp: new Date() }],
        ['streamEnd', { streamId, message: botTextMessage('First') }],
        ['streamStart', { streamId, text: 'Second', timestamp: new Date() }],
        ['streamEnd', { streamId, message: botTextMessage('Second') }],
      ]);
    });

    it('completes an open stream on disconnect', () => {
      createClient(true);

      triggerSocketEvent('stream_start', {});
      triggerSocketEvent('stream_chunk', { text: 'Partial' });
      triggerSocketEvent('disconnect');

      expect(events).toEqual([
        ['streamStart', { streamId, text: 'Partial', timestamp: new Date() }],
        ['streamEnd', { streamId, message: botTextMessage('Partial') }],
        ['disconnect', undefined],
      ]);
      expect(storedMessages()).toEqual([{ sender: 'bot', text: 'Partial', timestamp: new Date().toISOString() }]);
    });

    it('keeps buttons sent after a stream as their own message', () => {
      createClient(true);
      const quickReplies = [{ content_type: 'text', title: 'Yes', payload: '/affirm' }];

      streamResponse('Continue?');
      triggerSocketEvent('bot_uttered', { quick_replies: quickReplies });

      expect(events.at(-1)).toEqual([
        'message',
        {
          sender: 'bot',
          type: 'quickReply',
          text: undefined,
          replies: [{ text: 'Yes', reply: '/affirm', isSelected: undefined }],
          timestamp: new Date(),
        },
      ]);
      expect(storedMessages()).toEqual([
        { sender: 'bot', text: 'Continue?', timestamp: new Date().toISOString() },
        { sender: 'bot', quick_replies: quickReplies, timestamp: new Date().toISOString() },
      ]);
    });
  });
});
