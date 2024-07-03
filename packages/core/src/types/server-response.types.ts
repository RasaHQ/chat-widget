import { RESPONSE_MESSAGE_TYPES } from '../constants';

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
  quick_replies: { content_type: string; payload: string; title: string, isSelected?: boolean }[];
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

export interface HttpTextResponse {
  recipient_id: string;
  text: string;
}

export interface HttpImageResponse {
  recipient_id: string;
  image: string;
}

export interface HttpCarouselResponse {
  recipient_id: string;
  custom: CarouselResponse;
}

export interface HttpVideoResponse {
  recipient_id: string;
  custom: VideoResponse;
}

export interface HttpAccordionResponse {
  recipient_id: string;
  custom: AccordionResponse;
}

export interface HttpFileDownloadResponse {
  recipient_id: string;
  custom: FileDownloadResponse;
}

export interface HttpQuickReplyResponse {
  recipient_id: string;
  text: string;
  buttons: { payload: string; title: string }[];
}

export type HttpResponse =
  | HttpTextResponse
  | HttpImageResponse
  | HttpCarouselResponse
  | HttpVideoResponse
  | HttpAccordionResponse
  | HttpFileDownloadResponse
  | HttpQuickReplyResponse;

export type MessageResponse =
  | TextResponse
  | ImageResponse
  | AccordionResponse
  | CarouselResponse
  | QuickReplyResponse
  | FileDownloadResponse
  | VideoResponse;
