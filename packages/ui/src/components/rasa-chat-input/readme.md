# rasa-chat-input



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type     | Default |
| -------------- | --------------- | ----------- | -------- | ------- |
| `initialValue` | `initial-value` | Input value | `string` | `''`    |


## Events

| Event                | Description        | Type                  |
| -------------------- | ------------------ | --------------------- |
| `sendMessageHandler` | Send message event | `CustomEvent<string>` |


## Dependencies

### Used by

 - [rasa-chatbot-widget](../../rasa-chatbot-widget)

### Depends on

- rasa-icon-paper-plane

### Graph
```mermaid
graph TD;
  rasa-chat-input --> rasa-icon-paper-plane
  rasa-chatbot-widget --> rasa-chat-input
  style rasa-chat-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
