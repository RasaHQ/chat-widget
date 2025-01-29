# rasa-rating



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                 | Type                                                          | Default     |
| --------- | --------- | ------------------------------------------- | ------------------------------------------------------------- | ----------- |
| `options` | `options` | List of rating options                      | `string \| { value: string; icon: string; label: string; }[]` | `[]`        |
| `text`    | `text`    | Instructional text for the rating component | `string`                                                      | `undefined` |


## Events

| Event            | Description                             | Type                              |
| ---------------- | --------------------------------------- | --------------------------------- |
| `ratingSelected` | Event emitted when a rating is selected | `CustomEvent<{ value: string; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
