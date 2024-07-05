import { Component, Host, Prop, h } from '@stencil/core';
import { configStore } from '../../store/config-store';

@Component({
  tag: 'chat-message',
  styleUrl: 'chat-message.scss',
  shadow: true,
})
export class ChatMessage {
  /**
   * Who sent the message
   */
  @Prop() sender: 'user' | 'bot';
  /**
   * Show sender icon
   */
  @Prop() hideSenderIcon: boolean = false;

  render() {
    const messageContentClassList = {
      'chat-message__message': true,
      'chat-message__message--user': this.sender === 'user',
      'chat-message__message--bot': this.sender === 'bot',
    };
    const contentClassList = {
      'chat-message__content': true,
      'chat-message__content--right': this.sender === 'user',
      'chat-message__content--left': this.sender === 'bot',
    };
    return (
      <Host class="chat-message">
        <div class={contentClassList}>
          {!this.hideSenderIcon && this.sender === 'bot' && (
            <div class="chat-message__robot">{configStore().botIcon ? <img class="chat-message__robot-image" src={configStore().botIcon}></img> : <rasa-icon-robot size={20} class="chat-message__icon" />}</div>
          )}
          <div part="messageContent" class={messageContentClassList}>
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}
