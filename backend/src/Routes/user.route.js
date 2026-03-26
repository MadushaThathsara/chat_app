import express from "express";
import {login, logout, signup, updateProfile} from "../Controllers/user.controller.js";
import {auth} from "../Middleware/auth.middleware.js";
import {arcjetMiddleware} from "../Middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetMiddleware);

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);
router.put("/update-profile", auth, updateProfile);

router.get("/check", auth, (req, res) => res.status(200).json(req.user));

export default router;