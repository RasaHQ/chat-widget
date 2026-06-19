/**
 * Integration tests for `RasaChatbotWidget.loadHistory` and the
 * cross-session CSAT lifecycle.
 *
 * Spec:
 *   1. CSAT prompts in history are NEVER rendered as chat bubbles.
 *   2. A page refresh ALWAYS closes the popup, whether the user rated or
 *      not - a pending CSAT request expires with its session.
 *   3. After a refresh, the answered-hash is dropped on the next
 *      session-divider, so when the bot reuses the same `utter_ask_csat_score`
 *      template in a fresh conversation, the popup opens again.
 */
import { newSpecPage } from '@stencil/core/testing';
import {
  CsatMessage,
  MESSAGE_TYPES,
  Message,
  QuickReplyMessage,
  SENDER,
} from '@rasahq/chat-widget-sdk';
import { RasaChatbotWidget } from './rasa-chatbot-widget';

const divider = (): Message =>
  ({ type: MESSAGE_TYPES.SESSION_DIVIDER, startDate: new Date() } as Message);

const text = (sender: 'bot' | 'user' = SENDER.BOT, body = 'hi'): Message =>
  ({ sender, type: MESSAGE_TYPES.TEXT, text: body } as Message);

const csatButtons = (question = 'Was this helpful?'): QuickReplyMessage =>
  ({
    sender: SENDER.BOT,
    type: MESSAGE_TYPES.QUICK_REPLY,
    text: question,
    replies: [
      { text: 'Yes', reply: '/SetSlots{"csat_score":"satisfied"}', isSelected: false },
      { text: 'No', reply: '/SetSlots{"csat_score":"unsatisfied"}', isSelected: false },
    ],
  } as unknown as QuickReplyMessage);

const csatTyped = (question = 'Was this helpful?'): CsatMessage =>
  ({
    sender: SENDER.BOT,
    type: MESSAGE_TYPES.CSAT,
    question,
    thankYou: 'Thanks!',
    options: [
      { value: 'satisfied', payload: '/SetSlots{"csat_score":"satisfied"}' },
      { value: 'unsatisfied', payload: '/SetSlots{"csat_score":"unsatisfied"}' },
    ],
  } as unknown as CsatMessage);

/**
 * Render the widget without letting it construct a real Rasa client.
 * The constructor in componentWillLoad calls `new Rasa(...)` which would
 * attempt to open a websocket; we pre-stub the client method on the prototype
 * by wrapping componentWillLoad.
 */
const renderWidget = async (extraAttrs = 'enable-feedback="true"') => {
  const originalComponentWillLoad = RasaChatbotWidget.prototype.componentWillLoad;
  RasaChatbotWidget.prototype.componentWillLoad = function patched() {
    const result = originalComponentWillLoad.call(this);
    this.client = {
      on: () => {},
      connect: () => {},
      disconnect: () => {},
      reconnection: () => {},
      sendMessage: () => {},
      sendSilentMessage: () => {},
      sessionId: 'test-session',
      getChatHistory: () => '{}',
      updateAuthenticationToken: () => {},
      overrideChatHistory: () => {},
    } as never;
    return result;
  };

  try {
    return await newSpecPage({
      components: [RasaChatbotWidget],
      html: `<rasa-chatbot-widget
        server-url="http://localhost:5005"
        ${extraAttrs}
        feedback-question-text="How was it?"
        feedback-thank-you-text="Thanks!"
      ></rasa-chatbot-widget>`,
    });
  } finally {
    RasaChatbotWidget.prototype.componentWillLoad = originalComponentWillLoad;
  }
};

beforeEach(() => {
  sessionStorage.clear();
});

describe('RasaChatbotWidget loadHistory - refresh closes the popup', () => {
  it('strips a QUICK_REPLY CSAT message from rendered history', async () => {
    const page = await renderWidget();
    const widget = page.rootInstance as RasaChatbotWidget;

    const history: Message[] = [divider(), text(), text(), csatButtons()];
    (widget as never as { loadHistory: (d: Message[]) => void }).loadHistory(history);
    await page.waitForChanges();

    expect((widget as never as { messages: Message[] }).messages).toHaveLength(3);
    expect((widget as never as { showFeedback: boolean }).showFeedback).toBe(false);
  });

  it('strips a CSAT-typed message from rendered history', async () => {
    const page = await renderWidget();
    const widget = page.rootInstance as RasaChatbotWidget;

    const history: Message[] = [divider(), text(), text(), csatTyped()];
    (widget as never as { loadHistory: (d: Message[]) => void }).loadHistory(history);
    await page.waitForChanges();

    expect((widget as never as { messages: Message[] }).messages).toHaveLength(3);
    expect((widget as never as { showFeedback: boolean }).showFeedback).toBe(false);
  });

  // Reported requirement: "if I refresh and I didn't rate, I don't want to
  // see thumbs up and down". The pending CSAT expires with the session.
  it('does NOT re-open the popup on refresh when the user did not rate', async () => {
    const page = await renderWidget();
    const widget = page.rootInstance as RasaChatbotWidget;

    const history: Message[] = [divider(), text(), text(), csatTyped()];
    (widget as never as { loadHistory: (d: Message[]) => void }).loadHistory(history);
    await page.waitForChanges();

    expect((widget as never as { showFeedback: boolean }).showFeedback).toBe(false);
  });

  it('does NOT re-open the popup after multiple refreshes with trailing dividers', async () => {
    const page = await renderWidget();
    const widget = page.rootInstance as RasaChatbotWidget;

    const history: Message[] = [
      divider(),
      text(),
      csatTyped(),
      divider(),
      divider(),
      divider(),
    ];
    (widget as never as { loadHistory: (d: Message[]) => void }).loadHistory(history);
    await page.waitForChanges();

    expect((widget as never as { showFeedback: boolean }).showFeedback).toBe(false);
  });

  it('strips both CSAT shapes when they appear interleaved with text', async () => {
    const page = await renderWidget();
    const widget = page.rootInstance as RasaChatbotWidget;

    const history: Message[] = [
      text(),
      csatTyped('Round one?'),
      text(),
      csatButtons('Round two?'),
      text(),
    ];
    (widget as never as { loadHistory: (d: Message[]) => void }).loadHistory(history);
    await page.waitForChanges();

    const remaining = (widget as never as { messages: Message[] }).messages;
    expect(remaining).toHaveLength(3);
    expect(remaining.every(m => m.type === MESSAGE_TYPES.TEXT)).toBe(true);
  });

  it('preserves non-CSAT QUICK_REPLY messages (yes/no flow, etc.)', async () => {
    const page = await renderWidget();
    const widget = page.rootInstance as RasaChatbotWidget;

    const nonCsatButtons = {
      sender: SENDER.BOT,
      type: MESSAGE_TYPES.QUICK_REPLY,
      text: 'Continue?',
      replies: [
        { text: 'Yes', reply: '/affirm', isSelected: false },
        { text: 'No', reply: '/deny', isSelected: false },
      ],
    } as unknown as Message;

    const history: Message[] = [text(), nonCsatButtons];
    (widget as never as { loadHistory: (d: Message[]) => void }).loadHistory(history);
    await page.waitForChanges();

    expect((widget as never as { messages: Message[] }).messages).toHaveLength(2);
  });

  it('passes through history untouched when feedback is disabled', async () => {
    const page = await renderWidget('');
    const widget = page.rootInstance as RasaChatbotWidget;

    const history: Message[] = [divider(), text(), csatTyped(), divider()];
    (widget as never as { loadHistory: (d: Message[]) => void }).loadHistory(history);
    await page.waitForChanges();

    expect((widget as never as { showFeedback: boolean }).showFeedback).toBe(false);
    expect((widget as never as { messages: Message[] }).messages).toHaveLength(4);
  });
});

describe('RasaChatbotWidget - cross-session CSAT lifecycle', () => {
  // The hash-based answered memo is set when the user rates. It must be
  // cleared on the next session-divider so a fresh CSAT in a new session
  // (which reuses the same template and therefore the same content-hash)
  // opens the popup again.
  it('clears the answered hash when a new session begins', async () => {
    const { isCsatAnsweredFor, markCsatAnswered } = await import('../utils/csat');

    const page = await renderWidget();
    const widget = page.rootInstance as RasaChatbotWidget;
    const prompt = csatTyped('How was it?');

    markCsatAnswered(prompt);
    expect(isCsatAnsweredFor(prompt)).toBe(true);

    (widget as never as { onNewMessage: (m: Message) => void }).onNewMessage(divider());
    await page.waitForChanges();

    expect(isCsatAnsweredFor(prompt)).toBe(false);
  });

  it('opens a fresh CSAT in a new conv after the user rated and refreshed', async () => {
    const { markCsatAnswered } = await import('../utils/csat');

    const page = await renderWidget();
    const widget = page.rootInstance as RasaChatbotWidget;

    // Pre-state: user already rated this template in a previous session.
    markCsatAnswered(csatTyped('How was it?'));

    // Refresh: history contains the rated prompt; the popup must stay closed.
    (widget as never as { loadHistory: (d: Message[]) => void }).loadHistory([
      divider(),
      text(),
      csatTyped('How was it?'),
      divider(),
    ]);
    await page.waitForChanges();
    expect((widget as never as { showFeedback: boolean }).showFeedback).toBe(false);

    // Fresh session begins.
    (widget as never as { onNewMessage: (m: Message) => void }).onNewMessage(divider());

    // Bot eventually sends the same CSAT template in the new conversation.
    (widget as never as { handleCsatRequest: (m: Message) => void }).handleCsatRequest(
      csatTyped('How was it?'),
    );
    await page.waitForChanges();

    expect((widget as never as { showFeedback: boolean }).showFeedback).toBe(true);
  });

  it('suppresses a server replay of an already-rated CSAT in the same session', async () => {
    const { markCsatAnswered } = await import('../utils/csat');

    const page = await renderWidget();
    const widget = page.rootInstance as RasaChatbotWidget;
    const prompt = csatTyped('How was it?');

    markCsatAnswered(prompt);
    (widget as never as { handleCsatRequest: (m: Message) => void }).handleCsatRequest(prompt);
    await page.waitForChanges();

    expect((widget as never as { showFeedback: boolean }).showFeedback).toBe(false);
  });
});
