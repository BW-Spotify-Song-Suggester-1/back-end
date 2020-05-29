const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../vars')

module.exports = {
  createToken,
  verifyToken
}

function createToken(payload) {
  const options = {
    expiresIn: '5d'
  }

  return jwt.sign({
    ...payload
  }, JWT_SECRET, options)
}

function verifyToken(token, cb) {
  jwt.verify(token, JWT_SECRET, cb)
}
