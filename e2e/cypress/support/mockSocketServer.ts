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
    console.log(`Received message`);
    // Mock server response
    const response = { text: 'Something went wrong, please try again.' };
    socket.emit('bot_uttered', response);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = 8081;
httpServer.listen(port, () => {
  console.log(`Mock socket.io server running on http://localhost:${port}`);
});
