import {
  AccordionMessage,
  CarouselMessage,
  FileDownloadMessage,
  ImageMessage,
  QuickReplyMessage,
  TextMessage,
  VideoMessage,
  RatingMessage,
} from '../types/parsed-message.types';
import {
  AccordionResponse,
  CarouselResponse,
  FileDownloadResponse,
  ImageResponse,
  QuickReplyResponse,
  TextResponse,
  VideoResponse,
  RatingResponse,
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
  image: (message: ImageResponse, sender: SenderType): ImageMessage => ({
    sender,
    type: MESSAGE_TYPES.IMAGE,
    imageSrc: message.attachment.payload.src,
    alt: message.attachment.payload.alt || '',
    text: message.text,
    timestamp: message.timestamp,
  }),
  accordion: (message: AccordionResponse, sender: SenderType): AccordionMessage => ({
    sender,
    ...message,
    type: MESSAGE_TYPES.ACCORDION,
  }),
  carousel: (message: CarouselResponse, sender: SenderType): CarouselMessage => ({
    sender,
    type: MESSAGE_TYPES.CAROUSEL,
    elements: message.elements.map(({ image_url, text, link }) => ({
      text,
      link,
      imageUrl: image_url,
    })),
    timestamp: message.timestamp,
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
    message: FileDownloadResponse,
    sender: SenderType,
  ): FileDownloadMessage => ({
    sender,
    type: MESSAGE_TYPES.FILE_DOWNLOAD,
    fileName: message.file_name,
    fileUrl: message.file_url,
    text: message.text,
    timestamp: message.timestamp,
  }),
  video: (
    message: VideoResponse,
    sender: SenderType,
  ): VideoMessage => ({
    sender,
    type: MESSAGE_TYPES.VIDEO,
    src: message.video_url,
    timestamp: message.timestamp,
  }),
  rating: (message: RatingResponse, sender: SenderType): RatingMessage => ({
    sender,
    type: MESSAGE_TYPES.RATING,
    text: message.text,
    options: message.options.map(option => ({
      value: option.value,
      payload: option.payload
    })),
    message: message.message,
    timestamp: message.timestamp,
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
