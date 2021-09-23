const { connection } = require("../services/mysql");
const { hashYourPassword } = require("../utils/hashPassword");

exports.signUp = async (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    try {
      const hashedPassword = await hashYourPassword(password);
      return await connection.execute("INSERT INTO user(username, password) VALUES( ?, ?)", [username, hashedPassword], (err, results) => {
        if (err) {
          return res.status(400).json({ message: err.message, status_code: 400, success: false });
        }
        return res.status(201).json({ message: "User saved successfully.", newId: results.insertId, status_code: 201, success: true });
      })
    } catch (error) {
      return res.status(400).json({ message: error.message, status_code: 400, success: false });
    }
  }
};

exports.signIn = async (req, res, next) => {
  /* Aqui el controlador para el Sign In */
}
