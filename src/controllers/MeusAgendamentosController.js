const MeusAgendamentosService = require("../services/MeusAgendamentosService");

class MeusAgendamentosController {
  async listarPorPaciente(req, res) {
    try {
      const { pacienteId } = req.params;

      const agendamentos =
        await MeusAgendamentosService.listarPorPaciente(pacienteId);

      return res.status(200).json(agendamentos);

    } catch (error) {
      return res.status(500).json({
        error: error.message
      });
    }
  }
}

module.exports = new MeusAgendamentosController();