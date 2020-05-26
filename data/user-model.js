const db = require('./dbConfig')("knex")
const { makeHash, checkHash } = require("../utils/bcrypt")
const { v4: uuidv4 } = require("uuid")

module.exports = {
  insert,
  getById,
  getByUsername,
  loginUser,
}

const log = console.log

async function insert (data) {
  log("before-insert", data)
  try {
    data.guid = uuidv4()
  
    data.password = makeHash(data.password)

    const result = await db('users').insert(data, 'id').debug()

    if (result) {
      log("after-insert", data)
      return getById(result[0])
    }
    else {
      throw 'database ID error';
    }

  }
  catch (err) {
    log("err", {err})

  }
}

function getById(id) {
  return db("users")
    .columns({
      id:       "id",
      username: "username",
      email: "email",
      // password: "password"
    })
    .where("id", id)
    .select()
    .first()
}

function getByUsername(username) {
  return db("users")
    .columns({
      id:       "id",
      username: "username",
      email: "email"
      // password: 'password'
    })
    .where("username", username)
    .select()
    .first()
}

async function loginUser(username, password) {
  const foundUser = await db("users")
    .columns({
      id:       "id",
      username: "username",
      password: "password",
      email: "email"
    })
    .where({"username": username})
    .select()
    .first()

  if (foundUser && !checkHash(password, foundUser.password)) {
    foundUser = null
  }
  delete foundUser.password
  return foundUser
}
