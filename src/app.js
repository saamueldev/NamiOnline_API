const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/usuarioRoutes");
const medicoRoutes = require("./routes/medicoRoutes");
const pacienteRoutes = require("./routes/pacienteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/usuarios", userRoutes);
app.use("/medicos", medicoRoutes);
app.use("/pacientes", pacienteRoutes);

module.exports = app;