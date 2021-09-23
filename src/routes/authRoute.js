const express = require("express");
const { signUp } = require("../controllers/signUp");

const authRoute = express.Router();

authRoute.post("/", signUp)

module.exports = authRoute;