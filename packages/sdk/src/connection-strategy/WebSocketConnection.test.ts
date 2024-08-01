import { WebSocketConnection } from './WebSocketConnection';

// Mock implementation within the same file
jest.mock('socket.io-client', () => {
  const mSocket = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    emit: jest.fn(),
    on: jest.fn(),
    io: {
      reconnection: jest.fn(),
      on: jest.fn(),
    },
  };

  return {
    io: jest.fn(() => mSocket),
    Socket: jest.fn(() => mSocket),
  };
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { io, Socket } from 'socket.io-client';

describe('WebSocketConnection', () => {
  const url = 'http://localhost';
  const authenticationToken = 'token123';
  const onConnect = jest.fn();
  const onDisconnect = jest.fn();
  const onBotResponse = jest.fn();
  const onSessionConfirm = jest.fn();

  const createInstance = (overrideParams = {}) => {
    return new WebSocketConnection({
      url,
      authenticationToken,
      onConnect,
      onDisconnect,
      onBotResponse,
      onSessionConfirm,
      ...overrideParams,
    });
  };

  let socket;
  let connection: WebSocketConnection;

  beforeEach(() => {
    jest.clearAllMocks();
    socket = io();
    connection = createInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with given parameters', () => {
    expect(connection.url).toBe(url);
    expect(connection.authenticationToken).toBe(authenticationToken);
    expect(connection.onConnect).toBe(onConnect);
    expect(connection.onDisconnect).toBe(onDisconnect);
    expect(connection.onBotResponse).toBe(onBotResponse);
    expect(connection.onSessionConfirm).toBe(onSessionConfirm);
  });

  it('should initialize socket with correct options', () => {
    expect(io).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        autoConnect: false,
        reconnectionDelay: 4000,
        reconnectionDelayMax: 4000,
        auth: { token: authenticationToken },
      }),
    );
  });

  it('should connect the socket', () => {
    connection.connect();

    expect(socket.connect).toHaveBeenCalled();
  });

  it('should send message correctly', () => {
    const message = 'hello';
    const sessionId = 'session1';

    connection.sendMessage(message, sessionId);

    expect(socket.emit).toHaveBeenCalledWith('user_uttered', { message, session_id: sessionId });
  });

  it('should disconnect the socket', () => {
    connection.disconnect();

    expect(socket.disconnect).toHaveBeenCalled();
  });

  it('should request session', () => {
    const sessionId = 'session1';

    connection.sessionRequest(sessionId);

    expect(socket.emit).toHaveBeenCalledWith('session_request', { session_id: sessionId });
  });

  it('should handle reconnection logic', () => {
    connection.reconnection(true);
    expect(socket.io.reconnection).toHaveBeenCalledWith(true);

    socket.connected = false;
    socket.io._reconnecting = true;
    connection.reconnection(true);

    expect(socket.disconnect).toHaveBeenCalled();
  });

  describe('Socket events', () => {
    it('should handle connect event', () => {
      socket.on.mockImplementation((event, handler) => {
        if (event === 'connect') {
          handler();
        }
      });

      connection.initEvents();

      expect(onConnect).toHaveBeenCalledWith(false);
    });

    it('should handle disconnect event', () => {
      socket.on.mockImplementation((event, handler) => {
        if (event === 'disconnect') {
          handler();
        }
      });

      connection.initEvents();

      expect(onDisconnect).toHaveBeenCalled();
    });

    it('should handle bot uttered event', () => {
      const data = { message: 'hi' };
      socket.on.mockImplementation((event, handler) => {
        if (event === 'bot_uttered') {
          handler(data);
        }
      });

      connection.initEvents();

      expect(onBotResponse).toHaveBeenCalledWith(data);
    });

    it('should handle session confirm event', () => {
      socket.on.mockImplementation((event, handler) => {
        if (event === 'session_confirm') {
          handler();
        }
      });

      connection.initEvents();

      expect(onSessionConfirm).toHaveBeenCalled();
    });

    it('should handle reconnect event', () => {
      socket.io.on.mockImplementation((event, handler) => {
        if (event === 'reconnect') {
          handler();
        }
      });

      connection.initEvents();

      // @ts-expect-error @ts
      expect(connection.isReconnecting).toBe(true);
    });

    it('should handle reconnect attempt event', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      socket.io.on.mockImplementation((event, handler) => {
        if (event === 'reconnect_attempt') {
          handler(1);
        }
      });

      connection.initEvents();

      expect(consoleLogSpy).toHaveBeenCalledWith('Reconnection attempt #1');
    });
  });
});
