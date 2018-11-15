import React, { Component, Fragment } from 'react'
import { addResponseMessage, Widget } from 'react-chat-widget'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import 'react-chat-widget/lib/styles.css'

let stompClient

class App extends Component {

  constructor() {
    super()
    this.state = {
      username: ''
    }
  }

  componentDidMount = () => {
    const socket = new SockJS('http://172.20.0.90:8080/chat')
    stompClient = Stomp.over(socket)
    stompClient.connect({}, () =>
      stompClient.subscribe('/topic/chat', ({body}) => this.receiveMessage(JSON.parse(body)))
    )
  }

  receiveMessage = ({from, content}) => {
    if (from !== this.state.username) {
      addResponseMessage(content)
    }
  }

  sendMessage = content => {
    const message = {
      from: this.state.username,
      content
    }
    stompClient.send('/chat', {}, JSON.stringify(message))
  }

  render() {
    return (
      <Fragment>
        <span>Username</span>
        <input name='username' onChange={({target}) => this.setState({username: target.value})}/>
        <Widget
          title='Chat demo'
          subtitle='This is a chat demo'
          handleNewUserMessage={this.sendMessage}
        />
      </Fragment>
    )
  }
}

export default App
