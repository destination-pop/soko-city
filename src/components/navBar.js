import React from 'react'
// import logo from '../../public/sokocity.png'
import firebase from 'firebase'
import { db, storage } from '../config/firebaseConfig'
import 'firebase/storage'

storage
  .ref('sokocity.png')
  .getDownloadURL()
  .then(function(url) {
    const img = document.getElementById('logo')
    img.src = url
  })

const NavBar = props => {
  const { isLoggedIn, logout } = props

  return (
    <div>
      <nav>
        <img id="logo" />
        {isLoggedIn ? (
          <button type="button" id="navButton" onClick={logout}>
            SIGN OUT
          </button>
        ) : null}
      </nav>
    </div>
  )
}

export default NavBar
