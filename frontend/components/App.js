import React from 'react';
import Chat from './chat';
import {Header, Menu, Button} from 'semantic-ui-react';
import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import Profile from './profile';
import Edit from './edit';
import AllUsers from './allUsers';
import Home from './home';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            username: "",
            activeItem: "",
            loggedin: false,
            user: {},
        };
    }

    login(email, pwd) {
        fetch('/login',
            {method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: email,
                    password: pwd,
                })
            })
          .then(resp=>resp.json())
          .then(userObj=>{console.log(userObj); this.setState({loggedin: true, user: userObj});})
          .catch(err=>{console.log(err);});
    }

    logout(){
      this.setState({
        loggedin: false,
      })
    }

    render() {
        return (
          <Router>
            <div key = "appDiv" className='wallpaper'>
              <div className = "nav">
                <Header size="huge"><Link to="/">Mood Chat</Link></Header>
                <span style={{marginBottom: '5px'}}>Welcome to Mood Chat.  Bridge the gap.  Love more.</span>
                {this.state.loggedin ?
                  <div><Button onClick={this.logout.bind(this)}>Logout</Button><Button><Link to={{pathname: '/profile', state:{user: this.state.user}}}>Profile</Link></Button></div>:
                  <div><Button><Link to="/signup">Sign Up </Link></Button><Button><Link to="/login"> Login</Link></Button></div>
                }
              </div>
               <Switch>
                <Route path="/signup" component={Signup}/>
                <Route path="/login" render={props=><Login login={this.login.bind(this)} {...props}/>}/>
                <Route path="/profile" component={Profile}/>
                <Route path="/edit" component={Edit}/>
                <Route path="/allUsers" component={AllUsers}/>
                <Route path="/chat" component = {Chat}/>
                <Route path="/" component ={Home}/>
              </Switch>
              {this.state.loggedin ? <Redirect to={{pathname: '/profile', state:{user: this.state.user}}}/> : <Redirect to="/"/>}
            </div>
          </Router>
        );
    }
  }

export default App;
