# rasa-quick-reply



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute        | Description             | Type                | Default     |
| -------------- | ---------------- | ----------------------- | ------------------- | ----------- |
| `elementKey`   | `element-key`    | Element key             | `number`            | `undefined` |
| `isHistory`    | `is-history`     | Is message form history | `boolean`           | `false`     |
| `message`      | --               | Message value           | `QuickReplyMessage` | `undefined` |
| `quickReplyId` | `quick-reply-id` | Element unique id       | `string`            | `undefined` |


## Events

| Event                | Description          | Type                                           |
| -------------------- | -------------------- | ---------------------------------------------- |
| `quickReplySelected` | Quick reply selected | `CustomEvent<{ value: string; key: number; }>` |


## Dependencies

### Used by

 - [rasa-chatbot-widget](../../rasa-chatbot-widget)

### Depends on

- [chat-message](../message)
- [rasa-text](../text)
- [rasa-button](../button)

### Graph
```mermaid
graph TD;
  rasa-quick-reply --> chat-message
  rasa-quick-reply --> rasa-text
  rasa-quick-reply --> rasa-button
  chat-message --> rasa-icon-robot
  rasa-chatbot-widget --> rasa-quick-reply
  style rasa-quick-reply fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*