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
import { CustomErrorClass, ErrorSeverity } from '../../errors';

import { MessageParsersReturnTypes } from './message-parsers';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RESPONSE_MESSAGE_TYPES } from '../../constants';

const messageTypeMap = {
  image: (msg: any): msg is ImageResponse => msg?.attachment?.type === RESPONSE_MESSAGE_TYPES.IMAGE,
  accordion: (msg: any): msg is AccordionResponse => msg?.type === RESPONSE_MESSAGE_TYPES.ACCORDION,
  carousel: (msg: any): msg is CarouselResponse => msg?.type === RESPONSE_MESSAGE_TYPES.CAROUSEL,
  quickReply: (msg: any): msg is QuickReplyResponse => msg?.quick_replies?.length > 0,
  fileDownload: (msg: any): msg is FileDownloadResponse => msg?.type === RESPONSE_MESSAGE_TYPES.FILE_DOWNLOAD,
  video: (msg: any): msg is VideoResponse => msg?.type === RESPONSE_MESSAGE_TYPES.VIDEO,
  text: (msg: any): msg is TextResponse => msg.text && msg.type === undefined,
  rating: (msg: any): msg is RatingResponse => msg?.type === RESPONSE_MESSAGE_TYPES.RATING,
};

export const determineMessageType = (message: unknown): keyof MessageParsersReturnTypes => {
  for (const [key, guard] of Object.entries(messageTypeMap)) {
    if (guard(message)) {
      return key as keyof MessageParsersReturnTypes;
    }
  }
  throw new CustomErrorClass(ErrorSeverity.Error, "Can't load new message" ,`Message type not implemented MESSAGE: ${message}`);
};
