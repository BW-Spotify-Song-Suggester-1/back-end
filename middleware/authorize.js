const { verifyToken } = require("../utils/jwt")

const errorMessages = require('./errors').messageDictionary

module.exports = authorize

function authorize(req, res, next) {
  const token = req.headers.authorization

  if (token) {
    verifyToken(token, (error, decodedToken) => {
      if (error) {
        next(errorMessages.invalidToken)
      } else {
        req.jwt = decodedToken
        next()
      }
    })
  } else {
    next(errorMessages.notAuthenticated)
  }
}
