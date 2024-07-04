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
  }),
  image: ({ attachment, text }: ImageResponse, sender: SenderType): ImageMessage => ({
    sender,
    type: MESSAGE_TYPES.IMAGE,
    imageSrc: attachment.payload.src,
    alt: attachment.payload.alt || '',
    text: text,
  }),
  accordion: (message: AccordionResponse, sender: SenderType): AccordionMessage => ({
    sender,
    ...message,
    type: MESSAGE_TYPES.ACCORDION,
  }),
  carousel: ({ elements }: CarouselResponse, sender: SenderType): CarouselMessage => ({
    sender,
    type: MESSAGE_TYPES.CAROUSEL,
    elements: elements.map(({ image_url, text, link }) => ({
      text,
      link,
      imageUrl: image_url,
    })),
  }),
  quickReply: (message: QuickReplyResponse, sender: SenderType): QuickReplyMessage => ({
    sender,
    type: MESSAGE_TYPES.QUICK_REPLY,
    text: message.text,
    replies: message.quick_replies.map(({ title, payload, isSelected }) => ({
      text: title,
      reply: payload,
      isSelected
    })),
  }),
  fileDownload: ({ text, file_url, file_name }: FileDownloadResponse, sender: SenderType): FileDownloadMessage => ({
    sender,
    type: MESSAGE_TYPES.FILE_DOWNLOAD,
    fileName: file_name,
    fileUrl: file_url,
    text,
  }),
  video: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { title, video_url }: VideoResponse,
    sender: SenderType,
  ): VideoMessage => ({
    sender,
    type: MESSAGE_TYPES.VIDEO,
    src: video_url,
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
