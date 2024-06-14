import { createServer } from 'http';
import { Server } from 'socket.io';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

const httpServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Welcome to Planning Poker!');
});

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket: any) => {
  console.log('New connection');

  socket.on('joinRoom', (roomId: any) => {
    socket.join(roomId);
    console.log(`Joined room ${roomId}`);
  });

  socket.on('setName', (name: any) => {
    console.log(`User set name to ${name}`);
    socket.emit('users', getUsersInRoom(socket.room));
  });

  socket.on('openVoting', () => {
    console.log('Voting opened');
    socket.emit('votingOpen');
  });

  socket.on('vote', (value) => {
    console.log(`User voted ${value}`);
    socket.emit('vote', value);
  });

  socket.on('showResults', () => {
    console.log('Showing results');
    const votes = getVotesInRoom(socket.room);
    socket.emit('votingClosed', votes);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

httpServer.listen(3000, () => {
  console.log('Server listening on port 3000');
});

const getUsersInRoom = (roomId: any) => {
  return pool.query(`SELECT * FROM users WHERE room_id = $1`, [roomId])
   .then((result: any) => result.rows)
   .catch((error: any) => console.error(error));
};

const getVotesInRoom = (roomId: any) => {
  return pool.query(`SELECT * FROM votes WHERE room_id = $1`, [roomId])
   .then((result: any) => result.rows)
   .catch((error: any) => console.error(error));
};
