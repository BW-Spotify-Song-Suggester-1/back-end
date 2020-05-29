const request = require('request') // "Request" library

const errors = require('./errors').messageDictionary
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = require("../vars")

module.exports = spotifyRefresh

function spotifyRefresh(req, res, next) {

  if (req.jwt && req.jwt.spotify_refresh) {
    const refresh_token = req.jwt.spotify_refresh

    const config = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    }

    request.post(config, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token;
        req.jwt.spotify_access = access_token
        next()
      } else {
        res.statusCode(401).send("Failed to refresh Spotify access token")
      }
    })
  } else {
    next(errors.invalidToken)
  }
}
