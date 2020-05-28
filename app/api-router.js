const router = require('express').Router();

const authorize = require("../middleware/authorize")
const usersRouter = require('./users/users-router')
const songsRouter = require('./songs/songs-router')

module.exports = router;

router.use(authorize)

router.use('/users', usersRouter);
router.use('/songs', songsRouter);

// ROUTER METHODS

// basic hello world response to root path showing server is running
router.get('/', (req, res) => {
  res.send('API is running');
})
