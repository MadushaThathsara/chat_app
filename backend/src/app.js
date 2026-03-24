const express = require("express");
const path = require("path");

const userRoutes = require("./Routes/user.route");
const messageRoutes = require("./Routes/message.route");
const connectDB = require("./Database/mongoose");
const env = require("./lib/env");

const app = express();

app.use(express.json())

app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

// make ready for deployment
if(env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../../frontend/dist")));

    app.get("*path", (_, res) => {
        res.sendFile(path.resolve(__dirname, "../../frontend", "dist", "index.html"));
    });
}   

const PORT = env.PORT;
connectDB();
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
