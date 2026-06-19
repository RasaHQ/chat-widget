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
    // These tests deliberately avoid jest.useFakeTimers() because Stencil's
    // newSpecPage relies on real timers for its initial render. The fade
    // trigger is exercised by flipping the component's `isFadingOut` state
    // directly - which is exactly what the production setTimeout would do
    // after THANK_YOU_HOLD_MS elapses.

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

    it('keeps the thank-you mounted with the fade-out class so CSS can animate it', async () => {
      const page = await newSpecPage({
        components: [RasaConversationFeedback],
        html: `<rasa-conversation-feedback show="true" question-text="Rate me?" thank-you-text="Thanks!"></rasa-conversation-feedback>`,
      });

      (page.root.shadowRoot.querySelector('.rasa-conversation-feedback__thumb--positive') as HTMLElement).click();
      await page.waitForChanges();

      // Mid-hold: thank-you visible, no fade-out class.
      expect(page.root.shadowRoot.querySelector('.rasa-conversation-feedback__thank-you')).toBeTruthy();
      expect(page.root.shadowRoot.querySelector('.rasa-conversation-feedback--fading-out')).toBeFalsy();

      // Simulate the THANK_YOU_HOLD_MS timer elapsing. The host must STILL
      // render (so the CSS fade-out animation can play out) with the
      // --fading-out class applied. Returning null here was the original bug
      // that caused the abrupt disappearance the PR feedback flagged.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (page.rootInstance as any).isFadingOut = true;
      await page.waitForChanges();

      expect(page.root.shadowRoot.querySelector('.rasa-conversation-feedback')).toBeTruthy();
      expect(page.root.shadowRoot.querySelector('.rasa-conversation-feedback--fading-out')).toBeTruthy();
      expect(page.root.shadowRoot.querySelector('.rasa-conversation-feedback__thank-you')).toBeTruthy();
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
      const instance = page.rootInstance as RasaConversationFeedback;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (instance as any).handleRatingClick('satisfied');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (instance as any).handleRatingClick('unsatisfied');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].detail.rating).toBe('satisfied');
    });
  });
});
