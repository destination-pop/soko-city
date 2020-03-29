import React, { Component } from 'react'

class NavBar extends Component {
  constructor() {
    super()
    this.state = {
      loggedIn: false
    }
  }
  render() {
    return (
      <div>
        <nav>I am a (currently) useless navbar. Please disregard.</nav>
        <hr />
      </div>
    )
  }
}

export default NavBar
