import { Component, Element, Host, State, h } from '@stencil/core';

import { CustomErrorClass } from '@vortexwest/chat-widget-sdk';
import { configStore } from '../../store/config-store';
import { errorMessageService } from '../../store/error-message';

const TOAST_ANIMATION_TIME = 3500;

@Component({
  tag: 'error-toast',
  styleUrl: 'error-toast.scss',
  shadow: true,
})
export class ErrorHandler {
  @State() errorMessage: CustomErrorClass | null = null;
  @Element() el: HTMLErrorToastElement;

  connectedCallback() {
    errorMessageService.getState().onChange('errorMessage', errorMessage => {
      if (errorMessage) {
        this.processError(errorMessage);
        errorMessageService.errorReceived();
      }
    });
  }

  private processError(error: CustomErrorClass): void {
    this.errorMessage = error;
    setTimeout(() => {
      this.errorMessage = null;
    }, TOAST_ANIMATION_TIME);
  }

  render() {
    return (
      <Host>
        <div class={this.errorMessage ? 'toast toast__show' : 'toast'}>
          <rasa-icon-danger size={16} class="toast__icon"></rasa-icon-danger>
          <div class="toast__error">
            <rasa-text disableParsing value={configStore().errorMessage} class="toast__message"></rasa-text>
          </div>
        </div>
      </Host>
    );
  }
}
