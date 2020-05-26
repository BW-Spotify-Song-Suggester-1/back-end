const router = require('express').Router();
module.exports = router;

// ROUTER METHODS

// basic hello world response to root path showing server is running
router.get('/', (req, res) => {
  res.send('API is running');
})

// sub-routes
const usersRouter = require('./users/usersRouter')
const songsRouter = require('./songs/songsRouter')


router.use('/users', usersRouter);
router.use('/songs', songsRouter);
