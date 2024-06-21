# rasa-text-message



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description          | Type              | Default     |
| -------- | --------- | -------------------- | ----------------- | ----------- |
| `sender` | `sender`  | Who sent the message | `"bot" \| "user"` | `undefined` |
| `value`  | `value`   | Message value        | `string`          | `undefined` |


## Dependencies

### Used by

 - [rasa-chatbot-widget](../../rasa-chatbot-widget)

### Depends on

- [rasa-text](../text)

### Graph
```mermaid
graph TD;
  rasa-text-message --> rasa-text
  rasa-chatbot-widget --> rasa-text-message
  style rasa-text-message fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
