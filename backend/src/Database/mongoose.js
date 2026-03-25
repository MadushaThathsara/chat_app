import mongoose from "mongoose";
import {env} from "../lib/env.js";

export const connectDB = async () => {
    try{
        const conn =await mongoose.connect(env.MONGO_URL)
        console.log("Connected to MongoDB", conn.connection.host);
    }catch(error){
        console.error("MongoDB connection error:", error)
        process.exit(1);
    }
};
