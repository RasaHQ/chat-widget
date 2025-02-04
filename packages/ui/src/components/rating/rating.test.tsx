import { newSpecPage } from '@stencil/core/testing';
import { RasaRating } from './rating';

describe('rasa-rating', () => {
  it('renders correctly with given properties', async () => {
    const page = await newSpecPage({
      components: [RasaRating],
      html: `<rasa-rating text="How would you rate this answer?" options='[
        { "value": "positive", "icon": "😊", "label": "Positive" },
        { "value": "neutral", "icon": "😐", "label": "Neutral" },
        { "value": "negative", "icon": "☹️", "label": "Negative" }
      ]'></rasa-rating>`,
    });

    expect(page.root.shadowRoot).toEqualHtml(`
      <div class="rasa-rating">
        <p class="rasa-rating__text">How would you rate this answer?</p>
        <div class="rasa-rating__options">
          <button class="rasa-rating__option">
            <span class="rasa-rating__icon">😊</span>
            <span class="rasa-rating__label">Positive</span>
          </button>
          <button class="rasa-rating__option">
            <span class="rasa-rating__icon">😐</span>
            <span class="rasa-rating__label">Neutral</span>
          </button>
          <button class="rasa-rating__option">
            <span class="rasa-rating__icon">☹️</span>
            <span class="rasa-rating__label">Negative</span>
          </button>
        </div>
      </div>
    `);
  });

  it('emits ratingSelected event on option click', async () => {
    const page = await newSpecPage({
      components: [RasaRating],
      html: `<rasa-rating text="Rate the answer" options='[
        { "value": "positive", "icon": "😊", "label": "Positive" }
      ]'></rasa-rating>`,
    });

    const option = page.root.shadowRoot.querySelector('.rasa-rating__option');
    const ratingSelectedSpy = jest.fn();
    page.win.addEventListener('ratingSelected', ratingSelectedSpy);

    option.dispatchEvent(new Event('click')); // Simulate a click event
    await page.waitForChanges();

    expect(ratingSelectedSpy).toHaveBeenCalled();
    expect(ratingSelectedSpy.mock.calls[0][0].detail).toEqual({ value: 'positive' });
  });

  it('renders fallback when no options are provided', async () => {
    const page = await newSpecPage({
      components: [RasaRating],
      html: `<rasa-rating text="Rate the answer"></rasa-rating>`,
    });

    expect(page.root.shadowRoot.querySelector('.rasa-rating__option')).toBeNull();
    expect(page.root.shadowRoot.textContent).toContain('Rate the answer');
  });

  it('applies the selected class on click', async () => {
    const page = await newSpecPage({
      components: [RasaRating],
      html: `<rasa-rating text="Rate the answer" options='[
        { "value": "positive", "icon": "😊", "label": "Positive" },
        { "value": "neutral", "icon": "😐", "label": "Neutral" }
      ]'></rasa-rating>`,
    });

    const options = page.root.shadowRoot.querySelectorAll('.rasa-rating__option');
    const positiveOption = options[0];
    const neutralOption = options[1];

    // Click the positive option
    positiveOption.dispatchEvent(new Event('click'));
    await page.waitForChanges();

    expect(positiveOption.classList.contains('rasa-rating__option--selected')).toBe(true);
    expect(neutralOption.classList.contains('rasa-rating__option--selected')).toBe(false);
  });
});
