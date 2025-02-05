import { newSpecPage } from '@stencil/core/testing';
import { RasaRating } from './rating';

describe('rasa-rating', () => {
  it('renders correctly with given properties', async () => {
    const page = await newSpecPage({
      components: [RasaRating],
      html: `<rasa-rating text="How would you rate this answer?" options='[
        { "value": "positive", "payload": "/give_positive_feedback" },
        { "value": "neutral", "payload": "/give_neutral_feedback" },
        { "value": "negative", "payload": "/give_negative_feedback" }
      ]' message="We appreciate your feedback!"></rasa-rating>`,
    });

    expect(page.root.shadowRoot.innerHTML).toContain('How would you rate this answer?');
    expect(page.root.shadowRoot.querySelectorAll('.rasa-rating__option').length).toBe(3);
  });

  it('emits ratingSelected event with payload on option click', async () => {
    const page = await newSpecPage({
      components: [RasaRating],
      html: `<rasa-rating text="Rate the answer" options='[
        { "value": "positive", "payload": "/give_positive_feedback" }
      ]'></rasa-rating>`,
    });

    const option = page.root.shadowRoot.querySelector('.rasa-rating__option');
    const ratingSelectedSpy = jest.fn();
    page.win.addEventListener('ratingSelected', ratingSelectedSpy);

    option.dispatchEvent(new Event('click')); // Simulate a click event
    await page.waitForChanges();

    expect(ratingSelectedSpy).toHaveBeenCalled();
    expect(ratingSelectedSpy.mock.calls[0][0].detail).toEqual({ 
      value: 'positive', 
      payload: '/give_positive_feedback' 
    });
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
        { "value": "positive", "payload": "/give_positive_feedback" },
        { "value": "neutral", "payload": "/give_neutral_feedback" }
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

  it('displays message after selection', async () => {
    const page = await newSpecPage({
      components: [RasaRating],
      html: `<rasa-rating text="How would you rate this answer?" options='[
        { "value": "positive", "payload": "/give_positive_feedback" }
      ]' message="We appreciate your feedback!"></rasa-rating>`,
    });

    const option = page.root.shadowRoot.querySelector('.rasa-rating__option');
    option.dispatchEvent(new Event('click'));
    await page.waitForChanges();

    expect(page.root.shadowRoot.querySelector('.rasa-rating__options')).toBeNull(); // Ensure options disappear
    expect(page.root.shadowRoot.textContent).toContain("We appreciate your feedback!"); // Ensure message is displayed
  });

  it('displays default message if none is provided', async () => {
    const page = await newSpecPage({
      components: [RasaRating],
      html: `<rasa-rating text="Rate this answer" options='[
        { "value": "positive", "payload": "/give_positive_feedback" }
      ]'></rasa-rating>`,
    });

    const option = page.root.shadowRoot.querySelector('.rasa-rating__option');
    option.dispatchEvent(new Event('click'));
    await page.waitForChanges();

    expect(page.root.shadowRoot.textContent).toContain("Thank you for your feedback!"); // Default message should appear
  });
});
