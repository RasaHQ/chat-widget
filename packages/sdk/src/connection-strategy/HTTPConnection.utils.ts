import {
  HttpAccordionResponse,
  HttpCarouselResponse,
  HttpFileDownloadResponse,
  HttpImageResponse,
  HttpQuickReplyResponse,
  HttpResponse,
  HttpTextResponse,
  HttpVideoResponse,
  HttpRatingResponse,
} from '../types/server-response.types';

import { RESPONSE_MESSAGE_TYPES } from '../constants';

export const normalizeHttpQuickReplyResponse = (message: HttpQuickReplyResponse) => {
  return {
    text: message.text,
    quick_replies: message.buttons.map(button => ({
      content_type: 'text',
      payload: button.payload,
      title: button.title,
    })),
  };
};

export const normalizeHttpImageResponse = (message: HttpImageResponse) => {
  return {
    attachment: {
      payload: {
        alt: '',
        src: message.image,
      },
      type: RESPONSE_MESSAGE_TYPES.IMAGE,
    },
  };
};

export function isHttpQuickReplyResponse(response: HttpResponse): response is HttpQuickReplyResponse {
  return (response as HttpQuickReplyResponse).buttons !== undefined;
}

export function hasCustomAttribute(
  response: HttpResponse,
): response is HttpCarouselResponse | HttpVideoResponse | HttpAccordionResponse | HttpFileDownloadResponse | HttpRatingResponse {
  return (
    'custom' in response &&
    response.custom !== undefined &&
    (response.custom.type === RESPONSE_MESSAGE_TYPES.CAROUSEL ||
      response.custom.type === RESPONSE_MESSAGE_TYPES.VIDEO ||
      response.custom.type === RESPONSE_MESSAGE_TYPES.ACCORDION ||
      response.custom.type === RESPONSE_MESSAGE_TYPES.FILE_DOWNLOAD ||
      response.custom.type === RESPONSE_MESSAGE_TYPES.RATING) 
  );
}

export function isHttpImageResponse(response: HttpResponse): response is HttpImageResponse {
  return (response as HttpImageResponse).image !== undefined;
}

export function isHttpTextResponse(response: HttpResponse): response is HttpTextResponse {
  return (response as HttpTextResponse).text !== undefined;
}
