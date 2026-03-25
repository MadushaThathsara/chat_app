import express from "express";
import {getMessage} from "../Controllers/message.controller.js";

const router = express.Router();

router.get("/", getMessage);

export default router;