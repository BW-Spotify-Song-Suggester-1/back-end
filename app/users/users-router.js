const router = require('express').Router()

const users = require('./users-model')
const errors = require('../../middleware/errors').messageDictionary

module.exports = router;

router.get("/", (req, res, next) => {
  if (req.jwt && req.jwt.sub) {
    users.getById(req.jwt.sub)
      .then(result => {
        if (result) {
          res.status(200).json({data: result})
        } else {
          next(errors.dbRetrieveError)
        }
      })
      .catch(err => {
        next(errors.dbRetrieveError, err)
      })
  } else {
    next(errors.userIdNotFound)
  }
})

router.delete("/", (req, res, next) => {
  if (req.jwt && req.jwt.sub) {
    users.remove(req.jwt.sub)
      .then(result => {
        if (result) {
          res.status(200).json({message: "Successfully DELETED your account"})
        } else {
          next(errors.dbDeleteError)
        }
      })
      .catch(err => {
        next(errors.dbDeleteError, err)
      })
  } else {
    next(errors.userIdNotFound)
  }
})

router.put("/", (req, res, next) => {
  const data = req.body
  if (req.jwt && req.jwt.sub) {
    users.update(req.jwt.sub, data)
      .then(result => {
        if (result) {
          res.status(200).json({message: "Successfully UPDATED your account", data: result})
        } else {
          next(errors.dbUpdateError)
        }
      })
      .catch(err => {
        next(errors.dbUpdateError, err)
      })
  } else {
    next(errors.userIdNotFound)
  }
})


router.get("/profile", (req, res, next) => {
  next(messages.notImplemented)
})

/*



*/