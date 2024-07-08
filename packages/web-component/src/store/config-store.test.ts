import { configStore, setConfigStore } from './config-store';

describe('configStore', () => {
  it('returns the default configuration', () => {
    const defaultConfig = configStore();

    expect(defaultConfig).toEqual({
      authorizationToken: '',
      autoOpen: false,
      botIcon: '',
      displayTimestamp: false,
      errorMessage: 'Something bad happened',
      inputMessagePlaceholder: 'Type your message here',
      initialPayload: '',
      restEnabled: false,
      serverUrl: '',
      messageDelay: 600,
      messageTimestamp: '',
      streamMessages: false,
      widgetTitle: 'Rasa Widget',
      toggleFullScreen: false,
      senderId: '',
      widgetIcon: '',
    });
  });

  it('updates the configuration with new values', () => {
    const newConfig = {
      autoOpen: true,
      botIcon: 'bot-icon.png',
      displayTimestamp: true,
      widgetTitle: 'New Title',
    };

    setConfigStore(newConfig);
    const updatedConfig = configStore();

    expect(updatedConfig.autoOpen).toBe(true);
    expect(updatedConfig.botIcon).toBe('bot-icon.png');
    expect(updatedConfig.displayTimestamp).toBe(true);
    expect(updatedConfig.widgetTitle).toBe('New Title');
  });
});
