const mongoose = require("mongoose");

const tipoExameSchema = new mongoose.Schema(
  {
    categoriaExameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoriaExame",
      required: true,
    },

    nome: {
      type: String,
      required: true,
      trim: true,
    },

    descricao: {
      type: String,
      required: true,
      trim: true,
    },

    tempoMedioMinutos: {
      type: Number,
      required: true,
      min: 5,
    },

    guiaNecessaria: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("TipoExame", tipoExameSchema);