const MedicoService = require("../services/medicoService");

class MedicoController {
  async create(req, res) {
    try {
      const medico = await MedicoService.create(req.body);
      return res.status(201).json(medico);
    } catch (error) {
      return res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async list(req, res) {
    try {
      
      const medicos = await MedicoService.list();
      return res.status(200).json(medicos);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async index(req, res) {
    try {
      const medico = await MedicoService.searchId(req.params.id);

      if (!medico) {
        return res.status(404).json({ message: "Medico nao encontrado" });
      }

      return res.status(200).json(medico);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async patch(req, res) {
    try {
      const medico = await MedicoService.put(req.params.id, req.body);

      if (!medico) {
        return res.status(404).json({ message: "Medico nao encontrado" });
      }

      return res.status(200).json(medico);
    } catch (error) {
      return res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const medico = await MedicoService.delete(req.params.id);

      if (!medico) {
        return res.status(404).json({ message: "Medico nao encontrado" });
      }

      return res.status(200).json({ message: "Medico deletado com sucesso" });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

module.exports = new MedicoController();
