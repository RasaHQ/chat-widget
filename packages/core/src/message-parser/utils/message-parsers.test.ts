import type {
  AccordionMessage,
  CarouselMessage,
  FileDownloadMessage,
  ImageMessage,
  QuickReplyMessage,
  TextMessage,
  VideoMessage,
} from '../types';
import {
  AccordionResponse,
  CarouselResponse,
  FileDownloadResponse,
  ImageResponse,
  QuickReplyResponse,
  TextResponse,
  VideoResponse,
} from '../../types/server-response.types';

import { MESSAGE_TYPES } from '../constants';
import { MessageParsers } from './message-parsers';
import { RESPONSE_MESSAGE_TYPES } from '../../constants';
import { SenderType } from '../../types/common.types';

describe('MessageParsers', () => {
  const sender: SenderType = 'user';

  it('text message correctly parsed', () => {
    const textResponse: TextResponse = { text: 'Hello' };
    const expected: TextMessage = {
      sender,
      type: MESSAGE_TYPES.TEXT,
      text: 'Hello',
    };

    expect(MessageParsers.text(textResponse, sender)).toEqual(expected);
  });

  it('image message correctly parsed', () => {
    const imageResponse: ImageResponse = {
      attachment: {
        payload: { src: 'http://image.url', alt: 'alt text' },
        type: 'image',
      },
      text: 'Image description',
    };
    const expected: ImageMessage = {
      sender,
      type: MESSAGE_TYPES.IMAGE,
      imageSrc: 'http://image.url',
      alt: 'alt text',
      text: 'Image description',
    };

    expect(MessageParsers.image(imageResponse, sender)).toEqual(expected);
  });

  it('image message with no alt correctly parsed', () => {
    const imageResponse: ImageResponse = {
      attachment: {
        payload: { src: 'http://image.url' },
        type: 'image',
      },
      text: 'Image description',
    };
    const expected: ImageMessage = {
      sender,
      type: MESSAGE_TYPES.IMAGE,
      imageSrc: 'http://image.url',
      alt: '',
      text: 'Image description',
    };

    expect(MessageParsers.image(imageResponse, sender)).toEqual(expected);
  });

  it('accordion message correctly parsed', () => {
    const accordionResponse: AccordionResponse = {
      type: RESPONSE_MESSAGE_TYPES.ACCORDION,
      elements: [{ title: 'Accordion title', text: 'Accordion text' }],
    };
    const expected: AccordionMessage = {
      sender,
      ...accordionResponse,
      type: MESSAGE_TYPES.ACCORDION,
    };

    expect(MessageParsers.accordion(accordionResponse, sender)).toEqual(expected);
  });

  it('carousel message correctly parsed', () => {
    const carouselResponse: CarouselResponse = {
      type: RESPONSE_MESSAGE_TYPES.CAROUSEL,
      elements: [
        {
          image_url: 'http://image1.url',
          text: 'Text 1',
          link: 'http://link1.url',
        },
        {
          image_url: 'http://image2.url',
          text: 'Text 2',
          link: 'http://link2.url',
        },
      ],
    };
    const expected: CarouselMessage = {
      sender,
      type: MESSAGE_TYPES.CAROUSEL,
      elements: [
        {
          imageUrl: 'http://image1.url',
          text: 'Text 1',
          link: 'http://link1.url',
        },
        {
          imageUrl: 'http://image2.url',
          text: 'Text 2',
          link: 'http://link2.url',
        },
      ],
    };

    expect(MessageParsers.carousel(carouselResponse, sender)).toEqual(expected);
  });

  it('quick reply message correctly parsed', () => {
    const quickReplyResponse: QuickReplyResponse = {
      text: 'Choose one',
      quick_replies: [
        { content_type: 'text', title: 'Option 1', payload: 'option1' },
        { content_type: 'text', title: 'Option 2', payload: 'option2' },
      ],
    };
    const expected: QuickReplyMessage = {
      sender,
      type: MESSAGE_TYPES.QUICK_REPLY,
      text: 'Choose one',
      replies: [
        { text: 'Option 1', reply: 'option1' },
        { text: 'Option 2', reply: 'option2' },
      ],
    };

    expect(MessageParsers.quickReply(quickReplyResponse, sender)).toEqual(expected);
  });

  it('file download message correctly parsed', () => {
    const fileDownloadResponse: FileDownloadResponse = {
      type: RESPONSE_MESSAGE_TYPES.FILE_DOWNLOAD,
      text: 'Download this file',
      file_url: 'http://file.url',
      file_name: 'file.txt',
    };
    const expected: FileDownloadMessage = {
      sender,
      type: MESSAGE_TYPES.FILE_DOWNLOAD,
      fileName: 'file.txt',
      fileUrl: 'http://file.url',
      text: 'Download this file',
    };

    expect(MessageParsers.fileDownload(fileDownloadResponse, sender)).toEqual(expected);
  });

  it('video message correctly parsed', () => {
    const videoResponse: VideoResponse = {
      type: RESPONSE_MESSAGE_TYPES.VIDEO,
      title: 'Video title',
      video_url: 'http://video.url',
    };
    const expected: VideoMessage = {
      sender,
      type: MESSAGE_TYPES.VIDEO,
      src: 'http://video.url',
    };

    expect(MessageParsers.video(videoResponse, sender)).toEqual(expected);
  });
});
