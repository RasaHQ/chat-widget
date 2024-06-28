import { configStore, setConfigStore } from './config-store';

describe('configStore', () => {
  it('returns the default configuration', () => {
    const defaultConfig = configStore();
    expect(defaultConfig).toEqual({
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
    });
  });

  it('updates the configuration with new values', () => {
    const newConfig = {
      autoOpen: true,
      botIcon: 'bot-icon.png',
      displayTimestamp: true,
      title: 'New Title',
    };

    setConfigStore(newConfig);
    const updatedConfig = configStore();

    expect(updatedConfig.autoOpen).toBe(true);
    expect(updatedConfig.botIcon).toBe('bot-icon.png');
    expect(updatedConfig.displayTimestamp).toBe(true);
    expect(updatedConfig.title).toBe('New Title');
  });
});
