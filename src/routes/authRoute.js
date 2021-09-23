const express = require("express");
const { signUp } = require("../controllers/signUp");

const authRoute = express.Router();

authRoute.get("/", signUp)

module.exports = authRoute;