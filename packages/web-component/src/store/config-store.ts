import { createStore } from '@stencil/store';
import { WIDGET_DEFAULT_CONFIGURATION } from '../rasa-chatbot-widget/constants';

export type WidgetConfig = {
  serverUrl: string;
  authorizationToken: string;
  autoOpen: boolean;
  botIcon: string;
  displayTimestamp: boolean;
  errorMessage: string;
  inputMessagePlaceholder: string;
  messageDelay: number;
  messageTimestamp: string;
  initialPayload: string;
  streamMessages: boolean;
  widgetTitle: string;
  toggleFullScreen: boolean;
  senderId: string;
  widgetIcon: string;
  restEnabled: boolean;
};

const configStoreDefaults: WidgetConfig = {
  serverUrl: WIDGET_DEFAULT_CONFIGURATION.SERVER_URL,
  authorizationToken: WIDGET_DEFAULT_CONFIGURATION.AUTHORIZATION_TOKEN,
  autoOpen: WIDGET_DEFAULT_CONFIGURATION.AUTO_OPEN,
  botIcon: WIDGET_DEFAULT_CONFIGURATION.BOT_ICON,
  displayTimestamp: WIDGET_DEFAULT_CONFIGURATION.DISPLAY_TIMESTAMP,
  errorMessage: WIDGET_DEFAULT_CONFIGURATION.ERROR_MESSAGE,
  inputMessagePlaceholder: WIDGET_DEFAULT_CONFIGURATION.INPUT_MESSAGE_PLACEHOLDER,
  messageDelay: WIDGET_DEFAULT_CONFIGURATION.MESSAGE_DELAY,
  messageTimestamp: WIDGET_DEFAULT_CONFIGURATION.MESSAGE_TIMESTAMP,
  initialPayload: WIDGET_DEFAULT_CONFIGURATION.INITIAL_PAYLOAD,
  streamMessages: WIDGET_DEFAULT_CONFIGURATION.STREAM_MESSAGES,
  widgetTitle: WIDGET_DEFAULT_CONFIGURATION.WIDGET_TITLE,
  toggleFullScreen: WIDGET_DEFAULT_CONFIGURATION.TOGGLE_FULLSCREEN,
  senderId: WIDGET_DEFAULT_CONFIGURATION.SENDER_ID,
  widgetIcon: WIDGET_DEFAULT_CONFIGURATION.WIDGET_ICON,
  restEnabled: WIDGET_DEFAULT_CONFIGURATION.REST_ENABLED,
};

const { state } = createStore<WidgetConfig>({
  ...configStoreDefaults,
});

export const configStore = () => state;

export const setConfigStore = (config: Partial<WidgetConfig>) => {
  Object.entries(config).map(([key, value]) => {
    state[key] = value;
  });
};
