const router = require('express').Router()

const users = require("../../data/user-model")
const createToken = require("../../utils/createJwt")

module.exports = router

const messages = require('../../middleware/messages').messageDictionary
const log = console.log

router.post("/register", (req, res, next) => {
  const user = req.body
  // validate
  if (user && user.username && user.password) {
    // has the password and asign back to user
    users.insert(user).then(result => {
      // create the jwt and return it
      const token = createToken(result)
      res.set('authorization', token)

      res.status(200).json({message: "Success", data: result, token: token})
    })
    .catch(err => {
      next({...messages.dbCreateError, extra: err})
    })
  } else {
    next(messages.incompleteData)
  }
  
})

router.post("/login", (req, res, next) => {
  const user = req.body
  // abstract validate method -- use schema validation (hapi/joi?)
  if (user && user.username && user.password) {
    users.loginUser(user.username, user.password).then(result => {
      if (result) {
        console.log("verifiedUser", result)
        const token = createToken(result)
        res.set("authorization", token)

        res.status(200).json({message: "Logged in successfully!", data: result, token: token})
      } else {
        next(messages.invalidCredentials)
      }
    })
    .catch(err => {
      next({...messages.dbRetrieveError, extra: err})
    })
  } else {
    next(messages.incompleteData)
  }
})

router.get("/", (req, res, next) => {
  next(messages.notImplemented)
})

