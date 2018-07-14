import React from 'react';
import { Button, Form, Comment} from 'semantic-ui-react';
import {Redirect} from 'react-router';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          email: "",
          pwd: "",
          loggedin: false,
        };
    }

    login(){
      fetch('/login',
          {method:'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                  username: this.state.email,
                  password: this.state.pwd,
              })
          }).catch(err=>{console.log(err);})
      this.setState({loggedin: true});
    }

    render(){
      return (
        <div>
          <Form>
            <Form.Field required>
              <label>Email</label>
              <input value={this.state.email} onChange={(e)=>{this.setState({email: e.target.value})}} />
            </Form.Field>
            <Form.Field required>
              <label>Password</label>
              <input placeholder='Password' type="password" value={this.state.pwd} onChange={(e)=>{this.setState({pwd: e.target.value})}}/>
            </Form.Field>
            <Button type='submit' onClick={this.login.bind(this)}>Start Chatting</Button>
          </Form>

          {this.state.loggedin ? <Redirect to={{pathname: '/chat', state:{username: this.state.email}}}/> : null}
        </div>
      )
    }
  }

export default Login;
