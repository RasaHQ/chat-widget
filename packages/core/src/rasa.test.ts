import { Rasa } from "../src/";

const eventHandlers = {};
const mockSocketConnect = jest.fn();
const mockSocketDisconnect = jest.fn();
const mockSocketEmit = jest.fn();

jest.mock("socket.io-client", () => ({
  __esModule: true,
  io: () => ({
    connect: mockSocketConnect,
    disconnect: mockSocketDisconnect,
    emit: mockSocketEmit,
    on: (event, handler) => {
      eventHandlers[event] = handler;
    },
  }),
}));

const triggerSocketEvent = (event, data?: unknown) => {
  if (eventHandlers[event]) {
    eventHandlers[event](data);
  }
};

describe("Rasa Client", () => {
  let client: Rasa;

  beforeEach(() => {
    client = new Rasa({ url: "localhost:3000" });
  });

  describe("Connection", () => {
    it("should connect on the socket", () => {
      client.connect();

      expect(mockSocketConnect).toHaveBeenCalled();
    });

    it("should fire connect event", () => {
      const onConnect = jest.fn();
      client.on("connect", onConnect);

      triggerSocketEvent("connect");

      expect(mockSocketEmit).toHaveBeenCalledWith("session_request", {
        session_id: client.sessionId,
      });
      expect(onConnect).toHaveBeenCalled();
    });

    it("should disconnect on the socket", () => {
      client.disconnect();

      expect(mockSocketDisconnect).toHaveBeenCalled();
    });

    it("should fire disconnect event", () => {
      const onDisconnect = jest.fn();
      client.on("disconnect", onDisconnect);

      triggerSocketEvent("disconnect");

      expect(onDisconnect).toHaveBeenCalled();
    });
  });

  describe("Messaging", () => {
    it("should send a new message", () => {
      client.sendMessage({text: "Hello"});

      expect(mockSocketEmit).toHaveBeenCalledWith("user_uttered", {
        message: "Hello",
        session_id: client.sessionId,
      });
    });

    it("should fire bot_uttered event", () => {
      const onBotResponse = jest.fn();
      const specificDate = new Date(2024, 7, 8);
      jest.spyOn(global, 'Date').mockImplementation(() => specificDate);
      client.on("message", onBotResponse);

      triggerSocketEvent("bot_uttered", { text: "Hello! How can I help you?" });

      expect(onBotResponse).toHaveBeenCalledWith({
        sender: "bot",
        text: "Hello! How can I help you?",
        timestamp: specificDate,
        type: "text",
      });
    });
  });
});
