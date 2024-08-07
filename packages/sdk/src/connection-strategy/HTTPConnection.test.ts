/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorSeverity } from '../errors';
import { HttpResponse, MessageResponse } from '../types/server-response.types';

import { HTTPConnection } from './HTTPConnection';

const onConnect = jest.fn();
const onDisconnect = jest.fn();
const onBotResponse = jest.fn();
const onSessionConfirm = jest.fn();

describe('HTTPConnection', () => {
  const url = 'http://rasa.com';
  const sessionId = 'b01f371e-006d-4ab5-9762-bcf412453a34';
  const connectionParams = { url, onConnect, onDisconnect, onBotResponse, onSessionConfirm };
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
      headers: new Headers(),
      json: jest.fn().mockResolvedValue(response),
    });

    await httpConnection.sendMessage(message, sessionId);

    expect(global.fetch).toHaveBeenCalledWith(`${url}/webhooks/rest/webhook`, {
      method: 'POST',
      headers: new Headers(),
      body: JSON.stringify({ sender: sessionId, message }),
    });

    expect(onBotResponse).toHaveBeenCalledWith(normalizedResponse[0]);
  });

  it('should send a message and receive a response (with authorization token)', async () => {
    httpConnection = new HTTPConnection({ ...connectionParams, authenticationToken: 'jwt' });
    const message = 'Hello';
    const response: HttpResponse[] = [{ recipient_id: sessionId, text: 'Hi there' }];
    const normalizedResponse: MessageResponse[] = [{ text: 'Hi there' }];
    const expectedHeaders = new Headers();
    expectedHeaders.append('Authorization', `Bearer jwt`);

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: jest.fn().mockResolvedValue(response),
    });
    await httpConnection.sendMessage(message, sessionId);

    expect(global.fetch).toHaveBeenCalledWith(`${url}/webhooks/rest/webhook`, {
      method: 'POST',
      headers: expectedHeaders,
      body: JSON.stringify({ sender: sessionId, message }),
    });
    expect(onBotResponse).toHaveBeenCalledWith(normalizedResponse[0]);
  });

  it('should throw error when a response not ok', async () => {
    const message = 'Hello';
    const response: HttpResponse[] = [{ recipient_id: sessionId, text: 'Hi there' }];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      headers: new Headers(),
      json: jest.fn().mockResolvedValue(response)
    });

    try {
      await httpConnection.sendMessage(message, sessionId);
    } catch (error: any) {
      expect(error.severity).toBe(ErrorSeverity.Error);
      expect(error.message).toBe('Server error');
    }
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
    expect(result).toEqual([{ ...normalizedResponse[0], timestamp: result[0].timestamp }]);
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
    expect(result).toEqual([{ ...normalizedResponse[0], timestamp: result[0].timestamp }]);
  });

  it('should return the original message if it does not match any specific type', () => {
    const response: HttpResponse[] = [
      {
        recipient_id: sessionId,
        //@ts-expect-error @ts
        unknownType: 'Unknown type'
      }
    ];
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (httpConnection as any).normalizeResponse(response);
    expect(result).toEqual(response);
  });

  it('should trigger event callbacks on connect', () => {
    httpConnection.connect();

    expect(onConnect).toHaveBeenCalledTimes(1);
    expect(onSessionConfirm).toHaveBeenCalledTimes(1);
  });

  it('should trigger event callbacks on disconnect', () => {
    httpConnection.disconnect();

    expect(onDisconnect).toHaveBeenCalledTimes(1);
  });
});
