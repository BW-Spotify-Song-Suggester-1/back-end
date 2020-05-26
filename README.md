# back-end
WEB Unit 4 

## API URL

https://spotify-api-prod.herokuapp.com/

## API Documentation

To create a new account:

### POST /auth/register
```
required form fields are:
{
  "username": "someone",
  "password": "secret",
  "email": "someone@somewhere.net"
}
```
#### API returns:
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
To login with an existing account:

### POST /auth/login
```
required form fields are:
{
  "username": "someone",
  "password": "secret"
}
```
#### API returns:

same as /register endpoint above
