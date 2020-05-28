module.exports = {
  httpStart,
  httpsStart
}

const express = require('express');
const helmet = require('helmet')
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { HTTP_PORT, HTTPS_PORT } = require('../vars');
const apiRouter = require('./api-router')
const authRouter = require('./auth/auth-router')
const logger = require('../middleware/logger')
const { errorHandler } = require('../middleware/errors')

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser()); // used by spotify auth
if (require("../vars").APP_ENV === "development")
  app.use(logger)

// additional route handling
app.use('/api', apiRouter)
app.use('/auth', authRouter)

// final, catch-all middleware
app.use(errorHandler)

// basic hello world response to root path showing server is running
app.get('/', (req, res) => {
  res.send('server is running')
})

function httpStart() {
  const http = require('http')

   return http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`\n== App running on port ${HTTP_PORT} ==\n`)
  })
}

// uncomment code below and 'npm i fs' for HTTPS
function httpsStart() {
  const https = require('https')
  const fs = require('fs')

  return https.createServer({
      key: fs.readFileSync('server.key'), 
      cert: fs.readFileSync('server.cert') 
    }, app).listen(HTTPS_PORT, () => {
      console.log(`\n== [secure] App running on port ${HTTPS_PORT} ==\n`)
    })
}

