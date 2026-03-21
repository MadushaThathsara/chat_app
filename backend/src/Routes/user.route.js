const express = require("express");
const userController = require("../Controllers/user.controller");

const router = express.Router();

router.get("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/signup", userController.signup);

module.exports = router;    