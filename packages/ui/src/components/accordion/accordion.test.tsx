import { newSpecPage } from '@stencil/core/testing';
import { RasaAccordion } from './accordion';

describe('RasaAccordion', () => {
  it('renders the component', async () => {
    const page = await newSpecPage({
      components: [RasaAccordion],
      html: `<rasa-accordion label="Test Accordion"><p>Accordion Content</p></rasa-accordion>`,
    });

    // The mock is here because of a known issue: https://github.com/ionic-team/stencil/issues/3218
    const expectedHtml = `
      <rasa-accordion label="Test Accordion">
        <mock:shadow-root>
          <div class="accordion">
            <div class="accordion__header">
              <div class="accordion__header__title">
                <rasa-text disableparsing="" value="Test Accordion"></rasa-text>
              </div>
              <rasa-icon-chevron-down class="accordion__header__icon"></rasa-icon-chevron-down>
            </div>
            <div class="accordion__description-wrapper">
              <div class="accordion__description">
                <slot></slot>
              </div>
            </div>
          </div>
        </mock:shadow-root>
        <p>
          Accordion Content
        </p>
      </rasa-accordion>
    `;

    expect(page.root).toEqualHtml(expectedHtml);
  });

  it('toggles open state on click', async () => {
    const page = await newSpecPage({
      components: [RasaAccordion],
      html: `<rasa-accordion label="Test Accordion"><p>Accordion Content</p></rasa-accordion>`,
    });
    const accordion = page.rootInstance;
    expect(accordion.open).toBeFalsy();

    const accordionElement = page.root.shadowRoot.querySelector('.accordion__header') as HTMLElement;
    accordionElement.click();
    await page.waitForChanges();
    expect(accordion.open).toBeTruthy();
  });
});
