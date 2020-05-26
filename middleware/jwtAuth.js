const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../vars')
const messages = require('./messages').messageDictionary

module.exports = authorize

function authorize(req, res, next) {
  const token = req.headers.authorization

  if (token) {
    jwt.verify(token, JWT_SECRET, (error, decodedToken) => {
      if (error) {
        next(messages.invalidToken)
      } else {
        req.jwt = decodedToken
        next()
      }
    })
  } else {
    next(messages.notAuthenticated)
  }
}
