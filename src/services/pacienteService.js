const Paciente = require("../models/Paciente");

async function createPaciente(data) {
  return Paciente.create(data);
}

async function listPacientes() {
  return Paciente.find().populate("user");
}

module.exports = {
  createPaciente,
  listPacientes
};