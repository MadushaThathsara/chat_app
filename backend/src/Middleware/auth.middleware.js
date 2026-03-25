import jwt from "jsonwebtoken";
import {User} from "../Models/user.model.js";
import {env} from "../lib/env.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if(!token){
      return res.status(401).json({message: "Unauthorized"});
    }
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if(!decoded){
      return res.status(401).json({message: "Unauthorized - Invalid Token"});
    }

    const user = await User.findById(decoded._id).select("-password");  //get all details without password
    if (!user) {
      return res.status(401).json({message: "Unauthorized - User not found"});
    }

    req.user = user;
    next();

  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

