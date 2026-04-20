import express from "express";
import {getAllContacts, getChatPartners, getMessages, markMessagesAsRead, sendMessage} from "../Controllers/message.controller.js";
import {auth} from "../Middleware/auth.middleware.js";
import {arcjetMiddleware} from "../Middleware/arcjet.middleware.js";

const router = express.Router();
router.use(arcjetMiddleware, auth);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/get/:id", getMessages);
router.put("/read/:id", markMessagesAsRead);
router.post("/send/:id", sendMessage);

export default router;