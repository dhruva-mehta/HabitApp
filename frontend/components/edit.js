import React from 'react';
import {BrowserRouter as Route, Link} from 'react-router-dom';
import { Image, Form, Button} from 'semantic-ui-react';

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state={
          name: this.props.location.state.user.name,
          email: this.props.location.state.user.email,
          imgUrl: this.props.location.state.user.imgUrl,
          user: {},
          updated: false,
        }
    }

    edit() {
        fetch('/profile/edit',
            {method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: this.props.location.state.user._id,
                    name: this.state.name,
                    email: this.state.email,
                    imgUrl: this.state.imgUrl
                })
            })
          .then(resp=>resp.json())
          .then(userObj=>{this.setState({user: userObj, updated: true});})
          .catch(err=>{console.log(err);});
    }

    render(){
      console.log(this.props.location.state.user);
        return (
        <div>
          <Form>
            <Form.Field required>
              <label>Full Name</label>
              <input value={this.state.name} onChange={(e)=>{this.setState({name: e.target.value})}}/>
            </Form.Field>
            <Form.Field required>
              <label>Email</label>
              <input value={this.state.email} onChange={(e)=>{this.setState({email: e.target.value})}} />
            </Form.Field>
            <Image src={this.state.imgUrl} size="tiny" circular />
            <Form.Field required>
              <label>Image</label>
              <input placeholder="image url here" value={this.state.imgUrl} onChange={(e)=>{this.setState({imgUrl: e.target.value})}} />
            </Form.Field>
            <Button type='submit' onClick={this.edit.bind(this)}>Update</Button>
            <Button type='button'><Link to={{pathname: '/profile', state:{user: this.props.location.state.user}}}>Cancel</Link></Button>
          </Form>
          {this.state.updated ? this.props.history.push('/profile', {user: this.state.user}) : null}
        </div>
      );
    }
  }

export default Edit;
