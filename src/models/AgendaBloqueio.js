const mongoose = require("mongoose");

const AgendaBloqueioSchema = new mongoose.Schema(
  {
    medicoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medico",
      required: true,
    },

    dataInicio: {
      type: String,
      required: true,
    },

    dataFim: {
      type: String,
      required: true,
    },

    horaInicio: {
      type: String,
      required: true,
    },

    horaFim: {
      type: String,
      required: true,
    },

    motivo: {
      type: String,
      default: "Horário bloqueado",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AgendaBloqueio", AgendaBloqueioSchema);
