# rasa-carousel



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute | Description               | Type                | Default     |
| ---------- | --------- | ------------------------- | ------------------- | ----------- |
| `elements` | --        | List of carousel elements | `CarouselElement[]` | `undefined` |


## Dependencies

### Used by

 - [rasa-chatbot-widget](../../rasa-chatbot-widget)

### Depends on

- [rasa-image-message](../image-message)
- rasa-icon-chevron-down

### Graph
```mermaid
graph TD;
  rasa-carousel --> rasa-image-message
  rasa-carousel --> rasa-icon-chevron-down
  rasa-image-message --> rasa-image
  rasa-image-message --> rasa-text
  rasa-image --> rasa-icon-default-image-fallback
  rasa-chatbot-widget --> rasa-carousel
  style rasa-carousel fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
