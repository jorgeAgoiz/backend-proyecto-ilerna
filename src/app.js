// Variables de entorno si estamos en un entorno de desarrollo
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const booksRoute = require("./routes/booksRoute");
const reviewsRoute = require("./routes/reviewsRoute");

// Variable de entorno
const PORT = process.env.PORT;

// Server
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use(authRoute);
app.use(booksRoute);
app.use(reviewsRoute);

// Escucha en puerto
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
