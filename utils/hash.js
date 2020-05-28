const bcryptjs = require('bcryptjs')
const { BCRYPT_ROUNDS } = require('../vars')

module.exports = {
  makeHash,
  checkHash
}

async function makeHash(data) {
  try {
    const salt = await bcryptjs.genSalt(Number(BCRYPT_ROUNDS))
    return bcryptjs.hash(data, salt)
  }
  catch(error) {
    console.log(error)
  }
}

function checkHash(str, hash) {
  try {
    return bcryptjs.compare(str, hash)
  }
  catch(error) {
    console.log(error)
  }
}
