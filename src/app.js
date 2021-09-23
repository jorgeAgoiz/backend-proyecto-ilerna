require('dotenv').config();
const express = require("express");

const app = express();

app.get("/", (req, res, next) => {
    console.log("Starting with the backend")
    return res.send("<h1>Hey There!!</h1>")
})

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`))