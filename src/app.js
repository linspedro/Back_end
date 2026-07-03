const express = require("express");
const cors = require("cors");

const userRoutes = require("./Rotas/usuarioRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

module.exports = app;
