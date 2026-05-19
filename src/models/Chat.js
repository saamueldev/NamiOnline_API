const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    texto: {
      type: String,
      required: true,
    },

    remetente: {
      type: String,
      required: true,
    },

    remetenteId: {
      type: String,
      required: true,
    },

    destinatarioId: {
      type: String,
      required: true,
    },

    destinatarioNome: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "user",
    },

    visualizada: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Chat",
  ChatSchema
);