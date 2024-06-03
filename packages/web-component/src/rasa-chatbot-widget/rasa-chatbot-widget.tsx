import { Component, Host, State, h } from '@stencil/core/internal';

@Component({
  tag: 'rasa-chatbot-widget',
  styleUrl: 'rasa-chatbot-widget.scss',
  shadow: true,
})
export class RasaChatbotWidget {
  @State() isOpen: boolean = false;

  private toggleOpenState = () => {
    this.isOpen = !this.isOpen;
  };

  private getAltText() {
    return this.isOpen ? 'Close Chat' : 'Open Chat';
  }

  render() {
    return (
      <Host>
        <slot />
        <div class="rasa-chatbot-widget">
          <div class="rasa-chatbot-widget__container">
            {this.isOpen && <div>Chat Messenger placeholder</div>}
            <div role="button" onClick={this.toggleOpenState} class="rasa-chatbot-widget__launcher" aria-label={this.getAltText()}>
              {this.isOpen ? <rasa-icon-close-chat size={18} /> : <rasa-icon-chat />}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
