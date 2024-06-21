import { MESSAGE_TYPES } from "../constants/message.constants";
import { SenderType } from "./common.types";

export type SessionDivider = {
  type: typeof MESSAGE_TYPES.SESSION_DIVIDER;
  startDate: Date;
};

export type Button = {
  text: string;
  purpose: string;
  value?: string;
  isSelected: boolean;
};

type QuickReply = {
  text: string;
  reply: string;
};

export type CarouselElement = {
  imageUrl: string;
  text: string;
  link?: string;
};

interface BaseMessage {
  sender: SenderType;
}

export interface TextMessage extends BaseMessage {
  type: typeof MESSAGE_TYPES.TEXT;
  text: string;
}

export interface FileDownloadMessage extends BaseMessage {
  type: typeof MESSAGE_TYPES.FILE_DOWNLOAD;
  fileUrl: string;
  fileName: string;
  text?: string;
}

export interface QuickReplyMessage extends BaseMessage {
  text?: string;
  type: typeof MESSAGE_TYPES.QUICK_REPLY;
  replies: QuickReply[];
}

export interface ImageMessage extends BaseMessage {
  type: typeof MESSAGE_TYPES.IMAGE;
  imageSrc: string;
  alt: string;
  text?: string;
}

export interface VideoMessage extends BaseMessage {
  type: typeof MESSAGE_TYPES.VIDEO;
  src: string;
}

export interface CarouselMessage extends BaseMessage {
  type: typeof MESSAGE_TYPES.CAROUSEL;
  elements: CarouselElement[];
}

export interface AccordionMessage extends BaseMessage {
  type: typeof MESSAGE_TYPES.ACCORDION;
  elements: { title: string; text: string; link?: string }[];
}

export type Message =
  | AccordionMessage
  | CarouselMessage
  | FileDownloadMessage
  | ImageMessage
  | SessionDivider
  | QuickReplyMessage
  | TextMessage
  | VideoMessage;