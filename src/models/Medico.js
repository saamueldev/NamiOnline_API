const mongoose = require("mongoose");

const MedicoSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: [true, "O nome é obrigatório"],
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
  "name": "Jose",
  "crm": "123456-SP",
  "especialidade": "Cardiologia"
}
*/
