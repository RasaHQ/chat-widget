# `Core Package`

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

## Events

The core package provides the following events:

- `connect`: Triggered when a connection is established.
- `disconnect`: Triggered when the connection is closed.
- `message`: Triggered when a message is received. It provides the message data.
- `loadHistory`: Triggered when the history is loaded. It provides the history data.

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

rasa.connect();
```
