const mongoose = require("mongoose");

function somenteNumeros(valor) {
  return String(valor || "").replace(/\D/g, "");
}

function somenteNumerosOuIndefinido(valor) {
  const numeros = somenteNumeros(valor);
  return numeros || undefined;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  cpf: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    set: somenteNumeros,
    minlength: 11,
    maxlength: 11,
    match: [/^\d{11}$/, "CPF deve conter 11 numeros"],
  },

  password: {
    type: String,
    required: true,
  },

  data_nasc: {
    type: Date,
  },

  sexo: {
    type: String,
  },

  telefone: {
    type: String,
    trim: true,
    set: somenteNumerosOuIndefinido,
    minlength: 10,
    maxlength: 11,
    match: [/^\d{10,11}$/, "Telefone deve conter 10 ou 11 numeros"],
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  resetPasswordToken: {
    type: String,
  },

  resetPasswordExpires: {
    type: Date,
  },

  tipo: {
    type: String,
    enum: ["usuario", "admin"],
    default: "usuario",
  },
}, { timestamps: true });

module.exports = mongoose.model("Usuario", UserSchema);

/*
POST /USUARIOS
{
  "name": "Maria Silva",
  "cpf": "12345678900",
  "password": "123456",
  "data_nasc": "1995-04-20",
  "sexo": "F",
  "telefone": "11999999999",
  "email": "maria@email.com"
}
*/
