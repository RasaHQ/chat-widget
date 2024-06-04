type ValueOf<T> = T[keyof T];

type MessageType =
  | "accordion"
  | "adaptive-cards"
  | "buttons"
  | "carousel"
  | "file-download"
  | "image"
  | "quick-reply"
  | "text"
  | "video";

export type Link = {
  src: string;
  linkedText: string;
};

export type Button = {
  text: string;
  purpose: string;
  value?: string;
  isSelected: boolean;
};

type DownloadFile = {
  name: string;
  src: string;
};

type QuickReply = {
  text: string;
  reply: string;
};

interface BaseMessage {
  id: string;
  type: MessageType;
}

export interface TextMessage extends BaseMessage {
  type: "text";
  text: string;
  links?: Link[];
}

export interface ButtonsMessage extends Omit<TextMessage, "type"> {
  type: "buttons";
  buttons: Button[];
}

export interface FileDownloadMessage extends Omit<TextMessage, "type"> {
  type: "hyperlink";
  files: DownloadFile[];
}

export interface QuickReplyMessage extends Omit<TextMessage, "type"> {
  type: "quick-reply";
  replies: QuickReply[];
}

export interface ImageMessage extends Omit<TextMessage, "type"> {
  type: "image";
  imageSrc: string;
  alt?: string;
}

export interface VideoMessage extends Omit<TextMessage, "type"> {
  type: "video";
  src: string;
}

export interface CarouselMessage extends BaseMessage {
  type: "carousel";
  items: (
    | ButtonsMessage
    | FileDownloadMessage
    | ImageMessage
    | QuickReplyMessage
    | TextMessage
    | VideoMessage
  )[];
}

export interface AccordionMessage extends BaseMessage {
  type: "accordion";
  accordions: ValueOf<Pick<CarouselMessage, "items">> | CarouselMessage[];
}
