const { connection } = require("../services/mysql");

// POST => "/books"
exports.insertBook = async (req, res, next) => {
  const { title, author, category, book_description, rating, id_user } =
    req.body;

  try {
    const newBook = await connection
      .promise()
      .execute(
        "INSERT INTO book(title, author, category, book_description, rating, id_user) VALUES( ?, ?, ?, ?, ?, ?)",
        [title, author, category, book_description, rating, id_user]
      );
    if (newBook[0].affectedRows <= 0) {
      return res
        .status(400)
        .json({ message: "Book not saved.", status_code: 400, success: false });
    }

    return res
      .status(201)
      .json({
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

// DELETE "/books"
exports.deleteBook = (req, res, next) => {
    /* Controlador para eliminar libros */
}
