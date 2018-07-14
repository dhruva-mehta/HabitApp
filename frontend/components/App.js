import React from 'react';
import Chat from './chat';
import {Header, Menu} from 'semantic-ui-react';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import Profile from './profile';
import Edit from './edit';
import AllUsers from './allUsers';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            username: "",
            activeItem: "",
            loggedin: false,
        };
    }

    componentDidMount() {
        // this.state.socket.on('connect', () => {
        //     const username = window.prompt('Enter a username: ')
        //     this.setState({
        //         username: username,
        //     });
        //     this.state.socket.emit('username', username);
        //     this.state.socket.emit('room');
        // });
        // this.state.socket.on('errorMessage', message => {
        //     alert(message);
        // });
    }

    // handleItemClick(e, {name}){
    //   this.setState({activeItem: name})
    // }

    render() {
        return (
          <Router>
            <div key = "appDiv">
              <div className = "nav">
                <Header size="huge"><Link to="/">Mood Chat</Link></Header>
                {this.state.loggedin ?
                  <Link to="/logout">Logout</Link>:
                  <div><Link to="/signup">Sign Up </Link><Link to="/login">Login</Link> </div>
                }
              </div>
              <p>Welcome to Mood Chat.  Bridge the gap.  Love more.</p>
              {/* <Chat key = "chatroom" socket = {this.state.socket}
               username = {this.state.username}/> */}
               <Switch>
                <Route path="/signup" component={Signup}/>
                <Route path="/login" component={Login}/>
                <Route path="/profile" component={Profile}/>
                <Route path="/edit" component={Edit}/>
                <Route path="/allUsers" component={AllUsers}/>
                <Route path="/chat" component = {Chat}/>
              </Switch>
            </div>
          </Router>
        );
    }
  }

export default App;
