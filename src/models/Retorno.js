const mongoose = require("mongoose");

const RetornoSchema = new mongoose.Schema({
  especialidade: {
    type: String,
    required: true,
  },

  medico: {
    type: String,
    required: true,
  },

  data: {
    type: String,
    required: true,
  },

  horario: {
    type: String,
    required: true,
  },

  observacoes: {
    type: String,
    default: "",
  },

  // =========================
  // USUÁRIO
  // =========================
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  usuarioNome: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Retorno", RetornoSchema);