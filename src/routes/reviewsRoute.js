const express = require("express");
const { createReview } = require("../controllers/reviews");

const reviewsRoute = express.Router();

reviewsRoute.post("/review", createReview);

module.exports = reviewsRoute;
