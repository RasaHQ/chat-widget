import { RESPONSE_MESSAGE_TYPES } from "../constants/message.constants";

export interface TextResponse {
  text: string;
}

export interface ImageResponse {
  attachment: {
    payload: {
      alt?: string;
      src: string;
    };
    type: typeof RESPONSE_MESSAGE_TYPES.IMAGE;
  };
  text?: string;
}

export interface AccordionResponse {
  type: typeof RESPONSE_MESSAGE_TYPES.ACCORDION;
  elements: { title: string; text: string; link?: string }[];
}

export interface CarouselResponse {
  type: typeof RESPONSE_MESSAGE_TYPES.CAROUSEL;
  elements: { image_url: string; text: string; link?: string }[];
}

export interface QuickReplyResponse {
  text?: string;
  quick_replies: { content_type: string; payload: string; title: string }[];
}

export interface FileDownloadResponse {
  type: typeof RESPONSE_MESSAGE_TYPES.FILE_DOWNLOAD;
  text?: string;
  file_url: string;
  file_name: string;
}

export interface VideoResponse {
  title: string;
  type: typeof RESPONSE_MESSAGE_TYPES.VIDEO;
  video_url: string;
}

export type MessageResponse =
  | TextResponse
  | ImageResponse
  | AccordionResponse
  | CarouselResponse
  | QuickReplyResponse
  | FileDownloadResponse
  | VideoResponse;
