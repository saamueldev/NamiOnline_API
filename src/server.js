require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

// ROTAS
const retornoRoutes = require("./routes/retornoRoutes");
const notificacaoRoutes = require("./routes/notificacaoRoutes");
const configuracaoRoutes = require("./routes/configuracaoRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const requireRole = require("./middlewares/roleMiddleware");

const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.use(require("cors")());
app.use(require("express").json());

// ROTAS DA API
app.use("/retornos", authMiddleware, requireRole("usuario"), retornoRoutes);

app.use("/notificacoes", authMiddleware, requireRole("usuario"), notificacaoRoutes);

app.use("/configuracoes", authMiddleware, requireRole("usuario"), configuracaoRoutes);

// INICIAR SERVIDOR
async function startServer() {
  try {

    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {

    console.error("Erro ao iniciar servidor:", error);

  }
}

startServer();
