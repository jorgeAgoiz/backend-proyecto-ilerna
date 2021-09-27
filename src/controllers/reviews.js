const { connection } = require("../services/mysql");

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
    /* Peticiones asincronas */
    const newReview = await connection
      .promise()
      .execute(
        "INSERT INTO review(valoration, text_review, id_user, id_book) values(?, ?, ?, ?)",
        [valoration, text_review, id_user, id_book],
      );

    /* Una vez la petición es exitosa, debemos actualizar el rating global de ese libro 
    con la nueva puntuación aportada por este usuario */
    if (newReview[0].affectedRows <= 0) {
      return res.status(400).json({
        message: "Review not saved.",
        status_code: 400,
        success: false,
      });
    }
    /* Aquí meteremos la función updateRating */
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message, status_code: 400, success: false });
  }
};
