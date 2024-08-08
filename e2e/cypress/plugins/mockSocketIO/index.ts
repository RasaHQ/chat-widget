import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Server, ServerOptions } from 'socket.io';
import {
  userInputs,
  botResponses,
  TUserInput,
} from '@rasa-cypress-fixtures/chatbotWidgetData';

const WEBSOCKET_PORT = 8081;
const WEBSOCKET_HOST = `http://localhost:${WEBSOCKET_PORT}`;

function startFakeWebsocketServer(options?: Partial<ServerOptions>) {
  let sessionId;

  const app = express();
  const port = WEBSOCKET_PORT;
  const server = app.listen(port, () => {
    console.log(`Fake socket.io server listening on port ${port}`);
  });

  const io = new Server(server, options);

  app.use(cors({ origin: '*' }));
  app.use(bodyParser.json());

  let messages = [];

  // Retrieve all messages that were sent by the Chat Widget.
  app.get('/__cypress/messages', (req, res) => {
    res.json(messages);
  });

  // Delete all messages from memory.
  app.delete('/__cypress/messages', (req, res) => {
    messages = [];
    res.json();
  });

  app.get('/__cypress/options', (req, res) => {
    res.json(options);
  });

  io.on('connection', (socket) => {
    // Add all incoming socket.io events to the `messages` array.
    // @ts-expect-error @ts
    const onEvent = socket.onevent;
    // @ts-expect-error @ts
    socket.onevent = function (packet) {
      const args = packet.data || [];
      onEvent.call(this, packet);
      packet.data = ['*'].concat(args);
      const name = args[0];
      if (!name.startsWith('__cypress')) {
        // @ts-expect-error @ts
        messages.push([...args]);
      }
    };

    socket.on('session_request', (...args) => {
      sessionId = args[0].session_id;
      io.emit('session_confirm', { session_id: sessionId });
    });

    socket.on('user_uttered', (...args) => {
      const message = args[0].message as TUserInput;
      const eventPayload = botResponses[message];
      io.emit('bot_uttered', {
        ...eventPayload,
        session_id: sessionId,
      });
    });
  });
}

export default startFakeWebsocketServer;
