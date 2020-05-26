const router = require('express').Router()
const authorize = require("../../../middleware/jwtAuth")

module.exports = router;

router.use(authorize)

router.get("/", (req, res, next) => {
  res.send("I am authenticated")

})