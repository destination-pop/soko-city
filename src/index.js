import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app'
import history from './history'
import { Router } from 'react-router-dom'

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,

  document.getElementById('app')
)
