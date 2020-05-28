const db = require("../../data/dbConfig")("knex")

module.exports = {
  getByUserId,
  addFavSong,
  removeFavSong
}

function getByUserId(id) {
  db("favorites")
    .columns({
      song_id: "song_id",
      created_at: "created_at"
    })
    .where("user_id", id)
    .select()
}

async function addFavSong(userId, songId) {
  await db("favorites")
    .insert({
      "user_id": userId,
      "song_id": songId
    })

  return db("favorites")
    .where({"user_id": userId, "song_id": songId })
    .select()
    .first()
}

function removeFavSong(userId, songId) {
  db("favorites")
  .where({"user_id": userId, "song_id": songId })
  .del()
}