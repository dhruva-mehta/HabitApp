import React from 'react';
import { Button, Form, Comment, Image, Grid} from 'semantic-ui-react';
import {BrowserRouter as Route, Link, Switch} from 'react-router-dom';
import Chat from './chat';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          user: this.props.location.state.user,
          requests: this.props.location.state.user.requests,
          friends: this.props.location.state.user.friends,
        };
    }

    accept(acceptedUser, self) {
      fetch('/accept',
          {method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                  self: self,
                  toAdd: acceptedUser,
              })
          })
        .then(resp=>resp.json())
        .then(userObj => {console.log(userObj);this.setState({user: userObj, requests: userObj.requests, friends:userObj.friends})})
        .catch(err=>{console.log(err);});
    }

    render(){
      console.log(this.props.location.state.user);
      return (
        <div>
          <Grid style={{marginTop:"10px"}}>
            <Grid.Column width={3}>
              <center>
              <Image src={this.state.user.imgUrl} size="small" circular />
              <p style={{marginTop:"5px"}}><strong>{this.props.location.state.user.name}</strong></p>
              <Button onClick={()=>{this.props.history.push('/edit', {user:this.state.user})}}>Edit</Button>
              </center>
            </Grid.Column>
            <Grid.Column width={4}>
              <p style={{marginTop:"10px"}}><strong>Friend Requests</strong></p>
              <ul>
                {this.state.requests.map(obj=>
                  <li>{obj.name} <Button onClick={this.accept.bind(this, obj, this.state.user)}>Accept</Button></li>
                )}
              </ul>
            </Grid.Column>
            <Grid.Column width={4}>
              <p style={{marginTop:"10px"}}><strong>Conversations</strong></p>
              <ul>
                {this.state.friends.map(obj=>
                  <li>{obj.name} <Button><Link to={{pathname: '/chat', state:{user:this.state.user, friend:obj}}}>Chat</Link></Button></li>
                )}
              </ul>
            </Grid.Column>
            <Grid.Column width={4}>
              <p style={{marginTop:"10px"}}><strong>Bored? Find new friends!</strong></p>
              <Button><Link to={{pathname: '/allUsers', state:{user:this.state.user}}}>See Users</Link></Button>
            </Grid.Column>
          </Grid>
        </div>
      )
    }
  }

export default Profile;
