import React, { Component } from 'react'
import FirebaseAuth from './firebaseAuth'
import Game from './game'

class MainContent extends Component {
  constructor() {
    super()
    this.state = {
      isLoggedIn: true
    }
  }

  render() {
    return (
      <div align="center">
        {this.state.isLoggedIn ? null : <FirebaseAuth />}
        <div>{this.state.isLoggedIn ? <Game /> : null}</div>
        <br />
        <br />
        <button
          type="button"
          onClick={() => {
            this.setState(previous => ({
              isLoggedIn: !previous.isLoggedIn
            }))
          }}
        >
          Toggle for Testing Only
        </button>
      </div>
    )
  }
}

export default MainContent
