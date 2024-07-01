import { Component, Host, h } from '@stencil/core';
import { errorMessageService } from '../../store/error-message';
import { CUSTOM_ERROR_NAME, CustomErrorClass } from '@rasa-widget/core';

@Component({
  tag: 'global-error-handler',
  shadow: true,
})
export class ErrorHandler {
  connectedCallback() {
    window.onerror = (...[, , , , error]) => {
      console.log(error instanceof CustomErrorClass);
      console.log(error);
      if (error instanceof CustomErrorClass && error.name === CUSTOM_ERROR_NAME) {
        console.log(error.description);
        errorMessageService.setErrorMessage(error as CustomErrorClass);
        return true;
      }
    };
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
