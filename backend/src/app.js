const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const userRoutes = require("./Routes/user.route");
const messageRoutes = require("./Routes/message.route");

const app = express();

app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
