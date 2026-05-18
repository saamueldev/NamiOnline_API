const ConsultaService = require("../services/ConsultaService");
const Paciente = require("../models/Paciente");

class ConsultaController {

  async create(req, res) {
    try {

      const {
        pacienteId,
        medicoId,
        especialidadeId,
        guiaId,
        dataConsulta,
        tipo
      } = req.body;

      let pacienteConsultaId = pacienteId;

      if (!pacienteConsultaId && req.user?.id) {
        let paciente = await Paciente.findOne({ user: req.user.id });

        if (!paciente) {
          paciente = await Paciente.create({
            user: req.user.id,
            prontuario: `PAC-${req.user.id.slice(-6).toUpperCase()}-${Date.now().toString().slice(-6)}`
          });
        }

        pacienteConsultaId = paciente?._id;
      }

      if (!pacienteConsultaId) {
        return res.status(400).json({
          error: "Paciente nao encontrado para o usuario logado."
        });
      }

      const consulta = await ConsultaService.create({
        pacienteId: pacienteConsultaId,
        medicoId,
        especialidadeId,
        guiaId,
        dataConsulta,
        tipo
      });

      return res.status(201).json(consulta);

    } catch (error) {
      return res.status(400).json({
        error: error.message
      });
    }
  }

  async index(req, res) {
    try {

      const consultas = await ConsultaService.list();

      return res.status(200).json(consultas);

    } catch (error) {
      return res.status(500).json({
        error: error.message
      });
    }
  }

  async updateStatus(req, res) {
    try {

      const { id } = req.params;
      const { status } = req.body;

      const consultaAtualizada =
        await ConsultaService.updateStatus(id, status);

      return res.status(200).json(consultaAtualizada);

    } catch (error) {
      return res.status(400).json({
        error: error.message
      });
    }
  }

  async delete(req, res) {
    try {

      const { id } = req.params;

      await ConsultaService.delete(id);

      return res.status(204).send();

    } catch (error) {
      return res.status(400).json({
        error: error.message
      });
    }
  }

}

module.exports = new ConsultaController();
