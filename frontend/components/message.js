import React from 'react'
import { Message } from 'semantic-ui-react'

const Text = (props) => (
  <Message>
    <Message.Header>{props.name}</Message.Header>
    <p>
      {props.message}
    </p>
  </Message>
)

export default Text;
