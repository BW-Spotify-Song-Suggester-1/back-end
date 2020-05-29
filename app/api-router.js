const router = require('express').Router()

const authorize = require("../middleware/authorize")
const usersRouter = require('./users/users-router')
const tracksRouter = require('./tracks/tracks-router')
const spotifyAuthRouter = require('./spotify/spotify-auth-router')
const spotifyRouter = require('./spotify/spotify-router')

module.exports = router

router.use(authorize)

router.use('/users', usersRouter)
router.use('/tracks', tracksRouter)
router.use('/spotify', spotifyAuthRouter)
router.use('/spotify', spotifyRouter)

// ROUTER METHODS

// basic hello world response to root path showing server is running
router.get('/', (req, res) => {
  res.send('API is running')
})
