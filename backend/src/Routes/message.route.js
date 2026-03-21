const express = require("express");
const messageController = require("../Controllers/message.controller");

const router = express.Router();

router.get("/", messageController.getMessage);

module.exports = router;