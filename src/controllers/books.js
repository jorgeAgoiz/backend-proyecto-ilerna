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
        [title, author, category, book_description, rating, id_user],
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

// DELETE "/books"
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

// PATCH => "/books"
exports.updateBook = async (req, res, next) => {
  const { title, author, category, book_description, rating, id } = req.body;
  let queryString =
    "UPDATE book SET title = ?, author = ?, category = ?, book_description = ? WHERE id = ?";
  let queryArray = [title, author, category, book_description, id];

  if (rating) {
    queryString = "UPDATE book SET rating = ? WHERE id = ?";
    queryArray = [rating, id];
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

// GET => "/books/:user_id?page"
exports.getBooksOf = async (req, res, next) => {
  const { user_id } = req.params;
  const { page } = req.query;
  const limit = 6;
  const offset = (page - 1) * limit;
  const getQuery = `SELECT * FROM book WHERE id_user = ${user_id} limit ${limit} OFFSET ${offset}`;
  if (!user_id || !page) {
    return res.status(412).json({
      message: "User Id not found.",
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
      return res.status(404).json({
        message: "No books were found with the user ID entered.",
        status_code: 404,
        success: false,
      });
    }
    const numPages = Math.ceil(numBooksOf / limit);
    const allBooksOf = await connection.promise().execute(getQuery);

    return res.status(200).json({
      message: `Books of user_id: ${user_id}`,
      number_pages: numPages,
      page: page,
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

// GET => "/books"
exports.getBooks = (req, res, next) => {
  console.log("what up buddy??");
};

// GET => "/book/id"
exports.getBook = (req, res, next) => {
  const { id } = req.params;
  console.log(id);
};
