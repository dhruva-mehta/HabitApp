const path = require('path');
const express = require('express');

const app = express();
const routes = require('./backend/routes');
const auth = require('./backend/auth');

var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');

/* EXPRESS ROUTES */

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/public/index.html'); // For React/Redux
});

app.use('/auth', auth);
app.use('/api', routes);

/* SOCKETS */
io.on('connection', socket => {
    console.log('connected');
    socket.on('username', username => {
        if (!username || !username.trim()) {
            return socket.emit('errorMessage', 'No username!');
        }
        socket.username = String(username);
        return "";
    });

    socket.on('room', () => {
        if (!socket.username) {
            return socket.emit('errorMessage', 'Username not set!');
        }
        socket.join('chat', () => {
            socket.to('chat').emit('message', {
                username: 'System',
                content: `${socket.username} has joined`
            });
        });
        return "";
    });

    socket.on('message', message => {
        socket.to('chat').emit('message', {
            username: socket.username,
            content: message
        });
        return "";
    });

    socket.on('typing', (username)=> {
        socket.to('chat').emit('typing', username);
    });

    socket.on('stopTyping', (username)=> {
        socket.to('chat').emit('stopTyping', username);
    });
});


/* CONNECTION */
const PORT = process.env.PORT || 3001;
http.listen(PORT, error => {
    error
    ? console.error(error)
    : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
