const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Initialize Firebase Admin
admin.initializeApp();

// Configure Gmail email transport using environment variables
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store connected users
const users = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  /**
   * Event listener for logging in.
   * @param {Object} data - The data containing username.
   * @param {string} data.username - The username of the user.
   */
  socket.on('login', (data) => {
    const { username } = data;
    users[socket.id] = { username };
    console.log(`${username} has logged in`);
    socket.broadcast.emit('user-connected', `${username} has logged in`);
  });

  /**
   * Event listener for joining a room.
   * @param {Object} data - The data containing username and room.
   * @param {string} data.username - The username of the user.
   * @param {string} data.room - The room the user is joining.
   */
  socket.on('join-room', (data) => {
    const { username, room } = data;
    users[socket.id] = { username, room };
    socket.join(room);
    console.log(`${username} joined room ${room}`);
    socket.broadcast.to(room).emit('user-connected', `${username} has joined the chat`);
  });

  /**
   * Event listener for handling incoming messages.
   * @param {Object} msg - The message data.
   * @param {string} msg.text - The message text.
   * @param {string} msg.room - The room the message is sent to.
   */
  socket.on('message', (msg) => {
    const { text, room } = msg;
    if (text && room) {
      const username = users[socket.id]?.username || 'Anonymous';
      console.log(`message from ${username} in room ${room}: ${text}`);
      io.to(room).emit('message', { username, text, room, created: new Date() });
    } else {
      console.log('Received a null or undefined message or room');
    }
  });

  /**
   * Event listener for handling user disconnections.
   */
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      console.log(`${user.username} disconnected from room ${user.room}`);
      socket.broadcast.to(user.room).emit('user-disconnected', `${user.username} has left the chat`);
      delete users[socket.id];
    }
  });

  /**
   * Set user nickname.
   * @param {string} nickname - The nickname of the user.
   */
  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    console.log(`User nickname set to ${nickname}`);
  });

  /**
   * Add a new message and broadcast it to all connected clients.
   * @param {string} message - The message text.
   */
  socket.on('add-message', (message) => {
    io.emit('message', { text: message, from: socket.nickname, created: new Date() });
    console.log(`Message from ${socket.nickname}: ${message}`);
  });
});

// Define a simple route
app.get('/', (req, res) => {
  res.send('Socket.io server is running.');
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('listening on *:3000');
});

/**
 * Cloud Function to send email confirmation when a new request is created in Firestore.
 */
exports.sendEmailConfirmation = functions.firestore
  .document('requests/{requestId}')
  .onCreate(async (snap, context) => {
    const requestData = snap.data();
    const mailOptions = {
      from: 'Your App Name <noreply@yourdomain.com>',
      to: 'registered_user@example.com',
      subject: `New Request from ${requestData.fullname}`,
      text: `You have a new request from ${requestData.fullname}, Message: ${requestData.message}, Contact: ${requestData.mobile}, Office: ${requestData.office}`
    };

    try {
      await mailTransport.sendMail(mailOptions);
      console.log('New request email sent to:', mailOptions.to);
    } catch(error) {
      console.error('There was an error while sending the email:', error);
    }
  });
