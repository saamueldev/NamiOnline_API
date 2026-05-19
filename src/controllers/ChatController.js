const Chat = require("../models/Chat");

class ChatController {
  // =========================
  // ENVIAR MENSAGEM
  // =========================
  async enviar(req, res) {
    try {
      const mensagem = await Chat.create(req.body);

      return res.status(201).json(mensagem);

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        erro: "Erro ao enviar mensagem",
      });
    }
  }

  // =========================
  // BUSCAR CONVERSA
  // =========================
  async conversa(req, res) {
    try {
      const { usuarioId } = req.params;

      const mensagens = await Chat.find({
        $or: [
          {
            destinatarioId: usuarioId,
          },
          {
            remetenteId: usuarioId,
          },
        ],
      }).sort({ createdAt: 1 });

      return res.json(mensagens);

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        erro: "Erro ao buscar conversa",
      });
    }
  }

  // =========================
  // MARCAR VISUALIZADA
  // =========================
  async visualizar(req, res) {
    try {
      const { id } = req.params;

      await Chat.findByIdAndUpdate(id, {
        visualizada: true,
      });

      return res.json({
        ok: true,
      });

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        erro: "Erro ao atualizar mensagem",
      });
    }
  }
}

module.exports = new ChatController();