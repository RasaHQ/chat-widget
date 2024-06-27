import { h, FunctionalComponent } from '@stencil/core';
import { configStore } from '../store/config-store';

type MessengerProps = {
  isOpen: boolean;
  isFullScreen: boolean;
  toggleFullScreenMode: () => void;
};

export const Messenger: FunctionalComponent<MessengerProps> = ({ isOpen, isFullScreen, toggleFullScreenMode }, children) => {
  if (!isOpen) return null;

  const Icon = isFullScreen ? 'rasa-icon-arrows-contract' : 'rasa-icon-arrows-expand';

  return (
    <div class={{ 'messenger': true, 'messenger--fullscreen': isFullScreen }}>
      <div class="messenger__header">
        {configStore().title}
        {configStore().toggleFullScreen && <Icon onClick={toggleFullScreenMode} class="messenger__header__icon" size={20}></Icon>}
      </div>
      <div class="messenger__content">{children}</div>
      <rasa-chat-input></rasa-chat-input>
    </div>
  );
};
