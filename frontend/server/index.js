const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;
process.title = "pingpong";

app.use(express.static(path.join(__dirname, "../build")));

app.get("/ping", (req, res) => res.send("pong"));

app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.listen(port, () => {
    console.info(`Server listening at http://localhost:${port}`);
});
