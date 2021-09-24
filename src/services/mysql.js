const mysql = require("mysql2");


// Variables de entorno
const HOSTDB = process.env.MYSQL_HOST;
const USERDB = process.env.MYSQL_USER;
const PASSDB = process.env.MYSQL_PASSWORD;
const PORTDB = process.env.MYSQL_PORT;
const NAMEDB = process.env.MYSQL_DATABASE;

// Conexión a BBDD
exports.connection = mysql.createConnection(
  {
    host: HOSTDB,
    user: USERDB,
    password: PASSDB,
    port: PORTDB,
    database: NAMEDB
  },
  (err) => {
    console.log(err); // Manejar ese error
  }
);

