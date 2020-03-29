import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import FirebaseAuth from './firebaseAuth'
import Game from './game'

const Routes = () => {
  return (
    <Switch>
      <Route path="/" component={FirebaseAuth} />
      <Route path="/" component={Game} />
    </Switch>
  )
}

export default Routes
