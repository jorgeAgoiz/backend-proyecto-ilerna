const express = require("express");
const { insertBook } = require("../controllers/books");

const booksRoute = express.Router();

booksRoute.post("/books", insertBook);

module.exports = booksRoute;