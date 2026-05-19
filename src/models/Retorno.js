const mongoose = require("mongoose");

const RetornoSchema = new mongoose.Schema({
  especialidade: String,
  medico: String,
  data: String,
  horario: String,
  observacoes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Retorno", RetornoSchema);