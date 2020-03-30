import React, { Component } from 'react'
import NavBar from './navBar'
import Game from './game'

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase'
import * as firebaseui from 'firebaseui'

class MainContent extends Component {
  constructor() {
    super()
    this.state = {
      isLoggedIn: false
    }

    this.uiConfig = {
      signInFlow: 'popup',
      signInSuccessUrl: '/',
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccessWithAuthResult: () => false
      }
    }
    this.logout = this.logout.bind(this)
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(user => this.setState({ isLoggedIn: !!user }))
  }

  componentWillUnmount() {
    this.unregisterAuthObserver()
  }

  logout() {
    firebase.auth().signOut()
    this.setState({
      isLoggedIn: false
    })
  }

  render() {
    return (
      <div>
        <NavBar isLoggedIn={this.state.isLoggedIn} logout={this.logout} />
        {!this.state.isLoggedIn ? (
          <StyledFirebaseAuth
            uiConfig={this.uiConfig}
            firebaseAuth={firebase.auth()}
          />
        ) : (
          <Game />
        )}
      </div>
    )
  }
}

export default MainContent
