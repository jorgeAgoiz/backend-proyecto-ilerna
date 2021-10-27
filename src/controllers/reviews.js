const { connection } = require("../services/mysql");
const { updateGlobalRating } = require("../utils/updateRating");

// POST => "/review"
exports.createReview = async (req, res, next) => {
  let { valoration, text_review, id_user, id_book } = req.body;
  if (!text_review) {
    text_review = null;
  }
  if (!valoration || !id_user || !id_book) {
    return res.status(412).json({
      message: "Incomplete data provided.",
      status_code: 412,
      success: false,
    });
  }
  try {
    const newReview = await connection
      .promise()
      .execute(
        "INSERT INTO review(valoration, text_review, id_user, id_book) values(?, ?, ?, ?)",
        [valoration, text_review, id_user, id_book]
      );
    if (newReview[0].affectedRows <= 0) {
      return res.status(400).json({
        message: "Review not saved.",
        status_code: 400,
        success: false,
      });
    }
    const newReviewId = newReview[0].insertId;

    const gloRatUpd = await updateGlobalRating(id_book, valoration);
    if (!gloRatUpd) {
      const deleteNewReview = await connection
        .promise()
        .execute("DELETE FROM review WHERE id = ?", [newReviewId]);
      return res.status(412).json({
        message: "Review not saved.",
        status_code: 412,
        success: false,
      });
    }
    return res.status(201).json({
      message: "Review saved successfully.",
      newId: newReviewId,
      status_code: 201,
      success: true,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message, status_code: 400, success: false });
  }
};

// DELETE => "/review"
exports.deleteReview = async (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    return res.status(412).json({
      message: "Incomplete data provided.",
      status_code: 412,
      success: false,
    });
  }
  try {
    const deletedReview = await connection
      .promise()
      .execute("DELETE FROM review WHERE id = ?", [id]);

    if (deletedReview[0].affectedRows <= 0) {
      return res.status(400).json({
        message: "Review not deleted.",
        status_code: 400,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Review deleted successfully.",
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

// PATCH => "/review"
exports.updateReview = async (req, res, next) => {
  const { id, valoration, text_review, id_user } = req.body;
  if (!id || !valoration || !text_review || !id_user) {
    return res.status(412).json({
      message: "Incomplete data provided.",
      status_code: 412,
      success: false,
    });
  }

  try {
    const reviewUpdated = await connection
      .promise()
      .execute(
        "UPDATE review SET valoration = ?, text_review = ? WHERE id = ? AND id_user = ?",
        [valoration, text_review, id, id_user]
      );
    if (reviewUpdated[0].affectedRows <= 0) {
      return res.status(400).json({
        message: "Review not updated.",
        status_code: 400,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Review updated successfully.",
      id_updated: id,
      id_user: id_user,
      status_code: 200,
      success: true,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message, status_code: 400, success: false });
  }
};

// GET => "/book_reviews/:id_book"
exports.getReviewsOfBook = async (req, res, next) => {
  const { id_book } = req.params;
  if (!id_book) {
    return res.status(412).json({
      message: "Incomplete data provided.",
      status_code: 412,
      success: false,
    });
  }
  try {
    const arrayReviews = await connection
      .promise()
      .execute(
        "SELECT r.valoration, r.text_review, r.id_user, r.id, r.created_at, r.id_book, u.username FROM review r LEFT JOIN user u ON r.id_user = u.id WHERE r.id_book = ?",
        [id_book]
      );

    if (arrayReviews[0].length <= 0) {
      return res.status(200).json({
        message: "No reviews were found with the book ID entered.",
        book_id: id_book,
        data: [],
        status_code: 200,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Reviews found with success.",
      book_id: id_book,
      data: arrayReviews[0],
      status_code: 200,
      success: true,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message, status_code: 400, success: false });
  }
};

// GET => "/user_reviews/:id_user"
exports.getReviewsOfUser = async (req, res, next) => {
  const { id_user } = req.params;
  if (!id_user) {
    return res.status(412).json({
      message: "Incomplete data provided.",
      status_code: 412,
      success: false,
    });
  }

  try {
    const arrayReviews = await connection
      .promise()
      .execute("SELECT r.valoration, r.text_review, r.id_book, r.id_user, r.id, r.created_at, b.title FROM review r LEFT JOIN book b ON r.id_book = b.id WHERE r.id_user = ?", [id_user]);
    if (arrayReviews[0].length <= 0) {
      return res.status(200).json({
        message: "No reviews were found with the user ID entered.",
        data: [],
        user_id: id_user,
        status_code: 200,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Reviews found with success.",
      user_id: id_user,
      data: arrayReviews[0],
      status_code: 200,
      success: true,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message, status_code: 400, success: false });
  }
};

// GET "/review/:id"
exports.getReview = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(412).json({
      message: "Incomplete data provided.",
      status_code: 412,
      success: false,
    });
  }

  try {
    const specificReview = await connection
      .promise()
      .execute("SELECT * FROM review WHERE id = ?", [id]);
    if (specificReview[0].length <= 0) {
      return res.status(404).json({
        message: "No review were found with the ID entered.",
        status_code: 404,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Review found with success.",
      id_review: id,
      data: specificReview[0][0],
      status_code: 200,
      success: true,
    });

  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message, status_code: 400, success: false });
  }
};
