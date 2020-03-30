import React from 'react'

const NavBar = props => {
  const { isLoggedIn, logout } = props

  return (
    <div>
      <nav>
        {isLoggedIn ? (
          <button type="button" onClick={logout}>
            Sign Out
          </button>
        ) : null}
      </nav>
      <hr />
    </div>
  )
}

export default NavBar
