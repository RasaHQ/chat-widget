const mockRasaOn = jest.fn();
const mockRasaConnect = jest.fn();
const mockRasaDisconnect = jest.fn();
const mockRasaSendMessage = jest.fn();

jest.mock('@rasa-widget/core', () => ({
  Rasa: jest.fn(() => ({
    on: mockRasaOn,
    connect: mockRasaConnect,
    disconnect: mockRasaDisconnect,
    sendMessage: mockRasaSendMessage
  })),
}));

export { mockRasaOn, mockRasaConnect, mockRasaDisconnect, mockRasaSendMessage };
