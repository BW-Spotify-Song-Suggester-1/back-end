const router = require('express').Router()
const url = require('url')
const request = require('request') // "Request" library
const querystring = require('querystring')
const axios = require('axios').default

const users = require('../users/users-model')
const favorites = require('../tracks/favorites-model')
const errors = require('../../middleware/errors').messageDictionary
const { createToken } = require("../../utils/jwt")
const generateRandomString = require('../../utils/randomString')
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = require("../../vars")

module.exports = router

// const redirect_uri = 'http://localhost:5000/auth/spotify-callback'; // Your redirect uri
const redirect_endpoint_path = "/callback/"
const stateKey = 'spotify_auth_state'

// Spotify access scopes
// const scopes = []
const scope_user = `user-read-private user-read-email`
const scope_fol = `user-follow-read user-follow-modify`
const scope_hist = `usr-read-recently-played user-top-read user-read-playback-position`
const scope_lib = `user-library-read user-library-modify`
const scope_conn = `user-read-playback-state user-read-currently-playing user-modify-playback-state`
const scope_playlist = `playlist-read-collaborative playlist-modify-private playlist-modify-public playlist-read-private`
const scope_playback = `streaming app-remote-control`
const scope_img = `ugc-image-upload`


router.get('/connect2', function(req, res) {
  const redirect_uri = urlBuilder(req, redirect_endpoint_path)

  const scopes = scope_user;
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + SPOTIFY_CLIENT_ID +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri)
  )
})

router.get('/connect', function(req, res) {
  const redirect_uri = urlBuilder(req, redirect_endpoint_path)

  const state = generateRandomString(16)
  res.cookie(stateKey, state)

  // your application requests authorization

  // generate URL to return to client
  const scope = scope_playlist + ' ' + scope_user + ' ' + scope_lib + ' ' + scope_fol
  const redirUrl = 'https://accounts.spotify.com/authorize?' +
  querystring.stringify({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state,
    origin: '' // append the request's origin URL so that we can return to it after everything is done!!!
  })

  res.redirect(redirUrl)
  // res.status(200).json({ data: redirUrl })
})

router.get('/token', async (req, res, next) => {

  const access_token = body.access_token
  const refresh_token = body.refresh_token

  users.getById(rq.jwt.sub)
    .then(result => {

    })
  
  // requesting access token from refresh token
  // var refresh_token = req.query.refresh_token
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


  // persist refresh_token to user's account
  await users.update(req.jwt.sub, { spotify_token: refresh_token })

  const payload = { 
    sub: req.jwt.sub,
    username: req.jwt.username,
    spotify_refresh: refresh_token,
  }
  const token = createToken(payload)

  const config = {
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  }


}) 

router.get('/callback', function(req, res, next) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null
  var state = req.query.state || null
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
        await users.update(req.jwt.sub, { spotify_token: refresh_token })

        const payload = { 
          sub: req.jwt.sub,
          username: req.jwt.username,
          spotify_refresh: refresh_token,
        }
        const token = createToken(payload)

        const config = {
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        }
    
        res.redirect(req.query['origin'])

        // var options = {
        //   url: 'https://api.spotify.com/v1/me',
        //   headers: { 'Authorization': 'Bearer ' + access_token },
        //   json: true
        // }

        // use the access token to access the Spotify Web API
        // request.get(options, function(error, response, body) {
        //   res.status(200).json({profile: body, token: token})
        //   console.log(body);
        // })

        // we can also pass the token to the browser to make requests from there
        // res.redirect('/#' +
        //   querystring.stringify({
        //     access_token: access_token,
        //     refresh_token: refresh_token
        //   }))
      } else {
        next(errors.invalidToken)
      }
    })
  }
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


router.get('/fake', async function(req, res, next) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  if (req.jwt) {
    // const access_token = body.access_token
    const refresh_token = SPOTIFY_REFRESH_TOKEN
  
    // persist refresh_token to user's account
    try {
      await users.update(req.jwt.sub, { spotify_token: refresh_token })
  
      const payload = { 
        sub: req.jwt.sub,
        username: req.jwt.username,
        spotify_refresh: refresh_token,
      }
      const token = createToken(payload)
    
      res.status(200).json({data: "token obtained", token: token})
  
    }
    catch {
      next(errors.dbUpdateError)
    }
  }
  else {
    next(errors.invalidToken)
  }
})
