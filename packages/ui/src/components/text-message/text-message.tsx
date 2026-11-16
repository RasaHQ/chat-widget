import { Component, Host, Prop, h } from '@stencil/core';

import { SENDER } from '@rasahq/chat-widget-sdk';
import { SenderType } from '@rasahq/chat-widget-sdk/dist/types/common.types';
import { configStore } from '../../store/config-store';
import { messageQueueService } from '../../store/message-queue';
import { streamStore } from '../../store/stream-store';

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

  /**
   * Id of the server stream the message text comes from. The text updates while the stream is in progress.
   */
  @Prop() streamId?: string;

  componentDidLoad() {
    if (!this.streamId && this.sender !== SENDER.USER && configStore().streamMessages) return;
    messageQueueService.completeRendering();
  }

  render() {
    const classList = {
      'text-message--bot': this.sender === SENDER.BOT,
      'text-message--user': this.sender === SENDER.USER,
    };
    if (this.streamId) {
      return (
        <Host class={classList}>
          <rasa-text value={streamStore.getText(this.streamId) ?? this.value} live={true}></rasa-text>
        </Host>
      );
    }
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
