const mongoose = require("mongoose")

async function conectarBanco() {
  try {

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI nao configurada no arquivo .env")
    }

    await mongoose.connect(process.env.MONGO_URI)

    console.log("MongoDB conectado com sucesso")

  } catch (error) {

    console.error("Erro ao conectar com o MongoDB:", error.message)

    process.exit(1)
  }
}

module.exports = conectarBanco