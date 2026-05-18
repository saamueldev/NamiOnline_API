const agendaBloqueioService = require("../services/agendaBloqueioService");

class AgendaBloqueioController {

  async create(req, res) {
    try {
      const block = await agendaBloqueioService.createBlock(req.body);

      return res.status(201).json({
        mensagem: "Horário bloqueado com sucesso.",
        block,
      });

    } catch (error) {
      return res.status(500).json({
        mensagem: "Erro ao bloquear horário.",
        erro: error.message,
      });
    }
  }

  async index(req, res) {
    try {
      const blocks = await agendaBloqueioService.listBlocks();

      return res.status(200).json(blocks);

    } catch (error) {
      return res.status(500).json({
        mensagem: "Erro ao listar bloqueios.",
        erro: error.message,
      });
    }
  }

  async show(req, res) {
    try {
      const block = await agendaBloqueioService.findBlockById(
        req.params.id
      );

      if (!block) {
        return res.status(404).json({
          mensagem: "Bloqueio não encontrado.",
        });
      }

      return res.status(200).json(block);

    } catch (error) {
      return res.status(500).json({
        mensagem: "Erro ao buscar bloqueio.",
        erro: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const block = await agendaBloqueioService.updateBlock(
        req.params.id,
        req.body
      );

      if (!block) {
        return res.status(404).json({
          mensagem: "Bloqueio não encontrado.",
        });
      }

      return res.status(200).json({
        mensagem: "Bloqueio atualizado com sucesso.",
        block,
      });

    } catch (error) {
      return res.status(500).json({
        mensagem: "Erro ao atualizar bloqueio.",
        erro: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const block = await agendaBloqueioService.deleteBlock(
        req.params.id
      );

      if (!block) {
        return res.status(404).json({
          mensagem: "Bloqueio não encontrado.",
        });
      }

      return res.status(200).json({
        mensagem: "Bloqueio removido com sucesso.",
      });

    } catch (error) {
      return res.status(500).json({
        mensagem: "Erro ao remover bloqueio.",
        erro: error.message,
      });
    }
  }
}

module.exports = new AgendaBloqueioController();