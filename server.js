const path = require('path');
const express = require('express');

var app = require('./passport.js');
const routes = require('./backend/routes');

var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');

var analysis = require('./analysis')
var API_KEY=process.env.API_KEY;
var axios=require('axios');

/* EXPRESS ROUTES */

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (request, response) => {
    response.sendFile(__dirname + '/public/index.html'); // For React/Redux
});

app.use('/api', routes);

/* SOCKETS */
io.on('connection', socket => {
    console.log('connected');
    socket.on('username', (username, userObj) => {
        if (!username || !username.trim()) {
            return socket.emit('errorMessage', 'No username!');
        }
        socket.username = String(username);
        return "";
    });

    socket.on('room', () => {
        socket.join('chat', () => {
            socket.to('chat').emit('message', {
                username: 'System',
                content: `${socket.username} has joined`
            });
        });
        return "";
    });

    socket.on('message', (message, user) => {
        socket.to('chat').emit('message', {
            username: socket.username,
            avatar: user.imgUrl,
            content: message,
            image: null
        });
        return "";
    });

    socket.on('typing', (username) => {
        socket.to('chat').emit('typing', username);
    });

    socket.on('stopTyping', (username) => {
        socket.to('chat').emit('stopTyping', username);
    });

    socket.on('gif', source => {
      io.to('chat').emit('message', {
        username: 'Giphy',
        image: source
      })
    })

    socket.on('messageArray', messages => {
        var giphyCall = (keyword) => {
          console.log('giphyCall')
          const query = keyword.replace(' ', '+');
          const queryUrl = `http://api.giphy.com/v1/gifs/search?q=${query}&api_key=${API_KEY}`;
          axios.get(queryUrl).then(response => {
            let data = []
            for (let i = 0; i < 3; i++) {
              data.push({id: response.data.data[i].id, search: keyword})
            }
            io.to('chat').emit('gifCall', data);
          });
        }
        var last5 = messages.slice(-5);
        var joined = _.map(last5, (msg)=>msg.body).join(' ');
        var doc = {documents: [{'id': '1', 'text': joined}]};
        analysis.get_sentiments(doc, (score) => {
          if (score < 0.5) {
            io.to('chat').emit('message', {
              username: `Moodbot`,
              content: `Your recent messages have seemed negative. Why not send a gif?`
            })
          }
        })
        analysis.get_key_phrases(doc, giphyCall);
    })
});

/* CONNECTION */
const PORT = process.env.PORT || 3001;
http.listen(PORT, error => {
    error
    ? console.error(error)
    : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
