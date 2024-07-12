import { MESSAGE_TYPES } from "../constants";
import { RESPONSE_MESSAGE_TYPES } from "../../constants";
import { determineMessageType } from "./determine-message-type";

describe("determineMessageType", () => {
  it("text message", () => {
    const message = { text: "Hello, world!" };
    expect(determineMessageType(message)).toBe(MESSAGE_TYPES.TEXT);
  });

  it("image message", () => {
    const message = { attachment: { type: RESPONSE_MESSAGE_TYPES.IMAGE } };
    expect(determineMessageType(message)).toBe(MESSAGE_TYPES.IMAGE);
  });

  it("accordion message", () => {
    const message = { type: RESPONSE_MESSAGE_TYPES.ACCORDION };
    expect(determineMessageType(message)).toBe(MESSAGE_TYPES.ACCORDION);
  });

  it("carousel message", () => {
    const message = { type: RESPONSE_MESSAGE_TYPES.CAROUSEL };
    expect(determineMessageType(message)).toBe(MESSAGE_TYPES.CAROUSEL);
  });

  it("quick replies message", () => {
    const message = { quick_replies: ["reply1", "reply2"] };
    expect(determineMessageType(message)).toBe(MESSAGE_TYPES.QUICK_REPLY);
  });

  it("file download message", () => {
    const message = { type: RESPONSE_MESSAGE_TYPES.FILE_DOWNLOAD };
    expect(determineMessageType(message)).toBe(MESSAGE_TYPES.FILE_DOWNLOAD);
  });

  it("video message", () => {
    const message = { type: RESPONSE_MESSAGE_TYPES.VIDEO };
    expect(determineMessageType(message)).toBe(MESSAGE_TYPES.VIDEO);
  });

  it("throw an error for undefined message type", () => {
    const message = { unknownType: "someValue" };
    expect(() => determineMessageType(message)).toThrow(
      "Can't load new message"
    );
  });
});
