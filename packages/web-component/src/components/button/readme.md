# rasa-button



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description                                     | Type      | Default     |
| ------------ | ------------- | ----------------------------------------------- | --------- | ----------- |
| `isSelected` | `is-selected` | Is button selected as option                    | `boolean` | `false`     |
| `reply`      | `reply`       | Additional value that is passed at button click | `string`  | `undefined` |


## Events

| Event                | Description                   | Type                               |
| -------------------- | ----------------------------- | ---------------------------------- |
| `buttonClickHandler` | On button click event emitter | `CustomEvent<{ value?: string; }>` |


## Dependencies

### Used by

 - [rasa-button-group](../button-group)

### Graph
```mermaid
graph TD;
  rasa-button-group --> rasa-button
  style rasa-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
