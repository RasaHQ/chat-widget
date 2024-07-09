# Rasa Chatbot Widget

This project is a Rasa chatbot widget designed to be easily embeddable into any web applications. It leverages Lerna for managing multiple packages within a single repository. The widget utilizes StencilJS for building efficient and reusable web components.

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
