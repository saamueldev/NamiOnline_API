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
  },
  {
    timestamps: true,
  }
);

tipoExameSchema.index(
  { categoriaExameId: 1, nome: 1 },
  { unique: true }
);

module.exports = mongoose.model("TipoExame", tipoExameSchema);