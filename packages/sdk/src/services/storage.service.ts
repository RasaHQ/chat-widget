import { SESSION_STORAGE_KEYS } from '../constants';
import { CustomErrorClass, ErrorSeverity } from '../errors';

export class StorageService {
  public setSession(sessionId: string, sessionStart: Date): void {
    const preservedHistory = this.getChatHistory() || {};
    preservedHistory[sessionId] = {
      sessionStart,
      messages: [],
    };
    sessionStorage.setItem(SESSION_STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(preservedHistory));
  }

  public setMessage(message: unknown, sessionId: string): void {
    const chatHistory = this.getChatHistory() || {};
    if (chatHistory[sessionId]) {
      if (Array.isArray(chatHistory[sessionId].messages)) {
        chatHistory[sessionId].messages.push(message);
      } else {
        chatHistory[sessionId].messages = [message];
      }
    } else {
      const startDate = new Date();
      this.setSession(sessionId, startDate);
      this.setMessage(message, sessionId);
      return;
    }
    sessionStorage.setItem(SESSION_STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(chatHistory));
  }

  public getChatHistory() {
    const value = sessionStorage.getItem(SESSION_STORAGE_KEYS.CHAT_HISTORY);
    return this.parseSessionStorageValue(value);
  }

  public setQuickReplyValue(reply: string, messageKey: number, sessionId: string) {
    const chatHistory = this.getChatHistory() || {};
    if (chatHistory[sessionId]) {
      if (Array.isArray(chatHistory[sessionId].messages)) {
        try {
          chatHistory[sessionId].messages[messageKey].quick_replies.find(
            quickReply => quickReply.payload === reply,
          ).isSelected = true;
          sessionStorage.setItem(SESSION_STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(chatHistory));
        } catch {
          throw new CustomErrorClass(
            ErrorSeverity.LogWarning,
            `Failed to save selected quick reply to history`,
            `reply: ${reply}, messageKey:${messageKey}`,
          );
        }
      }
    }
  }

  private parseSessionStorageValue(value: string | null) {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }
}
