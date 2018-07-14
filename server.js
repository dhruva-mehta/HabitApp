const path = require('path');
const express = require('express');

var app = require('./passport.js');
const routes = require('./backend/routes');

var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');

var analysis = require('./analysis')

/* EXPRESS ROUTES */

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/public/index.html'); // For React/Redux
});

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

    socket.on('typing', (username) => {
        socket.to('chat').emit('typing', username);
    });

    socket.on('stopTyping', (username) => {
        socket.to('chat').emit('stopTyping', username);
    });

    socket.on('messageArray', messages => {
        var last5 = messages.slice(-5);
        var joined = _.map(last5, (msg)=>msg.body).join(' ');
        console.log(joined)
        var doc = {documents: [{'id': '1', 'text': joined}]};
        analysis.get_sentiments(doc, (score) => {
          console.log('callback')
          if (score < 0.5) {
            console.log(score)
            io.to('chat').emit('message', {
              username: `Moodbot`,
              content: `Your recent messages have seemed negative. Why not tell a joke?`
            })
          }
        })
        analysis.get_key_phrases(doc);
    })
});



/* CONNECTION */
const PORT = process.env.PORT || 3001;
http.listen(PORT, error => {
    error
    ? console.error(error)
    : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
