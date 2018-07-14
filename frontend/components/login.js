import React from 'react';
import { Button, Form, Comment} from 'semantic-ui-react';
import {Redirect, Switch} from 'react-router';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            pwd: "",
            loggedin: false,
            loginFunc: "",
        };
    }

    componentDidMount(){
      const {login} = this.props;
      this.setState({
        loginFunc: login,
      })
    }

    submit(){
      this.state.loginFunc(this.state.email, this.state.pwd);
      this.setState({
        email: "",
        pwd:"",
        loggedin: true,
      })
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
            <Button type='submit' onClick={this.submit.bind(this)}>Start Chatting</Button>
          </Form>
          {/* {this.state.loggedin ? this.props.history.push('/profile', {user: this.state.user}) : null} */}
          {/* <Switch><Redirect push to={{pathname: '/profile', state:{user: this.state.user}}}/></Switch> */}
        </div>
      )
    }
  }

export default Login;
