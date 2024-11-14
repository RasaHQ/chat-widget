import { Component, Event, EventEmitter, Host, Listen, Prop, State, h } from '@stencil/core';
import { QuickReply, QuickReplyMessage, SENDER } from '@rasahq/chat-widget-sdk';

import { messageQueueService } from '../../store/message-queue';
import { widgetState } from '../../store/widget-state-store';
import { configStore } from '../../store/config-store';

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
    quickReply: QuickReply;
    key: number;
  }>;
  private onQuickReplySelected(quickReply: QuickReply) {
    this.quickReplySelected.emit({ quickReply, key: this.elementKey });
  }

  @State() disableButtons = false;
  @State() quickReplyMessage: QuickReplyMessage;
  @State() textStreamComplete = false;

  @Listen('buttonClickHandler', { capture: true })
  // @ts-ignore-next-line
  private buttonClicked(event) {
    this.onQuickReplySelected(this.quickReplyMessage.replies.find(quickReply => quickReply.reply === event.detail.value));
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

  @Listen('textStreamComplete')
  // @ts-ignore-next-line
  private onTextStreamComplete() {
    this.textStreamComplete = true;
  }

  render() {
    const buttonsClassList = {
      'quick-reply__buttons': true,
      'quick-reply__buttons--disabled': this.disableButtons,
    };
    const isStreamEnabled = configStore().streamMessages && !this.isHistory;
    const canShowText = isStreamEnabled ? this.textStreamComplete : true;
    return (
      <Host>
        <chat-message sender={SENDER.BOT} timestamp={this.message.timestamp}>
          <rasa-text value={this.message.text} notifyCompleteRendering={isStreamEnabled} enableStream={isStreamEnabled} class="quick-reply__text"></rasa-text>
        </chat-message>
        {canShowText && this.quickReplyMessage.replies.length && (
          <div class={buttonsClassList}>
            {this.quickReplyMessage.replies.map((button, key) => (
              <rasa-button {...button} key={key} isSelected={button.isSelected} title={button.text}>
                <rasa-text value={button.text} disableParsing={true}></rasa-text>
              </rasa-button>
            ))}
          </div>
        )}
      </Host>
    );
  }
}
