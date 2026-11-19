import type { SpecPage } from '@stencil/core/testing';

import { WIDGET_OPENED_STORAGE_KEY } from '../utils/auto-open';

jest.mock('@rasahq/chat-widget-sdk', () => {
  const actual = jest.requireActual('@rasahq/chat-widget-sdk');

  class Rasa {
    sessionId = 'test-session';
    sendMessage = jest.fn();
    connect = jest.fn();
    disconnect = jest.fn();
    reconnection = jest.fn();
    getChatHistory = jest.fn(() => ({}));
    on = jest.fn();

    constructor(public options: Record<string, unknown>) {}
  }

  return { ...actual, Rasa };
});

describe('rasa-chatbot-widget auto open', () => {
  let page: SpecPage;
  // sessionStorage of the browser tab, shared by every page load within a test
  let tabSessionStorage: Storage | undefined;

  // Every call is a new page load in the same browser tab: the window is new, sessionStorage is kept
  const loadPage = async (attributes = '') => {
    jest.resetModules();
    const { newSpecPage } = require('@stencil/core/testing');
    const { RasaChatbotWidget } = require('./rasa-chatbot-widget');

    page = await newSpecPage({ components: [RasaChatbotWidget] });
    if (tabSessionStorage) Object.assign(page.win, { sessionStorage: tabSessionStorage });
    tabSessionStorage = page.win.sessionStorage;
    await page.setContent(`<rasa-chatbot-widget server-url="https://example.com" ${attributes}></rasa-chatbot-widget>`);
  };

  const clickLauncher = async () => {
    page.root.shadowRoot.querySelector<HTMLElement>('.rasa-chatbot-widget__launcher').click();
    await page.waitForChanges();
  };

  const isOpen = () => page.rootInstance.isOpen;

  beforeEach(() => {
    tabSessionStorage = undefined;
  });

  it('opens on the first page load with auto-open', async () => {
    await loadPage('auto-open');

    expect(isOpen()).toBe(true);
    expect(page.rootInstance.client.connect).toHaveBeenCalled();
    expect(tabSessionStorage.getItem(WIDGET_OPENED_STORAGE_KEY)).toBe('true');
  });

  it('does not auto-open again on reload', async () => {
    await loadPage('auto-open');
    await loadPage('auto-open');

    expect(isOpen()).toBe(false);
    expect(page.rootInstance.client.connect).not.toHaveBeenCalled();
  });

  it('does not auto-open again when the user comes back to a page with auto-open', async () => {
    await loadPage('auto-open');
    await loadPage();
    expect(isOpen()).toBe(false);

    await loadPage('auto-open');

    expect(isOpen()).toBe(false);
    expect(page.rootInstance.client.connect).not.toHaveBeenCalled();
  });

  it('does not auto-open again after the user closed the chat', async () => {
    await loadPage('auto-open');
    await clickLauncher();
    expect(isOpen()).toBe(false);

    await loadPage('auto-open');

    expect(isOpen()).toBe(false);
  });

  it('does not auto-open when the user already opened the chat on a page without auto-open', async () => {
    await loadPage();
    await clickLauncher();
    expect(isOpen()).toBe(true);

    await loadPage('auto-open');

    expect(isOpen()).toBe(false);
  });

  it('does not count a page load without auto-open as opened', async () => {
    await loadPage();

    expect(isOpen()).toBe(false);
    expect(tabSessionStorage.getItem(WIDGET_OPENED_STORAGE_KEY)).toBeNull();
  });

  it('still opens from the launcher after auto-open was skipped', async () => {
    await loadPage('auto-open');
    await loadPage('auto-open');
    expect(isOpen()).toBe(false);

    await clickLauncher();

    expect(isOpen()).toBe(true);
    expect(page.rootInstance.client.connect).toHaveBeenCalled();
  });
});
