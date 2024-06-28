import { SENDER } from '@rasa-widget/core';
import { Component, h } from '@stencil/core';

@Component({
  tag: 'rasa-typing-indicator',
  styleUrl: 'typing-indicator.scss',
  shadow: true,
})
export class TypingIndicator {
  render() {
    return (
      <chat-message sender={SENDER.BOT}>
        <div class="typing-indicator">
          <span class="typing-indicator__dot"></span>
          <span class="typing-indicator__dot"></span>
          <span class="typing-indicator__dot"></span>
        </div>
      </chat-message>
    );
  }
}
