import { Component, Host, Prop, h } from '@stencil/core';

import { SENDER } from '@vortexwest/chat-widget-sdk';
import { SenderType } from '@vortexwest/chat-widget-sdk/dist/types/common.types';
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
  @Prop() sender: SenderType;

  /**
   * Is message form history
   */
  @Prop() isHistory = false;

  componentDidLoad() {
    if (this.sender !== SENDER.USER && configStore().streamMessages) return;
    messageQueueService.completeRendering();
  }

  render() {
    const classList = {
      'text-message--bot': this.sender === SENDER.BOT,
      'text-message--user': this.sender === SENDER.USER,
    };
    return (
      <Host class={classList}>
        <rasa-text
          value={this.value}
          disableParsing={this.sender === SENDER.USER}
          notifyCompleteRendering={configStore().streamMessages}
          enableStream={configStore().streamMessages && !this.isHistory}
        ></rasa-text>
      </Host>
    );
  }
}
