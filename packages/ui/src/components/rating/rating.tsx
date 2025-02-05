import { Component, Prop, Event, EventEmitter, h, State } from '@stencil/core';
import { messageQueueService } from '../../store/message-queue';

@Component({
  tag: 'rasa-rating',
  styleUrl: 'rating.scss',
  shadow: true,
})
export class RasaRating {
  /**
   * Instructional text for the rating component
   */
  @Prop() text: string;

  /**
   * List of rating options
   */
  @Prop() options: string | { value: string }[] = [];

  /**
   * Customizable thank-you message from Rasa
   */
  @Prop() thankYouMessage: string = "Thank you for your feedback!";

  /**
   * Event emitted when a rating is selected
   */
  @Event() ratingSelected: EventEmitter<{ value: string }>;

  /**
   * State to track the currently selected option
   */
  @State() selectedOption: string | null = null;

  /**
   * State to track if the user has voted
   */
  @State() hasVoted: boolean = false;

  componentDidLoad() {
    messageQueueService.completeRendering();
  }

  private handleOptionClick(optionValue: string) {
    this.selectedOption = optionValue;
    this.hasVoted = true;
    this.ratingSelected.emit({ value: optionValue });
  }

  private getParsedOptions(): { value: string }[] {
    if (typeof this.options === 'string') {
      try {
        return JSON.parse(this.options);
      } catch (e) {
        console.error('Invalid JSON provided for options:', this.options);
        return [];
      }
    }
    return this.options;
  }

  private getIconForValue(value: string): string {
    switch (value) {
      case 'positive':
        return `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="white" stroke="#4CAF50" stroke-width="2"/>
                  <circle cx="9" cy="10" r="1.5" fill="#4CAF50"/>
                  <circle cx="15" cy="10" r="1.5" fill="#4CAF50"/>
                  <path d="M8.5 14.5c1.75 2 5.25 2 7 0" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
      case 'neutral':
        return `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="white" stroke="#FFEB3B" stroke-width="2"/>
                  <circle cx="9" cy="10" r="1.5" fill="#FFEB3B"/>
                  <circle cx="15" cy="10" r="1.5" fill="#FFEB3B"/>
                  <path d="M8.5 14h7" stroke="#FFEB3B" stroke-width="2" stroke-linecap="round"/>
                </svg>`;
      case 'negative':
        return `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="white" stroke="#F44336" stroke-width="2"/>
                  <circle cx="9" cy="10" r="1.5" fill="#F44336"/>
                  <circle cx="15" cy="10" r="1.5" fill="#F44336"/>
                  <path d="M8.5 15.5c1.75-2 5.25-2 7 0" stroke="#F44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
      default:
        return '';
    }
  }

  render() {
    const parsedOptions = this.getParsedOptions();

    return (
      <div class="rasa-rating">
        {this.hasVoted ? (
          <p class="rasa-rating__thank-you">{this.thankYouMessage}</p> // Thank-you message from Rasa
        ) : (
          <div>
            <p class="rasa-rating__text">{this.text}</p>
            <div class="rasa-rating__options">
              {parsedOptions.map((option) => (
                <button
                  key={option.value}
                  class={{
                    'rasa-rating__option': true,
                    'rasa-rating__option--selected': this.selectedOption === option.value,
                  }}
                  onClick={() => this.handleOptionClick(option.value)}
                  innerHTML={this.getIconForValue(option.value)} // Injecting the SVG directly into the button
                ></button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
