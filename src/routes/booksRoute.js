const express = require("express");
const { insertBook, deleteBook, updateBook } = require("../controllers/books");

const booksRoute = express.Router();

booksRoute.post("/books", insertBook);
booksRoute.delete("/books", deleteBook);
booksRoute.patch("/books", updateBook);

module.exports = booksRoute;