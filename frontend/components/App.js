import React from 'react';
import Chat from './chat';
import {Header, Menu} from 'semantic-ui-react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import Profile from './profile';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: io(),
            messages: [],
            username: "",
            activeItem: "",
            loggedin: false,
        };
    }

    componentDidMount() {
    //WebSockets Receiving Event Handlers
        this.state.socket.on('connect', () => {
            const username = window.prompt('Enter a username: ')
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

    handleItemClick(e, {name}){
      this.setState({activeItem: name})
    }

    render() {
        const { activeItem } = this.state.activeItem
        return (
          // <Router>
          //   <div key = "appDiv">
          //     <div className = "nav">
          //       <Header size="huge">Mood Chat</Header>
          //       {this.state.loggedin ?
          //         <Link to="/logout">Logout</Link>:
          //         <div><Link to="/signup">Sign Up </Link><Link to="/login">Login</Link> </div>
          //       }
          //     </div>
          //     <p>Welcome to Mood Chat.  Bridge the gap.  Love more.</p>
              <Chat key = "chatroom" socket = {this.state.socket}
                username = {this.state.username}/>
          //     <Route path="/signup" exact component={Signup}/>
          //     <Route path="/login" exact component={Login}/>
          //     <Route path="/chat" exact component={Chat} key = "chatroom"
          //     socket = {this.state.socket} username = {this.state.username}/>
          //   </div>
          // </Router>
        );
    }
  }

export default App;
