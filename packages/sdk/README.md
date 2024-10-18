# `Rasa SDK Package`

The core package provides essential functionality to connect and interact with a Rasa server. It supports HTTP and Socket.io protocols, with events to handle connections, disconnections, messages, and loading chat history.

## Installation (Update after NPM publish)

Install the core package using npm:

```bash
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

## Custom Errors

### Error Severity:

- `Error`: Represents a critical error that should be treated as a failure.
- `LogError`: Represents an error that should be logged but is not critical.
- `LogWarning`: Represents a warning that should be logged but is not necessarily an error.

### Errors

The Rasa SDK can throw various custom errors during its operations. Below is a table listing all possible errors, their severity, and the conditions under which they are thrown:

| Error Message                       | Severity   | Description                                                                                                                              |
| ----------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Server error                        | Error      | Thrown on socket connection error or communication errors with the API.                                                                  |
| Network response error              | Error      | Thrown when the HTTP response is not ok.                                                                                                 |
| Can’t load new message              | Error      | Thrown when unable to parse a new message due to a missing message parser for the message type. Or unable to determine the message type. |
| Failed to save selected quick reply | LogWarning | Thrown when unable to process a quick reply.                                                                                             |
| Invalid video source                | Error      | Thrown when the video source is invalid.                                                                                                 |
| formatDateTime: Invalid time object | LogError   | Thrown when unable to format the date/time object.                                                                                       |
| Date not found                      | Error      | Thrown when the date is missing in a message.                                                                                            |
| Invalid message text                | Error      | Thrown when unable to parse the message text because it is not a string.                                                                 |
