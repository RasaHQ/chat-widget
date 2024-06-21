import { MESSAGE_TYPES } from "../constants";
import { DataMap, SessionData } from "../types";
import { determineMessageType } from "./determine-message-type";
import { MessageParsers } from "./message-parsers";
import { parseChatHistory } from "./parse-chat-history";
import { sortBySessionStart } from "./sort-by-session-start";

// Mock
jest.mock("./determine-message-type");
jest.mock("./message-parsers");
jest.mock("./sort-by-session-start");

describe("parseChatHistory", () => {
  const mockDetermineMessageType = determineMessageType as jest.MockedFunction<
    typeof determineMessageType
  >;
  const mockSortBySessionStart = sortBySessionStart as jest.MockedFunction<
    typeof sortBySessionStart
  >;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("parse and transform chat history correctly", () => {
    const chatHistory: DataMap = {
      session1: {
        sessionStart: "2023-01-01T10:00:00.000Z",
        messages: [
          { text: "Hello", sender: "user" },
          { text: "Hi", sender: "bot" },
        ],
      },
    };
    const sortedChatHistory: SessionData[] = [
      {
        sessionStart: "2023-01-01T10:00:00.000Z",
        messages: [
          { text: "Hello", sender: "user" },
          { text: "Hi", sender: "bot" },
        ],
      },
    ];
    mockSortBySessionStart.mockReturnValue(sortedChatHistory);
    mockDetermineMessageType.mockImplementation(() => "text");
    MessageParsers.text = jest.fn((message, sender) => ({
      type: "text",
      sender,
      text: message.text,
    }));

    const result = parseChatHistory(chatHistory);

    expect(mockSortBySessionStart).toHaveBeenCalledWith(chatHistory);
    expect(mockDetermineMessageType).toHaveBeenCalledTimes(2);
    expect(MessageParsers.text).toHaveBeenCalledTimes(2);
    expect(result).toEqual([
      {
        type: MESSAGE_TYPES.SESSION_DIVIDER,
        startDate: new Date("2023-01-01T10:00:00.000Z"),
      },
      {
        type: "text",
        sender: "user",
        text: "Hello",
      },
      {
        type: "text",
        sender: "bot",
        text: "Hi",
      },
    ]);
  });

  it("handle empty chat history", () => {
    const chatHistory: DataMap = {};
    mockSortBySessionStart.mockReturnValue([]);

    const result = parseChatHistory(chatHistory);

    expect(mockSortBySessionStart).toHaveBeenCalledWith(chatHistory);
    expect(result).toEqual([]);
  });
});
