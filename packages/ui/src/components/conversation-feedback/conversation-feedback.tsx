import { Component, Prop, Event, EventEmitter, h, State } from '@stencil/core';
import { feedbackIcons } from './icons';
import { THANK_YOU_HOLD_MS } from './conversation-feedback.timings';

@Component({
  tag: 'rasa-conversation-feedback',
  styleUrl: 'conversation-feedback.scss',
  shadow: true,
})
export class RasaConversationFeedback {
  /**
   * Whether the feedback component should be shown
   */
  @Prop() show: boolean = false;

  /**
   * Whether the feedback has been submitted
   */
  @Prop() submitted: boolean = false;

  /**
   * Text for the feedback question. If empty, component will not be shown.
   */
  @Prop() questionText: string = '';

  /**
   * Text for the thank you message. If empty, no thank you message will be shown.
   */
  @Prop() thankYouText: string = '';

  /**
   * Event emitted when feedback is submitted. The `rating` value matches the
   * Rasa CALM `csat_score` slot vocabulary so it can be passed through unchanged.
   */
  @Event() feedbackSubmitted: EventEmitter<{ rating: 'satisfied' | 'unsatisfied'; helpful: boolean }>;

  /**
   * State to track the selected rating
   */
  @State() selectedRating: 'satisfied' | 'unsatisfied' | null = null;

  /**
   * State to track if the conversation was helpful
   */
  @State() isHelpful: boolean | null = null;

  /**
   * State to track if component is fading out
   */
  @State() isFadingOut: boolean = false;

  /**
   * State to track if thank you message is showing
   */
  @State() showThankYou: boolean = false;

  /**
   * Tracks the pending fade-out timer so we can cancel it if the host
   * unmounts the popup before the hold elapses (e.g. the user sends a new
   * message and the parent flips `showFeedback = false`). Without this the
   * timer would later fire against a disposed component and set state on a
   * detached instance.
   */
  private fadeOutTimer: ReturnType<typeof setTimeout> | null = null;

  disconnectedCallback() {
    if (this.fadeOutTimer !== null) {
      clearTimeout(this.fadeOutTimer);
      this.fadeOutTimer = null;
    }
  }

  private handleRatingClick(rating: 'satisfied' | 'unsatisfied') {
    // Guard against double-clicks: a second click on the other thumb (or the
    // same one) after a selection is already locked in must be a no-op.
    if (this.selectedRating !== null) return;

    this.selectedRating = rating;
    this.showThankYou = true;

    // Emit synchronously so the parent persists the answered state before any
    // visual delay - protects against a refresh that races the fade-out.
    this.feedbackSubmitted.emit({
      rating,
      helpful: true,
    });

    // Hold the thank-you, then trigger the CSS fade-out. We deliberately keep
    // `showThankYou` true here so the thank-you content stays mounted (and
    // visible) while it fades; previously we flipped it to false alongside
    // `isFadingOut`, which collapsed the content before the animation ran.
    this.fadeOutTimer = setTimeout(() => {
      this.fadeOutTimer = null;
      this.isFadingOut = true;
    }, THANK_YOU_HOLD_MS);
  }


  render() {
    // Note: do NOT short-circuit on `isFadingOut`. Returning null here would
    // remove the element from the DOM before the CSS fade-out has a chance to
    // play, producing the abrupt disappearance the PR feedback called out.
    if (!this.show || !this.questionText.trim()) {
      return null;
    }

    return (
      <div class={{
        'rasa-conversation-feedback': true,
        'rasa-conversation-feedback--fading-out': this.isFadingOut
      }}>
        <div class="rasa-conversation-feedback__content">
          {!this.showThankYou ? (
            <div>
              <h3 class="rasa-conversation-feedback__title">{this.questionText}</h3>
              
              <div class="rasa-conversation-feedback__rating">
                <button
                  class={{
                    'rasa-conversation-feedback__thumb': true,
                    'rasa-conversation-feedback__thumb--positive': true,
                    'rasa-conversation-feedback__thumb--selected': this.selectedRating === 'satisfied'
                  }}
                  onClick={() => this.handleRatingClick('satisfied')}
                  disabled={this.selectedRating !== null}
                  aria-label="Thumbs up - positive rating"
                  innerHTML={feedbackIcons.positive}
                ></button>
                
                <button
                  class={{
                    'rasa-conversation-feedback__thumb': true,
                    'rasa-conversation-feedback__thumb--negative': true,
                    'rasa-conversation-feedback__thumb--selected': this.selectedRating === 'unsatisfied'
                  }}
                  onClick={() => this.handleRatingClick('unsatisfied')}
                  disabled={this.selectedRating !== null}
                  aria-label="Thumbs down - negative rating"
                  innerHTML={feedbackIcons.negative}
                ></button>
              </div>
            </div>
          ) : (
            this.thankYouText.trim() ? (
              <div class="rasa-conversation-feedback__thank-you">
                <div class="rasa-conversation-feedback__thank-you-content">
                  <span class="rasa-conversation-feedback__thank-you-text">{this.thankYouText}</span>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    );
  }
}
