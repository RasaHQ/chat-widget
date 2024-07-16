const mockRasaOn = jest.fn();
const mockRasaConnect = jest.fn((file, fileName, callback) => callback());
const mockRasaDisconnect = jest.fn();
const mockRasaSendMessage = jest.fn();

jest.mock('@vortexwest/chat-widget-sdk', () => ({
  ...jest.requireActual('@vortexwest/chat-widget-sdk'),
  Rasa: jest.fn(() => ({
    on: mockRasaOn,
    connect: mockRasaConnect,
    disconnect: mockRasaDisconnect,
    sendMessage: mockRasaSendMessage,
  })),
}));

export { mockRasaOn, mockRasaConnect, mockRasaDisconnect, mockRasaSendMessage };
