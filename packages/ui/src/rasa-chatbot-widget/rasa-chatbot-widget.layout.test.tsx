import type { SpecPage } from '@stencil/core/testing';

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

describe('rasa-chatbot-widget layout and utility props', () => {
  let page: SpecPage;

  const renderWidget = async (attributes = '') => {
    jest.resetModules();
    const { newSpecPage } = require('@stencil/core/testing');
    const { RasaChatbotWidget } = require('./rasa-chatbot-widget');
    const { Messenger } = require('../components/messenger');

    page = await newSpecPage({
      components: [RasaChatbotWidget, Messenger],
      html: `<rasa-chatbot-widget server-url="https://example.com" ${attributes}></rasa-chatbot-widget>`,
    });
  };

  const $ = (selector: string) => page.root.shadowRoot.querySelector(selector);
  const $$ = (selector: string) => Array.from(page.root.shadowRoot.querySelectorAll(selector));

  beforeEach(() => {
    // Stencil flushes changes with process.nextTick, so only the timers are faked
    jest.useFakeTimers({ doNotFake: ['nextTick', 'queueMicrotask', 'setImmediate'] });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('reflects the theme attribute and defaults to light', async () => {
    await renderWidget();
    expect(page.root.getAttribute('theme')).toBe('light');

    await renderWidget('theme="midnight"');
    expect(page.root.getAttribute('theme')).toBe('midnight');
  });

  it('anchors to the bottom right by default and to the left on request', async () => {
    await renderWidget();
    expect($('.rasa-chatbot-widget').classList.contains('rasa-chatbot-widget--left')).toBe(false);

    await renderWidget('position="bottom-left"');
    expect($('.rasa-chatbot-widget').classList.contains('rasa-chatbot-widget--left')).toBe(true);
  });

  it('makes the launcher keyboard reachable and reports its expanded state', async () => {
    await renderWidget();
    const launcher = $('.rasa-chatbot-widget__launcher') as HTMLElement;
    expect(launcher.getAttribute('tabindex')).toBe('0');
    expect(launcher.getAttribute('aria-expanded')).toBe('false');

    launcher.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await page.waitForChanges();

    expect(launcher.getAttribute('aria-expanded')).toBe('true');
  });

  it('shows a launcher label only while the chat is closed', async () => {
    await renderWidget('launcher-label="Ask us"');
    expect($('.rasa-chatbot-widget__launcher-label').textContent).toBe('Ask us');

    ($('.rasa-chatbot-widget__launcher') as HTMLElement).click();
    await page.waitForChanges();

    expect($('.rasa-chatbot-widget__launcher-label')).toBeNull();
  });

  it('shows the connection status in the header unless a subtitle is set', async () => {
    await renderWidget();
    expect($('.messenger__header-subtitle rasa-text').getAttribute('value')).toBe('Connecting…');

    page.rootInstance.isConnected = true;
    await page.waitForChanges();
    expect($('.messenger__header-subtitle rasa-text').getAttribute('value')).toBe('Online');

    await renderWidget('widget-subtitle="Usually replies in a minute"');
    expect($('.messenger__header-subtitle rasa-text').getAttribute('value')).toBe('Usually replies in a minute');
  });

  it('renders a close button that can be turned off', async () => {
    await renderWidget();
    expect($('.messenger__header-close')).not.toBeNull();

    await renderWidget('hide-close-button="true"');
    expect($('.messenger__header-close')).toBeNull();
  });

  describe('suggested prompts', () => {
    it('renders one chip per prompt', async () => {
      await renderWidget('suggested-prompts="Pricing, Support"');
      expect($$('.messenger__suggestion').map(chip => chip.textContent.trim())).toEqual(['Pricing', 'Support']);
    });

    it('sends the prompt as a user message and hides the chips', async () => {
      await renderWidget('suggested-prompts="Pricing, Support"');
      page.rootInstance.isConnected = true;
      await page.waitForChanges();

      ($('.messenger__suggestion') as HTMLElement).click();
      await page.waitForChanges();

      expect(page.rootInstance.client.sendMessage).toHaveBeenCalledWith(expect.objectContaining({ text: 'Pricing' }));
      expect($$('.messenger__suggestion')).toHaveLength(0);
    });

    it('does nothing while disconnected', async () => {
      await renderWidget('suggested-prompts="Pricing"');

      ($('.messenger__suggestion') as HTMLElement).click();
      await page.waitForChanges();

      expect(page.rootInstance.client.sendMessage).not.toHaveBeenCalled();
    });
  });

  it('shows the welcome message', async () => {
    await renderWidget('welcome-message="Ask anything"');
    expect($('.messenger__welcome rasa-text').getAttribute('value')).toBe('Ask anything');
  });

  it('shows the scroll to latest button once the visitor scrolls up', async () => {
    await renderWidget();
    const button = $('.messenger__scroll-bottom');
    expect(button.classList.contains('messenger__scroll-bottom--visible')).toBe(false);

    const wrapper = $('.messenger__content-wrapper') as HTMLElement;
    Object.defineProperty(wrapper, 'scrollTop', { value: -300, configurable: true });
    wrapper.dispatchEvent(new Event('scroll'));
    await page.waitForChanges();

    expect(button.classList.contains('messenger__scroll-bottom--visible')).toBe(true);
  });

  it('updates the title and full screen toggle when the props change after load', async () => {
    await renderWidget('widget-title="Before"');
    expect($('.messenger__header-title rasa-text').getAttribute('value')).toBe('Before');
    expect($('.messenger__header-action[aria-label="Enter full screen"]')).toBeNull();

    page.root.setAttribute('widget-title', 'After');
    page.root.setAttribute('toggle-full-screen', 'true');
    await page.waitForChanges();

    expect($('.messenger__header-title rasa-text').getAttribute('value')).toBe('After');
    expect($('.messenger__header-action[aria-label="Enter full screen"]')).not.toBeNull();
  });
});
