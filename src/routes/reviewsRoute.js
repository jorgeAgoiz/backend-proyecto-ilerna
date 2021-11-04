// ****************************************** Rutas de Reseñas
const express = require("express");
const {
  createReview,
  deleteReview,
  getReviewsOfBook,
  getReviewsOfUser,
  updateReview,
  getReview,
} = require("../controllers/reviews");

const reviewsRoute = express.Router();

// Rutas asignadas a controladores
reviewsRoute.post("/review", createReview);
reviewsRoute.delete("/review", deleteReview);
reviewsRoute.get("/book_reviews/:id_book", getReviewsOfBook);
reviewsRoute.get("/user_reviews/:id_user", getReviewsOfUser);
reviewsRoute.patch("/review", updateReview);
reviewsRoute.get("/review/:id", getReview);

module.exports = reviewsRoute;
