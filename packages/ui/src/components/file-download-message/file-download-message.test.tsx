import { newSpecPage } from '@stencil/core/testing';
import { RasaFileDownloadMessage } from './file-download-message';

describe('rasa-file-download-message', () => {
  it('renders correctly with required props', async () => {
    const page = await newSpecPage({
      components: [RasaFileDownloadMessage],
      html: `<rasa-file-download-message file-url="http://example.com/file.pdf" file-name="example.pdf"></rasa-file-download-message>`,
    });

    expect(page.root).toEqualHtml(`
      <rasa-file-download-message file-url="http://example.com/file.pdf" file-name="example.pdf">
        <mock:shadow-root>
          <a href="http://example.com/file.pdf" download="example.pdf" class="file-download" target="_blank">
            <rasa-icon-paperclip class="file-download__icon" size="24"></rasa-icon-paperclip>
            <rasa-text value="example.pdf" class="file-download__name"></rasa-text>
          </a>
        </mock:shadow-root>
      </rasa-file-download-message>
    `);
  });

  it('renders with optional text', async () => {
    const page = await newSpecPage({
      components: [RasaFileDownloadMessage],
      html: `<rasa-file-download-message file-url="http://example.com/file.pdf" file-name="example.pdf" text="Click to download the file"></rasa-file-download-message>`,
    });

    expect(page.root).toEqualHtml(`
      <rasa-file-download-message file-url="http://example.com/file.pdf" file-name="example.pdf" text="Click to download the file">
        <mock:shadow-root>
          <a href="http://example.com/file.pdf" download="example.pdf" class="file-download" target="_blank">
            <rasa-icon-paperclip class="file-download__icon" size="24"></rasa-icon-paperclip>
            <rasa-text value="example.pdf" class="file-download__name"></rasa-text>
          </a>
          <rasa-text value="Click to download the file" class="image-message__text"></rasa-text>
        </mock:shadow-root>
      </rasa-file-download-message>
    `);
  });

  it('applies correct class based on sender prop', async () => {
    const page = await newSpecPage({
      components: [RasaFileDownloadMessage],
      html: `<rasa-file-download-message file-url="http://example.com/file.pdf" file-name="example.pdf"></rasa-file-download-message>`,
    });

    const anchorElement = page.root.shadowRoot.querySelector('a');
    expect(anchorElement).toBeTruthy();
    expect(anchorElement.getAttribute('class')).toContain('file-download');
  });

  it('has a valid download link', async () => {
    const page = await newSpecPage({
      components: [RasaFileDownloadMessage],
      html: `<rasa-file-download-message file-url="http://example.com/file.pdf" file-name="example.pdf"></rasa-file-download-message>`,
    });

    const anchorElement = page.root.shadowRoot.querySelector('a');
    expect(anchorElement).toBeTruthy();
    expect(anchorElement.getAttribute('href')).toBe('http://example.com/file.pdf');
    expect(anchorElement.getAttribute('download')).toBe('example.pdf');
  });

  it('should emit fileDownloadStarted event on click', async () => {
    const page = await newSpecPage({
      components: [RasaFileDownloadMessage],
      html: `<rasa-file-download-message file-url="https://example.com/file.pdf" file-name="file.pdf"></rasa-file-download-message>`,
    });

    const component = page.rootInstance;
    const spy = jest.spyOn(component.fileDownloadStarted, 'emit');

    const anchor = page.root.shadowRoot.querySelector('a');
    anchor.click();

    expect(spy).toHaveBeenCalled();
  });
});
