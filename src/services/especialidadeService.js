const Especialidade = require("../models/Especialidade");

async function createEspecialidade(data) {
  return Especialidade.create(data);
}

async function listEspecialidades() {
  return Especialidade.find();
}

module.exports = {
  createEspecialidade,
  listEspecialidades
};
