require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

// ROTAS
const retornoRoutes = require("./routes/retornoRoutes");
const notificacaoRoutes = require("./routes/notificacaoRoutes");
const configuracaoRoutes = require("./routes/configuracaoRoutes");

const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.use(require("cors")());
app.use(require("express").json());

// ROTAS DA API
app.use("/retornos", retornoRoutes);

app.use("/notificacoes", notificacaoRoutes);

app.use("/configuracoes", configuracaoRoutes);

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