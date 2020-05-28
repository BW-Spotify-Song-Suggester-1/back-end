const router = require('express').Router();

const authorize = require("../middleware/authorize")
const usersRouter = require('./users/users-router')
const tracksRouter = require('./tracks/tracks-router')

module.exports = router;

router.use(authorize)

router.use('/users', usersRouter);
router.use('/tracks', tracksRouter);

// ROUTER METHODS

// basic hello world response to root path showing server is running
router.get('/', (req, res) => {
  res.send('API is running');
})
