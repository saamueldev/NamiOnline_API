const Especialidade = require("../models/Especialidade");

async function createEspecialidade(data) {
  return Especialidade.create(data);
}

async function listEspecialidades() {
  return Especialidade.find().sort({ name: 1 });
}

module.exports = {
  createEspecialidade,
  listEspecialidades
};
