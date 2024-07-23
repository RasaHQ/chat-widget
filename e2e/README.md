# Cypress E2E test suite for Rasa Chatbot Widget

E2E test suite for Rasa Chatbot Widget based on Cypress framework.

## Installation

- Clone the repository
- Navigate to `e2e` directory
- Install dependencies `npm install`

## Running the tests locally Cypress runner

- Start the websocket mocking server before starting the Rasa Chatbot Widget

```bash
npm run cy:socketMock
```

- Start Rasa Chatbot Widget

```bash
npm run dev
```

- Start Cypress runner

```bash
npm run cy:open
```

## Running the tests locally CLI

- Start the websocket mocking server before starting the Rasa Chatbot Widget

```bash
npm run cy:socketMock
```

- Start the tests

```bash
npx cypress run
```
