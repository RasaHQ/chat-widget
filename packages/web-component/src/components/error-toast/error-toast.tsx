import { Component, Host, State, h, Element } from '@stencil/core';
import { errorMessageService } from '../../store/error-message';
import { CustomErrorClass } from '@rasa-widget/core';
import { configStore } from '../../store/config-store';

@Component({
  tag: 'error-toast',
  styleUrl: 'error-toast.scss',
  shadow: true,
})
export class ErrorHandler {
  @State() errorMessage: CustomErrorClass | null = null;
  @Element() el: HTMLErrorToastElement;
  private toastElement: HTMLElement;

  componentDidUpdate() {
    this.toastElement = this.el.shadowRoot.querySelector('.toast') as HTMLElement;
    const computedHeight = this.toastElement.offsetHeight;
    this.toastElement.style.setProperty('--toast-bottom-end-point', `calc(${computedHeight}px + 24px)`);
  }

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
    }, 3000);
  }

  render() {
    return (
      <Host>
        <div class={this.errorMessage ? 'toast toast__show' : 'toast'}>
          <rasa-icon-danger size={16} class="toast__icon"></rasa-icon-danger>
          <div class="toast__error">
            <rasa-text disableParsing value={configStore().errorMessage} class="toast__message"></rasa-text>
            {/* {this.errorMessage?.description && <rasa-text disableParsing value={this.errorMessage?.description} class="toast__description"></rasa-text>} */}
          </div>
        </div>
      </Host>
    );
  }
}
