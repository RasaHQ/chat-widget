# rasa-button



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description                                     | Type      | Default     |
| ------------ | ------------- | ----------------------------------------------- | --------- | ----------- |
| `isSelected` | `is-selected` | Is button selected as option                    | `boolean` | `false`     |
| `purpose`    | `purpose`     | Button click event name                         | `string`  | `undefined` |
| `value`      | `value`       | Additional value that is passed at button click | `string`  | `undefined` |


## Events

| Event                | Description                   | Type                                                |
| -------------------- | ----------------------------- | --------------------------------------------------- |
| `buttonClickHandler` | On button click event emitter | `CustomEvent<{ purpose: string; value?: string; }>` |


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
