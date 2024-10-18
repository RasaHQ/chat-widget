import { CUSTOM_ERROR_NAME, CustomErrorClass, ErrorSeverity } from '@vortexwest/chat-widget-sdk';
import { Component, Host, h } from '@stencil/core';

import { errorMessageService } from '../../store/error-message';

@Component({
  tag: 'global-error-handler',
  shadow: true,
})
export class ErrorHandler {
  private handleError(error: Error): void | boolean {
    if (error instanceof CustomErrorClass && error.name === CUSTOM_ERROR_NAME) {
      switch (error.severity) {
        case ErrorSeverity.Error:
          errorMessageService.setErrorMessage(error as CustomErrorClass);
          console.error(error.message, error.description);
        case ErrorSeverity.LogError:
          console.error(error.message, error.description);
        case ErrorSeverity.LogWarning:
          console.warn(error.message, error.description);
      }
      return true;
    }
  }
  connectedCallback() {
    window.addEventListener('unhandledrejection', event => {
      return this.handleError(event.reason);
    });

    window.onerror = (...[, , , , error]) => {
      return this.handleError(error);
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
