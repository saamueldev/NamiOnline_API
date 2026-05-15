const mongoose = require("mongoose");

const tipoExameSchema = new mongoose.Schema(
  {
    categoriaPrincipal: {
      type: String,
      required: true,
      trim: true,
    },

    nome: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    descricao: {
      type: String,
      required: true,
      trim: true,
    },

    quantidadeExames: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TipoExame", tipoExameSchema);