import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'rasa-text-message',
  styleUrl: 'text-message.scss',
  shadow: true,
})
export class RasaTextMessage {
  /**
   * Message value
   */
  @Prop() value: string;
  /**
   * Who sent the message
   */
  @Prop() sender: 'user' | 'bot';

  render() {
    const classList = {
      'text-message--bot': this.sender === 'bot',
      'text-message--user': this.sender === 'user',
    }
    return (
      <Host class={classList}>
          <rasa-text value={this.value} disableParsing={this.sender === 'user'} notifyCompleteRendering={true}></rasa-text>
      </Host>
    );
  }
}
