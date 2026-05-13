const mongoose = require("mongoose");

const MedicoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: [true, "O médico deve estar vinculado a um usuário."],
  },
  crm: {
    type: String,
    required: [true, "O CRM é obrigatório."],
    unique: true,
    trim: true,

  },
  especialidade: {
    type: String,
    required: [true, "A especialidade é obrigatória."],
    trim: true,
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Medico", MedicoSchema);


/*
POST /MEDICOS
{
  "user": "ID_DO_USUARIO",
  "crm": "123456-SP",
  "especialidade": "Cardiologia"
}
*/
