const mongoose = require("mongoose")

let connectionPromise = null

async function conectarBanco() {
  try {

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI nao configurada no arquivo .env")
    }

    if (mongoose.connection.readyState === 1) {
      return mongoose.connection
    }

    if (!connectionPromise) {
      connectionPromise = mongoose.connect(process.env.MONGO_URI)
    }

    await connectionPromise

    console.log("MongoDB conectado com sucesso")
    return mongoose.connection

  } catch (error) {

    console.error("Erro ao conectar com o MongoDB:", error.message)
    connectionPromise = null
    throw error
  }
}

module.exports = conectarBanco
