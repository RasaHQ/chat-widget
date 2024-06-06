import { Component, Prop, h, EventEmitter, Event } from '@stencil/core';

@Component({
  tag: 'rasa-button',
  styleUrl: 'button.scss',
  shadow: true,
})
export class RasaButton {
  /**
   * Button click event name
   */
  @Prop() purpose: string;
  /**
   * Additional value that is passed at button click
   */
  @Prop() value?: string;
  /**
   * Is button selected as option
   */
  @Prop() isSelected: boolean = false;

  /**
   * On button click event emitter
   */
  @Event() buttonClickHandler: EventEmitter<{purpose: string; value?: string}>;

  private buttonClick() {
    this.buttonClickHandler.emit({purpose: this.purpose, value: this.value});
  }

  render() {
    return (
        <button class={`rasa-button ${this.isSelected && 'rasa-button--selected'}`} onClick={this.buttonClick}>
          <slot></slot>
        </button>
    );
  }
}
