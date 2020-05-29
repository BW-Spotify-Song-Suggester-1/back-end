// const { v4: uuidv4 } = require("uuid")
const { makeHash } = require("../../utils/hash")

const adminId = '1b9f7e41-3f77-4cec-bbd9-3688952fe156'
const demoId = '406c7054-effc-4d5d-9a46-7ff5da58b3fb'

exports.seed = async function(knex, Promise) {
  // Inserts seed entries
  return knex('users').insert([
    {
      id: adminId,
      username: 'admin',
      password: await makeHash('pass'),
      email: 'admin@email.net',
      role_id: 1,
    },
    {
      id: demoId,
      username: 'demo',
      password: await makeHash('pass'),
      email: 'demo@email.net',
      role_id: 3,
    },
  ])
}
