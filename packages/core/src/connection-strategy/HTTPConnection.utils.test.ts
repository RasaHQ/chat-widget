import { HttpImageResponse, HttpQuickReplyResponse, HttpResponse } from '../types/server-response.types';
import {
  isHttpImageResponse,
  normalizeHttpImageResponse,
  normalizeHttpQuickReplyResponse,
} from './HTTPConnection.utils';

describe('normalizeHttpQuickReplyResponse', () => {
  it('should normalize HttpQuickReplyResponse correctly', () => {
    const message: HttpQuickReplyResponse = {
      recipient_id: 'b01f371e-006d-4ab5-9762-bcf412453a34',
      text: 'Sample text',
      buttons: [
        { title: 'Button 1', payload: 'payload1' },
        { title: 'Button 2', payload: 'payload2' },
      ],
    };

    const normalized = normalizeHttpQuickReplyResponse(message);

    expect(normalized).toEqual({
      text: 'Sample text',
      quick_replies: [
        { content_type: 'text', payload: 'payload1', title: 'Button 1' },
        { content_type: 'text', payload: 'payload2', title: 'Button 2' },
      ],
    });
  });
});

describe('normalizeHttpImageResponse', () => {
  it('should normalize HttpImageResponse correctly', () => {
    const message: HttpImageResponse = {
      recipient_id: 'b01f371e-006d-4ab5-9762-bcf412453a34',
      image: 'https://example.com/image.jpg',
    };

    const normalized = normalizeHttpImageResponse(message);

    expect(normalized).toEqual({
      attachment: {
        payload: {
          alt: '',
          src: 'https://example.com/image.jpg',
        },
        type: 'image',
      },
    });
  });
});

describe('isHttpImageResponse', () => {
  it('should return true for HttpImageResponse', () => {
    const response: HttpResponse = {
      recipient_id: 'b01f371e-006d-4ab5-9762-bcf412453a34',
      image: 'https://example.com/image.jpg',
    };

    expect(isHttpImageResponse(response)).toBe(true);
  });

  it('should return false for non-HttpImageResponse', () => {
    const response: HttpResponse = {
      recipient_id: 'b01f371e-006d-4ab5-9762-bcf412453a34',
      text: 'Sample text',
    };

    expect(isHttpImageResponse(response)).toBe(false);
  });
});
