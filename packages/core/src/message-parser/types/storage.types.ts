import type { SenderType } from "./common.types";
import type { MessageResponse } from "./server-response.types";

type Message = MessageResponse & { sender: SenderType };

export type SessionData = {
  sessionStart: string;
  messages: Message[];
};

export type DataMap = {
  [id: string]: SessionData;
};
