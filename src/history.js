import { createMemoryHistory, createBrowserHistory } from 'history'

const history =
  process.env.NODE_ENV === 'development'
    ? createMemoryHistory()
    : createBrowserHistory()

export default history
