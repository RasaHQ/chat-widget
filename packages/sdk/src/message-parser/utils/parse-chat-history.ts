import { MESSAGE_TYPES } from "../constants/message.constants";
import {
  Message,
} from "../types/parsed-message.types";
import { determineMessageType } from "./determine-message-type";
import { MessageParsers } from "./message-parsers";
import { sortBySessionStart } from "./sort-by-session-start";

export const parseChatHistory = (chatHistory) => {
  return sortBySessionStart(chatHistory).reduce<Message[]>(
    (acc, session) => {
      acc.push({
        type: MESSAGE_TYPES.SESSION_DIVIDER,
        startDate: new Date(session.sessionStart),
      });

      const transformedMessages = session.messages.map<Message>(
        (message) => {
          const messageType = determineMessageType(message);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return MessageParsers[messageType](message as any, message.sender);
        }
      );

      acc.push(...transformedMessages);

      return acc;
    },
    []
  );
};
