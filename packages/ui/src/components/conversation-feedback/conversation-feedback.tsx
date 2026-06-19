import { Component, Prop, Event, EventEmitter, h, State } from '@stencil/core';
import { feedbackIcons } from './icons';

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
   * State to track if thank you message is showing
   */
  @State() showThankYou: boolean = false;

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

    // No JS timer for the fade-out: the thank-you element's CSS animation
    // is a chained `fadeIn` + delayed `fadeOut` with `forwards` fill, so
    // the popup self-dismisses visually without any setTimeout here. The
    // parent's slide-down + unmount run on the same CSS timeline.
  }


  render() {
    // Note: do NOT short-circuit while the popup is fading out. The popup
    // stays mounted with its `forwards`-filled CSS fade-out animation - the
    // parent unmounts it via a single setTimeout once the chat slide is done.
    if (!this.show || !this.questionText.trim()) {
      return null;
    }

    return (
      <div class="rasa-conversation-feedback">
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
