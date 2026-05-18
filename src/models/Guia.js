const mongoose = require("mongoose");

const GuiaSchema = new mongoose.Schema({
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paciente",
    required: true
  },

  especialidadeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Especialidade",
    required: true
  },

  urlArquivo: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["PENDENTE", "APROVADA", "RECUSADA"],
    default: "PENDENTE"
  },

  motivoRecusa: {
    type: String,
    default: null
  },

  analisadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    default: null
  },

  dataAnalise: {
    type: Date,
    default: null
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Guia", GuiaSchema);