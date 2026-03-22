const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const userRoutes = require("./Routes/user.route");
const messageRoutes = require("./Routes/message.route");

const app = express();
// const __dirname = path.resolve();

app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

// make ready for deployment
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../../frontend/dist")));

    app.get("*path", (_, res) => {
        res.sendFile(path.resolve(__dirname, "../../frontend", "dist", "index.html"));
    });
}   

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
