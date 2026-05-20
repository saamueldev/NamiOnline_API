const mongoose = require("mongoose");

const agendamentoExameSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },

    tipoExameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TipoExame",
      required: true,
    },

    data: {
      type: Date,
      required: true,
    },

    horario: {
      type: String,
      required: true,
      trim: true,
    },

    tipoAtendimento: {
      type: String,
      enum: ["Particular"],
      default: "Particular",
      required: true,
    },

    observacoes: {
      type: String,
      trim: true,
      default: "",
    },

    guiaArquivoNome: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["pendente", "confirmado", "cancelado", "realizado"],
      default: "pendente",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AgendamentoExame", agendamentoExameSchema);