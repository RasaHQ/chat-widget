import { newSpecPage } from '@stencil/core/testing';
import { RasaImageMessage } from './image-message';

describe('rasa-image-message', () => {
  it('renders correctly when required props', async () => {
    const page = await newSpecPage({
      components: [RasaImageMessage],
      html: `<rasa-image-message image-src="example.jpg" text="Hello"></rasa-image-message>`,
    });

    expect(page.root).toEqualHtml(`
      <rasa-image-message image-src="example.jpg" text="Hello">
        <mock:shadow-root>
          <rasa-image alt="" class="image-message__image" src="example.jpg"></rasa-image>
          <rasa-text class="image-message__text" value="Hello"></rasa-text>
        </mock:shadow-root>
      </rasa-image-message>
    `);
  });

  it('renders correctly with no text', async () => {
    const page = await newSpecPage({
      components: [RasaImageMessage],
      html: `<rasa-image-message image-src="example.jpg" text=""></rasa-image-message>`,
    });

    expect(page.root).toEqualHtml(`
      <rasa-image-message image-src="example.jpg" text="">
        <mock:shadow-root>
          <rasa-image alt="" class="image-message__image image-message__image--no-text" src="example.jpg"></rasa-image>
        </mock:shadow-root>
      </rasa-image-message>
    `);
  });

  it('handles missing image source gracefully', async () => {
    const page = await newSpecPage({
      components: [RasaImageMessage],
      html: `<rasa-image-message text="Hello"></rasa-image-message>`,
    });

    expect(page.root).toEqualHtml(`
      <rasa-image-message text="Hello">
        <mock:shadow-root>
          <rasa-image alt="" class="image-message__image"></rasa-image>
          <rasa-text class="image-message__text" value="Hello"></rasa-text>
        </mock:shadow-root>
      </rasa-image-message>
    `);
  });
});
