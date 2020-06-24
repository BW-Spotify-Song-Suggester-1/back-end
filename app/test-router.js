const router = require('express').Router()
const url = require('url')
const request = require('request') // "Request" library
const querystring = require('querystring')

const users = require('./users/users-model')
const generateRandomString = require('../utils/randomString')
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = require("../vars")
const errors = require('../middleware/errors').messageDictionary

module.exports = router

// const redirect_uri = 'http://localhost:5000/auth/spotify-callback'; // Your redirect uri
const redirect_endpoint_path = "/callback/"
const stateKey = 'spotify_auth_state'

router.get('/login', function(req, res) {
  const redirect_uri = urlBuilder(req, redirect_endpoint_path)

  var state = generateRandomString(16)
  res.cookie(stateKey, state)

  // your application requests authorization
  var scope = 'user-read-private user-read-email'
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
    }))
})

router.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null
  var state = req.query.state || null
  var uid = "e7296b6d-a813-40f1-83fe-681de65eb0fd"
  var storedState = req.cookies ? req.cookies[stateKey] : null

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }))
  } else {
    const redirect_uri = urlBuilder(req, redirect_endpoint_path)
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'))
      },
      json: true
    }

    request.post(authOptions, async function(error, response, body) {
      if (!error && response.statusCode === 200) {

        const access_token = body.access_token
        const refresh_token = body.refresh_token

        // persist refresh_token to user's account
        const user = await users.update(uid, { spotify_token: refresh_token })
        console.log(user)

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        }

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          res.status(200).json({appuser: user, spotify: body, acctoken: access_token, reftoken: refresh_token})
          // console.log(body);
        })

        // we can also pass the token to the browser to make requests from there
        // res.redirect('/#' +
        //   querystring.stringify({
        //     access_token: access_token,
        //     refresh_token: refresh_token
        //   }))
      } else {
        next(errors.invalidToken)
        // res.redirect('/#' +
        //   querystring.stringify({
        //     error: 'invalid_token'
        //   }))
      }
    })
  }
})

router.get("/profile", (req, res) => {

  const access_token = req.query.access_token
//  const refresh_token = body.refresh_token

  var options = {
  url: 'https://api.spotify.com/v1/me',
  headers: { 'Authorization': 'Bearer ' + access_token },
  json: true
  }

  // use the access token to access the Spotify Web API
  request.get(options, function(error, response, body) {
  // res.json(body)
  console.log(body)
  })

})

router.get('/refresh-token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  }

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      })
    }
  })
})


function urlBuilder(req, path) {
  const baseUrl = url.format({
    protocol: req.protocol,
    host: req.get("host"),
    pathname: req.baseUrl
  })
  return baseUrl + path
}
