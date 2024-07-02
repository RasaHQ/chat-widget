# rasa-chatbot-widget



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute            | Description                                                                                            | Type      | Default     |
| ------------------ | -------------------- | ------------------------------------------------------------------------------------------------------ | --------- | ----------- |
| `autoOpen`         | `auto-open`          | If set to True, it will open the chat, triggering the 'initialPayload' immediately if set.             | `boolean` | `false`     |
| `messageDelay`     | `message-delay`      | Indicates time between message is received and printed.                                                | `number`  | `100`       |
| `restEnabled`      | `rest-enabled`       | If set to True, instead of the default WebSocket communication, the widget will use the HTTP protocol. | `boolean` | `false`     |
| `serverUrl`        | `server-url`         | Url of the Rasa chatbot backend server                                                                 | `string`  | `undefined` |
| `streamMessages`   | `stream-messages`    | If set to True, bot messages will be received as stream (printing word by word).                       | `boolean` | `false`     |
| `toggleFullScreen` | `toggle-full-screen` | Indicates whether the chat messenger can be toggled to full screen mode.                               | `boolean` | `false`     |


## Events

| Event                       | Description                              | Type                   |
| --------------------------- | ---------------------------------------- | ---------------------- |
| `chatWidgetReceivedMessage` | Emitted when the user receives a message | `CustomEvent<unknown>` |
| `chatWidgetSentMessage`     | Emitted when the user sends a message    | `CustomEvent<string>`  |


## Dependencies

### Depends on

- [rasa-session-divider](../components/session-devider)
- [chat-message](../components/message)
- [rasa-text-message](../components/text-message)
- [rasa-image-message](../components/image-message)
- [rasa-video](../components/video)
- [rasa-file-download-message](../components/file-download-message)
- [rasa-accordion](../components/accordion)
- [rasa-text](../components/text)
- [rasa-button-group](../components/button-group)
- [rasa-carousel](../components/carousel)
- [rasa-typing-indicator](../components/typing-indicator)
- rasa-icon-close-chat
- rasa-icon-chat
- [rasa-chat-input](../components/rasa-chat-input)

### Graph
```mermaid
graph TD;
  rasa-chatbot-widget --> rasa-session-divider
  rasa-chatbot-widget --> chat-message
  rasa-chatbot-widget --> rasa-text-message
  rasa-chatbot-widget --> rasa-image-message
  rasa-chatbot-widget --> rasa-video
  rasa-chatbot-widget --> rasa-file-download-message
  rasa-chatbot-widget --> rasa-accordion
  rasa-chatbot-widget --> rasa-text
  rasa-chatbot-widget --> rasa-button-group
  rasa-chatbot-widget --> rasa-carousel
  rasa-chatbot-widget --> rasa-typing-indicator
  rasa-chatbot-widget --> rasa-icon-close-chat
  rasa-chatbot-widget --> rasa-icon-chat
  rasa-chatbot-widget --> rasa-chat-input
  rasa-session-divider --> rasa-text
  chat-message --> rasa-icon-robot
  rasa-text-message --> rasa-text
  rasa-image-message --> rasa-image
  rasa-image-message --> rasa-text
  rasa-image --> rasa-icon-default-image-fallback
  rasa-file-download-message --> rasa-icon-paperclip
  rasa-file-download-message --> rasa-text
  rasa-accordion --> rasa-icon-chevron-down
  rasa-button-group --> rasa-button
  rasa-button-group --> rasa-text
  rasa-carousel --> rasa-image-message
  rasa-carousel --> rasa-icon-chevron-down
  rasa-typing-indicator --> chat-message
  rasa-chat-input --> rasa-icon-paper-plane
  style rasa-chatbot-widget fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
