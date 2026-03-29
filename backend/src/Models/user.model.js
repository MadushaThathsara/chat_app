import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {env} from "../lib/env.js";  


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    profilePic: {
        type: String,
        default: "" 
    },
    // tokens: [{token: {type: String}}]
},
{timestamps: true});

userSchema.pre("save", async function (){
  const user = this;
  if(user.isModified("password")){
    try{
      user.password = await bcrypt.hash(user.password, 10);
    } catch (error){
      throw new Error("Failed to hash password");
    }
  }
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};

userSchema.methods.generateAuthToken = async function (res) {
  const user = this; 
  const token = jwt.sign({ _id: user._id.toString() }, env.JWT_SECRET, {expiresIn: "7d"});
//   user.tokens = user.tokens.concat({ token });
//   await user.save();

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,    // 7 days
        httpOnly: true, // prevent client side js access
        sameSite: "strict", // prevent CSRF attacks
        secure: env.NODE_ENV !== "development" // only send over https in production
    })

    return token;
};

export const User = mongoose.model("User", userSchema);
 