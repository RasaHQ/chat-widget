# rasa-session-divider



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute              | Description                                   | Type     | Default                |
| -------------------- | ---------------------- | --------------------------------------------- | -------- | ---------------------- |
| `sessionStartDate`   | --                     | Session start datetime                        | `Date`   | `undefined`            |
| `sessionStartedText` | `session-started-text` | Text to display before the session start date | `string` | `'Session started on'` |


## Dependencies

### Used by

 - [rasa-chatbot-widget](../../rasa-chatbot-widget)

### Depends on

- [rasa-text](../text)

### Graph
```mermaid
graph TD;
  rasa-session-divider --> rasa-text
  rasa-chatbot-widget --> rasa-session-divider
  style rasa-session-divider fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
