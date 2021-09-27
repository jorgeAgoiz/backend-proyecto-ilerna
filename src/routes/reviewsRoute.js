const express = require("express");
const { createReview, deleteReview } = require("../controllers/reviews");

const reviewsRoute = express.Router();

reviewsRoute.post("/review", createReview);
reviewsRoute.delete("/review", deleteReview);

module.exports = reviewsRoute;
