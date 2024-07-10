import { ConnectionParams, ConnectionStrategy } from './ConnectionStrategy';
import { ManagerOptions, Socket, SocketOptions, io } from 'socket.io-client';

export class WebSocketConnection implements ConnectionStrategy {
  url: string;
  authenticationToken?: string;
  socket: Socket;

  constructor(options: ConnectionParams) {
    this.url = options.url;
    this.authenticationToken = options.authenticationToken;
    const ioOptions: Partial<ManagerOptions & SocketOptions> = { autoConnect: false };
    if (this.authenticationToken) {
      ioOptions.auth = {
        token: this.authenticationToken,
      };
    }

    this.socket = io(options.url, ioOptions);
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
}
