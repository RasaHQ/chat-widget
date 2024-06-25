import { Component, Prop, h } from '@stencil/core';
import { QuickReply } from '@rasa-widget/core';

@Component({
  tag: 'rasa-button-group',
  styleUrl: 'button-group.scss',
  shadow: true,
})
export class RasaButtonGroup {
  /**
   * Buttons list
   */
  @Prop() buttons: QuickReply[];

  /**
   * Type of button list
   */
  @Prop() type: 'quick-reply' | 'buttons';

  render() {
    return (
      <div class={`button-group button-group--${this.type}`}>
        {this.buttons.map((button, key) => (
          <rasa-button {...button} key={key}>
            <rasa-text value={button.text} disableStream={true}></rasa-text>
          </rasa-button>
        ))}
      </div>
    );
  }
}
