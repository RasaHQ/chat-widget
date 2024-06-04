import { h, FunctionalComponent } from '@stencil/core';

type MessengerProps = {
  isOpen: boolean;
  isFullScreen: boolean;
  toggleFullScreenMode: () => void;
  toggleFullScreen: boolean;
};

export const Messenger: FunctionalComponent<MessengerProps> = ({ isOpen, isFullScreen, toggleFullScreen, toggleFullScreenMode }, children) => {
  if (!isOpen) return null;

  const Icon = isFullScreen ? 'rasa-icon-arrows-contract' : 'rasa-icon-arrows-expand';

  return (
    <div class={{ 'messenger': true, 'messenger--fullscreen': isFullScreen }}>
      <div class="messenger__header">
        Rasa Widget
        {toggleFullScreen && <Icon onClick={toggleFullScreenMode} class="messenger__header__icon" size={20}></Icon>}
      </div>
      <div class="messenger__content">{children}</div>
      <rasa-chat-input></rasa-chat-input>
    </div>
  );
};
