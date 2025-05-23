import { FunctionalComponent, h } from '@stencil/core';

import { configStore } from '../store/config-store';

type MessengerProps = {
  isOpen: boolean;
  isFullScreen: boolean;
  toggleFullScreenMode: () => void;
};

export const Messenger: FunctionalComponent<MessengerProps> = ({ isOpen, isFullScreen, toggleFullScreenMode }, children) => {
  const Icon = isFullScreen ? 'rasa-icon-arrows-contract' : 'rasa-icon-arrows-expand';

  return (
    <div class={{ 'messenger': true, 'messenger--fullscreen': isFullScreen, 'messenger--open': isOpen }}>
      <div class="messenger__header">
        <div>
          <rasa-text value={configStore().widgetTitle} disableParsing></rasa-text>
        </div>
        {configStore().toggleFullScreen && <Icon onClick={toggleFullScreenMode} class="messenger__header__icon" size={20}></Icon>}
      </div>
      <div class="messenger__content-wrapper">
        <div class="messenger__content">{children}</div>
      </div>
      <error-toast></error-toast>
      <rasa-chat-input></rasa-chat-input>
    </div>
  );
};
