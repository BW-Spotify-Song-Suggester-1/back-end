const router = require('express').Router()
const request = require('request') // "Request" library
const axios = require('axios').default

const authRefresh = require('../../middleware/spotify-refresh')
const errors = require('../../middleware/errors').messageDictionary

module.exports = router

router.get("/profile", authRefresh, async (req, res, next) => {

  if (req.jwt.spotify_access) {
    const access_token = req.jwt.spotify_access
    console.log(access_token)
    const config = {
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    }

    try {
      const result = await axios.get('https://api.spotify.com/v1/me', config)
      res.status(200).json({data: result.data})
    }
    catch(err) {
      console.log(err)
      res.status(500).json({error: "Unable to get data from Spotify", system: err})
    }
  } else {
    res.status(401).json({error: "Missing or invalid access token"})
  }

})

router.get("/saved", authRefresh, async(req, res, next) => {

  if (req.jwt.spotify_access) {
    const access_token = req.jwt.spotify_access
    console.log(access_token)
    const config = {
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    }
  
    // axios get
    try {
      // get tracks from spotify
      const result = await axios.get("https://api.spotify.com/v1/me/tracks", config)

      // return tracks to user
      res.status(200).json({data: result.data})
    }
    catch(err) {
      // console.log(err)
      res.status(500).json({error: "Error while getting or parsing spotify data", system: err})
      // next(errors.notAcceptableValue, err)
    }
  } else {
    res.status(401).json({error: "Missing or invalid access token"})
    // please connect to spotify first
  }

})
