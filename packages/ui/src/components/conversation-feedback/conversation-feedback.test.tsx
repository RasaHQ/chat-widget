import { newSpecPage } from '@stencil/core/testing';
import { RasaConversationFeedback } from './conversation-feedback';

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
      rating: 'positive',
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
      rating: 'negative',
      helpful: true
    });
  });
});
