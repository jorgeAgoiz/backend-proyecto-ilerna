const express = require("express");
const {
  createReview,
  deleteReview,
  getReviewsOfBook,
  getReviewsOfUser,
  updateReview,
} = require("../controllers/reviews");

const reviewsRoute = express.Router();

reviewsRoute.post("/review", createReview);
reviewsRoute.delete("/review", deleteReview);
reviewsRoute.get("/book_reviews/:id_book", getReviewsOfBook);
reviewsRoute.get("/user_reviews/:id_user", getReviewsOfUser);
reviewsRoute.patch("/review", updateReview);

module.exports = reviewsRoute;
