import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';

@Component({
  tag: 'rasa-button',
  styleUrl: 'button.scss',
  shadow: true,
})
export class RasaButton {
  /**
   * Additional value that is passed at button click
   */
  @Prop() reply: string;
  /**
   * Is button selected as option
   */
  @Prop() isSelected: boolean = false;

  /**
   * On button click event emitter
   */
  @Event() buttonClickHandler: EventEmitter<{ value: string }>;

  private buttonClick = () => {
    this.buttonClickHandler.emit({ value: this.reply });
  };

  render() {
    return (
      <button class={`rasa-button ${this.isSelected && 'rasa-button--selected'}`} onClick={this.buttonClick}>
        <slot></slot>
      </button>
    );
  }
}
