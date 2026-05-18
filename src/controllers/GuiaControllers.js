const Guia = require("../models/Guia");

class GuiaController {
  async criar(req, res) {
    try {
      const { pacienteId, especialidadeId, urlArquivo } = req.body;

      if (!pacienteId || !especialidadeId || !urlArquivo) {
        return res.status(400).json({
          mensagem: "Paciente, especialidade e arquivo são obrigatórios."
        });
      }

      const guia = await Guia.create({
        pacienteId,
        especialidadeId,
        urlArquivo,
        status: "PENDENTE"
      });

      return res.status(201).json({
        mensagem: "Guia enviada com sucesso. Aguarde análise.",
        guia
      });

    } catch (error) {
      return res.status(500).json({
        mensagem: "Erro ao enviar guia.",
        erro: error.message
      });
    }
  }

  async listarMinhasGuias(req, res) {
    try {
      const { pacienteId } = req.params;

      const guias = await Guia.find({ pacienteId })
        .populate("especialidadeId")
        .sort({ createdAt: -1 });

      return res.status(200).json(guias);

    } catch (error) {
      return res.status(500).json({
        mensagem: "Erro ao listar guias.",
        erro: error.message
      });
    }
  }

  async listarPendentes(req, res) {
    try {
      const guias = await Guia.find({ status: "PENDENTE" })
        .populate("pacienteId")
        .populate("especialidadeId")
        .sort({ createdAt: -1 });

      return res.status(200).json(guias);

    } catch (error) {
      return res.status(500).json({
        mensagem: "Erro ao listar guias pendentes.",
        erro: error.message
      });
    }
  }

  async aprovar(req, res) {
    try {
      const { id } = req.params;
      const { analisadoPor } = req.body;

      const guia = await Guia.findByIdAndUpdate(
        id,
        {
          status: "APROVADA",
          analisadoPor,
          dataAnalise: new Date(),
          motivoRecusa: null
        },
        { new: true }
      );

      if (!guia) {
        return res.status(404).json({
          mensagem: "Guia não encontrada."
        });
      }

      return res.status(200).json({
        mensagem: "Guia aprovada com sucesso.",
        guia
      });

    } catch (error) {
      return res.status(500).json({
        mensagem: "Erro ao aprovar guia.",
        erro: error.message
      });
    }
  }

  async recusar(req, res) {
    try {
      const { id } = req.params;
      const { analisadoPor, motivoRecusa } = req.body;

      if (!motivoRecusa) {
        return res.status(400).json({
          mensagem: "O motivo da recusa é obrigatório."
        });
      }

      const guia = await Guia.findByIdAndUpdate(
        id,
        {
          status: "RECUSADA",
          analisadoPor,
          dataAnalise: new Date(),
          motivoRecusa
        },
        { new: true }
      );

      if (!guia) {
        return res.status(404).json({
          mensagem: "Guia não encontrada."
        });
      }

      return res.status(200).json({
        mensagem: "Guia recusada com sucesso.",
        guia
      });

    } catch (error) {
      return res.status(500).json({
        mensagem: "Erro ao recusar guia.",
        erro: error.message
      });
    }
  }
}

module.exports = new GuiaController();