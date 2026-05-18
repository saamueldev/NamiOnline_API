const mongoose = require("mongoose");

const AgendaMedicoSchema = new mongoose.Schema({
  medicoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medico",
    required: true
  },

  especialidadeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Especialidade",
    required: true
  },

  data: {
    type: Date,
    required: true
  },

  horaInicio: {
    type: String,
    required: true
  },

  horaFim: {
    type: String,
    required: true
  },

  disponivel: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("AgendaMedico", AgendaMedicoSchema);