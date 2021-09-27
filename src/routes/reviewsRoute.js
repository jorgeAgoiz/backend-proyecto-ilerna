const express = require("express");

const reviewsRoute = express.Router();

reviewsRoute.post("/review", () => console.log("Reviews Route!!"));

module.exports = reviewsRoute;
