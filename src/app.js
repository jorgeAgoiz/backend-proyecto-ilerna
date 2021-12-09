// Variables de entorno si estamos en un entorno de desarrollo
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const authRoute = require("./routes/authRoute");
const booksRoute = require("./routes/booksRoute");
const reviewsRoute = require("./routes/reviewsRoute");

// Variable de entorno
const PORT = process.env.PORT;

// Server
const app = express();

// Middlewares
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-access-token"
  );
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use(authRoute);
app.use(booksRoute);
app.use(reviewsRoute);

// Escucha en puerto
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
