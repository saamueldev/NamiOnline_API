require("dotenv").config();

const app = require("../src/app");
const connectDatabase = require("../src/config/database");

let databaseReady = null;

function ensureDatabase() {
  if (!databaseReady) {
    databaseReady = connectDatabase();
  }

  return databaseReady;
}

module.exports = async (req, res) => {
  try {
    const path = req.url.split("?")[0];
    const canSkipDatabase =
      req.method === "GET" && ["/", "/health"].includes(path);

    if (!canSkipDatabase) {
      await ensureDatabase();
    }

    return app(req, res);
  } catch (error) {
    console.error("Erro ao conectar com MongoDB:", error);

    return res.status(500).json({
      status: "error",
      message: "Erro ao conectar com o banco de dados",
      details: error.message,
    });
  }
};