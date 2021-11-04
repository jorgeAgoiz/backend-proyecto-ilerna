// ****************************************** Rutas de Libros
const express = require("express");
const { insertBook, deleteBook, updateBook, getBooks, getBooksOf, getBook, getBookByTitle } = require("../controllers/books");

const booksRoute = express.Router();

// Rutas asignadas a controladores
booksRoute.post("/books", insertBook);
booksRoute.delete("/books", deleteBook);
booksRoute.patch("/books", updateBook);
booksRoute.get("/books/:user_id", getBooksOf);
booksRoute.get("/books", getBooks)
booksRoute.get("/book/:id", getBook);
booksRoute.get("/book-title/:title", getBookByTitle)

module.exports = booksRoute;