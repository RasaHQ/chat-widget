import { Component, Prop, Event, EventEmitter, h, State } from '@stencil/core';

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
   * Event emitted when feedback is submitted
   */
  @Event() feedbackSubmitted: EventEmitter<{ rating: 'positive' | 'negative'; helpful: boolean }>;

  /**
   * State to track the selected rating
   */
  @State() selectedRating: 'positive' | 'negative' | null = null;

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

  private handleRatingClick(rating: 'positive' | 'negative') {
    this.selectedRating = rating;
    
    // Show thank you message immediately (no delay)
    this.showThankYou = true;
    
    // Hide thank you message after 3 seconds and set fading out
    setTimeout(() => {
      this.showThankYou = false;
      this.isFadingOut = true;
    }, 3000);
    
    // Emit feedback immediately - main widget will handle timing
    this.feedbackSubmitted.emit({
      rating: rating,
      helpful: true // Default to helpful when just rating
    });
  }


  render() {
    if (!this.show || this.isFadingOut || !this.questionText.trim()) {
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
                    'rasa-conversation-feedback__thumb--selected': this.selectedRating === 'positive'
                  }}
                  onClick={() => this.handleRatingClick('positive')}
                  disabled={this.selectedRating !== null}
                  aria-label="Thumbs up - positive rating"
                >
                  👍
                </button>
                
                <button
                  class={{
                    'rasa-conversation-feedback__thumb': true,
                    'rasa-conversation-feedback__thumb--negative': true,
                    'rasa-conversation-feedback__thumb--selected': this.selectedRating === 'negative'
                  }}
                  onClick={() => this.handleRatingClick('negative')}
                  disabled={this.selectedRating !== null}
                  aria-label="Thumbs down - negative rating"
                >
                  👎
                </button>
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
