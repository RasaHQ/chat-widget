import { newSpecPage } from '@stencil/core/testing';
import { RasaTextMessage } from './text-message';
import { RasaText } from '../text/text';
import { streamStore } from '../../store/stream-store';

describe('rasa-text-message', () => {
  it('renders correctly with required props', async () => {
    const page = await newSpecPage({
      components: [RasaTextMessage, RasaText],
      html: `<rasa-text-message value="Hello, World!" sender="user"></rasa-text-message>`,
    });

    expect(page.root).toEqualHtml(`
    <rasa-text-message class="text-message--user" sender="user" value="Hello, World!">
    <mock:shadow-root>
      <rasa-text>
        <mock:shadow-root>
          <span class="text" part="text">
            Hello, World!
          </span>
        </mock:shadow-root>
      </rasa-text>
    </mock:shadow-root>
  </rasa-text-message>
    `);
  });

  it('renders correctly with sender bot', async () => {
    const pageBot = await newSpecPage({
      components: [RasaTextMessage, RasaText],
      html: `<rasa-text-message value="Bot message" sender="bot"></rasa-text-message>`,
    });

    expect(pageBot.root).toEqualHtml(`
    <rasa-text-message class="text-message--bot" sender="bot" value="Bot message">
      <mock:shadow-root>
        <rasa-text>
          <mock:shadow-root>
            <span class="text" data-segment-index="0">
              Bot message
            </span>
          </mock:shadow-root>
        </rasa-text>
      </mock:shadow-root>
    </rasa-text-message>
    `);
  });

  it('renders correctly with sender user', async () => {
    const pageUser = await newSpecPage({
      components: [RasaTextMessage, RasaText],
      html: `<rasa-text-message value="User message" sender="user"></rasa-text-message>`,
    });

    expect(pageUser.root).toEqualHtml(`
    <rasa-text-message class="text-message--user" sender="user" value="User message">
      <mock:shadow-root>
        <rasa-text>
          <mock:shadow-root>
            <span class="text" part="text">
              User message
            </span>
          </mock:shadow-root>
        </rasa-text>
      </mock:shadow-root>
    </rasa-text-message>
    `);
  });

  describe('with a stream id', () => {
    it('renders the streamed text and updates it while the stream is in progress', async () => {
      streamStore.setText('stream-1', 'Hello');
      const page = await newSpecPage({
        components: [RasaTextMessage, RasaText],
        html: `<rasa-text-message value="Hello" sender="bot" stream-id="stream-1"></rasa-text-message>`,
      });
      const text = () => page.root.shadowRoot.querySelector('rasa-text');
      expect(text().shadowRoot).toEqualHtml(`<span class="text" data-segment-index="0">Hello</span>`);

      streamStore.setText('stream-1', 'Hello, **World**');
      await page.waitForChanges();

      expect(text().shadowRoot).toEqualHtml(`
        <span class="text" data-segment-index="0">Hello, </span><span class="text text--bold" data-segment-index="1">World</span>
      `);
    });

    it('renders the value when the stream text is not available', async () => {
      const page = await newSpecPage({
        components: [RasaTextMessage, RasaText],
        html: `<rasa-text-message value="Stored text" sender="bot" stream-id="unknown-stream"></rasa-text-message>`,
      });
      expect(page.root.shadowRoot.querySelector('rasa-text').shadowRoot).toEqualHtml(`
        <span class="text" data-segment-index="0">Stored text</span>
      `);
    });

    it('lets the next message render right away, also when stream messages are enabled', async () => {
      // Fresh module instances, so components from previous tests don't react to the config change
      jest.resetModules();
      const { newSpecPage } = require('@stencil/core/testing');
      const { setConfigStore } = require('../../store/config-store');
      const { messageQueueService } = require('../../store/message-queue');
      const { RasaTextMessage } = require('./text-message');
      const { RasaText } = require('../text/text');
      setConfigStore({ streamMessages: true });
      const completeRendering = jest.spyOn(messageQueueService, 'completeRendering');

      await newSpecPage({
        components: [RasaTextMessage, RasaText],
        html: `<rasa-text-message value="Hello" sender="bot" stream-id="stream-2"></rasa-text-message>`,
      });

      expect(completeRendering).toHaveBeenCalledTimes(1);
    });
  });
});
