import React from 'react';
import { Comment, Button } from 'semantic-ui-react';
import {BrowserRouter as Route, Link} from 'react-router-dom';


class AllUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state={
          users: [],
        }
    }

    componentDidMount(){
      fetch('/users')
      .then(response => response.json())
      .then(arr=>{this.setState({users:arr})})
      .catch((err) => console.log(err))
    }

    add(idOfToAdd){
      fetch('/addUser', {method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              self: this.props.location.state.user._id,
              id: idOfToAdd,
          })
      });
    }

    render(){
        return (
        <div>
          <h4>Find your family, find new friends!</h4>
          {this.state.users.map((user)=>
            <div>
              <Comment.Group>
                <Comment>
                  <Comment.Avatar src={user.imgUrl} />
                  <Comment.Content>
                    <Comment.Author>{user.name}</Comment.Author>
                  </Comment.Content>
                </Comment>
              </Comment.Group>
              <Button onClick={this.add.bind(this, user._id)}>Add Friend</Button>
            </div>
          )}
        </div>
      );
    }
  }

export default AllUsers;
