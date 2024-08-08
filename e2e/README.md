# Cypress E2E test suite for Rasa Chatbot Widget

E2E test suite for Rasa Chatbot Widget based on Cypress framework. Along with functional testing, visual regression plugin for Cypress is used to validate rendering of the Widget.

## Installation

- Clone the repository
- Navigate to `e2e` directory
- Install dependencies `npm install`

## Running the tests locally Cypress runner

- Start Rasa Chatbot Widget

```bash
npm run dev
```

- Start Cypress runner

```bash
npm run cy:open
```

## Running the tests locally CLI

- Start the tests with Chrome browser

```bash
npm run cy:run
```

- Cleanup unused images

```bash
npx cypress run --browser chrome --env "pluginVisualRegressionCleanupUnusedImages=true"
```

- Update existing base images

```bash
npx cypress run --browser chrome --env "pluginVisualRegressionUpdateImages=true"
```
