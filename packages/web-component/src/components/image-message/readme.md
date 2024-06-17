# rasa-image-message



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description            | Type     | Default     |
| ---------- | ----------- | ---------------------- | -------- | ----------- |
| `imageAlt` | `image-alt` | Alt text for the image | `string` | `''`        |
| `imageSrc` | `image-src` | Image source           | `string` | `undefined` |
| `text`     | `text`      | Message text           | `string` | `undefined` |


## Dependencies

### Depends on

- [rasa-image](../image)
- [rasa-text](../text)

### Graph
```mermaid
graph TD;
  rasa-image-message --> rasa-image
  rasa-image-message --> rasa-text
  rasa-image --> rasa-icon-default-image-fallback
  style rasa-image-message fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
