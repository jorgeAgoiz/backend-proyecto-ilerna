const express = require("express");
const { insertBook, deleteBook, updateBook, getBooks, getBooksOf, getBook } = require("../controllers/books");

const booksRoute = express.Router();

booksRoute.post("/books", insertBook);
booksRoute.delete("/books", deleteBook);
booksRoute.patch("/books", updateBook);
booksRoute.get("/books/:user_id", getBooksOf);
booksRoute.get("/books", getBooks)
booksRoute.get("/book/:id", getBook);

module.exports = booksRoute;