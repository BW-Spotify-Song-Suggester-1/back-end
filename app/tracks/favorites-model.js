const db = require("../../data/dbConfig")("knex")

module.exports = {
  getByUserId,
  add,
  addMany,
  remove,
}

function getByUserId(id) {
  db("favorites")
    .columns({
      track_id: "track_id",
      created_at: "created_at"
    })
    .where("user_id", id)
    .select()
}

async function add(userId, trackId) {
  await db("favorites")
    .insert({
      "user_id": userId,
      "track_id": trackId
    })

  return db("favorites")
    .where({"user_id": userId, "track_id": trackId })
    .select()
    .first()
}

function remove(userId, trackId) {
  db("favorites")
  .where({"user_id": userId, "track_id": trackId })
  .del()
}

function addMany(userId, tracks) {
  const values = tracks.map(item => ({user_id: userId, track_id: item}))
  return db("favorites")
    .insert(values)
}

