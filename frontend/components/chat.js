import React from 'react';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            messages: [],
            typing: []
        };
    }

    componentDidMount() {
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
            tempMessageArr.push(`${message.username}: ${message.content}`);
            this.setState({
                messages: tempMessageArr,
            })
        })
    }

    handleMessageChange(e){
      const msg = e.target.value;

      if (msg.length > 0){
        this.props.socket.emit('typing', this.props.username);
      }

      this.setState({
        message: msg,
      })
    }

    handleSubmit(e){
      e.preventDefault();
      let tempMessageArr = this.state.messages.slice();
      tempMessageArr.push(`${this.props.username}: ${this.state.message}`);
      this.setState({
        messages: tempMessageArr,
      })
      this.props.socket.emit('stopTyping', this.props.username);
      this.props.socket.emit('message', this.state.message);
      this.setState({
        message: "",
      })
    }

    render(){
      return (
        <div>
          <div>
            {this.state.messages.map((message, i)=><p key={i}>{message}</p>)}
          </div>

          <div>
            {this.state.typing.map((user, i)=><span key={i}>{user} is typing...</span>)}
          </div>

          <form onSubmit= {(e)=> this.handleSubmit(e)}>
            <input type = "text" value={this.state.message} onChange = {(e)=> this.handleMessageChange(e)}/>
            <input type = "submit" value = "Send"/>
          </form>
        </div>
      )
    }
  }

export default Chat;
