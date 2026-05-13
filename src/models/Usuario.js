const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  cpf: String,
  password: String,
  data_nasc: Date,
  sexo: String,
  telefone: String,
  email: String
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