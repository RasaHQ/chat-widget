import { Component, Host, h } from '@stencil/core';
import { errorMessageService } from '../../store/error-message';
import { CUSTOM_ERROR_NAME, CustomErrorClass, ErrorSeverity } from '@rasa-widget/core';

@Component({
  tag: 'global-error-handler',
  shadow: true,
})
export class ErrorHandler {
  connectedCallback() {
    window.onerror = (...[, , , , error]) => {
      if (error instanceof CustomErrorClass && error.name === CUSTOM_ERROR_NAME) {
        switch (error.severity) {
          case ErrorSeverity.Error:
            errorMessageService.setErrorMessage(error as CustomErrorClass);
          case ErrorSeverity.LogError:
            console.error(error.message, error.description);
          case ErrorSeverity.LogWarning:
            console.warn(error.message, error.description);
        }
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
