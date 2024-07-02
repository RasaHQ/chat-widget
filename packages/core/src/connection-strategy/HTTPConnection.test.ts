/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpResponse, MessageResponse } from '../types/server-response.types';

import { HTTPConnection } from './HTTPConnection';

describe('HTTPConnection', () => {
  const url = 'http://rasa.com';
  const sessionId = 'b01f371e-006d-4ab5-9762-bcf412453a34';
  const connectionParams = { url };
  let httpConnection: HTTPConnection;

  beforeEach(() => {
    httpConnection = new HTTPConnection(connectionParams);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send a message and receive a response', async () => {
    const message = 'Hello';
    const response: HttpResponse[] = [{ recipient_id: sessionId, text: 'Hi there' }];
    const normalizedResponse: MessageResponse[] = [{ text: 'Hi there' }];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(response),
    });

    const cb = jest.fn();
    await httpConnection.sendMessage(message, sessionId, cb);

    expect(global.fetch).toHaveBeenCalledWith(`${url}/webhooks/rest/webhook`, {
      method: 'POST',
      body: JSON.stringify({ sender: sessionId, message }),
    });

    expect(cb).toHaveBeenCalledWith(normalizedResponse);
  });

  it('should normalize quick reply responses', () => {
    const response: HttpResponse[] = [
      { recipient_id: sessionId, text: 'Hi there', buttons: [{ title: 'Reply 1', payload: 'Click Here' }] },
    ];
    const normalizedResponse: MessageResponse[] = [
      { text: 'Hi there', quick_replies: [{ title: 'Reply 1', content_type: 'text', payload: 'Click Here' }] },
    ];

    const result = (httpConnection as any).normalizeResponse(response);
    expect(result).toEqual(normalizedResponse);
  });

  it('should normalize custom accordion response', () => {
    const response: HttpResponse[] = [
      {
        recipient_id: sessionId,
        custom: { type: 'accordion', elements: [{ title: 'Expand', text: 'Expanded content.' }] },
      },
    ];
    const normalizedResponse: MessageResponse[] = [
      { type: 'accordion', elements: [{ title: 'Expand', text: 'Expanded content.' }] },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (httpConnection as any).normalizeResponse(response);
    expect(result).toEqual(normalizedResponse);
  });

  it('should normalize custom image response', () => {
    const response: HttpResponse[] = [
      {
        recipient_id: sessionId,
        image: 'www.rasa.com/image.jpg',
      },
    ];
    const normalizedResponse: MessageResponse[] = [
      { attachment: { payload: { alt: '', src: 'www.rasa.com/image.jpg' }, type: 'image' } },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (httpConnection as any).normalizeResponse(response);
    expect(result).toEqual(normalizedResponse);
  });
});
