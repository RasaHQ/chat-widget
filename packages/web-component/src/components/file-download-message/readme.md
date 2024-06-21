# rasa-file-download-message



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                           | Type     | Default     |
| ---------- | ----------- | ------------------------------------- | -------- | ----------- |
| `fileName` | `file-name` | The file name for the downloaded file | `string` | `undefined` |
| `fileUrl`  | `file-url`  | URL of the file to download           | `string` | `undefined` |
| `text`     | `text`      | Message text                          | `string` | `undefined` |


## Dependencies

### Used by

 - [rasa-chatbot-widget](../../rasa-chatbot-widget)

### Depends on

- [rasa-text](../text)

### Graph
```mermaid
graph TD;
  rasa-file-download-message --> rasa-text
  rasa-chatbot-widget --> rasa-file-download-message
  style rasa-file-download-message fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
