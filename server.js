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
                username: 'MoodBot',
                content: `${socket.username} has joined`,
                method: 'Bot'
            });
        });
        return "";
    });

    socket.on('message', (message, user) => {
        socket.to('chat').emit('message', {
            username: socket.username,
            avatar: user.imgUrl,
            content: message,
            image: null,
            method: 'person'
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
        username: socket.username,
        image: source,
        method: 'Giphy'
      })
    })

    socket.on('change', message => {
      io.to('chat').emit('message', {
        username: 'MoodBot',
        content: 'We just changed your previous message to "' + message + '" to try and help your conversation partner understand you better!',
        method: 'Bot'
      })
    } )

    socket.on('messageArray', messages => {
        var giphyCall = (keyword) => {
          if (keyword) {
            const query = keyword.replace(' ', '+');
            const queryUrl = `http://api.giphy.com/v1/gifs/search?q=${query}&api_key=${API_KEY}`;
            axios.get(queryUrl).then(response => {
              let data = []
              for (let i = 0; i < 5; i++) {
                data.push({id: response.data.data[i].id, search: keyword})
              }
              io.to('chat').emit('gifCall', data);
            });
          }
        }
        var last5 = messages.slice(-5);
        var joined = _.map(last5, (msg)=>msg.body).join(' ');
        var doc = {documents: [{'id': '1', 'text': joined}]};
        analysis.get_sentiments(doc, (score) => {
          if (score < 0.5) {
            io.to('chat').emit('message', {
              username: `MoodBot`,
              content: `Your recent conversation seems to be heading south. Why not send a gif to liven things up? If that's not your style, you can always type joke to send a random joke!`
            })
          } else {
            io.to('chat').emit('message', {
              username: `MoodBot`,
              content: `Your recent conversation seems to be going well! How about sending a gif or joke to keep the good times rolling? Here are some gifs, and if you want a random joke, just type joke and hit send!`
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
