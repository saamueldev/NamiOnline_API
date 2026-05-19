const mongoose = require("mongoose");

const NoticiaSchema = new mongoose.Schema({
  Autor: {
    type: String,
    required: [true, "O Autor é obrigatorio"],
    trim: true,
  },

  Titulo: {
    type: String,
    required: [true, "O titulo é obrigatorio"],
  },

  Imagem: {
    data: Buffer,
    contentType: String
  },

  Data: {
    type: Date,
    required: [true, "Data é obrigatória"],
    trim: true
  },

  Categoria: {
    type: String,
    required: [true, "Categoria é obrigatória"],
    trim: true
  },

  Resumo: {
    type: String,
    required: [true, "Resumo é obrigatório"],
    trim: true
  },

  Conteudo: {
    type: String, 
    required: [true, "Conteúdo é obrigatório"],
    trim: true
  }

}, {
  timestamps: true,
});

module.exports = mongoose.model("Noticia", NoticiaSchema);


