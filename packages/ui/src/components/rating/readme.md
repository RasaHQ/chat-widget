# rasa-rating



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                                       | Type                                                | Default     |
| --------- | --------- | ----------------------------------------------------------------- | --------------------------------------------------- | ----------- |
| `options` | --        | List of rating options, each containing a value, icon, and label. | `{ value: string; icon: string; label: string; }[]` | `undefined` |
| `text`    | `text`    | Instructional text displayed above the rating options.            | `string`                                            | `undefined` |


## Events

| Event            | Description                                     | Type                              |
| ---------------- | ----------------------------------------------- | --------------------------------- |
| `ratingSelected` | Event emitted when a rating option is selected. | `CustomEvent<{ value: string; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
