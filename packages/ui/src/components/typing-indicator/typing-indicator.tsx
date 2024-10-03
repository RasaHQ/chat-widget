import { Component, h } from '@stencil/core';

import { SENDER } from '@rasahq/chat-widget-sdk/dist/constants';

@Component({
  tag: 'rasa-typing-indicator',
  styleUrl: 'typing-indicator.scss',
  shadow: true,
})
export class TypingIndicator {
  render() {
    return (
      <chat-message sender={SENDER.BOT} showTimestamp={false}>
        <div class="typing-indicator">
          <span class="typing-indicator__dot"></span>
          <span class="typing-indicator__dot"></span>
          <span class="typing-indicator__dot"></span>
        </div>
      </chat-message>
    );
  }
}
