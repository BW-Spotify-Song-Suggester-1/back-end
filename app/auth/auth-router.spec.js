const supertest = require('supertest')
const server = require('../server')
// const usersTable = require('../database/user-model')

describe('auth-router', () => {
  const uname = `u${Math.random()}`
  const pass = 'let me in!'

  it('can run tests', () => {
    expect(true).toBeTruthy();
  })

  describe('POST /register', () => {
    it('returns error when trying to signup with invalid data', () => {
      return supertest(server)
        .post('/api/auth/register')
        .send({username: uname})
        .then(response => {
          expect(response.status).toBe(400)
        })
    })

    it('returns success with correct user data', () => {
      return supertest(server)
        .post('/api/auth/register')
        .send({username: uname, password: pass})
        .then(response => {
          expect(response.status).toBe(200)
        })
    })

    it('returns server (db) error when trying to signup with duplicate username', () => {
      return supertest(server)
        .post('/api/auth/register')
        .send({username: uname, password: pass})
        .then(response => {
          expect(response.status).toBe(500)
        })
    })
  })

  describe('POST /login', () => {
    it('returns error when trying to login with invalid data', () => {
      return supertest(server)
        .post('/api/auth/login')
        .send({password: pass})
        .then(response => {
          expect(response.status).toBe(400)
        })
    })

    it('returns error when trying to login with incorrect credentials', () => {
      return supertest(server)
        .post('/api/auth/login')
        .send({username: uname, password: 'I am the wrong pass'})
        .then(response => {
          expect(response.status).toBe(401)
        })
    })

    it('returns successfully if correct credentials are passed', () => {
      return supertest(server)
        .post('/api/auth/login')
        .send({username: uname, password: pass})
        .then(response => {
          expect(response.status).toBe(202)
        })
    })

  })

})