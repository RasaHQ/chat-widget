import { broadcastChatHistoryEvent, receiveChatHistoryEvent } from './eventChannel';

describe('broadcastChatHistoryEvent', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should not set or remove from localStorage if senderID is not set', () => {
    const setItemSpy = jest.spyOn(localStorage, 'setItem');
    const removeItemSpy = jest.spyOn(localStorage, 'removeItem');

    broadcastChatHistoryEvent('some chat history', '');

    expect(setItemSpy).not.toHaveBeenCalled();
    expect(removeItemSpy).not.toHaveBeenCalled();
  });

  it('should set and then remove the chat history in localStorage for the given senderID', () => {
    const setItemSpy = jest.spyOn(localStorage, 'setItem');
    const removeItemSpy = jest.spyOn(localStorage, 'removeItem');

    const senderID = '123';
    broadcastChatHistoryEvent('some chat history', senderID);

    expect(setItemSpy).toHaveBeenCalledWith(`rasaChatHistory-${senderID}`, 'some chat history');
    expect(removeItemSpy).toHaveBeenCalledWith(`rasaChatHistory-${senderID}`);
  });
});

describe('receiveChatHistoryEvent', () => {
  it('should not call callback if the event key does not match the senderID', () => {
    const callback = jest.fn();
    const ev = { key: '321', newValue: 'new chat history' };

    receiveChatHistoryEvent(ev, callback, '123');

    expect(callback).not.toHaveBeenCalled();
  });

  it('should not call callback if newValue is falsy', () => {
    const callback = jest.fn();
    const ev = { key: 'rasaChatHistory-123', newValue: null };

    receiveChatHistoryEvent(ev, callback, '123');

    expect(callback).not.toHaveBeenCalled();
  });

  it('should call callback with new chat history if the event matches the senderID', () => {
    const callback = jest.fn();
    const newChatHistory = 'new chat history';
    const ev = { key: 'rasaChatHistory-123', newValue: newChatHistory };

    receiveChatHistoryEvent(ev, callback, '123');

    expect(callback).toHaveBeenCalledWith(newChatHistory);
  });
});
