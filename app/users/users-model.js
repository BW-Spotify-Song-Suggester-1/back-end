const db = require('../../data/dbConfig')("knex")
const { makeHash, checkHash } = require("../../utils/hash")
const { v4: uuidv4 } = require("uuid")

module.exports = {
  register,
  login,
  update,
  remove,

  getById,
  getByUsername,
  getByEmail,

}

const log = console.log

async function login(id, password, idtype = "username") {
  const whereSelector = {}
  whereSelector[idtype] = id

  const found = await db("users")
    .columns({id: "id", password: "password"})
    .where(whereSelector)
    .select()
    .first()

  if (found && await checkHash(password, found.password)) {
    return getById(found.id)
  } else {
    return null
  }
}

async function register(data) {
  data.id = uuidv4()
  data.password = await makeHash(data.password)
  // log(data)
  await db('users').insert(data)
  // log('ins1', result)
  const result = await getByUsername(data.username)
  if (!result) {
    throw 'new user not found';
  }
  return result
}

function getById(id) {
  return db("users")
    .columns({
      id:       "id",
      username: "username",
      email: "email",
      spotify_token: "spotify_token",
      created_at: "created_at",
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
      email: "email",
      created_at: "created_at",
      // password: 'password'
    })
    .where("username", username)
    .select()
    .first()
}

function getByEmail(email) {
  return db("users")
    .columns({
      id:       "id",
      username: "username",
      email: "email",
      created_at: "created_at",
      // password: 'password'
    })
    .where("email", email)
    .select()
    .first()
}

async function loginUser(username, password) {
  const foundUser = await db("users")
    .columns({
      id:       "id",
      username: "username",
      password: "password",
      email: "email",
      created_at: "created_at",
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

async function update(id, data) {
  const changes = {
    ...data
  }
  delete changes.id
  delete changes.created_at
  if (changes.password) {
    changes.password = makeHash(changes.password)
  }
  console.log("user-update: ", changes)

  const result = await db("users")
    .update(changes)
    .where("id", id)

  // potentially check if data was updated
  return getById(id)
}

function remove(id) {
  return db("users")
    .where("id", id)
    .del()
}