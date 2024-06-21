# rasa-image-message



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description            | Type     | Default     |
| ---------- | ----------- | ---------------------- | -------- | ----------- |
| `height`   | `height`    | Image height           | `number` | `170`       |
| `imageAlt` | `image-alt` | Alt text for the image | `string` | `''`        |
| `imageSrc` | `image-src` | Image source           | `string` | `undefined` |
| `text`     | `text`      | Message text           | `string` | `undefined` |
| `width`    | `width`     | Image width            | `number` | `288`       |


## Dependencies

### Used by

 - [rasa-carousel](../carousel)
 - [rasa-chatbot-widget](../../rasa-chatbot-widget)

### Depends on

- [rasa-image](../image)
- [rasa-text](../text)

### Graph
```mermaid
graph TD;
  rasa-image-message --> rasa-image
  rasa-image-message --> rasa-text
  rasa-image --> rasa-icon-default-image-fallback
  rasa-carousel --> rasa-image-message
  rasa-chatbot-widget --> rasa-image-message
  style rasa-image-message fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
