export const broadcastChatHistoryEvent = (chatHistory: string, senderID) => {
  if (!senderID) return;
  localStorage.setItem(`rasaChatHistory-${senderID}`, chatHistory);
  localStorage.removeItem(`rasaChatHistory-${senderID}`);
};

export const receiveChatHistoryEvent = (ev, callback, senderID) => {
  if (ev.key != `rasaChatHistory-${senderID}`) return;
  var message = ev.newValue;
  console.log(ev.newValue);
  if (!message) return;
  callback(ev.newValue);
};
