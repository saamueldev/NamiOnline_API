const AgendaMedicoService = require("../services/AgendaMedicoService");

class AgendaMedicoController {
  async create(req, res) {
    try {
      const {
        medicoId,
        especialidadeId,
        data,
        horaInicio,
        horaFim,
        disponivel
      } = req.body;

      if (!medicoId || !especialidadeId || !data || !horaInicio || !horaFim) {
        return res.status(400).json({
          error: "Médico, especialidade, data, hora inicial e hora final são obrigatórios."
        });
      }

      const agenda = await AgendaMedicoService.create({
        medicoId,
        especialidadeId,
        data,
        horaInicio,
        horaFim,
        disponivel
      });

      return res.status(201).json(agenda);

    } catch (error) {
      return res.status(400).json({
        error: error.message
      });
    }
  }

  async gerarAgendaDoDia(req, res) {
    try {
      const {
        medicoId,
        especialidadeId,
        data,
        horaInicio,
        horaFim,
        duracaoConsulta
      } = req.body;

      const agenda = await AgendaMedicoService.gerarAgendaDoDia({
        medicoId,
        especialidadeId,
        data,
        horaInicio,
        horaFim,
        duracaoConsulta
      });

      return res.status(201).json(agenda);

    } catch (error) {
      return res.status(400).json({
        error: error.message
      });
    }
  }

  async index(req, res) {
    try {
      const agendas = await AgendaMedicoService.list();

      return res.status(200).json(agendas);

    } catch (error) {
      return res.status(500).json({
        error: error.message
      });
    }
  }

  async listarPorMedico(req, res) {
    try {
      const { medicoId } = req.params;

      const agendas = await AgendaMedicoService.listarPorMedico(medicoId);

      return res.status(200).json(agendas);

    } catch (error) {
      return res.status(500).json({
        error: error.message
      });
    }
  }

  async listarDisponiveis(req, res) {
    try {
      const { medicoId, especialidadeId, data } = req.query;

      const agendas = await AgendaMedicoService.listarDisponiveis({
        medicoId,
        especialidadeId,
        data
      });

      return res.status(200).json(agendas);

    } catch (error) {
      return res.status(500).json({
        error: error.message
      });
    }
  }

  async atualizarDisponibilidade(req, res) {
    try {
      const { id } = req.params;
      const { disponivel } = req.body;

      const agenda = await AgendaMedicoService.atualizarDisponibilidade(
        id,
        disponivel
      );

      return res.status(200).json(agenda);

    } catch (error) {
      return res.status(400).json({
        error: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      await AgendaMedicoService.delete(id);

      return res.status(204).send();

    } catch (error) {
      return res.status(400).json({
        error: error.message
      });
    }
  }
}

module.exports = new AgendaMedicoController();