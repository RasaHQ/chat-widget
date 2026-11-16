import { SENDER, SESSION_STORAGE_KEYS } from '../constants';
import { CustomErrorClass, ErrorSeverity } from '../errors';

export class StorageService {
  //#region Private Methods
  private parseSessionStorageValue(value: string | null) {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }
  //#endregion

  //#region Public Methods
  public setSession(sessionId: string, sessionStart: Date): boolean {
    const preservedHistory = this.getChatHistory() || {};
    if (!preservedHistory[sessionId]) {
      preservedHistory[sessionId] = {
        sessionStart,
        messages: [],
      };
      sessionStorage.setItem(SESSION_STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(preservedHistory));
      return false;
    }
    return true;
  }

  // Returns the index of the stored message within the session's messages
  public setMessage(message: unknown, sessionId: string): number {
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
      return this.setMessage(message, sessionId);
    }
    sessionStorage.setItem(SESSION_STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(chatHistory));
    return chatHistory[sessionId].messages.length - 1;
  }

  // Replaces a stored bot message, e.g. once a streamed response is complete.
  // Anything else at that index (the history was overridden meanwhile) is left untouched.
  public updateBotMessage(message: unknown, messageIndex: number, sessionId: string): void {
    const chatHistory = this.getChatHistory() || {};
    const messages = chatHistory[sessionId]?.messages;
    if (!Array.isArray(messages) || messages[messageIndex]?.sender !== SENDER.BOT) return;
    messages[messageIndex] = message;
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

  public overrideChatHistory(chatHistory: string) {
    sessionStorage.setItem(SESSION_STORAGE_KEYS.CHAT_HISTORY, chatHistory);
  }
  //#endregion
}
