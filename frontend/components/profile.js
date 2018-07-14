import React from 'react';
import { Button, Form, Comment, Image} from 'semantic-ui-react';
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
        .then(this.setState({user: userObj, requests: userObj.requests, friends:userObj.friends}))
        .catch(err=>{console.log(err);});
    }

    render(){
      console.log(this.state.user);
      return (
        <div>
          <Image src={this.props.location.state.user.imgUrl} size="tiny" circular />
          <p>{this.props.location.state.user.name}</p>
          <Button onClick={()=>{this.props.history.push('/edit', {user:this.props.location.state.user})}}>Edit</Button>
          <p>Friend Requests</p>
          <ul>
            {this.state.requests.map(obj=>
              <li>{obj.name} <Button onClick={this.accept.bind(this, obj, this.state.user)}>Accept</Button></li>
            )}
          </ul>
          <p>Conversations</p>
          <ul>
            {this.state.friends.map(obj=>
              <li>{obj.name}<Button><Link to={{pathname: '/chat', state:{user:this.state.user}}}>Chat</Link></Button></li>
            )}
          </ul>
          <Link to={{pathname: '/allUsers', state:{user:this.props.location.state.user}}}>Find new friends</Link>
        </div>
      )
    }
  }

export default Profile;
