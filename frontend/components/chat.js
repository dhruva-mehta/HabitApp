import React from 'react';
import { Button, Form, Comment, Header} from 'semantic-ui-react';
import Autosuggest from 'react-autosuggest'
var oneLinerJoke = require('one-liner-joke');

let suggestions = [];

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: io(),
            message: '',
            messages: [],
            typing: [],
            suggestions: [],
            username: this.props.location.state.user.name,
            user: this.props.location.state.user,
            friend: this.props.location.state.friend
        };
    }

    escapeRegexCharacters(str) {
        return str.replace(/[*+?^${}()|[\]\\]/g, '\\$&');
    }

    getSuggestions(value) {
        const escapedValue = this.escapeRegexCharacters(value.trim());

        if (escapedValue === '') {
            return [];
        }
        const regex = new RegExp('^' + escapedValue, 'i');

        return suggestions
          .map(section => {
              return {
                  title: section.title,
                  suggestions: section.suggestions.filter(suggestion => regex.test(suggestion.name))
              };
          })
          .filter(section => section.suggestions.length > 0);
    }

    getSuggestionValue(suggestion) {
      return suggestion.name;
    }

    renderSuggestion(suggestion) {
      return (
        <img style={{height: 100, width: 100}} src={suggestion.source} />
      );
    }

    onSuggestionSelected(event, {suggestion}) {
      this.state.socket.emit('gif', suggestion.source)
      suggestions = []
      this.setState({message: ''})
    }

    onSuggestionsFetchRequested({ value }){
      this.setState({
        suggestions: this.getSuggestions(value)
      });
    };

    onSuggestionsClearRequested(){
      this.setState({
        suggestions: []
      });
    };

    renderSectionTitle(section){
      return (
        <strong>{section.title}</strong>
      );
    }

    getSectionSuggestions(section) {
      return section.suggestions;
    }

    componentDidMount() {
        this.state.socket.on('connect', () => {
            this.state.socket.emit('username', this.state.username);
            this.state.socket.emit('room');
        });
        this.state.socket.on('errorMessage', message => {
            alert(message);
        });

        this.state.socket.on('typing', (username)=>{
            let tempArr = this.state.typing.slice();
            let typingBool = false;
            for (var ind in tempArr){
                if (tempArr[ind] === username){
                    typingBool = true;
                }
            }
            if (!typingBool) {
                tempArr.push(username);
            }
            this.setState({
                typing:tempArr,
            });
        });

        this.state.socket.on('gifCall', (data) => {
          let gifs = []
          data.forEach(gif => {
            gifs.push({
                "source": 'https://media.giphy.com/media/' + gif.id + '/200w_d.gif',
                "name": gif.search
            })
          })
          suggestions.push({'title': 'Gifs', 'suggestions': gifs})
          this.setState({message: data[0].search})
        })

        this.state.socket.on('stopTyping', (username) => {
            let tempArr = this.state.typing.slice();
            for(var ind in tempArr) {
              if (tempArr[ind] === username) {
                  tempArr.splice(ind, 1);
              }
            }
            this.setState({
                typing: tempArr,
            })
        })

        this.state.socket.on('message', message => {
            let tempMessageArr = this.state.messages.slice();
            tempMessageArr.push({name: message.username, avatar: message.avatar, time: new Date(), image: message.image, body: message.content, method: message.method});
            this.setState({
                messages: tempMessageArr,
            }, ()=>{this.scrollToBottom()})
        })
    }

    handleMessageChange(e){
        const msg = e.target.value ? e.target.value : e.target.textContent ;

        if (msg.length > 0){
          this.state.socket.emit('typing', this.state.username);
        }

      this.setState({
          message: msg,
      })
    }

    emit(){
      if (this.state.message === 'joke.') {
        this.setState({message: 'Random Joke: ' + oneLinerJoke.getRandomJoke().body}, () => {
          this.joke()
        })
      } else if (this.state.message === 'lol.' || this.state.message === 'LOL'){
        this.setState({message: "That's so funny!"}, () => {
          this.joke()
          this.state.socket.emit('change', this.state.message)
        })
      } else if (this.state.message === 'lmao.'){
        this.setState({message: "That's hilarious!"}, () => {
          this.joke()
          this.state.socket.emit('change', this.state.message)
        })
      } else if (this.state.message === 'lmfao.'){
        this.setState({message: "I'm laughing so hard right now!"}, () => {
          this.joke()
          this.state.socket.emit('change', this.state.message)
        })
      } else if (this.state.message === 'wtf.'){
        this.setState({message: "What in tarnation!"}, () => {
          this.joke()
          this.state.socket.emit('change', this.state.message)
        })
      } else if (this.state.message === 'holy shit.'){
        this.setState({message: "Gee willikers!"}, () => {
          this.joke()
          this.state.socket.emit('change', this.state.message)
        })
      } else if (this.state.message === 'That is so funny!'){
        this.setState({message: "lol!"}, () => {
          this.joke()
          this.state.socket.emit('change', this.state.message)
        })
      } else {
        this.joke()
      }
    }

    joke(){
      let tempMessageArr = this.state.messages.slice();
      tempMessageArr.push({name: this.state.username, body: this.state.message, time: new Date(), method: 'person'});
      this.setState({
        messages: tempMessageArr,
      }, () => {
        var filtered = this.state.messages.filter(mess => {
          return mess.method === 'person';
        })
        if (filtered.length % 5 === 0 && filtered.length > 0) {
          this.state.socket.emit('messageArray', filtered);
        }
          this.scrollToBottom();
      })
      this.state.socket.emit('stopTyping', this.state.username);
      this.state.socket.emit('message', this.state.message, this.state.user);
      this.setState({
        message: "",
      })
    }

    handleSubmit(e){
      e.preventDefault();
      let mess = this.state.message
      var punct = ['.', ',', '!', '?']
      if (punct.indexOf(mess[mess.length - 1]) === -1) {
        this.setState({
          message: mess + '.'
        }, () => this.emit())
      } else {
        this.emit()
      }
    }

    scrollToBottom() {
      this.el.scrollIntoView({ behavior: 'smooth' });
    }

    render(){
      const { message,suggestions } = this.state;
      const inputProps= {
        value: this.state.message,
        onChange:(e)=>this.handleMessageChange(e),
      }
      return (
        <div className='both'>
          <Form className="textBar" onSubmit= {(e)=> this.handleSubmit(e)}>
            <Header>Conversation with {this.state.friend.name}</Header>
            <Form.Group>
              <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected={this.onSuggestionSelected.bind(this)}
          renderSectionTitle={this.renderSectionTitle.bind(this)}
          getSectionSuggestions={this.getSectionSuggestions.bind(this)}
          multiSection={true}
          inputProps={inputProps} />
              <Form.Button type="submit" width={4}>Send</Form.Button>
            </Form.Group>
          </Form>
          <div className = "messageContainer">
            {this.state.messages.map((message, i)=>
              {
                if (this.state.username === message.name)
                {return (<div className='message' ref={el => { this.el = el; }}>
                  <Comment.Group>
                    <Comment>
                      <Comment.Avatar src={this.state.user.imgUrl}/>
                      <Comment.Content>
                        <Comment.Author>{message.name}</Comment.Author>
                        <Comment.Metadata>
                          {message.time.toTimeString()}
                        </Comment.Metadata>
                        <Comment.Text>{message.body}</Comment.Text>
                        {message.image ? <img style={{width:150, height: 150}}src={message.image} /> : null}
                      </Comment.Content>
                    </Comment>
                  </Comment.Group>
                </div>)}
                else if(message.name==='MoodBot'){
                  return (<div className='message2' ref={el => { this.el = el; }}>
                    <Comment.Group>
                      <Comment>
                        <Comment.Avatar src="https://lunastitches.com/132-large_default/cute-green-tractor-applique-embroidery-design.jpg"/>
                        <Comment.Content>
                          <Comment.Author>{message.name}</Comment.Author>
                          <Comment.Metadata>
                            {message.time.toTimeString()}
                          </Comment.Metadata>
                          <Comment.Text>{message.body}</Comment.Text>
                          {message.image ? <img style={{width:150, height: 150}}src={message.image} /> : null}
                        </Comment.Content>
                      </Comment>
                    </Comment.Group>
                  </div>);
                }
                else{
                  return (<div className='message3' ref={el => { this.el = el; }}>
                    <Comment.Group>
                      <Comment>
                        <Comment.Avatar className='avatar' src={message.avatar}/>
                        <Comment.Content>
                          <Comment.Author>{message.name}</Comment.Author>
                          <Comment.Metadata>
                            {message.time.toTimeString()}
                          </Comment.Metadata>
                          <Comment.Text>{message.body}</Comment.Text>
                          {message.image ? <img style={{width:150, height: 150}}src={message.image} /> : null}
                        </Comment.Content>
                      </Comment>
                    </Comment.Group>
                  </div>);
                }
              }
            )}
            <div>
              {this.state.typing.map((user, i)=>
                <p key={i}>{user} is typing...</p>)}
            </div>
          </div>
        </div>
      )
    }
  }

export default Chat;
