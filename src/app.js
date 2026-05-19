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
const avatarRoutes = require("./routes/Avatarroutes");
const guiaRoutes = require("./routes/guiaRoutes");
const especialidadeRoutes = require("./routes/especialidadeRoutes");
const consultaRoutes = require("./routes/consultaRoutes");
const meusAgendamentosRoutes = require("./routes/meusAgendamentosRoutes");
const agendaBloqueioRoutes = require("./routes/agendaBloqueioRoutes");
const horariosFixosRoutes = require("./routes/horariosFixosRoutes");
const noticiasRoutes = require("./routes/noticiasRoutes");
const eventosRoutes = require("./routes/eventosRoutes");

const authMiddleware = require("./middlewares/authMiddleware");
const requireRole = require("./middlewares/roleMiddleware");

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.use("/usuarios", userRoutes);

app.use("/medicos", medicoRoutes);
app.use("/pacientes", pacienteRoutes);

app.use("/categorias-exames", categoriaExameRoutes);
app.use("/tipos-exames", tipoExameRoutes);
app.use("/agendamentos-exames", agendamentoExameRoutes);
app.use("/retornos", retornoRoutes);

app.use("/notificacoes", notificacaoRoutes);
app.use("/configuracoes", configuracaoRoutes);
app.use("/configuracoes/avatar", avatarRoutes);

app.use("/guias", guiaRoutes);
app.use("/especialidades", especialidadeRoutes);

app.use("/consultas", authMiddleware, consultaRoutes);
app.use("/meus-agendamentos", meusAgendamentosRoutes);

app.use("/horarios-fixos", horariosFixosRoutes);
app.use("/agenda-bloqueios", agendaBloqueioRoutes);
app.use("/noticias", noticiasRoutes);
app.use("/eventos", eventosRoutes);

module.exports = app;
