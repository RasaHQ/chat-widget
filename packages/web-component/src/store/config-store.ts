import { createStore } from '@stencil/store';

type WidgetConfig = {
  autoOpen: boolean;
  botIcon: string;
  displayTimestamp: boolean;
  errorMessage: string;
  inputMessagePlaceholder: string;
  messageDelay: number;
  messageTimestamp: string;
  streamMessages: boolean;
  subTitle: string;
  title: string;
  toggleFullScreen: boolean;
  unreadDisplayEnabled: boolean;
  userId: string;
  widgetIcon: string;
};

const WIDGET_CONFIG_DEFAULT: WidgetConfig = {
  autoOpen: false,
  botIcon: '',
  displayTimestamp: false,
  errorMessage: 'Something bad happened',
  inputMessagePlaceholder: 'Type your message here',
  messageDelay: 100,
  messageTimestamp: '',
  streamMessages: false,
  subTitle: '',
  title: 'Rasa Widget',
  toggleFullScreen: false,
  unreadDisplayEnabled: false,
  userId: '',
  widgetIcon: '',
};

const { state } = createStore<WidgetConfig>({
  ...WIDGET_CONFIG_DEFAULT,
});

export const configStore = () => state;

export const setConfigStore = (config: Partial<WidgetConfig>) => {
  Object.entries(config).map(([key, value]) => {
    state[key] = value;
  });
};
