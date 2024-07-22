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
          <span class="text" data-segment-index="0">Hello, world!</span>
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
        <span class="text" data-segment-index="0">This is </span><span class="text text--bold" data-segment-index="1">bold</span>
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
        <span class="text" data-segment-index="0">This is </span><span class="text text--italic" data-segment-index="1">italic</span>
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
        <span class="text" data-segment-index="0">This is </span><span class="text text--italic" data-segment-index="1">italic</span>
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
        <span class="text" data-segment-index="0">Visit </span><a href="https://google.com" target="_blank"><span class="text" data-segment-index="1">Google</span></a>
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
        <span class="text" data-segment-index="0">This is </span><span class="text text--bold" data-segment-index="1">bold</span><span class="text" data-segment-index="2">, </span><span class="text text--italic" data-segment-index="3">italic</span>
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
        <span class="text" data-segment-index="0">This is </span><span class="text text--bold" data-segment-index="1">bold</span><span class="text" data-segment-index="2">, an </span><span class="text text--italic" data-segment-index="3">italic</span><span class="text" data-segment-index="4"> link </span><a href="https://google.com" target="_blank"><span class="text" data-segment-index="5">Google</span></a>
        </mock:shadow-root>
      </rasa-text>
    `);
  });

  it('should emit linkClicked event when a link is clicked', async () => {
    const page = await newSpecPage({
      components: [RasaText],
      html: `<rasa-text value="This is **bold**, an _italic_ link [Google](https://google.com)"></rasa-text>`,
    });

    const linkClickedSpy = jest.fn();
    page.root.addEventListener('linkClicked', linkClickedSpy);

    await page.waitForChanges();

    const linkElement = page.root.shadowRoot.querySelector('a');
    linkElement.click();

    expect(linkClickedSpy).toHaveBeenCalled();
  });
});
