const { connection } = require("../services/mysql");

// POST => "/books" ** Insertar Libro
exports.insertBook = async (req, res, next) => {
  const { title, author, category, book_description, rating, id_user } =
    req.body;

  try {
    const newBook = await connection
      .promise()
      .execute(
        "INSERT INTO book(title, author, category, book_description, rating, average, id_user) VALUES( ?, ?, ?, ?, ?, ?, ?)",
        [title, author, category, book_description, rating, rating, id_user],
      );
    if (newBook[0].affectedRows <= 0) {
      return res
        .status(404)
        .json({ message: "Book not saved.", status_code: 404, success: false });
    }

    return res.status(201).json({
      message: "Book saved successfully.",
      newId: newBook[0].insertId,
      status_code: 201,
      success: true,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message, status_code: 400, success: false });
  }
};

// DELETE "/books" ** Eliminar Libro
exports.deleteBook = async (req, res, next) => {
  const { id } = req.body;

  try {
    const deletedBook = await connection
      .promise()
      .execute("DELETE FROM book WHERE id = ?", [id]);
    if (deletedBook[0].affectedRows <= 0) {
      return res.status(404).json({
        message: "Book not deleted.",
        status_code: 404,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Book deleted successfully.",
      id_removed: id,
      status_code: 200,
      success: true,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message, status_code: 400, success: false });
  }
};

// PATCH => "/books" ** Modificar Libro
exports.updateBook = async (req, res, next) => {
  const { title, author, category, book_description, rating, average, id } = req.body;
  let queryString =
    "UPDATE book SET title = ?, author = ?, category = ?, book_description = ?, rating = ? WHERE id = ?";
  let queryArray = [title, author, category, book_description, rating, id];

  if (average) {
    queryString = "UPDATE book SET average = ? WHERE id = ?";
    queryArray = [average, id];
  }

  try {
    const updatedBook = await connection
      .promise()
      .execute(queryString, queryArray);

    if (updatedBook[0].affectedRows <= 0) {
      return res.status(404).json({
        message: "Book not found.",
        status_code: 404,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Book updated successfully.",
      id_updated: id,
      status_code: 200,
      success: true,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message, status_code: 400, success: false });
  }
};

// GET => "/books/:user_id" ** Obtener libros de un usuario por id_user
exports.getBooksOf = async (req, res, next) => {
  const { user_id } = req.params;
  const getQuery = `SELECT * FROM book WHERE id_user = ${user_id} ORDER BY created_at DESC`;
  if (!user_id) {
    return res.status(412).json({
      message: "Incomplete data provided.",
      status_code: 412,
      success: false,
    });
  }

  try {
    const totalBooksOf = await connection
      .promise()
      .execute("SELECT COUNT(*) FROM book WHERE id_user = ?", [user_id]);

    const numBooksOf = totalBooksOf[0][0]["COUNT(*)"];
    if (numBooksOf <= 0) {
      return res.status(200).json({
        message: "No books were found with the user ID entered.",
        data: [],
        status_code: 200,
        success: false,
      });
    }
   
    const allBooksOf = await connection.promise().execute(getQuery);

    return res.status(200).json({
      message: `Books of user_id: ${user_id}`,
      total_books: numBooksOf,
      data: allBooksOf[0],
      status_code: 200,
      success: true,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message, status_code: 400, success: false });
  }
};

// GET => "/books?page&order&direction" ** Obtener libros con paginaci??n ( pagina, orden, direcci??n )
exports.getBooks = async (req, res, next) => {
  const { page, order, direction} = req.query;
  const limit = 6;
  const offset = (page - 1) * limit;
  const getQuery = `SELECT * FROM book ORDER BY ${order} ${direction} LIMIT ${limit} OFFSET ${offset}`;

  try {
    const totalBooks = await connection
      .promise()
      .execute("SELECT COUNT(*) FROM book");
    const numBooks = totalBooks[0][0]["COUNT(*)"];
    if (numBooks <= 0) {
      return res.status(404).json({
        message: "No books found.",
        status_code: 404,
        success: false,
      });
    }
    const numPages = Math.ceil(numBooks / limit);
    if (page > numPages) {
      return res.status(404).json({
        message: "This page does not exists.",
        status_code: 404,
        success: false,
      });
    }
    const allBooks = await connection.promise().execute(getQuery);

    return res.status(200).json({
      message: `All books available.`,
      number_pages: numPages,
      page: page,
      data: allBooks[0],
      status_code: 200,
      success: true,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message, status_code: 400, success: false });
  }
};

// GET => "/book/id" ** Obtener libro espec??fico por id
exports.getBook = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(412).json({
      message: "Incomplete data provided.",
      status_code: 412,
      success: false,
    });
  }

  try {
    const book = await connection
      .promise()
      .execute("SELECT * FROM book WHERE id = ?", [id]);

    if (book[0].length <= 0) {
      return res.status(404).json({
        message: "Book not found.",
        status_code: 404,
        success: false,
      });
    }
    return res.status(200).json({
      message: `Book with Id: ${id}`,
      data: book[0][0],
      status_code: 200,
      success: true,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message, status_code: 400, success: false });
  }
};

// GET => "/book-title/:title" ** Obtener libro espec??fico por t??tulo
exports.getBookByTitle = async (req, res, next) => {
  const { title } = req.params
  if (!title) {
    return res.status(412).json({
      message: "Incomplete data provided.",
      status_code: 412,
      success: false,
    });
  }

  try {
    const book = await connection
      .promise()
      .execute("SELECT * FROM book WHERE title = ?", [title]);

    if (book[0].length <= 0) {
      return res.status(404).json({
        message: "Book not found.",
        status_code: 404,
        success: false,
      });
    }
    return res.status(200).json({
      message: `Book with title: ${title}`,
      data: book[0][0],
      status_code: 200,
      success: true,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message, status_code: 400, success: false });
  }
}
