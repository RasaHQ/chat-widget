import { newSpecPage } from '@stencil/core/testing';
import { RasaConversationFeedback } from './conversation-feedback';
import { CONVERSATION_FEEDBACK_TIMINGS } from './conversation-feedback.timings';

describe('rasa-conversation-feedback', () => {
  it('renders feedback component when show is true and questionText is provided', async () => {
    const page = await newSpecPage({
      components: [RasaConversationFeedback],
      html: `<rasa-conversation-feedback show="true" question-text="How do you rate this conversation?"></rasa-conversation-feedback>`,
    });

    expect(page.root.shadowRoot.querySelector('.rasa-conversation-feedback')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('.rasa-conversation-feedback__title')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('.rasa-conversation-feedback__rating')).toBeTruthy();
  });

  it('does not render when show is false', async () => {
    const page = await newSpecPage({
      components: [RasaConversationFeedback],
      html: `<rasa-conversation-feedback show="false" question-text="How do you rate this conversation?"></rasa-conversation-feedback>`,
    });

    expect(page.root.shadowRoot.querySelector('.rasa-conversation-feedback')).toBeFalsy();
  });

  it('does not render when questionText is empty', async () => {
    const page = await newSpecPage({
      components: [RasaConversationFeedback],
      html: `<rasa-conversation-feedback show="true" question-text=""></rasa-conversation-feedback>`,
    });

    expect(page.root.shadowRoot.querySelector('.rasa-conversation-feedback')).toBeFalsy();
  });

  it('shows thank you message after rating selection', async () => {
    const page = await newSpecPage({
      components: [RasaConversationFeedback],
      html: `<rasa-conversation-feedback show="true" question-text="How do you rate this conversation?" thank-you-text="Thank you for your feedback!"></rasa-conversation-feedback>`,
    });

    const positiveButton = page.root.shadowRoot.querySelector('.rasa-conversation-feedback__thumb--positive') as HTMLElement;
    positiveButton.click();
    await page.waitForChanges();

    expect(page.root.shadowRoot.querySelector('.rasa-conversation-feedback__thank-you')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('.rasa-conversation-feedback__rating')).toBeFalsy();
  });

  it('handles rating selection and emits event', async () => {
    const page = await newSpecPage({
      components: [RasaConversationFeedback],
      html: `<rasa-conversation-feedback show="true" question-text="How do you rate this conversation?"></rasa-conversation-feedback>`,
    });

    const feedbackSubmittedSpy = jest.fn();
    page.win.addEventListener('feedbackSubmitted', feedbackSubmittedSpy);

    const positiveButton = page.root.shadowRoot.querySelector('.rasa-conversation-feedback__thumb--positive') as HTMLElement;
    positiveButton.click();
    await page.waitForChanges();

    expect(feedbackSubmittedSpy).toHaveBeenCalled();
    expect(feedbackSubmittedSpy.mock.calls[0][0].detail).toEqual({
      rating: 'satisfied',
      helpful: true
    });
  });

  it('handles negative rating selection', async () => {
    const page = await newSpecPage({
      components: [RasaConversationFeedback],
      html: `<rasa-conversation-feedback show="true" question-text="How do you rate this conversation?"></rasa-conversation-feedback>`,
    });

    const feedbackSubmittedSpy = jest.fn();
    page.win.addEventListener('feedbackSubmitted', feedbackSubmittedSpy);

    const negativeButton = page.root.shadowRoot.querySelector('.rasa-conversation-feedback__thumb--negative') as HTMLElement;
    negativeButton.click();
    await page.waitForChanges();

    expect(feedbackSubmittedSpy).toHaveBeenCalled();
    expect(feedbackSubmittedSpy.mock.calls[0][0].detail).toEqual({
      rating: 'unsatisfied',
      helpful: true
    });
  });

  describe('graceful fade-out', () => {
    // The fade-out is now driven entirely by CSS (a chained `fadeIn` +
    // delayed `fadeOut` animation with `forwards` fill mode on the
    // thank-you element). The component itself no longer schedules any
    // setTimeout for the dismiss - these tests verify the bits that remain
    // the component's responsibility: synchronous event emit, the
    // thank-you element being mounted so CSS can animate it, and the
    // click-once guard.

    it('emits the rating event synchronously on click (no visual delay)', async () => {
      const page = await newSpecPage({
        components: [RasaConversationFeedback],
        html: `<rasa-conversation-feedback show="true" question-text="Rate me?" thank-you-text="Thanks!"></rasa-conversation-feedback>`,
      });

      const spy = jest.fn();
      page.win.addEventListener('feedbackSubmitted', spy);

      (page.root.shadowRoot.querySelector('.rasa-conversation-feedback__thumb--positive') as HTMLElement).click();

      // No waitForChanges, no timers: the event must already have fired.
      // Parent's setCsatAnswered relies on this synchronous emit so a refresh
      // immediately after click cannot race the answered hash being persisted.
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('mounts the thank-you element so the CSS fade-out animation can play', async () => {
      const page = await newSpecPage({
        components: [RasaConversationFeedback],
        html: `<rasa-conversation-feedback show="true" question-text="Rate me?" thank-you-text="Thanks!"></rasa-conversation-feedback>`,
      });

      (page.root.shadowRoot.querySelector('.rasa-conversation-feedback__thumb--positive') as HTMLElement).click();
      await page.waitForChanges();

      // After the click the thank-you element is present and the rating
      // buttons have been swapped out. The fade-out itself is a CSS-only
      // animation on the thank-you element (see conversation-feedback.scss),
      // so we only need to verify the element is in the DOM here - the
      // animation runs without any state change from the component.
      expect(page.root.shadowRoot.querySelector('.rasa-conversation-feedback')).toBeTruthy();
      expect(page.root.shadowRoot.querySelector('.rasa-conversation-feedback__thank-you')).toBeTruthy();
      expect(page.root.shadowRoot.querySelector('.rasa-conversation-feedback__rating')).toBeFalsy();
    });

    it('exposes a coherent set of dismiss timings', () => {
      // Guards the contract the parent widget relies on for its unmount delay.
      expect(CONVERSATION_FEEDBACK_TIMINGS.TOTAL_DISMISS_MS).toBe(
        CONVERSATION_FEEDBACK_TIMINGS.THANK_YOU_HOLD_MS + CONVERSATION_FEEDBACK_TIMINGS.FADE_OUT_MS,
      );
      // Snappy dismissal is the whole point of this fix - keep it under 2.5s.
      expect(CONVERSATION_FEEDBACK_TIMINGS.TOTAL_DISMISS_MS).toBeLessThanOrEqual(2500);
    });

    it('ignores a second click after a rating has been selected', async () => {
      const page = await newSpecPage({
        components: [RasaConversationFeedback],
        html: `<rasa-conversation-feedback show="true" question-text="Rate me?"></rasa-conversation-feedback>`,
      });

      const spy = jest.fn();
      page.win.addEventListener('feedbackSubmitted', spy);

      // Call the handler directly twice to bypass the disabled attribute the
      // buttons get after the first click. The handler itself must guard
      // against re-entry so a stray programmatic call cannot emit twice.
      const instance = page.rootInstance as unknown as {
        handleRatingClick: (rating: 'satisfied' | 'unsatisfied') => void;
      };
      instance.handleRatingClick('satisfied');
      instance.handleRatingClick('unsatisfied');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].detail.rating).toBe('satisfied');
    });
  });
});
