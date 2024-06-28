import { Component, Host, Prop, h } from '@stencil/core';
import { configStore } from '../../store/config-store';
import { messageQueueService } from '../../store/message-queue';

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

  /**
   * Is message form history
   */
  @Prop() isHistory = false;

  componentDidLoad() {
    if (this.sender !== 'user' && configStore().streamMessages) return;
    messageQueueService.completeRendering();
  }

  render() {
    const classList = {
      'text-message--bot': this.sender === 'bot',
      'text-message--user': this.sender === 'user',
    };
    return (
      <Host class={classList}>
        <rasa-text
          value={this.value}
          disableParsing={this.sender === 'user'}
          notifyCompleteRendering={configStore().streamMessages}
          enableStream={configStore().streamMessages && !this.isHistory}
        ></rasa-text>
      </Host>
    );
  }
}
