import { io, Socket } from "socket.io-client";
import { messageParser } from "./messageParser";
import { EventEmitter } from "./EventEmitter";

interface Options {
  url: string;
}

export class Rasa extends EventEmitter {
  readonly socket: Socket;
  sessionId: string;

  constructor(options: Options) {
    super();
    this.socket = io(options.url, { autoConnect: false });
    this.sessionId = window.crypto.randomUUID();

    this.socket.on("connect", () => {
      this.socket.emit("session_request", { session_id: this.sessionId });
      this.trigger("connect");
    });

    this.socket.on("disconnect", () => {
      this.trigger("disconnect");
    });

    this.socket.on("bot_uttered", (data: unknown) => {
      this.trigger("message", messageParser(data));
    });
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  sendMessage(message: string) {
    this.socket.emit("user_uttered", { message, session_id: this.sessionId });
  }
}
