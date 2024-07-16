# `Rasa SDK Package`

The core package provides essential functionality to connect and interact with a Rasa server. It supports HTTP and Socket.io protocols, with events to handle connections, disconnections, messages, and loading chat history.

## Installation (Update after NPM publish)

Install the core package using npm:

```
npm install '@vortexwest/chat-widget-sdk'
```

## Initialization

To initialize the package, you need to provide the following parameters:

```typescript
interface Options {
  url: string;
  protocol?: 'http' | 'ws'; // Defaults to 'ws'
  initialPayload?: string;
}
```

### Example

Here’s an example of how to initialize the package:

```typescript
const rasa = new Rasa({ url: 'http://example.com' });
```

## API

### Constructor

- `url`: The URL of the server to connect to.
- `protocol`: The protocol to use (‘ws’ for WebSocket or ‘http’ for HTTP). Default is ‘ws’.
- `initialPayload`: Initial message to send after connection.
- `authenticationToken`: Token for authenticating the connection.
- `senderId`: Optional sender ID for the session.

### Methods

- `connect()`: Establishes the connection to the server.
- `disconnect()`: Disconnects from the server.
- `sendMessage({ text, reply, timestamp }, isQuickReply = false, messageKey)`: Sends a message to the bot. Optionally handles quick replies.
- `reconnection(value: boolean)`: Enables or disables reconnection logic.

### Events

The core package provides the following events:

- `connect`: Triggered when a connection is established.
- `disconnect`: Triggered when the connection is closed.
- `message`: Triggered when a message is received. It provides the message data.
- `loadHistory`: Triggered when the history is loaded. It provides the history data.
- `sessionConfirm`: Triggered when the session is confirmed. It provides session ID.

### Event Listeners

To listen to an event, you can use the on method. Here is an example:

```typescript
this.rasa.on('message', this.onNewMessage);
```

## Full Example

```typescript
import { Rasa } from '@vortexwest/chat-widget-sdk';

const rasa = new Rasa({
  url: 'http://example.com',
  initialPayload: '_/session_start',
});

// Event listeners
rasa.on('connect', () => {
  console.log('Connected to server');
});

rasa.on('disconnect', () => {
  console.log('Disconnected from server');
});

rasa.on('message', data => {
  console.log('New message received:', data);
});

rasa.on('loadHistory', data => {
  console.log('Chat history loaded:', data);
});

rasa.on('sessionConfirm', data => {
  console.log('Session is confirmed:', data);
});

rasa.connect();
```
