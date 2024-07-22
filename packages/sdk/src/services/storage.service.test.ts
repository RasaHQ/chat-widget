import { SESSION_STORAGE_KEYS } from '../constants';
import { CustomErrorClass, ErrorSeverity } from '../errors';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let storageService: StorageService;

  beforeEach(() => {
    storageService = new StorageService();
    sessionStorage.clear();
  });

  it('new session correctly set', () => {
    const sessionId = 'session1';
    const sessionStart = new Date();

    storageService.setSession(sessionId, sessionStart);

    const storedHistory = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEYS.CHAT_HISTORY) || '{}');
    expect(storedHistory[sessionId]).toEqual({
      sessionStart: sessionStart.toISOString(),
      messages: [],
    });
  });

  it('add a message to an existing session', () => {
    const sessionId = 'session1';
    const sessionStart = new Date();
    const message = { text: 'Hello, world!' };

    storageService.setSession(sessionId, sessionStart);
    storageService.setMessage(message, sessionId);

    const storedHistory = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEYS.CHAT_HISTORY) || '{}');
    expect(storedHistory[sessionId].messages).toEqual([message]);
  });

  it('add a message to an existing session with malformed messages array', () => {
    const sessionId = 'session1';
    const sessionStart = new Date();
    const message = { text: 'Hello, world!' };
    storageService.setSession(sessionId, sessionStart);

    const malformedData = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEYS.CHAT_HISTORY)!);
    malformedData[sessionId].messages = 'a';
    sessionStorage.setItem(SESSION_STORAGE_KEYS.CHAT_HISTORY, malformedData);
    storageService.setMessage(message, sessionId);

    const storedHistory = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEYS.CHAT_HISTORY) || '{}');
    expect(storedHistory[sessionId].messages).toEqual([message]);
  });

  it('create a new session if it does not exist and add a message', () => {
    const sessionId = 'session1';
    const message = { text: 'Hello, world!' };

    storageService.setMessage(message, sessionId);

    const storedHistory = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEYS.CHAT_HISTORY) || '{}');
    expect(storedHistory[sessionId].messages).toEqual([message]);
  });

  it('get chat history from session storage', () => {
    const sessionId = 'session1';
    const sessionStart = new Date();
    const message = { text: 'Hello, world!' };
    const chatHistory = {
      [sessionId]: {
        sessionStart: sessionStart.toISOString(),
        messages: [message],
      },
    };

    sessionStorage.setItem(SESSION_STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(chatHistory));
    const retrievedHistory = storageService.getChatHistory();

    expect(retrievedHistory).toEqual(chatHistory);
  });

  it('return null if session storage data is malformed', () => {
    sessionStorage.setItem(SESSION_STORAGE_KEYS.CHAT_HISTORY, 'invalidJson');

    const retrievedHistory = storageService.getChatHistory();

    expect(retrievedHistory).toBeNull();
  });

  it('return null if session storage value is null', () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.CHAT_HISTORY);

    const retrievedHistory = storageService.getChatHistory();

    expect(retrievedHistory).toBeNull();
  });

  it('should set quick reply value successfully', () => {
    const reply = 'test_reply';
    const messageKey = 0;
    const sessionId = 'session1';
    const chatHistory = {
      [sessionId]: {
        messages: [
          {
            quick_replies: [{ payload: reply, isSelected: false }],
          },
        ],
      },
    };
    jest.spyOn(storageService, 'getChatHistory').mockReturnValue(chatHistory);

    storageService.setQuickReplyValue(reply, messageKey, sessionId);

    expect(chatHistory[sessionId].messages[messageKey].quick_replies[0].isSelected).toBe(true);
  });

  it('should throw error if setting quick reply value fails', () => {
    const reply = 'test_reply';
    const messageKey = 1;
    const sessionId = 'session_3';
    const chatHistory = {
      [sessionId]: {
        messages: [
          {
            quick_replies: [],
          },
        ],
      },
    };
    jest.spyOn(storageService, 'getChatHistory').mockReturnValue(chatHistory);

    expect(() => {
      storageService.setQuickReplyValue(reply, messageKey, sessionId);
    }).toThrow(
      new CustomErrorClass(
        ErrorSeverity.LogWarning,
        `Failed to save selected quick reply to history`,
        `reply: ${reply}, messageKey:${messageKey}`,
      ),
    );
  });
});
