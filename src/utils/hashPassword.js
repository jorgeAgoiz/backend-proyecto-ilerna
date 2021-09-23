const bcrypt = require("bcrypt");
const saltRounds = 12;


exports.hashYourPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}