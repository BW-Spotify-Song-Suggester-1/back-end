# Spotify Song Suggester API

## API URL

https://spotify-api-prod.herokuapp.com/

## API Documentation

### General principles

#### Requests
This Web API follows the REST principles:
- resources are accessed using standard HTTPS requests
- HTTP requests are made to distinct API endpoint.
- use HTTP verbs (GET, POST, PUT, PATCH, DELETE, etc) based on the action taken

#### HTTP Methods and their roles:
GET     - Retrieves existing resources
POST    - Creates a new resource
PUT     - Updates an existing resource
DELETE  - Deletes resources

## API Endpoints
- All Data is returned in JSON format
- Requested data is returned as the "data" object
  - "data" can be a single item or an array of items, depending on what was requested
- Most responses are accompanied by a "message" object
- Errors return an "error" object
- Auth requests return a "token" object

### Registration and Authentication

#### POST /auth/register
Use this endpoint to create a NEW user account

Required body fields are:
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
Use this endpoint to log in with an existing user account

Required body fields are:
```
{
  "username": "someone",
  "password": "secret"
}
```
Returned JSON:
sames as /register endpoint above