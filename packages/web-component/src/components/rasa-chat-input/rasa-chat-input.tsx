import { Component, Prop, h, EventEmitter, Event, State, Watch } from '@stencil/core';

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

  componentWillLoad() {
    this.value = this.initialValue;
  }

  private sendMessageClick = () => {
    this.sendMessageHandler.emit(this.value);
  };

  private inputChangeHandler = (event: Event) => {
    this.value = (event.target as HTMLInputElement).value;
  };

  render() {
    return (
      <div class="rasa-chat-input">
        <input type="text" class="rasa-chat-input__input" placeholder="Type your message here" value={this.value} onChange={this.inputChangeHandler} maxLength={500} />
        <button class="rasa-chat-input__button" onClick={this.sendMessageClick}>
          <rasa-icon-paper-plane class="rasa-chat-input__icon"></rasa-icon-paper-plane>
        </button>
      </div>
    );
  }
}
