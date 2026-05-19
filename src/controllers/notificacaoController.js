const Notificacao = require(
  "../models/Notificacao"
);

// ========================================
// CRIAR
// ========================================
exports.criarNotificacao =
  async (req, res) => {
    try {
      console.log(
        "BODY:",
        req.body
      );

      const notificacao =
        await Notificacao.create({
          usuarioId:
            req.body.usuarioId,

          titulo:
            req.body.titulo,

          mensagem:
            req.body.mensagem,

          tipo: req.body.tipo,

          rota: req.body.rota,

          lida:
            req.body.lida || false,
        });

      console.log(
        "NOTIFICAÇÃO SALVA:",
        notificacao
      );

      res.status(201).json(
        notificacao
      );
    } catch (error) {
      console.log(
        "ERRO NOTIFICAÇÃO:",
        error
      );

      res.status(500).json({
        erro:
          "Erro ao criar notificação",
        detalhes: error.message,
      });
    }
  };

// ========================================
// LISTAR
// ========================================
exports.buscarNotificacoes =
  async (req, res) => {
    try {
      const { usuarioId } =
        req.query;

      const notificacoes =
        await Notificacao.find({
          usuarioId,
        }).sort({
          createdAt: -1,
        });

      res.json(notificacoes);
    } catch (error) {
      res.status(500).json({
        erro:
          "Erro ao buscar notificações",
      });
    }
  };

// ========================================
// MARCAR COMO LIDA
// ========================================
exports.marcarComoLida =
  async (req, res) => {
    try {
      const notificacao =
        await Notificacao.findByIdAndUpdate(
          req.params.id,
          {
            lida: true,
          },
          { new: true }
        );

      res.json(notificacao);
    } catch (error) {
      res.status(500).json({
        erro:
          "Erro ao atualizar notificação",
      });
    }
  };

// ========================================
// DELETAR
// ========================================
exports.deletarNotificacao =
  async (req, res) => {
    try {
      await Notificacao.findByIdAndDelete(
        req.params.id
      );

      res.json({
        sucesso: true,
      });
    } catch (error) {
      res.status(500).json({
        erro:
          "Erro ao deletar notificação",
      });
    }
  };