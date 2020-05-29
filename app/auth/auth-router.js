const router = require('express').Router()

const users = require("../users/users-model")
const { createToken } = require("../../utils/jwt")

module.exports = router

const errorMessages = require('../../middleware/errors').messageDictionary
const log = console.log

router.post("/register", (req, res, next) => {
  const user = req.body
  // validate
  if (user && user.username && user.password) {
    // has the password and asign back to user
    users.register(user).then(result => {
      // create the jwt and return it
      // log("one", result)
      if (result) {
        const payload = {
          sub: result.id, 
          username: result.username
        }
        // log('two', payload)
        const token = createToken(payload)
        // log('three', token)
        res.set('authorization', token)
        // log('4 - set header')
  
        res.status(200).json({message: "Registered successfully", data: result, token: token})
  
      } else {
        next(errorMessages.dbCreateError)
      }
    })
    .catch(err => {
      next({...errorMessages.dbCreateError, err})
    })
  } else {
    next(errorMessages.incompleteData)
  }
  
})

router.post("/login", (req, res, next) => {
  const user = req.body
  // abstract validate method -- use schema validation (hapi/joi?)
  if (user && user.username && user.password) {
    users.login(user.username, user.password).then(result => {
      if (result) {
        const payload = {
          sub: result.id, 
          username: result.username,
          spotify_refresh: result.spotify_token,
        }
        const token = createToken(payload)
        // res.set("authorization", token)

        res.status(200).json({message: "Logged in successfully!", data: result, token: token})
      } else {
        next(errorMessages.invalidCredentials)
      }
    })
    .catch(err => {
      log("err:", err)
      next({...errorMessages.dbRetrieveError, err})
    })
  } else {
    next(errorMessages.incompleteData)
  }
})

// router.get("/", (req, res, next) => {
//   next(messages.notImplemented)
// })

