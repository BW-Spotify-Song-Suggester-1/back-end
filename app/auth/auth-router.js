const router = require('express').Router()
const url = require('url')
// used by Spotify auth flow
const request = require('request'); // "Request" library
const querystring = require('querystring');
const generateRandomString = require("../../utils/randomString")

const users = require("../users/users-model")
const { createToken } = require("../../utils/jwt")

module.exports = router

const errorMessages = require('../../middleware/errors').messageDictionary
const log = console.log

router.post("/register", (req, res, next) => {
  const user = req.body
  // validate
  if (user && user.username && user.password) {
    // has the password and asign back to user
    users.register(user).then(result => {
      // create the jwt and return it
      // log("one", result)
      if (result) {
        const payload = {sub: result.id, username: result.username}
        // log('two', payload)
        const token = createToken(payload)
        // log('three', token)
        res.set('authorization', token)
        // log('4 - set header')
  
        res.status(200).json({message: "Registered successfully", data: result, token: token})
  
      } else {
        next(errorMessages.dbCreateError)
      }
    })
    .catch(err => {
      next({...errorMessages.dbCreateError, err})
    })
  } else {
    next(errorMessages.incompleteData)
  }
  
})

router.post("/login", (req, res, next) => {
  const user = req.body
  // abstract validate method -- use schema validation (hapi/joi?)
  if (user && user.username && user.password) {
    users.login(user.username, user.password).then(result => {
      if (result) {
        const payload = {sub: result.id, username: result.username}
        const token = createToken(payload)
        res.set("authorization", token)

        res.status(200).json({message: "Logged in successfully!", data: result, token: token})
      } else {
        next(errorMessages.invalidCredentials)
      }
    })
    .catch(err => {
      log("err:", err)
      next({...errorMessages.dbRetrieveError, err})
    })
  } else {
    next(errorMessages.incompleteData)
  }
})

// router.get("/", (req, res, next) => {
//   next(messages.notImplemented)
// })


// *** SPOTIFY AUTH -- AUTHORIZATION CODE FLOW *** ///
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = require("../../vars")
const redirect_uri = 'http://localhost:5000/auth/spotify-callback'; // Your redirect uri
const redirect_endpoint_path = "/spotify-callback"

const stateKey = 'spotify_auth_state';

router.get('/spotify-login', function(req, res) {
  const redirect_uri = urlBuilder(req, redirect_endpoint_path)

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

router.get('/spotify-callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
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
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          // res.json(body)
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

router.get("/spotify-profile", (req, res) => {

  const access_token = req.query.access_token
  refresh_token = body.refresh_token;

  var options = {
  url: 'https://api.spotify.com/v1/me',
  headers: { 'Authorization': 'Bearer ' + access_token },
  json: true
  };

  // use the access token to access the Spotify Web API
  request.get(options, function(error, response, body) {
  // res.json(body)
  console.log(body);
  });

})

router.get('/spotify-refresh-token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});


function urlBuilder(req, path) {
  const baseUrl = url.format({
    protocol: req.protocol,
    host: req.get("host"),
    pathname: req.baseUrl
  })
  return baseUrl + path
}
