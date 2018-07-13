import React from 'react';
//import io from 'socket.io-client';
import Chat from './chat';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: io(),
            messages: [],
            username: "",
        };
    }

    componentDidMount() {
    // WebSockets Receiving Event Handlers
        this.state.socket.on('connect', () => {
            const username = window.prompt('Enter a username: ');
            this.setState({
                username: username,
            });
            this.state.socket.emit('username', username);
            this.state.socket.emit('room');
        });
        this.state.socket.on('errorMessage', message => {
            alert(message);
        });
    }

    render() {
        return (
        <div key = "appDiv">
          <h1>Mood Chat</h1>
          <Chat key = "chatroom" socket = {this.state.socket}
            username = {this.state.username}/>
        </div>
        );
    }
  }

export default App;
