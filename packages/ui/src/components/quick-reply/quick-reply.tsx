import { Component, Event, EventEmitter, Host, Listen, Prop, State, h } from '@stencil/core';
import { QuickReplyMessage, SENDER } from '@vortexwest/chat-widget-sdk';

import { configStore } from '../../store/config-store';
import { messageQueueService } from '../../store/message-queue';
import { widgetState } from '../../store/widget-state-store';

@Component({
  tag: 'rasa-quick-reply',
  styleUrl: 'quick-reply.scss',
  shadow: true,
})
export class RasaQuickReply {
  /**
   * Message value
   */
  @Prop() message: QuickReplyMessage;
  /**
   * Element key
   */
  @Prop() elementKey: number;
  /**
   * Element unique id
   */
  @Prop() quickReplyId: string;
  /**
   * Is message form history
   */
  @Prop() isHistory = false;
  /**
   * Quick reply selected
   */
  @Event() quickReplySelected: EventEmitter<{
    value: string;
    key: number;
  }>;
  private onQuickReplySelected(
    event: CustomEvent<{
      value: string;
    }>,
  ) {
    this.quickReplySelected.emit({ value: event.detail.value, key: this.elementKey });
  }

  @State() disableButtons = false;
  @State() quickReplyMessage: QuickReplyMessage;

  @Listen('buttonClickHandler', { capture: true })
  // @ts-ignore-next-line
  private buttonClicked(event) {
    this.onQuickReplySelected(event);
    this.quickReplyMessage.replies.find(quickReply => quickReply.reply === event.detail.value).isSelected = true;
    this.determineButtonState();
  }

  componentWillLoad() {
    this.determineButtonState();
    this.quickReplyMessage = this.message;
    widgetState.getState().onChange('activeQuickReply', newValue => {
      if (newValue !== this.quickReplyId) this.disableButtons = true;
    });
  }

  componentDidLoad() {
    if (configStore().streamMessages) return;
    messageQueueService.completeRendering();
  }

  private determineButtonState(): void {
    if (this.isHistory) {
      this.disableButtons = true;
      return;
    }
    if (this.message.replies.some(reply => reply.isSelected)) {
      this.disableButtons = true;
      return;
    }
    this.disableButtons = false;
  }

  render() {
    const buttonsClassList = {
      'quick-reply__buttons': true,
      'quick-reply__buttons--disabled': this.disableButtons,
    };
    return (
      <Host>
        <chat-message sender={SENDER.BOT} timestamp={this.message.timestamp}>
          <rasa-text value={this.message.text} enableStream={false} class="quick-reply__text"></rasa-text>
        </chat-message>
        {this.quickReplyMessage.replies.length && (
          <div class={buttonsClassList}>
            {this.quickReplyMessage.replies.map((button, key) => (
              <rasa-button {...button} key={key} isSelected={button.isSelected}>
                <rasa-text value={button.text} disableParsing={true}></rasa-text>
              </rasa-button>
            ))}
          </div>
        )}
      </Host>
    );
  }
}
