import type { SpecPage } from '@stencil/core/testing';
import { MESSAGE_TYPES, QuickReplyMessage, SENDER } from '@rasahq/chat-widget-sdk';

import type { WidgetConfig } from '../../store/config-store';

const quickReplyMessage = (text?: string): QuickReplyMessage => ({
  type: MESSAGE_TYPES.QUICK_REPLY,
  sender: SENDER.BOT,
  text,
  replies: [
    { text: 'Yes', reply: '/affirm' },
    { text: 'No', reply: '/deny' },
  ],
});

describe('rasa-quick-reply', () => {
  let page: SpecPage;
  let quickReply: HTMLElement;

  const renderQuickReply = async (message: QuickReplyMessage, config: Partial<WidgetConfig> = {}) => {
    // Fresh module instances per test, so components from previous tests don't react to the shared config store
    jest.resetModules();
    const { newSpecPage } = require('@stencil/core/testing');
    const { setConfigStore } = require('../../store/config-store');
    const { RasaQuickReply } = require('./quick-reply');

    setConfigStore(config);
    page = await newSpecPage({ components: [RasaQuickReply], html: '' });
    quickReply = page.doc.createElement('rasa-quick-reply');
    (quickReply as HTMLRasaQuickReplyElement).message = message;
    page.body.appendChild(quickReply);
    await page.waitForChanges();
  };

  const bubble = () => quickReply.shadowRoot.querySelector('chat-message');
  const buttons = () => Array.from(quickReply.shadowRoot.querySelectorAll('rasa-button')).map(button => button.getAttribute('title'));

  it('renders the text and the buttons', async () => {
    await renderQuickReply(quickReplyMessage('Continue?'));

    expect(bubble().querySelector('rasa-text').getAttribute('value')).toBe('Continue?');
    expect(buttons()).toEqual(['Yes', 'No']);
  });

  it('renders the text bubble also when the message has no text', async () => {
    await renderQuickReply(quickReplyMessage(''));

    expect(bubble()).not.toBeNull();
    expect(buttons()).toEqual(['Yes', 'No']);
  });

  describe('with server streaming enabled', () => {
    const config = { enableServerStreaming: true };

    it('renders only the buttons when the message has no text', async () => {
      await renderQuickReply(quickReplyMessage(), config);

      expect(bubble()).toBeNull();
      expect(buttons()).toEqual(['Yes', 'No']);
    });

    it('renders only the buttons when the message text is empty', async () => {
      await renderQuickReply(quickReplyMessage(' '), config);

      expect(bubble()).toBeNull();
      expect(buttons()).toEqual(['Yes', 'No']);
    });

    it('renders the text and the buttons when the message has text', async () => {
      await renderQuickReply(quickReplyMessage('Continue?'), config);

      expect(bubble().querySelector('rasa-text').getAttribute('value')).toBe('Continue?');
      expect(buttons()).toEqual(['Yes', 'No']);
    });

    it('renders the buttons right away when stream messages are enabled', async () => {
      await renderQuickReply(quickReplyMessage(), { ...config, streamMessages: true });

      expect(bubble()).toBeNull();
      expect(buttons()).toEqual(['Yes', 'No']);
    });
  });
});
