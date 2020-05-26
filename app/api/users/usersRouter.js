const router = require('express').Router()
const authorize = require("../../../middleware/jwtAuth")

module.exports = router;

router.use(authorize)

router.get("/profile", (req, res, next) => {
  next(messages.notImplemented)
})

router.get("/delete", (req, res, next) => {
  next(messages.notImplemented)
})

router.post("/profile", (req, res, next) => {
  next(messages.notImplemented)
})

router.get("/", (req, res, next) => {
  next(messages.notImplemented)
})

router.get("/", (req, res, next) => {
  next(messages.notImplemented)
})

