import { CustomErrorClass, ErrorSeverity } from '../errors';
import { ConnectionParams, ConnectionStrategy } from './ConnectionStrategy';
import { ManagerOptions, Socket, SocketOptions, io } from 'socket.io-client';

export class WebSocketConnection implements ConnectionStrategy {
  url: string;
  authenticationToken?: string;
  socket: Socket;
  onConnect: () => void;
  onDisconnect: () => void;
  onBotResponse: (data: unknown) => void;
  onSessionConfirm: () => void;

  constructor(options: ConnectionParams) {
    this.url = options.url;
    this.authenticationToken = options.authenticationToken;
    this.onConnect = options.onConnect;
    this.onDisconnect = options.onDisconnect;
    this.onBotResponse = options.onBotResponse;
    this.onSessionConfirm = options.onSessionConfirm;
    const ioOptions: Partial<ManagerOptions & SocketOptions> = {
      autoConnect: false,
      reconnectionAttempts: 4,
    };
    if (this.authenticationToken) {
      ioOptions.auth = {
        token: this.authenticationToken,
      };
    }

    this.socket = io(options.url, ioOptions);
    this.initEvents();
  }

  public connect(): void {
    this.socket.connect();
  }

  public sendMessage(message: string, sessionId: string): void {
    this.socket.emit('user_uttered', { message, session_id: sessionId });
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public sessionRequest(sessionId: string): void {
    this.socket.emit('session_request', {
      session_id: sessionId,
    });
  }

  public reconnection(value: boolean): void {
    this.socket.io.reconnection(value);
    if (this.socket.connected === false && this.socket.io._reconnecting) {
      this.socket.disconnect();
    }
  }

  public initEvents(): void {
    this.socket.on('connect', () => {
      this.onConnect();
    });

    this.socket.on('disconnect', () => {
      this.onDisconnect();
    });

    this.socket.on('bot_uttered', (data: unknown) => {
      this.onBotResponse(data);
    });

    this.socket.on('session_confirm', () => {
      this.onSessionConfirm();
    });

    this.socket.on('connect_error', () => {
      // The setTimeout function schedules the error to be thrown after the current execution context,
      // allowing the reconnection logic of Socket.IO to continue.
      setTimeout(() => {
        throw new CustomErrorClass(ErrorSeverity.Error, 'Server error');
      }, 0);
    });

    this.socket.on('reconnect_attempt', attemptNumber => {
      console.log(`Reconnection attempt #${attemptNumber}`);
    });
  }
}
