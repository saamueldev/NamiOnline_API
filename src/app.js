const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/usuarioRoutes");
const medicoRoutes = require("./routes/medicoRoutes");
const pacienteRoutes = require("./routes/pacienteRoutes");
const categoriaExameRoutes = require("./routes/categoriaExameRoutes");
const tipoExameRoutes = require("./routes/tipoExameRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const requireRole = require("./middlewares/roleMiddleware");

const guiaRoutes = require("./routes/guiaRoutes");
const especialidadeRoutes = require("./routes/especialidadeRoutes");
const consultaRoutes = require("./routes/consultaRoutes");
const agendaMedicoRoutes = require("./routes/agendaMedicoRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/usuarios", userRoutes);
app.use("/medicos", authMiddleware, requireRole("admin"), medicoRoutes);
app.use("/pacientes", authMiddleware, requireRole("admin"), pacienteRoutes);
app.use("/categorias-exames", authMiddleware, requireRole("admin"), categoriaExameRoutes);
app.use("/tipos-exames", authMiddleware, requireRole("admin"), tipoExameRoutes);
app.use("/medicos", medicoRoutes);
app.use("/pacientes", pacienteRoutes);
app.use("/guias", guiaRoutes);
app.use("/especialidades", especialidadeRoutes);
app.use("/consultas", consultaRoutes);
app.use("/agenda-medicos", agendaMedicoRoutes);

module.exports = app;
