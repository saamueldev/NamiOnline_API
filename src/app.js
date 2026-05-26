const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/usuarioRoutes");
const medicoRoutes = require("./routes/medicoRoutes");
const pacienteRoutes = require("./routes/pacienteRoutes");
const categoriaExameRoutes = require("./routes/categoriaExameRoutes");
const tipoExameRoutes = require("./routes/tipoExameRoutes");
const agendamentoExameRoutes = require("./routes/agendamentoExameRoutes");
const retornoRoutes = require("./routes/retornoRoutes");
const notificacaoRoutes = require("./routes/notificacaoRoutes");
const configuracaoRoutes = require("./routes/configuracaoRoutes");
const guiaRoutes = require("./routes/guiaRoutes");
const especialidadeRoutes = require("./routes/especialidadeRoutes");
const consultaRoutes = require("./routes/consultaRoutes");
const meusAgendamentosRoutes = require("./routes/meusAgendamentosRoutes");
const agendaBloqueioRoutes = require("./routes/agendaBloqueioRoutes");
const horariosFixosRoutes = require("./routes/horariosFixosRoutes");
const noticiasRoutes = require("./routes/noticiasRoutes");
const eventosRoutes = require("./routes/eventosRoutes");
const chatRoutes = require("./routes/ChatRoutes");

const authMiddleware = require("./middlewares/authMiddleware");
const requireRole = require("./middlewares/roleMiddleware");

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Nami Online API rodando"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/usuarios", userRoutes);
app.use("/medicos", authMiddleware, medicoRoutes);
app.use("/pacientes", authMiddleware, requireRole("admin"), pacienteRoutes);
app.use("/categorias-exames", authMiddleware, categoriaExameRoutes);
app.use("/tipos-exames", authMiddleware, tipoExameRoutes);
app.use("/agendamentos-exames", agendamentoExameRoutes);
app.use("/retornos", retornoRoutes);
app.use("/notificacoes", notificacaoRoutes);
app.use("/configuracoes", configuracaoRoutes);
app.use("/guias", guiaRoutes);
app.use("/especialidades", especialidadeRoutes);
app.use("/horarios-fixos", horariosFixosRoutes);
app.use("/agenda-bloqueios", agendaBloqueioRoutes);
app.use("/noticias", noticiasRoutes);
app.use("/eventos", eventosRoutes);
app.use("/chat", chatRoutes);

app.use("/consultas", authMiddleware, consultaRoutes);
app.use("/meus-agendamentos", authMiddleware, meusAgendamentosRoutes);

module.exports = app;
