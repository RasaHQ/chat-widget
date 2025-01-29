import { Component, Prop, Event, EventEmitter, State, h, Host } from '@stencil/core';
import { messageQueueService } from '../../store/message-queue';

@Component({
  tag: 'rasa-rating',
  styleUrl: 'rating.scss',
  shadow: true,
})
export class RasaRating {
  /**
   * Instructional text displayed above the rating options.
   */
  @Prop() text: string;

  /**
   * List of rating options, each containing a value, icon, and label.
   */
  @Prop() options: { value: string; icon: string; label: string }[];

  /**
   * Event emitted when a rating option is selected.
   */
  @Event() ratingSelected: EventEmitter<{ value: string }>;

  /**
   * The currently selected rating option.
   */
  @State() selectedValue: string = '';

  /**
   * Handles rating option click and emits the `ratingSelected` event.
   */
  private onOptionClick = (value: string) => {
    this.selectedValue = value;
    this.ratingSelected.emit({ value });
  };

  /**
   * Lifecycle hook to notify when rendering is complete.
   */
  componentDidLoad() {
    messageQueueService.completeRendering();
  }

  render() {
    return (
      <Host>
        <div class="rasa-rating">
          <p class="rasa-rating__text">{this.text}</p>
          <div class="rasa-rating__options">
            {this.options.map(option => (
              <button
                key={option.value}
                class={{
                  'rasa-rating__option': true,
                  'rasa-rating__option--selected': this.selectedValue === option.value,
                }}
                onClick={() => this.onOptionClick(option.value)}
              >
                <span class="rasa-rating__icon">{option.icon}</span>
                <span class="rasa-rating__label">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Host>
    );
  }
}
