// models/Configuracao.js
const mongoose = require("mongoose");

const configuracaoSchema = new mongoose.Schema({
  tema: {
    type: String,
    default: "claro",
  },
  notificacoes: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Configuracao", configuracaoSchema);