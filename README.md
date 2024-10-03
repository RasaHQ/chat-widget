# Rasa Chatbot Widget

This project is a Rasa chatbot widget designed to be easily embeddable into any web applications. It leverages Lerna for managing multiple packages within a single repository. The widget utilizes StencilJS for building efficient and reusable web components.

## Requirements

- Node version v20.11.1
- npm version 10.2.4

A .nvmrc file is provided for easily switching to the correct Node.js version using nvm.

## Installation

- Clone the repository
- Install dependencies `npm install`
- Start development server `npm run dev`

## Scripts

### dev

Concurrently runs the development servers for all packages managed by Lerna.

```bash
npm run dev
```

### storybook

Builds the packages in watch mode and starts Storybook, which serves as full documentation and allows for interactive component development.

```bash
npm run storybook
```

### test

Runs tests across all packages.

```bash
npm run test
```

### build

Builds all packages sequentially to ensure dependencies are built in the correct order.

```bash
npm run build
```

## How to Use the Chat Widget in a React Application

This guide will show you how to integrate the Rasa chatbot widget into your React application using the `@rasahq/chat-widget-react` package.

### Step 1: Install the Package

First, you need to install the chat widget package via NPM. Run the following command in your project directory:

```bash
npm install @rasahq/chat-widget-react
```

### Step 2: Import the Chat Widget

In your React component, import the RasaChatbotWidget from the installed package:

```javascript
import { RasaChatbotWidget } from "@rasahq/chat-widget-react";
```

### Step 3: Use the Chat Widget

In your React component, add the RasaChatbotWidget component to your JSX. Pass the serverUrl prop to specify the URL of your Rasa server. You can also handle events like onChatWidgetOpened:

```javascript
function App() {
  return (
    <div>
      <RasaChatbotWidget
        serverUrl="https://example.com"
        onChatWidgetOpened={console.log}
      />
    </div>
  );
}

export default App;
```

### Notes:

- **Installing via NPM:** The package `@rasahq/chat-widget-react` should be installed in your project via NPM. This package provides the RasaChatbotWidget component, making it easy to integrate the chatbot into your React application.
- **Handling Events:** You can handle various events such as `onChatWidgetOpened`, `onMessageSent`, etc., by passing the corresponding callback functions as props to the RasaChatbotWidget component.
- React example you can find [here](examples/react/src/App.tsx)
- For a complete list of available events and props, refer to the [documentation](packages/ui/src/rasa-chatbot-widget/readme.md)

## How to Use a Script Tag to Enable the Chat Widget

This guide will show you how to integrate the Rasa chatbot widget into your webpage using a script tag.

### Step 1: Add the Script Tag

In the <head> section of your HTML file, include the script tag to load the chat widget module. This script fetches the necessary JavaScript from a CDN.

```html
<script
  type="module"
  src="https://unpkg.com/@rasahq/chat-widget-ui/dist/rasa-chatwigdet/rasa-chatwigdet.esm.js"
></script>
```

### Step 2: Include the CSS

Also, include the CSS file to ensure the widget is styled correctly.

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@rasahq/chat-widget-ui/dist/rasa-chatwigdet/rasa-chatwigdet.css"
/>
```

### Step 3: Insert the Chat Widget

In the <body> section of your HTML, add the chat widget’s custom element. Make sure to set the server-url attribute to the appropriate URL of your Rasa server.

```html
<rasa-chatbot-widget server-url="https://example.com"></rasa-chatbot-widget>
```

### Complete Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HTML Example</title>
    <script
      type="module"
      src="https://unpkg.com/@rasahq/chat-widget-ui/dist/rasa-chatwigdet/rasa-chatwigdet.esm.js"
    ></script>
    <link
      rel="stylesheet"
      href="https://unpkg.com/@rasahq/chat-widget-ui/dist/rasa-chatwigdet/rasa-chatwigdet.css"
    />
  </head>
  <body>
    <rasa-chatbot-widget server-url="https://example.com"></rasa-chatbot-widget>
  </body>
</html>
```

### Notes:

- **Running a Local Server:** If you’re using the `<script type="module">` tag, you can’t simply double-click the HTML file to open it in your browser. This is because modern browsers enforce strict security policies when loading ES modules, preventing them from being executed if the file is accessed via the file:// protocol. Instead, you’ll need to serve your HTML file through a local server (e.g., using tools like http-server, live-server, or running a simple Python HTTP server with python -m http.server).
  - **Why This Happens:** When loading JavaScript modules, browsers apply stricter security rules to prevent potential vulnerabilities. The file:// protocol does not allow cross-origin imports, which are often needed when working with modules. Running a local server provides the http:// or https:// protocol, which supports proper module loading and allows the browser to manage dependencies correctly.
- Replace https://example.com with your actual Rasa server URL.
- Ensure the script and link tags are correctly placed in the <head> section for optimal loading.
- Example you can find [here](examples/html/index.html)
- For a complete list of available events and props, refer to the [documentation](packages/ui/src/rasa-chatbot-widget/readme.md)

This is all you need to add the Rasa chatbot widget to your webpage!

## GIT Convention

### Commit Message Format

We follow the Conventional Commits specification for our GIT commit messages. Each commit message consists of a header, body, and footer, structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

- **Type:** Specifies the kind of change being made, such as feat, fix, docs, style, refactor, test, chore, etc.
- **Scope:** Optional, describes the scope of the commit, e.g., component name, module affected.
- **Description:** A brief summary in the present tense, describing the change.

#### Examples

- **Feature:** `feat(image): add image component`
- **Bug Fix:** `fix(validation): handle empty inputs`
- **Documentation:** `docs(readme): update installation instructions`
- **Style:** `style(button): adjust padding for consistency`
- **Refactor:** `refactor(sdk): optimize database queries`
- **Test:** `test(image): add integration tests for image component`
- **Chore:** `chore(build): update dependencies`

#### Notes

- Always use imperative, present tense verbs (“add”, “fix”, “update”) rather than past tense (“added”, “fixed”, “updated”).
- Use the body to provide more details if the description alone is not enough to explain the changes.
- Use the footer for references to issues or breaking changes.

This convention helps maintain a clear and standardized format for our commit messages, aiding in changelog generation and automated release notes.

## Publishing Packages with Lerna

Lerna simplifies the process of publishing multiple packages within a monorepo. Below are the steps to publish packages using Lerna.

### Prerequisites

Before publishing, ensure that:

- You have logged into the npm registry using npm login.
- Your packages have the correct version numbers, or you have set up versioning with Lerna.

### Step-by-Step Publishing Guide

### 1.Run tests and build your packages:

Ensure that all your packages are tested and built before publishing:

```bash
npm run test
npm run build
```

### 2. Bump the version numbers (optional):

If you want to automatically bump version numbers based on your commits, you can use:

```bash
npx lerna version
```

Lerna will prompt you to select the new version numbers for your packages.

### 3. Publish your packages to the registry:

To publish all updated packages, use:

```bash
npx lerna publish
```

Lerna will:

- Increment the versions of your packages.
- Publish the packages to the npm registry.
- Create git tags for the versions.

### Troubleshooting

If you encounter any issues during publishing, make sure to:

- Verify your npm registry authentication.
- Check your package.json files for correct configuration.

For more detailed information on Lerna, visit the official documentation:

- [Lerna Website](https://lerna.js.org/)
- [Publishing with Lerna](https://lerna.js.org/docs/features/version-and-publish)
