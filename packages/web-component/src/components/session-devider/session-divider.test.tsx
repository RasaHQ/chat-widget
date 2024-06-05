import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { SessionDivider } from './session-divider';

describe('rasa-session-divider', () => {
  it('renders with the correct date', async () => {
    const sessionStartDate = new Date('Tue Apr 25 2023 15:45:30 GMT+0200 (Central European Summer Time)');

    const page = await newSpecPage({
      components: [SessionDivider],
      template: () => <rasa-session-divider sessionStartDate={sessionStartDate}></rasa-session-divider>,
    });

    const rasaText = page.root.shadowRoot.querySelector('rasa-text');

    expect(rasaText.outerHTML).toEqual('<rasa-text class="session-divider__text" value="Session started on 25 Apr 2023, 3:45:30 PM"></rasa-text>');

    expect(page.root).toEqualHtml(`
    <rasa-session-divider>
      <mock:shadow-root>
        <div class="session-divider__line"></div>
        <rasa-text class="session-divider__text" value="Session started on 25 Apr 2023, 3:45:30 PM"></rasa-text>
        <div class="session-divider__line"></div>
      </mock:shadow-root>
    </rasa-session-divider>
    `);
  });
});
