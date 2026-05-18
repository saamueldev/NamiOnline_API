const mongoose = require("mongoose");

const ConsultaSchema = new mongoose.Schema({

  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paciente",
    required: true
  },

  medicoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medico",
    required: true
  },

  especialidadeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Especialidade",
    required: true
  },

  guiaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guia",
    default: null
  },

  dataConsulta: {
    type: Date,
    required: true
  },

  tipo: {
    type: String,
    enum: ["CONSULTA", "RETORNO"],
    required: true
  },

  status: {
    type: String,
    enum: ["PENDENTE", "AGENDADO", "CANCELADO", "CONCLUIDO"],
    default: "PENDENTE"
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Consulta", ConsultaSchema);

//  {
//   "pacienteId": "ID_DO_PACIENTE",
//   "medicoId": "ID_DO_MEDICO",
//   "especialidadeId": "ID_DA_ESPECIALIDADE",
//   "guiaId": null,
//   "dataConsulta": "2026-05-20T14:00:00",
//   "tipo": "CONSULTA"
// }