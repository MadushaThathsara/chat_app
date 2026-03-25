const express = require("express");
const userController = require("../Controllers/user.controller");
const auth = require("../Middleware/auth.middleware");

const router = express.Router();

router.post("/login", userController.login);
router.post("/logout", auth, userController.logout);
router.post("/signup", userController.signup);
router.put("/update-profile", auth, userController.updateProfile);

router.get("/check", auth, (req, res) => res.status(200).json(req.user));

module.exports = router;     