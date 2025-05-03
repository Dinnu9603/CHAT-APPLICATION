const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

const users = new Map();

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('user join', (username) => {
        users.set(socket.id, username);
        io.emit('user joined', { username, users: Array.from(users.values()) });
    });

    socket.on('chat message', (msg) => {
        const username = users.get(socket.id);
        io.emit('chat message', {
            text: msg,
            userId: socket.id,
            username: username,
            timestamp: new Date().toLocaleTimeString()
        });
    });

    socket.on('disconnect', () => {
        const username = users.get(socket.id);
        users.delete(socket.id);
        io.emit('user left', { username, users: Array.from(users.values()) });
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});