import { MessageResponse } from "../../types/server-response.types";
import { SenderType } from "../../types/common.types";

type Message = MessageResponse & { sender: SenderType };

export type SessionData = {
  sessionStart: string;
  messages: Message[];
};

export type DataMap = {
  [id: string]: SessionData;
};
