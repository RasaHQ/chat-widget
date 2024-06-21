import { newSpecPage } from '@stencil/core/testing';
import { RasaImage } from './image';

describe('rasa-image', () => {
  it('renders correctly with given properties', async () => {
    const page = await newSpecPage({
      components: [RasaImage],
      html: `<rasa-image src="https://example.com/image.png" alt="An example image" width="100" height="100"></rasa-image>`,
    });

    expect(page.root.shadowRoot).toEqualHtml(`
    <img alt="An example image" src="https://example.com/image.png" style="width: 100px; height: 100px;">
    `);
  });

  it('shows fallback icon on image error', async () => {
    const page = await newSpecPage({
      components: [RasaImage],
      html: `<rasa-image src="https://example.com/invalid-image.png"></rasa-image>`,
    });

    const img = page.root.shadowRoot.querySelector('img');
    img.dispatchEvent(new Event('error'));
    await page.waitForChanges();

    expect(page.root.shadowRoot).toEqualHtml(`
    <rasa-icon-default-image-fallback style="width: auto; height: auto;"></rasa-icon-default-image-fallback>
    `);
  });

  it('applies width and height correctly', async () => {
    const page = await newSpecPage({
      components: [RasaImage],
      html: `<rasa-image src="https://example.com/image.png" width="200" height="150"></rasa-image>`,
    });

    const img = page.root.shadowRoot.querySelector('img');
    expect(img.style.width).toBe('200px');
    expect(img.style.height).toBe('150px');
  });

  it('respects default values for width and height', async () => {
    const page = await newSpecPage({
      components: [RasaImage],
      html: `<rasa-image src="https://example.com/image.png"></rasa-image>`,
    });

    const img = page.root.shadowRoot.querySelector('img');
    expect(img.style.width).toBe('auto');
    expect(img.style.height).toBe('auto');
  });
});
