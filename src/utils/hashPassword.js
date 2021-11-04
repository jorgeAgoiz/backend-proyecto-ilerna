const bcrypt = require("bcrypt");
const saltRounds = 12;

// Función para encriptar el password
exports.hashYourPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}
// Función para verificar si el password es correcto
exports.comparePasswords = async (password, hashPassword) => {
    const matchPassword = await bcrypt.compare(password, hashPassword);
    return matchPassword;
}