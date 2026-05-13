const medicoService = require("../services/medicoService");

async function create(req, res) {
  try {
    const medico = await medicoService.createMedico(req.body);
    return res.status(201).json(medico);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function index(req, res) {
  try {
    const medicos = await medicoService.listMedicos();
    return res.json(medicos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  create,
  index
};