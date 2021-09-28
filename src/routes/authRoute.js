const express = require("express");
const { signUp, signIn, deleteUserAccount } = require("../controllers/auth");

const authRoute = express.Router();

authRoute.post("/signup", signUp);
authRoute.post("/signin", signIn);
authRoute.delete("/delete_account", deleteUserAccount);

module.exports = authRoute;
