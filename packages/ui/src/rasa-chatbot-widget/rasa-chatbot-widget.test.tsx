import type { SpecPage } from '@stencil/core/testing';
import { CustomErrorClass, ErrorSeverity, MESSAGE_TYPES, SENDER } from '@rasahq/chat-widget-sdk';

import { TYPING_INDICATOR_TIMEOUT } from './constants';

jest.mock('@rasahq/chat-widget-sdk', () => {
  const actual = jest.requireActual('@rasahq/chat-widget-sdk');

  class Rasa {
    handlers: Record<string, ((...args: unknown[]) => void)[]> = {};
    sessionId = 'test-session';
    sendMessage = jest.fn();
    connect = jest.fn();
    disconnect = jest.fn();
    reconnection = jest.fn();
    getChatHistory = jest.fn(() => ({}));

    constructor(public options: Record<string, unknown>) {}

    on(eventName: string, callback: (...args: unknown[]) => void) {
      (this.handlers[eventName] ??= []).push(callback);
    }

    emit(eventName: string, ...args: unknown[]) {
      this.handlers[eventName]?.forEach(callback => callback(...args));
    }
  }

  return { ...actual, Rasa };
});

const MESSAGE_DELAY = 600;

const botMessage = (text: string) => ({ type: MESSAGE_TYPES.TEXT, text, sender: SENDER.BOT });

describe('rasa-chatbot-widget typing indicator', () => {
  let page: SpecPage;
  let errorMessageService: typeof import('../store/error-message').errorMessageService;

  const hasTypingIndicator = () => !!page.root.shadowRoot.querySelector('rasa-typing-indicator');
  const client = () => page.rootInstance.client;

  const advanceTime = async (ms: number) => {
    jest.advanceTimersByTime(ms);
    await page.waitForChanges();
  };

  const sendMessage = async () => {
    page.root.dispatchEvent(new CustomEvent('sendMessageHandler', { detail: 'Hello' }));
    await page.waitForChanges();
  };

  const renderWidget = async (attributes = '') => {
    // Fresh module instances per test, so widgets from previous tests don't react to the shared stores
    jest.resetModules();
    const { newSpecPage } = require('@stencil/core/testing');
    const { RasaChatbotWidget } = require('./rasa-chatbot-widget');
    ({ errorMessageService } = require('../store/error-message'));

    page = await newSpecPage({
      components: [RasaChatbotWidget],
      html: `<rasa-chatbot-widget server-url="https://example.com" ${attributes}></rasa-chatbot-widget>`,
    });
  };

  beforeEach(() => {
    // Stencil flushes changes with process.nextTick, so only the timers are faked
    jest.useFakeTimers({ doNotFake: ['nextTick', 'queueMicrotask', 'setImmediate'] });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('shows the typing indicator as soon as a message is sent', async () => {
    await renderWidget();
    expect(hasTypingIndicator()).toBe(false);

    await sendMessage();

    expect(hasTypingIndicator()).toBe(true);
  });

  it('shows the typing indicator as soon as a quick reply is selected', async () => {
    await renderWidget();
    const quickReply = { text: 'Yes', reply: '/affirm' };
    page.rootInstance.messages = [{ type: MESSAGE_TYPES.QUICK_REPLY, sender: SENDER.BOT, text: 'Continue?', replies: [quickReply] }];
    await page.waitForChanges();

    page.root.dispatchEvent(new CustomEvent('quickReplySelected', { detail: { quickReply, key: 0 } }));
    await page.waitForChanges();

    expect(hasTypingIndicator()).toBe(true);
  });

  it('keeps showing the typing indicator until the first bot message is displayed', async () => {
    await renderWidget();
    await sendMessage();

    client().emit('message', botMessage('Hi'));
    await page.waitForChanges();
    expect(hasTypingIndicator()).toBe(true);

    await advanceTime(MESSAGE_DELAY - 1);
    expect(hasTypingIndicator()).toBe(true);

    await advanceTime(1);
    expect(hasTypingIndicator()).toBe(false);
  });

  it('shows the rest of the bot reply without the typing indicator', async () => {
    await renderWidget();
    await sendMessage();

    client().emit('message', botMessage('First'));
    client().emit('message', botMessage('Second'));
    await page.waitForChanges();
    await advanceTime(MESSAGE_DELAY);

    expect(hasTypingIndicator()).toBe(false);
  });

  it('hides the typing indicator as soon as the bot reply arrives when there is no message delay', async () => {
    await renderWidget('message-delay="0"');
    await sendMessage();

    client().emit('message', botMessage('Hi'));
    await page.waitForChanges();

    expect(hasTypingIndicator()).toBe(false);
  });

  it('hides the typing indicator when the bot does not reply in time', async () => {
    await renderWidget();
    await sendMessage();

    await advanceTime(TYPING_INDICATOR_TIMEOUT - 1);
    expect(hasTypingIndicator()).toBe(true);

    await advanceTime(1);
    expect(hasTypingIndicator()).toBe(false);
  });

  it('hides the typing indicator when the connection is lost', async () => {
    await renderWidget();
    await sendMessage();
    expect(hasTypingIndicator()).toBe(true);

    client().emit('disconnect');
    await page.waitForChanges();

    expect(hasTypingIndicator()).toBe(false);
  });

  it('hides the typing indicator when an error occurs', async () => {
    await renderWidget();
    await sendMessage();
    expect(hasTypingIndicator()).toBe(true);

    errorMessageService.setErrorMessage(new CustomErrorClass(ErrorSeverity.Error, 'Server error'));
    await page.waitForChanges();

    expect(hasTypingIndicator()).toBe(false);
  });
});

describe('rasa-chatbot-widget server streaming', () => {
  const STREAM_ID = 'stream-1';
  const STREAM_EVENTS = ['streamStart', 'streamChunk', 'streamEnd'];
  const timestamp = new Date('2026-01-01T10:00:00Z');

  let page: SpecPage;

  const client = () => page.rootInstance.client;
  const hasTypingIndicator = () => !!page.root.shadowRoot.querySelector('rasa-typing-indicator');
  const botTexts = () =>
    Array.from(page.root.shadowRoot.querySelectorAll('rasa-text-message.text-message--bot')).map(message =>
      message.shadowRoot.querySelector('rasa-text').shadowRoot.textContent,
    );

  const advanceTime = async (ms: number) => {
    jest.advanceTimersByTime(ms);
    await page.waitForChanges();
  };

  const emit = async (eventName: string, data?: unknown) => {
    client().emit(eventName, data);
    await page.waitForChanges();
  };

  const startStream = (text: string, streamId = STREAM_ID) => emit('streamStart', { streamId, text, timestamp });
  const streamChunk = (text: string, streamId = STREAM_ID) => emit('streamChunk', { streamId, text });
  const endStream = (text: string, streamId = STREAM_ID) =>
    emit('streamEnd', { streamId, message: { type: MESSAGE_TYPES.TEXT, sender: SENDER.BOT, text, timestamp } });

  const sendMessage = async () => {
    page.root.dispatchEvent(new CustomEvent('sendMessageHandler', { detail: 'Hello' }));
    await page.waitForChanges();
  };

  const renderWidget = async (attributes = '') => {
    // Fresh module instances per test, so widgets from previous tests don't react to the shared stores
    jest.resetModules();
    const { newSpecPage } = require('@stencil/core/testing');
    const { RasaChatbotWidget } = require('./rasa-chatbot-widget');
    const { RasaTextMessage } = require('../components/text-message/text-message');
    const { RasaText } = require('../components/text/text');

    page = await newSpecPage({
      components: [RasaChatbotWidget, RasaTextMessage, RasaText],
      html: `<rasa-chatbot-widget server-url="https://example.com" ${attributes}></rasa-chatbot-widget>`,
    });
  };

  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['nextTick', 'queueMicrotask', 'setImmediate'] });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('does not listen to stream events by default', async () => {
    await renderWidget();

    expect(client().options.enableServerStreaming).toBe(false);
    STREAM_EVENTS.forEach(eventName => expect(client().handlers[eventName]).toBeUndefined());
  });

  it('does not listen to stream events with the REST protocol', async () => {
    await renderWidget('enable-server-streaming rest-enabled');

    expect(client().options.enableServerStreaming).toBe(false);
    STREAM_EVENTS.forEach(eventName => expect(client().handlers[eventName]).toBeUndefined());
  });

  it('listens to stream events when enabled', async () => {
    await renderWidget('enable-server-streaming');

    expect(client().options.enableServerStreaming).toBe(true);
    STREAM_EVENTS.forEach(eventName => expect(client().handlers[eventName]).toHaveLength(1));
  });

  it('renders the streamed text in one message while it arrives', async () => {
    await renderWidget('enable-server-streaming');
    await sendMessage();
    expect(hasTypingIndicator()).toBe(true);

    await startStream('Hel');
    expect(hasTypingIndicator()).toBe(false);
    expect(botTexts()).toEqual(['Hel']);

    await streamChunk('Hello, **wor');
    expect(botTexts()).toEqual(['Hello, wor']);

    await endStream('Hello, **world**');
    expect(botTexts()).toEqual(['Hello, world']);
  });

  it('emits the received message once the stream ends', async () => {
    await renderWidget('enable-server-streaming');
    const receivedMessage = jest.fn();
    page.root.addEventListener('chatWidgetReceivedMessage', receivedMessage);

    await startStream('Hel');
    await streamChunk('Hello');
    expect(receivedMessage).not.toHaveBeenCalled();

    await endStream('Hello, world');
    expect(receivedMessage).toHaveBeenCalledTimes(1);
    expect(receivedMessage.mock.calls[0][0].detail).toEqual({ type: MESSAGE_TYPES.TEXT, sender: SENDER.BOT, text: 'Hello, world', timestamp });
  });

  it('renders messages received during the stream below it once the stream ends', async () => {
    await renderWidget('enable-server-streaming');
    await sendMessage();

    await startStream('Streamed');
    await emit('message', botMessage('After'));
    await advanceTime(MESSAGE_DELAY);
    expect(botTexts()).toEqual(['Streamed']);

    await endStream('Streamed text');
    await advanceTime(0);
    expect(botTexts()).toEqual(['Streamed text', 'After']);
  });

  it('renders a stream that follows a message after it, without an extra delay', async () => {
    await renderWidget('enable-server-streaming');
    await sendMessage();

    await emit('message', botMessage('Before'));
    await startStream('Streamed');
    expect(botTexts()).toEqual([]);
    expect(hasTypingIndicator()).toBe(true);

    await advanceTime(MESSAGE_DELAY);
    expect(botTexts()).toEqual(['Before', 'Streamed']);
    expect(hasTypingIndicator()).toBe(false);
  });

  it('renders consecutive streams as separate messages', async () => {
    await renderWidget('enable-server-streaming');

    await startStream('First', 'stream-1');
    await endStream('First', 'stream-1');
    await startStream('Second', 'stream-2');
    await streamChunk('Second text', 'stream-2');
    await endStream('Second text', 'stream-2');

    expect(botTexts()).toEqual(['First', 'Second text']);
  });

  it('ignores chunks and ends of unknown streams', async () => {
    await renderWidget('enable-server-streaming');
    const receivedMessage = jest.fn();
    page.root.addEventListener('chatWidgetReceivedMessage', receivedMessage);

    await streamChunk('Text');
    await endStream('Text');

    expect(botTexts()).toEqual([]);
    expect(receivedMessage).not.toHaveBeenCalled();
  });

  it('does not render streams in another tab of a continuous session', async () => {
    await renderWidget('enable-server-streaming sender-id="user-1"');
    // The mock document of the spec page has no focus support
    (page.doc as Document).hasFocus = () => false;
    const receivedMessage = jest.fn();
    page.root.addEventListener('chatWidgetReceivedMessage', receivedMessage);

    await startStream('Hel');
    await streamChunk('Hello');
    await endStream('Hello');

    expect(botTexts()).toEqual([]);
    expect(receivedMessage).not.toHaveBeenCalled();
  });
});
