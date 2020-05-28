# Spotify Song Suggester API

## API URL

https://spotify-api-prod.herokuapp.com/


## API Documentation

### General principles

#### Requests
This Web API follows the REST principles:
- resources are accessed using standard HTTPS requests
- HTTP requests are made to distinct API endpoints
- use HTTP verbs (GET, POST, PUT, DELETE, etc) based on the action taken

#### HTTP Methods and their roles
- GET - Retrieves existing resources
- POST - Creates a new resource
- PUT - Updates an existing resource
- DELETE - Deletes resources

## API Endpoints
- All Data is returned in JSON format
- Requested data is returned as the "data" object
  - "data" can be a single item or an array of items, depending on what was requested
- Most responses are accompanied by a "message" object
- Errors return an "error" object
- Auth requests return a "token" object

### POST /auth/register
Required fields:
```
{
  "username": "someone",
  "password": "secret",
  "email": "someone@somewhere.net"
}
```
Returned JSON:
```
{
  "message": "Success",
  "data": {
    "id": (numeric)
    "username": (string),
    "email": (string)
  }
  "token": (string)
}
```
### POST /auth/login
Required fields:
```
{
  "username": "someone",
  "password": "secret"
}
```
Returned JSON:
sames as /register endpoint above

**ALL of the following non-auth requests require an authorization token in the header**
### PATH /api/user
GET /api/user
- get all of the currently logged-in user's profile information

PUT /api/user
- update currently logged-in user's profile settings

DELETE /api/user
- delete this user's account

### PATH /favorite
GET /api/favorite
- gets the full list of the user's favorite songs

POST /api/favorite
- add a song to your favorites

DELETE /api/favorite/:id
- delete user's favorite song with {id}






