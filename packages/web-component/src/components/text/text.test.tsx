import { newSpecPage } from '@stencil/core/testing';
import { RasaText } from './text';

describe('rasa-text', () => {
  it('renders plain text', async () => {
    const page = await newSpecPage({
      components: [RasaText],
      html: `<rasa-text value="Hello, world!"></rasa-text>`,
    });
    expect(page.root).toEqualHtml(`
      <rasa-text value="Hello, world!">
        <mock:shadow-root>
          <span class="text">Hello, world!</span>
        </mock:shadow-root>
      </rasa-text>
    `);
  });

  it('renders bold ** text', async () => {
    const page = await newSpecPage({
      components: [RasaText],
      html: `<rasa-text value="This is **bold**"></rasa-text>`,
    });
    expect(page.root).toEqualHtml(`
      <rasa-text value="This is **bold**">
        <mock:shadow-root>
        <span class="text">This is </span><span class="text text--bold">bold</span>
        </mock:shadow-root>
      </rasa-text>
    `);
  });

  it('renders italic * text', async () => {
    const page = await newSpecPage({
      components: [RasaText],
      html: `<rasa-text value="This is *italic*"></rasa-text>`,
    });
    expect(page.root).toEqualHtml(`
      <rasa-text value="This is *italic*">
        <mock:shadow-root>
        <span class="text">This is </span><span class="text text--italic">italic</span>
        </mock:shadow-root>
      </rasa-text>
    `);
  });

  it('renders italic _ text', async () => {
    const page = await newSpecPage({
      components: [RasaText],
      html: `<rasa-text value="This is _italic_"></rasa-text>`,
    });
    expect(page.root).toEqualHtml(`
      <rasa-text value="This is _italic_">
        <mock:shadow-root>
        <span class="text">This is </span><span class="text text--italic">italic</span>
        </mock:shadow-root>
      </rasa-text>
    `);
  });

  it('renders link text', async () => {
    const page = await newSpecPage({
      components: [RasaText],
      html: `<rasa-text value="Visit [Google](https://google.com)"></rasa-text>`,
    });
    expect(page.root).toEqualHtml(`
      <rasa-text value="Visit [Google](https://google.com)">
        <mock:shadow-root>
        <span class="text">Visit </span><a href="https://google.com" target="_blank"><span class="text">Google</span></a>
        </mock:shadow-root>
      </rasa-text>
    `);
  });

  it('renders mixed formatting', async () => {
    const page = await newSpecPage({
      components: [RasaText],
      html: `<rasa-text value="This is **bold**, _italic_"></rasa-text>`,
    });
    expect(page.root).toEqualHtml(`
      <rasa-text value="This is **bold**, _italic_">
        <mock:shadow-root>
        <span class="text">This is </span><span class="text text--bold">bold</span><span class="text">, </span><span class="text text--italic">italic</span>
        </mock:shadow-root>
      </rasa-text>
    `);
  });

  it('renders complex mixed formatting', async () => {
    const page = await newSpecPage({
      components: [RasaText],
      html: `<rasa-text value="This is **bold**, an _italic_ link [Google](https://google.com)"></rasa-text>`,
    });
    expect(page.root).toEqualHtml(`
      <rasa-text value="This is **bold**, an _italic_ link [Google](https://google.com)">
        <mock:shadow-root>
        <span class="text">This is </span><span class="text text--bold">bold</span><span class="text">, an </span><span class="text text--italic">italic</span><span class="text"> link </span><a href="https://google.com" target="_blank"><span class="text">Google</span></a>
        </mock:shadow-root>
      </rasa-text>
    `);
  });
});
