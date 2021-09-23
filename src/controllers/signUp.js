const { hashYourPassword } = require("../utils/hashPassword");

exports.signUp = async (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    try {
      const hashedPassword = await hashYourPassword(password);
      
    } catch (error) {
      console.log(error.message);
      console.log("something went wrong");
    }
  }
};
