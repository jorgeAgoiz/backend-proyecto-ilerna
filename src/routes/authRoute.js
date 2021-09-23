const express = require("express");
const { signUp } = require("../controllers/auth");

const authRoute = express.Router();

authRoute.post("/", signUp)

module.exports = authRoute;