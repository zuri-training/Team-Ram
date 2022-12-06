const controller = require("../controller/authController");
const router = require("express").Router();

router
  // body: {user: {email, password} }
  .post('/login', controller.login)
  // body: {user: {name, email, password}}
  .post('/sign_up', controller.signUp)


module.exports = router;