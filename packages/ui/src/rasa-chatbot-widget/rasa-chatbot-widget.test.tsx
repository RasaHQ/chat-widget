import type { SpecPage } from '@stencil/core/testing';
import { CustomErrorClass, ErrorSeverity, MESSAGE_TYPES, SENDER } from '@rasahq/chat-widget-sdk';

import { TYPING_INDICATOR_TIMEOUT } from './constants';

jest.mock('@rasahq/chat-widget-sdk', () => {
  const actual = jest.requireActual('@rasahq/chat-widget-sdk');

  class Rasa {
    private handlers: Record<string, ((...args: unknown[]) => void)[]> = {};
    sessionId = 'test-session';
    sendMessage = jest.fn();
    connect = jest.fn();
    disconnect = jest.fn();
    reconnection = jest.fn();

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
