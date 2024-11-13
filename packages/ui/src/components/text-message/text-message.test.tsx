import { newSpecPage } from '@stencil/core/testing';
import { RasaTextMessage } from './text-message';
import { RasaText } from '../text/text';

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
});
