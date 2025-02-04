import { RESPONSE_MESSAGE_TYPES } from '../constants';

interface BaseMessageResponse {
  timestamp?: Date;
}
export interface TextResponse extends BaseMessageResponse {
  text: string;
}

export interface ImageResponse extends BaseMessageResponse {
  attachment: {
    payload: {
      alt?: string;
      src: string;
    };
    type: typeof RESPONSE_MESSAGE_TYPES.IMAGE;
  };
  text?: string;
}

export interface AccordionResponse extends BaseMessageResponse {
  type: typeof RESPONSE_MESSAGE_TYPES.ACCORDION;
  elements: { title: string; text: string; link?: string }[];
}

export interface CarouselResponse extends BaseMessageResponse {
  type: typeof RESPONSE_MESSAGE_TYPES.CAROUSEL;
  elements: { image_url: string; text: string; link?: string }[];
}

export interface RatingResponse extends BaseMessageResponse {
  type: typeof RESPONSE_MESSAGE_TYPES.RATING;
  text: string;
  options: { value: string; icon: string; label: string }[];
}

export interface QuickReplyResponse extends BaseMessageResponse {
  text?: string;
  quick_replies: { content_type: string; payload: string; title: string; isSelected?: boolean }[];
}

export interface FileDownloadResponse extends BaseMessageResponse {
  type: typeof RESPONSE_MESSAGE_TYPES.FILE_DOWNLOAD;
  text?: string;
  file_url: string;
  file_name: string;
}

export interface VideoResponse extends BaseMessageResponse {
  title: string;
  type: typeof RESPONSE_MESSAGE_TYPES.VIDEO;
  video_url: string;
}

export interface HttpTextResponse extends BaseMessageResponse {
  recipient_id: string;
  text: string;
}

export interface HttpImageResponse extends BaseMessageResponse {
  recipient_id: string;
  image: string;
}

export interface HttpCarouselResponse extends BaseMessageResponse {
  recipient_id: string;
  custom: CarouselResponse;
}

export interface HttpVideoResponse extends BaseMessageResponse {
  recipient_id: string;
  custom: VideoResponse;
}

export interface HttpAccordionResponse extends BaseMessageResponse {
  recipient_id: string;
  custom: AccordionResponse;
}

export interface HttpFileDownloadResponse extends BaseMessageResponse {
  recipient_id: string;
  custom: FileDownloadResponse;
}

export interface HttpQuickReplyResponse extends BaseMessageResponse {
  recipient_id: string;
  text: string;
  buttons: { payload: string; title: string }[];
}

export interface HttpRatingResponse extends BaseMessageResponse {
  recipient_id: string;
  custom: RatingResponse;
}

export type HttpResponse =
  | HttpTextResponse
  | HttpImageResponse
  | HttpCarouselResponse
  | HttpVideoResponse
  | HttpAccordionResponse
  | HttpFileDownloadResponse
  | HttpQuickReplyResponse
  | HttpRatingResponse;

export type MessageResponse =
  | TextResponse
  | ImageResponse
  | AccordionResponse
  | CarouselResponse
  | QuickReplyResponse
  | FileDownloadResponse
  | VideoResponse
  | RatingResponse;
