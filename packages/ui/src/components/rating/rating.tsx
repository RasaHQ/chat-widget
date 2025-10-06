import { Component, Prop, Event, EventEmitter, h, State } from '@stencil/core';
import { messageQueueService } from '../../store/message-queue';
import { ratingIcons } from './icons';

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
   * List of rating options from Rasa
   */
  @Prop() options: string | { value: string; payload: string }[] = [];

  /**
   * Customizable message from Rasa (Previously thankYouMessage)
   */
  @Prop() message: string = "Thank you for your feedback!";

  /**
   * Event emitted when a rating is selected
   */
  @Event() ratingSelected: EventEmitter<{ value: string; payload: string }>;

  /**
   * State to track the selected option
   */
  @State() selectedOption: string | null = null;

  /**
   * State to track if the user has voted
   */
  @State() hasVoted: boolean = false;

  componentDidLoad() {
    messageQueueService.completeRendering();
  }

  private handleOptionClick(optionValue: string, payload: string) {
    this.selectedOption = optionValue;
    this.hasVoted = true;
    this.ratingSelected.emit({ value: optionValue, payload });
  }

  private getParsedOptions(): { value: string; payload: string }[] {
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

  render() {
    const parsedOptions = this.getParsedOptions();

    return (
      <div class="rasa-rating">
        {this.hasVoted ? (
          <p class="rasa-rating__thank-you">{this.message}</p>
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
                  onClick={() => this.handleOptionClick(option.value, option.payload)}
                  innerHTML={ratingIcons[option.value] || ''}
                ></button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
