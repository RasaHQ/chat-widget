import { io, Socket } from "socket.io-client";
import { EventEmitter } from "./EventEmitter";
import { SENDER } from "./message-parser/constants/message.constants";
import { StorageService } from "./services/storage.service";
import { messageParser } from "./message-parser/messageParser";
import { parseChatHistory } from "./message-parser/utils/parse-chat-history";

interface Options {
  url: string;
}

export class Rasa extends EventEmitter {
  readonly socket: Socket;
  sessionId: string;
  private storageService: StorageService;

  public constructor(options: Options) {
    super();
    this.socket = io(options.url, { autoConnect: false });
    this.sessionId = window.crypto.randomUUID();
    this.storageService = new StorageService();

    this.initSocketEvents();
  }

  private initSocketEvents(): void {
    this.socket.on("connect", () => {
      this.socket.emit("session_request", { session_id: this.sessionId });
      const chatHistory = this.storageService.getChatHistory() || [];
      this.trigger("loadHistory", parseChatHistory(chatHistory));
      this.trigger("connect");
    });

    this.socket.on("disconnect", () => {
      this.trigger("disconnect");
    });

    this.socket.on("bot_uttered", (data: unknown) => {
      this.storageService.setMessage(
        { sender: SENDER.BOT, ...(data as object) },
        this.sessionId
      );
      this.trigger("message", messageParser(data, SENDER.BOT));
    });

    this.socket.on("session_confirm", () => {
      const sessionStart = new Date();
      this.trigger("message", {
        type: "sessionDivider",
        startDate: sessionStart,
      });
      this.storageService.setSession(this.sessionId, sessionStart);
    });
  }

  public connect(): void {
    this.socket.connect();
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public sendMessage(message: string): void {
    this.socket.emit("user_uttered", { message, session_id: this.sessionId });
    this.storageService.setMessage(
      { sender: SENDER.USER, text: message },
      this.sessionId
    );
  }
}

export * from "./message-parser";
export * from './errors';
