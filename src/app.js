const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/usuarioRoutes");
const medicoRoutes = require("./routes/medicoRoutes");
const pacienteRoutes = require("./routes/pacienteRoutes");
const categoriaExameRoutes = require("./routes/categoriaExameRoutes");
const tipoExameRoutes = require("./routes/tipoExameRoutes");
const agendamentoExameRoutes = require("./routes/agendamentoExameRoutes");
const avatarRoutes = require("./routes/avatarRoutes");
const notificacaoRoutes = require("./routes/notificacaoRoutes");
const configuracaoRoutes = require("./routes/configuracaoRoutes");
const guiaRoutes = require("./routes/guiaRoutes");
const especialidadeRoutes = require("./routes/especialidadeRoutes");
const consultaRoutes = require("./routes/consultaRoutes");
const agendaMedicoRoutes = require("./routes/agendaMedicoRoutes");

const authMiddleware = require("./middlewares/authMiddleware");
const requireRole = require("./middlewares/roleMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/usuarios", userRoutes);
app.use("/medicos", authMiddleware, requireRole("admin"), medicoRoutes);
app.use("/pacientes", authMiddleware, requireRole("admin"), pacienteRoutes);
app.use("/categorias-exames", categoriaExameRoutes);
app.use("/tipos-exames", tipoExameRoutes);
app.use("/agendamentos-exames", agendamentoExameRoutes);
app.use("/configuracoes", avatarRoutes);
app.use("/configuracoes", notificacaoRoutes);
app.use("/configuracoes", configuracaoRoutes);

module.exports = app;