const mongoose = require("mongoose");

const notificacaoSchema =
  new mongoose.Schema(
    {
      usuarioId: {
        type: String,
        required: true,
      },

      titulo: {
        type: String,
        required: true,
      },

      mensagem: {
        type: String,
        required: true,
      },

      tipo: {
        type: String,
        default: "geral",
      },

      rota: {
        type: String,
        default: "/",
      },

      lida: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Notificacao",
  notificacaoSchema
);