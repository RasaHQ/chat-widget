# rasa-chatbot-widget



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute            | Description                                                              | Type      | Default |
| ------------------ | -------------------- | ------------------------------------------------------------------------ | --------- | ------- |
| `toggleFullScreen` | `toggle-full-screen` | Indicates whether the chat messenger can be toggled to full screen mode. | `boolean` | `false` |


## Dependencies

### Depends on

- [rasa-text](../components/text)
- rasa-icon-close-chat
- rasa-icon-chat
- [rasa-chat-input](../components/rasa-chat-input)

### Graph
```mermaid
graph TD;
  rasa-chatbot-widget --> rasa-text
  rasa-chatbot-widget --> rasa-icon-close-chat
  rasa-chatbot-widget --> rasa-icon-chat
  rasa-chatbot-widget --> rasa-chat-input
  rasa-chat-input --> rasa-icon-paper-plane
  style rasa-chatbot-widget fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
