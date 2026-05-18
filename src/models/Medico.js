const mongoose = require("mongoose");

const MedicoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "O nome e obrigatorio"],
    trim: true,
  },

  especialidadeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Especialidade",
    required: [true, "A especialidade e obrigatoria"],
  },

  crm: {
    type: String,
    required: [true, "O CRM e obrigatorio."],
    unique: true,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Medico", MedicoSchema);

/*
POST /MEDICOS
{
  "name": "Jose",
  "crm": "123456-SP",
  "especialidadeId": "ID_DA_ESPECIALIDADE"
}
*/
