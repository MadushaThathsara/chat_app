import express from "express";
import path from "path";
import cookieParser from "cookie-parser";

import userRoutes from "./Routes/user.route.js";
import messageRoutes from "./Routes/message.route.js";
import {connectDB} from "./Database/mongoose.js";
import {env} from "./lib/env.js";

const app = express();

app.use(express.json())
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

// make ready for deployment
if(env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../../frontend/dist")));

    app.get("*path", (_, res) => {
        res.sendFile(path.resolve(__dirname, "../../frontend", "dist", "index.html"));
    });
}   


const PORT = Number(env.PORT) || 5000;
connectDB();
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
