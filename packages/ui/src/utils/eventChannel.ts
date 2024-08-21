export const broadcastChatHistoryEvent = (chatHistory: string, senderID) => {
  if (!senderID) return;
  localStorage.setItem(`rasaChatHistory-${senderID}`, chatHistory);
  localStorage.removeItem(`rasaChatHistory-${senderID}`);
};

export const receiveChatHistoryEvent = (ev, callback, senderID) => {
  const newChatHistory = ev.newValue;

  if (ev.key != `rasaChatHistory-${senderID}` || !newChatHistory) return;
  callback(newChatHistory);
};
