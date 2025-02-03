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
  @Prop() options: string | { value: string; icon: string; label: string }[] = [];

  /**
   * Event emitted when a rating is selected
   */
  @Event() ratingSelected: EventEmitter<{ value: string }>;

  /**
   * State to track the currently selected option
   */
  @State() selectedOption: string | null = null;

  componentDidLoad() {
    messageQueueService.completeRendering();
  }

  private handleOptionClick(optionValue: string) {
    this.selectedOption = optionValue; // Update the selected option
    this.ratingSelected.emit({ value: optionValue }); // Emit the event
  }

  private getParsedOptions(): { value: string; icon: string; label: string }[] {
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
            >
              <span class="rasa-rating__icon">{option.icon}</span>
              <span class="rasa-rating__label">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
}
