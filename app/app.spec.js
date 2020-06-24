const vars = require('../vars')
// vars.APP_ENV = "testing"
const supertest = require('supertest')
const server = require('../index')

// auth
describe("app", () => {



  const uname = `u${Math.random()}`
  const pass = "I am secret"

  it("can run tests", () => {
    expect(true).toBeTruthy()
  })

  describe("/auth/register", () => {
    it("returns error when invalid data provided", () => {
      return supertest(server)
        .post("/auth/register")
        .send({ password: pass })
        .then(response => {
          expect(response.status).toBe(400)
        })
    })

    it("returns success when good data provided", () => {
      return supertest(server)
        .post("/auth/register")
        .send({username: uname, password: pass})
        .then(response => {
          expect(response.status).toBe(200)
        })
    })

    it("returns error when trying a duplicate username", () => {
      return supertest(server)
        .post("/auth/register")
        .send({username: uname, password: pass})
        .then(response => {
          expect(response.status).toBe(500)
        })
    })

  })

  describe("/auth/login", () => {

    it("returns error when invalid data provided", () => {
      return supertest(server)
        .post("/auth/login")
        .send({ username: uname })
        .then(response => {
          expect(response.status).toBe(400)
        })
    })

    it("returns error when trying a duplicate username", () => {
      return supertest(server)
        .post("/auth/register")
        .send({username: uname, password: pass})
        .then(response => {
          expect(response.status).toBe(500)
        })
    })

    it("returns success when good data provided", () => {
      return supertest(server)
        .post("/auth/register")
        .send({username: uname, password: pass})
        .then(response => {
          expect(response.status).toBe(200)
        })
    })

  })

})

