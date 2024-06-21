import { mockRasaOn, mockRasaConnect, mockRasaDisconnect } from '../__mocks__/@rasa-widget/core';
import * as CoreSDK from '@rasa-widget/core';
import RasaChatbotPage from './rasa-chatbot-widget.po';

describe('rasa-chatbot-widget', () => {
  let chatbotPage: RasaChatbotPage;

  beforeEach(() => {
    chatbotPage = new RasaChatbotPage();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockRasaOn.mockReset();
    mockRasaConnect.mockReset();
  });

  it('should initialize CoreSDK Rasa client on initPage()', async () => {
    await chatbotPage.initPage();

    // We expect that the CoreSDK Rasa class was instantiated.
    expect(CoreSDK.Rasa).toHaveBeenCalled();
    expect(CoreSDK.Rasa).toHaveBeenCalledWith({ url: undefined });

    expect(mockRasaOn).toHaveBeenCalledTimes(4);
    expect(mockRasaOn).toHaveBeenNthCalledWith(1, 'connect', expect.any(Function));
    expect(mockRasaOn).toHaveBeenNthCalledWith(2, 'message', expect.any(Function));
    // We didn't toggle the launcher, so neither `connect` nor `disconnect` should happen.
    expect(mockRasaConnect).toHaveBeenCalledTimes(0);
    expect(mockRasaDisconnect).toHaveBeenCalledTimes(0);
  });

  it('should initalize CoreSDK Rasa client and connect on toggleLauncher()', async () => {
    await chatbotPage.initPage();

    // We expect that the CoreSDK Rasa class was instantiated.
    expect(CoreSDK.Rasa).toHaveBeenCalled();
    expect(CoreSDK.Rasa).toHaveBeenCalledWith({ url: undefined });

    expect(mockRasaOn).toHaveBeenCalledTimes(4);
    expect(mockRasaOn).toHaveBeenNthCalledWith(1, 'connect', expect.any(Function));
    expect(mockRasaOn).toHaveBeenNthCalledWith(2, 'message', expect.any(Function));

    // We open the launcher.
    await chatbotPage.toggleLauncher();
    expect(mockRasaConnect).toHaveBeenCalledTimes(1);
    expect(mockRasaDisconnect).toHaveBeenCalledTimes(0);
  });

  it('should initalize CoreSDK Rasa client and connect on toggleLauncher()', async () => {
    await chatbotPage.initPage();

    // We expect that the CoreSDK Rasa class was instantiated.
    expect(CoreSDK.Rasa).toHaveBeenCalled();
    expect(CoreSDK.Rasa).toHaveBeenCalledWith({ url: undefined });

    expect(mockRasaOn).toHaveBeenCalledTimes(4);
    expect(mockRasaOn).toHaveBeenNthCalledWith(1, 'connect', expect.any(Function));
    expect(mockRasaOn).toHaveBeenNthCalledWith(2, 'message', expect.any(Function));

    // We open and close the launcher this time.
    await chatbotPage.toggleLauncher();
    await chatbotPage.toggleLauncher();
    expect(mockRasaConnect).toHaveBeenCalledTimes(1);
    expect(mockRasaDisconnect).toHaveBeenCalledTimes(1);
  });

  it('should toggle isOpen state when launcher is clicked', async () => {
    await chatbotPage.initPage();
    await chatbotPage.toggleLauncher();

    // Chat Widget isn't open by default.
    expect(chatbotPage.isLauncherOpen()).toBe(true);

    await chatbotPage.toggleLauncher();
    expect(chatbotPage.isLauncherOpen()).toBe(false);
  });

  it('default state of the toggle full screen feature should be disabled.', async () => {
    await chatbotPage.initPage();
    await chatbotPage.toggleLauncher();

    // Fullscreen button shouldn't be shown by default.
    const button = chatbotPage.getFullScreenToggleButton();

    expect(button).toBeNull();
  });

  it('ensure the capability to toggle full screen is functional when the toggleFullScreen feature is enabled.', async () => {
    await chatbotPage.initPage({ toggleFullScreen: true });
    await chatbotPage.toggleLauncher();

    await chatbotPage.toggleFullScreen();
    expect(chatbotPage.isFullScreen()).toBe(true);

    await chatbotPage.toggleFullScreen();
    expect(chatbotPage.isFullScreen()).toBe(false);
  });
});
