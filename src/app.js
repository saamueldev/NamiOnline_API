const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/usuarioRoutes");
const medicoRoutes = require("./routes/medicoRoutes");
const pacienteRoutes = require("./routes/pacienteRoutes");
const categoriaExameRoutes = require("./routes/categoriaExameRoutes");
const tipoExameRoutes = require("./routes/tipoExameRoutes");
const guiaRoutes = require("./routes/guiaRoutes");
const especialidadeRoutes = require("./routes/especialidadeRoutes");
const consultaRoutes = require("./routes/consultaRoutes");
const meusAgendamentosRoutes = require("./routes/meusAgendamentosRoutes");
const agendaBloqueioRoutes = require("./routes/agendaBloqueioRoutes");
const horariosFixosRoutes = require("./routes/horariosFixosRoutes");




const authMiddleware = require("./middlewares/authMiddleware");
const requireRole = require("./middlewares/roleMiddleware");




const app = express();

app.use(cors());
app.use(express.json());

app.use("/usuarios", userRoutes);
app.use("/pacientes", authMiddleware, requireRole("admin"), pacienteRoutes);
app.use("/categorias-exames", authMiddleware, requireRole("admin"), categoriaExameRoutes);
app.use("/tipos-exames", authMiddleware, requireRole("admin"), tipoExameRoutes);
app.use("/medicos", medicoRoutes);
app.use("/pacientes", pacienteRoutes);
app.use("/guias",  guiaRoutes);
app.use("/especialidades",  especialidadeRoutes);
// Rota sem protecao para uso futuro/testes:
// app.use("/consultas", consultaRoutes);
app.use("/consultas", authMiddleware, consultaRoutes);
app.use("/horarios-fixos",  horariosFixosRoutes);
app.use("/meus-agendamentos" ,meusAgendamentosRoutes);
app.use("/agenda-bloqueios", agendaBloqueioRoutes);

module.exports = app;
