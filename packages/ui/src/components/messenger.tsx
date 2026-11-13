import { FunctionalComponent, h } from '@stencil/core';

import { configStore } from '../store/config-store';

type MessengerProps = {
  isOpen: boolean;
  isFullScreen: boolean;
  toggleFullScreenMode: () => void;
  hasFeedback?: boolean;
  isFeedbackDismissing?: boolean;
  isConnected?: boolean;
  subtitle?: string;
  greeting?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  welcomeMessage?: string;
  suggestedPrompts?: string[];
  onSuggestedPrompt?: (prompt: string) => void;
  showScrollToBottom?: boolean;
  onScroll?: (event: Event) => void;
  onScrollToBottom?: () => void;
  connectedText?: string;
  disconnectedText?: string;
};

export const Messenger: FunctionalComponent<MessengerProps> = (
  {
    isOpen,
    isFullScreen,
    toggleFullScreenMode,
    hasFeedback,
    isFeedbackDismissing,
    isConnected,
    subtitle,
    greeting,
    showCloseButton,
    onClose,
    welcomeMessage,
    suggestedPrompts = [],
    onSuggestedPrompt,
    showScrollToBottom,
    onScroll,
    onScrollToBottom,
    connectedText = 'Online',
    disconnectedText = 'Connecting…',
  },
  children,
) => {
  const Icon = isFullScreen ? 'rasa-icon-arrows-contract' : 'rasa-icon-arrows-expand';
  const { botIcon, widgetTitle } = configStore();
  const statusText = subtitle || (isConnected ? connectedText : disconnectedText);

  return (
    <div
      class={{
        'messenger': true,
        'messenger--fullscreen': isFullScreen,
        'messenger--open': isOpen,
        'messenger--with-feedback': hasFeedback,
        // Only present during the dismiss-down animation. The padding-bottom
        // transition is gated on this class so the popup's *entrance* (when
        // `--with-feedback` is added) makes room instantly, while the
        // *dismissal* slides smoothly in lock-step with the popup fade.
        'messenger--feedback-dismissing': isFeedbackDismissing,
      }}
      role="dialog"
      aria-label={widgetTitle}
      aria-hidden={isOpen ? 'false' : 'true'}
    >
      <div class="messenger__header">
        <div class="messenger__header-bar">
          <div class="messenger__header-avatar">
            {botIcon ? <img class="messenger__header-avatar-image" src={botIcon} alt="" /> : <rasa-icon-robot size={20} decorative />}
            <span class={{ 'messenger__status-dot': true, 'messenger__status-dot--online': !!isConnected }} aria-hidden="true"></span>
          </div>
          <div class="messenger__header-text">
            <div class="messenger__header-title">
              <rasa-text value={widgetTitle} disableParsing></rasa-text>
            </div>
            <div class="messenger__header-subtitle" aria-live="polite">
              <rasa-text value={statusText} disableParsing></rasa-text>
            </div>
          </div>
          <div class="messenger__header-actions">
            {configStore().toggleFullScreen && (
              <button
                type="button"
                class="messenger__header-action"
                aria-label={isFullScreen ? 'Exit full screen' : 'Enter full screen'}
                onClick={toggleFullScreenMode}
              >
                <Icon class="messenger__header__icon" size={18}></Icon>
              </button>
            )}
            {showCloseButton && (
              <button type="button" class="messenger__header-action messenger__header-close" aria-label="Close chat" onClick={onClose}>
                <rasa-icon-close-chat size={14} decorative></rasa-icon-close-chat>
              </button>
            )}
          </div>
        </div>
        {greeting && (
          <div class="messenger__greeting">
            <rasa-text value={greeting} disableParsing></rasa-text>
          </div>
        )}
      </div>
      <div class="messenger__sheet">
        <div class="messenger__body">
          <div class="messenger__content-wrapper" onScroll={onScroll}>
            <div class="messenger__content">
              {welcomeMessage && (
                <div class="messenger__welcome">
                  <rasa-text value={welcomeMessage} disableParsing></rasa-text>
                </div>
              )}
              {children}
              {suggestedPrompts.length > 0 && (
                <div class="messenger__suggestions" role="group" aria-label="Suggested questions">
                  {suggestedPrompts.map(prompt => (
                    <button type="button" class="messenger__suggestion" onClick={() => onSuggestedPrompt && onSuggestedPrompt(prompt)}>
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            class={{ 'messenger__scroll-bottom': true, 'messenger__scroll-bottom--visible': !!showScrollToBottom }}
            aria-label="Scroll to latest message"
            tabindex={showScrollToBottom ? 0 : -1}
            onClick={onScrollToBottom}
          >
            <rasa-icon-chevron-down size={14} decorative></rasa-icon-chevron-down>
          </button>
        </div>
        <error-toast></error-toast>
        <rasa-chat-input></rasa-chat-input>
      </div>
    </div>
  );
};
