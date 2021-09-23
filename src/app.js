if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const { connection } = require("./services/mysql");
const authRoute = require("./routes/authRoute");

// Variables de entorno
const PORT = process.env.PORT;

const app = express();

// Rutas
app.use(authRoute);



app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))