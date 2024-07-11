import { Component, Prop, h, EventEmitter, Event, State, Watch } from '@stencil/core';
import { configStore } from '../../store/config-store';
import { messageQueueService } from '../../store/message-queue';

@Component({
  tag: 'rasa-chat-input',
  styleUrl: 'rasa-chat-input.scss',
  shadow: true,
})
export class RasaChatInput {
  /**
   * Input value
   */
  @Prop() initialValue?: string = '';
  /**
   * Send message event
   */
  @Event() sendMessageHandler: EventEmitter<string>;

  @State() value: string;

  @Watch('initialValue')
  valueChange(newVal: string) {
    this.value = newVal;
  }

  public componentWillLoad() {
    this.value = this.initialValue;
  }

  private sendMessageClick = () => {
    if (!this.value.trim()) return;
    const { isRendering, messageQueue } = messageQueueService.getState().state;
    if (isRendering || messageQueue.length > 0) return;
    this.sendMessageHandler.emit(this.value);
    this.value = '';
  };

  private inputChangeHandler = (event: Event) => {
    this.value = (event.target as HTMLInputElement).value;
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      this.sendMessageClick();
    }
  };

  render() {
    return (
      <div class="rasa-chat-input">
        <input
          type="text"
          class="rasa-chat-input__input"
          placeholder={configStore().inputMessagePlaceholder}
          value={this.value}
          onChange={this.inputChangeHandler}
          maxLength={500}
          onKeyUp={event => this.handleKeyUp(event)}
        />
        <button class="rasa-chat-input__button" onClick={this.sendMessageClick}>
          <rasa-icon-paper-plane class="rasa-chat-input__icon"></rasa-icon-paper-plane>
        </button>
      </div>
    );
  }
}