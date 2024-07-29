import { Rasa } from '.';

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
});
