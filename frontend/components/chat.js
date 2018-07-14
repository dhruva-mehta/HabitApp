import React from 'react';
import { Button, Form, Comment} from 'semantic-ui-react';
import Autosuggest from 'react-autosuggest'

let suggestions = [];

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            messages: [],
            typing: [],
            suggestions: [],
            // username: this.props.location.state.username,
        };
        // this.onGifClick = this.onGifClick.bind(this)
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
      .filter(section => section.suggestions.length>0);
    }

    getSuggestionValue(suggestion) {
      return suggestion.name;
    }

    renderSuggestion(suggestion) {
      return (
        <img style={{height: 50, width: 50}} src={suggestion.source} />
      );
    }

    onSuggestionSelected(event, {suggestion}) {
      this.props.socket.emit('gif', suggestion.source)
      gifs = []
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
        // this.state.socket.on('connect', () => {
        //     this.state.socket.emit('username', username);
        //     this.state.socket.emit('room');
        // });
        // this.state.socket.on('errorMessage', message => {
        //     alert(message);
        // });

        this.props.socket.on('typing', (username)=>{
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

        this.props.socket.on('gifCall', (data) => {
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

        this.props.socket.on('stopTyping', (username) => {
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

        this.props.socket.on('message', message => {
            let tempMessageArr = this.state.messages.slice();
            tempMessageArr.push({name: message.username, time: new Date(), body: message.content, image: message.image});
            this.setState({
                messages: tempMessageArr,
            })
        })
    }

    handleMessageChange(e){
        const msg = e.target.value ? e.target.value : e.target.textContent ;

        if (msg.length > 0){
            this.props.socket.emit('typing', this.props.username);
        }

      this.setState({
          message: msg,
      })
    }

    emit(){
      let tempMessageArr = this.state.messages.slice();
      tempMessageArr.push({name: this.props.username, body: this.state.message, time: new Date()});
      this.setState({
        messages: tempMessageArr,
      }, () => {
        var comp = ['System', 'Moodbot', 'Giphy']
        var filtered = this.state.messages.filter(mess => {
          return comp.indexOf(mess.name) === -1;
        })
        if (filtered.length % 5 === 0 && filtered.length > 0) {
          this.props.socket.emit('messageArray', filtered);
        }
      })
      this.props.socket.emit('stopTyping', this.props.username);
      this.props.socket.emit('message', this.state.message);
      // if (this.state.messages.length % 5 === 0 && this.state.messages.length > 0) {
      //   this.props.socket.emit('messageArray', this.state.messages);
      // }
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

    render(){
      const { message,suggestions } = this.state;
      const inputProps= {
        value: this.state.message,
        onChange:(e)=>this.handleMessageChange(e)
      }
      return (
        <div>
          <div className = "messageContainer">
            {this.state.messages.map((message, i)=>
              <div>
                <Comment.Group>
                  <Comment>
                    <Comment.Avatar src=""/>
                    <Comment.Content>
                      <Comment.Author>{message.name}</Comment.Author>
                      <Comment.Text>{message.body}</Comment.Text>
                      {message.image ? <img style={{width:100, height: 100}}src={message.image} /> : null}
                    </Comment.Content>
                  </Comment>
                </Comment.Group>
              </div>
            )}
          </div>

          <div>
            {this.state.typing.map((user, i)=>
              <p key={i}>{user} is typing...</p>)}
          </div>

          <Form className="textBar" onSubmit= {(e)=> this.handleSubmit(e)}>
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
        </div>
      )
    }
  }

export default Chat;
