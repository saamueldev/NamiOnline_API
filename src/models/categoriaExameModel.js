const mongoose = require("mongoose");

const categoriaExameSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CategoriaExame", categoriaExameSchema);