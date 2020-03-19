const path = require('path')
const express = require('express')
const PORT = process.env.PORT || 8080
const app = express()

module.exports = app

const createApp = () => {
  app.use(express.static('public'))

  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found')
      err.status = 404
      next(err)
    } else {
      next()
    }
  })

  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '/capstone/public/index.html'))
  })

  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
}


const startListening = () => {
  const server = app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  )

}

async function bootApp() {
  await createApp()
  await startListening()
}

if (require.main === module) {
  bootApp()
} else {
  createApp()
}
