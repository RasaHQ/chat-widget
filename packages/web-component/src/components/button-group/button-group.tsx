import { Component, Prop, h } from '@stencil/core';
import type { Button } from '@rasa-widget/core/src/types/types';

@Component({
  tag: 'rasa-button-group',
  styleUrl: 'button-group.scss',
  shadow: true,
})
export class RasaButtonGroup {
  /**
   * Buttons list
   */
  @Prop() buttons: Button[];

  /**
   * Type of button list
   */
  @Prop() type: "quick-reply" | "buttons";

  render() {
    return (
        <div class={`button-group button-group--${this.type}`}>
          {this.buttons.map((button, key) => (
            <rasa-button {...button} key={key}><rasa-text value={button.text}></rasa-text></rasa-button>
          ))}
        </div>
    );
  }
}
