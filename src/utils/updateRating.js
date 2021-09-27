const { connection } = require("../services/mysql");

exports.updateGlobalRating = async (id_book) => {
  let valorations = 0;
  const numberOfReviews = await connection
    .promise()
    .execute("SELECT valoration FROM review WHERE id_book = ?", [id_book]);
  numberOfReviews[0].map((rev) => (valorations = valorations + rev.valoration));

  const newRating = valorations / numberOfReviews[0].length;
  if (numberOfReviews[0].length <= 0) {
    return false;
  }
  const bookUpdated = await connection
    .promise()
    .execute("UPDATE book SET rating = ? WHERE id = ? ", [newRating, id_book]);
  if (bookUpdated[0].affectedRows <= 0) {
    return false;
  }
  return true;
};
