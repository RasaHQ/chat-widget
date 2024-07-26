import { ManagerOptions, Socket, SocketOptions, io } from 'socket.io-client';

import { CustomErrorClass, ErrorSeverity } from '../errors';
import { ConnectionParams, ConnectionStrategy } from './ConnectionStrategy';
import { SOCKET_IO_RECONNECTION_DELAY } from '../constants';

export class WebSocketConnection implements ConnectionStrategy {
  url: string;
  authenticationToken?: string;
  socket: Socket;
  onConnect: (isReconnect?: boolean) => void;
  onDisconnect: () => void;
  onBotResponse: (data: unknown) => void;
  onSessionConfirm: () => void;

  private isReconnecting = false;

  constructor(options: ConnectionParams) {
    this.url = options.url;
    this.authenticationToken = options.authenticationToken;
    this.onConnect = options.onConnect;
    this.onDisconnect = options.onDisconnect;
    this.onBotResponse = options.onBotResponse;
    this.onSessionConfirm = options.onSessionConfirm;
    const ioOptions: Partial<ManagerOptions & SocketOptions> = {
      autoConnect: false,
      reconnectionDelay: SOCKET_IO_RECONNECTION_DELAY,
      reconnectionDelayMax: SOCKET_IO_RECONNECTION_DELAY,
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
    //#region Rasa Server Input Events
    this.socket.on('connect', () => {
      this.onConnect(this.isReconnecting);
      this.isReconnecting = false;
    });

    this.socket.on('disconnect', () => {
      this.onDisconnect();
      this.isReconnecting = false;
    });
    //#endregion

    //#region Rasa Server Output Events
    this.socket.on('bot_uttered', (data: unknown) => {
      this.onBotResponse(data);
    });

    this.socket.on('session_confirm', () => {
      this.onSessionConfirm();
    });
    //#endregion

    //#region Socket IO Events
    this.socket.io.on('reconnect', _ => {
      // Fired upon a successful reconnection.
      // https://socket.io/docs/v4/client-api/#event-reconnect
      this.isReconnecting = true;
    });

    this.socket.on('connect_error', () => {
      // The setTimeout function schedules the error to be thrown after the current execution context,
      // allowing the reconnection logic of Socket.IO to continue.
      setTimeout(() => {
        throw new CustomErrorClass(ErrorSeverity.Error, 'Server error');
      }, 0);
    });

    this.socket.io.on('reconnect_attempt', attemptNumber => {
      console.log(`Reconnection attempt #${attemptNumber}`);
    });
    //#endregion
  }
}
