import { Component, Host, Prop, State, h } from '@stencil/core/internal';

import { Messenger } from '../components/messenger';

@Component({
  tag: 'rasa-chatbot-widget',
  styleUrl: 'rasa-chatbot-widget.scss',
  shadow: true,
})
export class RasaChatbotWidget {
  /**
   * Indicates whether the chat messenger can be toggled to full screen mode.
   * */
  @Prop() toggleFullScreen: boolean = false;
  
  @State() isOpen: boolean = false;
  @State() isFullScreen: boolean = false;

  private toggleOpenState = () => {
    this.isOpen = !this.isOpen;
  };

  private getAltText() {
    return this.isOpen ? 'Close Chat' : 'Open Chat';
  }

  private toggleFullscreenMode = () => {
    this.isFullScreen = !this.isFullScreen;
  };

  render() {
    return (
      <Host>
        <slot />
        <div class="rasa-chatbot-widget">
          <div class="rasa-chatbot-widget__container">
          <Messenger isOpen={this.isOpen} toggleFullScreen={this.toggleFullScreen} toggleFullScreenMode={this.toggleFullscreenMode} isFullScreen={this.isFullScreen}>Messages</Messenger>
            <div role="button" onClick={this.toggleOpenState} class="rasa-chatbot-widget__launcher" aria-label={this.getAltText()}>
              {this.isOpen ? <rasa-icon-close-chat size={18} /> : <rasa-icon-chat />}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
