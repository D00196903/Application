const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Initialize express app
const app = express();

// Use CORS middleware
app.use(cors({
  origin: ['http://localhost:8100', 'http://localhost:8101'], // Allow both client URLs
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Create HTTP server
const server = http.createServer(app);

// Initialize socket.io with CORS options
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:8100', 'http://localhost:8101'], // Allow both client URLs
    methods: ['GET', 'POST']
  }
});

// Store connected users and their statuses
const users = {};

io.on('connection', (socket) => {
  console.log('A user connected', { socketId: socket.id });

  socket.on('login', (data) => {
    const { username, status = 'available' } = data;
    users[socket.id] = { username, status, online: true };
    console.log(`${username} has logged in`, { socketId: socket.id });
    io.emit('user-status', { username, status, online: true });
  });

  socket.on('set-status', (status) => {
    if (users[socket.id]) {
      users[socket.id].status = status;
      io.emit('user-status', { username: users[socket.id].username, status, online: true });
    }
  });

  socket.on('join-room', (data) => {
    const { username, room } = data;
    users[socket.id] = { username, room };
    socket.join(room);
    console.log(`${username} joined room ${room}`, { socketId: socket.id });
    socket.broadcast.to(room).emit('user-connected', `${username} has joined the chat`);
  });

  socket.on('message', (msg) => {
    const { text, room } = msg;
    if (text && room) {
      const username = users[socket.id]?.username || 'Anonymous';
      console.log(`Message from ${username} in room ${room}: ${text}`, { socketId: socket.id });
      io.to(room).emit('message', { username, text, room, created: new Date() });
    } else {
      console.log('Received a null or undefined message or room', { socketId: socket.id });
    }
  });

  socket.on('typing', (data) => {
    const { room, username, typing } = data;
    socket.broadcast.to(room).emit('typing', { username, typing });
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      console.log(`${user.username} disconnected`, { socketId: socket.id });
      socket.broadcast.emit('user-status', { username: user.username, online: false });
      delete users[socket.id];
    } else {
      console.log('A user disconnected without prior login or room join', { socketId: socket.id });
    }
  });
});

// Define a simple route
app.get('/', (req, res) => {
  res.send('Socket.io server is running.');
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
