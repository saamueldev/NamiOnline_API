const mongoose = require("mongoose");

const EventoSchema = new mongoose.Schema({

  titulo: {
    type: String,
    required: [true, "O titulo é obrigatorio"],
    trim: true
  },

  data: {
    type: Date,
    required: [true, "Data é obrigatória"],
    trim: true
  },

  horario: {
    type: String,
    required: [true, "Horário é obrigatória"],
    trim: true
  },

  local: {
    type: String,
    required: [true, "Local é obrigatório"],
    trim: true,
  },

  Imagem: {
    data: Buffer,
    contentType: String
  },

  descricao: {
    type: String, 
    required: [true, "descrição é obrigatório"],
    trim: true
  }


}, {
  timestamps: true,
});

module.exports = mongoose.model("Evento", EventoSchema);


