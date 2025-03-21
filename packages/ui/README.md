# Rasa Chat Widget

A customizable chat widget built with StencilJS. This widget can be easily integrated into any web application to provide interactive chat capabilities.

## Installation

### Using npm

To install the chat widget via npm, run the following command:

```bash
npm install @rasahq/chat-widget-ui
```

### Using CDN

Alternatively, you can use a CDN to include the chat widget in your project:

```html
<script type="module" src="https://unpkg.com/@rasahq/chat-widget-ui/dist/rasa-chatwidget/rasa-chatwidget.esm.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@rasahq/chat-widget-ui/dist/rasa-chatwidget/rasa-chatwidget.css" />
```

## Usage

Add the chatbot widget to your HTML file:

```html
<rasa-chatbot-widget server-url="https://example.com"></rasa-chatbot-widget>
```

For more detailed documentation please see storybook.

## Development

### Generating New Icons

To add new icons to the project, follow these steps:

1. **Copy SVG File**: Place your SVG file into the `src/icons` directory.

2. **Generate Icons**: Navigate to the `web-components` folder and run the following command:

   ```bash
   npm run generate:icons
   ```

   This script will automatically generate the necessary components for the new icon based on the SVG file.

3. **Access New Icon**: Once the script has executed successfully, your new icon will be available in the `src/components/icons` directory.

By following these steps, you can efficiently add new icons to the project without the need for manual editing of existing components.
