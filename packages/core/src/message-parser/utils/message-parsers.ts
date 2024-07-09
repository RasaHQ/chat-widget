import {
  AccordionMessage,
  CarouselMessage,
  FileDownloadMessage,
  ImageMessage,
  QuickReplyMessage,
  TextMessage,
  VideoMessage,
} from '../types/parsed-message.types';
import {
  AccordionResponse,
  CarouselResponse,
  FileDownloadResponse,
  ImageResponse,
  QuickReplyResponse,
  TextResponse,
  VideoResponse,
} from '../../types/server-response.types';

import { MESSAGE_TYPES } from '../constants/message.constants';
import { SenderType } from '../../types/common.types';

export const MessageParsers = {
  text: (message: TextResponse, sender: SenderType): TextMessage => ({
    sender,
    type: MESSAGE_TYPES.TEXT,
    text: message.text,
    timestamp: message.timestamp,
  }),
  image: ({ attachment, text, timestamp }: ImageResponse, sender: SenderType): ImageMessage => ({
    sender,
    type: MESSAGE_TYPES.IMAGE,
    imageSrc: attachment.payload.src,
    alt: attachment.payload.alt || '',
    text: text,
    timestamp: timestamp,
  }),
  accordion: (message: AccordionResponse, sender: SenderType): AccordionMessage => ({
    sender,
    ...message,
    type: MESSAGE_TYPES.ACCORDION,
  }),
  carousel: ({ elements, timestamp }: CarouselResponse, sender: SenderType): CarouselMessage => ({
    sender,
    type: MESSAGE_TYPES.CAROUSEL,
    elements: elements.map(({ image_url, text, link }) => ({
      text,
      link,
      imageUrl: image_url,
    })),
    timestamp,
  }),
  quickReply: (message: QuickReplyResponse, sender: SenderType): QuickReplyMessage => ({
    sender,
    type: MESSAGE_TYPES.QUICK_REPLY,
    text: message.text,
    replies: message.quick_replies.map(({ title, payload, isSelected }) => ({
      text: title,
      reply: payload,
      isSelected,
    })),
    timestamp: message.timestamp,
  }),
  fileDownload: (
    { text, file_url, file_name, timestamp }: FileDownloadResponse,
    sender: SenderType,
  ): FileDownloadMessage => ({
    sender,
    type: MESSAGE_TYPES.FILE_DOWNLOAD,
    fileName: file_name,
    fileUrl: file_url,
    text,
    timestamp,
  }),
  video: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { title, video_url, timestamp }: VideoResponse,
    sender: SenderType,
  ): VideoMessage => ({
    sender,
    type: MESSAGE_TYPES.VIDEO,
    src: video_url,
    timestamp,
  }),
};

export type MessageParsersType = typeof MessageParsers;
export type MessageParsersKeys = keyof MessageParsersType;
export type MessageParamTypesMap = {
  [K in MessageParsersKeys]: Parameters<MessageParsersType[K]>[0];
};
export type MessageParsersReturnTypes = {
  [K in keyof typeof MessageParsers]: ReturnType<(typeof MessageParsers)[K]>;
};
export type MessageParamTypeFromString<T extends keyof MessageParamTypesMap> = MessageParamTypesMap[T];
