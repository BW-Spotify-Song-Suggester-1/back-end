/* 
 Users
 Roles
 Sessions - automatically managed by sessions-knex
 
*/
exports.up = function (knex) {
  return knex.schema
    // ROLES
    .createTable("roles", tbl => {
      tbl.increments("id")

      tbl.string("name", 128).notNullable().unique()
      tbl.string("description", 255)

      tbl.timestamp("created_at", {useTz: true}).defaultTo(knex.fn.now())
    }) // centrally managed table; pre-seeded; default role to 1?

    // USERS
    .createTable("users", tbl => {
      // tbl.increments("id")
      tbl.string("id", 64).primary() //.notNullable().unique() // a uuid just in case

      tbl.string("username", 255).notNullable().unique().index()
      tbl.string("password", 255).notNullable()
      tbl.string("email", 255).notNullable().unique().index()
      tbl.string("spotify_token")

      tbl.integer("role_id")
        .references("roles.id")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE")

      tbl.timestamp("created_at", {useTz: true}).defaultTo(knex.fn.now())
    })

    // FAVORITES
    .createTable("favorites", tbl => {
      tbl.primary(["user_id", "song_id"])

      tbl.string("song_id", 64).notNullable()
      tbl.string("user_id", 64).notNullable()
        .references("users.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")

      tbl.timestamp("created_at", {useTz: true}).defaultTo(knex.fn.now())
    })

    // HISTORY
    .createTable("history", tbl => {
      tbl.string("id", 64).primary()

      tbl.string("song_id", 64).notNullable()
      tbl.string("user_id", 64).notNullable()
        .references("users.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")

      tbl.timestamp("created_at", {useTz: true}).defaultTo(knex.fn.now())
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("favorites")
    .dropTableIfExists("history")
    .dropTableIfExists("users")
    .dropTableIfExists("roles")
}

/* 

profile:
favorites
song history

favorites table
id
user_id
song_id
timestamp





suggestions db

*/