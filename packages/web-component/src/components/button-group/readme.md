# rasa-button-group



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description         | Type                         | Default     |
| --------- | --------- | ------------------- | ---------------------------- | ----------- |
| `buttons` | --        | Buttons list        | `QuickReply[]`               | `undefined` |
| `type`    | `type`    | Type of button list | `"buttons" \| "quick-reply"` | `undefined` |


## Dependencies

### Used by

 - [rasa-chatbot-widget](../../rasa-chatbot-widget)

### Depends on

- [rasa-button](../button)
- [rasa-text](../text)

### Graph
```mermaid
graph TD;
  rasa-button-group --> rasa-button
  rasa-button-group --> rasa-text
  rasa-chatbot-widget --> rasa-button-group
  style rasa-button-group fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
