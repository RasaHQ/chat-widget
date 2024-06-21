
import { SenderType } from "./types/common.types";
import { determineMessageType } from "./utils/determine-message-type";
import { MessageParsers } from "./utils/message-parsers";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const messageParser = (messageResponse: any, sender: SenderType) => {
  const messageType = determineMessageType(messageResponse);

  const typedMessageResponse = messageResponse as Parameters<typeof parser>[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parser = MessageParsers[messageType] as any;
  
  if (parser) {
    return parser(typedMessageResponse, sender);
  } else {
    throw new Error(`Unsupported message type: ${messageType}`);
  }
};
