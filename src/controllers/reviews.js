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
        [valoration, text_review, id_user, id_book],
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
exports.updateReview = (req, res, next) => {
  console.log("Patch route working!!");
};

// GET => "/review/:book_id"
exports.getReviewsOfBook = (req, res, next) => {};

// GET => "/review/:user_id"
exports.getReviewsOfUser = (req, res, next) => {};
/* Estas serían todas las rutas en principio del backend */
