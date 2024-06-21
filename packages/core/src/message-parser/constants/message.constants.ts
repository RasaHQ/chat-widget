
export const SESSION_STORAGE_KEYS = {
    CHAT_HISTORY: "rasa-chat-history",
};

export const SENDER = {
  BOT: "bot",
  USER: "user",
} as const;

export const RESPONSE_MESSAGE_TYPES = {
  ACCORDION: "accordion",
  CAROUSEL: "carousel",
  FILE_DOWNLOAD: "file_download",
  VIDEO: "video",
  IMAGE: "image",
} as const;

export const MESSAGE_TYPES = {
  ACCORDION: "accordion",
  CAROUSEL: "carousel",
  FILE_DOWNLOAD: "fileDownload",
  VIDEO: "video",
  IMAGE: "image",
  TEXT: "text",
  QUICK_REPLY: "quickReply",
  SESSION_DIVIDER: 'sessionDivider'
} as const;
