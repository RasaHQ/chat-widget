import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('user_uttered', (message) => {
    console.log(`Received message:`, message.message);
    const userInput = message.message;
    // Mock server response
    if (userInput === 'Hello') {
      socket.emit(
        'bot_uttered',
        'Hello there, we were expecting you. Sit back and relax.'
      );
    } else {
      const response2 = { text: 'Your input is not understandable.' };
      socket.emit('bot_uttered', response2);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = 8081;
httpServer.listen(port, () => {
  console.log(`Mock socket.io server running on http://localhost:${port}`);
});
