const express = require("express");
const userController = require("../Controllers/user.controller");

const router = express.Router();

router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/signup", userController.signup);

module.exports = router;    