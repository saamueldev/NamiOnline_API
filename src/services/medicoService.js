const Medico = require("../models/Medico");

async function createMedico(data) {
  return Medico.create(data);
}

async function listMedicos() {
  return Medico.find().populate("user");
}

module.exports = {
  createMedico,
  listMedicos
};