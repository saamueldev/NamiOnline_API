require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

const PORT = process.env.PORT || 3000;

let databaseReady = null;

function ensureDatabase() {
  if (!databaseReady) {
    databaseReady = connectDatabase();
  }

  return databaseReady;
}

async function startServer() {
  try {
    await ensureDatabase();

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
  }
}

if (process.env.VERCEL) {
  module.exports = async (req, res) => {
    try {
      const path = req.url.split("?")[0];
      const canRespondWithoutDatabase = req.method === "GET" && ["/", "/health"].includes(path);

      if (!canRespondWithoutDatabase) {
        await ensureDatabase();
      }

      return app(req, res);
    } catch (error) {
      console.error("Erro na funcao serverless:", error);
      return res.status(500).json({
        status: "error",
        message: "Erro ao iniciar API"
      });
    }
  };
} else {
  startServer();
}
