const pacienteService = require("../services/pacienteService");

async function create(req, res) {
  try {
    const paciente = await pacienteService.createPaciente(req.body);
    return res.status(201).json(paciente);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function index(req, res) {
  try {
    const pacientes = await pacienteService.listPacientes();
    return res.json(pacientes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function showByCpf(req, res) {
  try {
    const paciente = await pacienteService.findPacienteByCpf(req.params.cpf);

    if (!paciente) {
      return res.status(404).json({ error: "Paciente nao encontrado para este CPF." });
    }

    return res.status(200).json(paciente);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  create,
  index,
  showByCpf,
};
