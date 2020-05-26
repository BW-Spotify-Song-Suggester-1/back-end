const bcryptjs = require('bcryptjs')
const { BCRYPT_ROUNDS } = require('../vars')

module.exports = {
  makeHash,
  checkHash
}

function makeHash(data) {
  try {
    return bcryptjs.hashSync(data, 4)
  }
  catch(error) {
    console.log(error)
  }
}

function checkHash(string, hash) {
  try {
    return bcryptjs.compareSync(string, hash)
  }
  catch(error) {
    console.log(error)
  }
}

