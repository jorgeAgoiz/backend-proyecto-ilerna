const { connection } = require("../services/mysql");
const { hashYourPassword, comparePasswords } = require("../utils/hashPassword");

// POST => "/signup"
exports.signUp = async (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    try {
      const hashedPassword = await hashYourPassword(password);
      return await connection.execute(
        "INSERT INTO user(username, password) VALUES( ?, ?)",
        [username, hashedPassword],
        (err, results) => {
          if (err) {
            return res
              .status(400)
              .json({ message: err.message, status_code: 400, success: false });
          }
          return res.status(201).json({
            message: "User saved successfully.",
            newId: results.insertId,
            status_code: 201,
            success: true,
          });
        }
      );
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, status_code: 400, success: false });
    }
  }
  return res
    .status(400)
    .json({ message: "Incomplete data.", status_code: 400, success: false });
};

// POST => "/signin"
exports.signIn = async (req, res, next) => {
  const { username, password } = req.body;

  if (username && password) {
    try {
      const user = await connection
        .promise()
        .query("SELECT * FROM user WHERE username = ?", [username]);

      if (user[0].length > 0) {
        const matchPasswords = await comparePasswords(
          password,
          user[0][0].password
        );

        if (!matchPasswords) {
          return res.status(400).json({
            message: "Incorrect password.",
            status_code: 400,
            success: false,
          });
        }
        const validUser = {
          id: user[0][0].id,
          username: user[0][0].username,
          created_at: user[0][0].created_at,
        };
        return res.status(200).json({
          message: "User found",
          status_code: 200,
          user: validUser,
          success: true,
        });
      } else {
        return res.status(404).json({
          message: "User not found",
          status_code: 404,
          success: false,
        });
      }
    } catch (error) {
      return res.status(400).json({
        message: error.message,
        status_code: 400,
        success: false,
      });
    }
  }

  return res.status(400).json({
    message: "Incomplete data.",
    status_code: 400,
    success: false,
  });
};
