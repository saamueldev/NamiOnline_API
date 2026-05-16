const notificacoes = [];

exports.listarNotificacoes = (req, res) => {
  res.json(notificacoes);
};

exports.criarNotificacao = (req, res) => {
  const novaNotificacao = {
    id: Date.now(),
    titulo: req.body.titulo,
    mensagem: req.body.mensagem,
    lida: false,
  };

  notificacoes.push(novaNotificacao);

  res.status(201).json({
    mensagem: "Notificação criada",
    notificacao: novaNotificacao,
  });
};

exports.marcarComoLida = (req, res) => {
  const id = Number(req.params.id);

  const notificacao = notificacoes.find(n => n.id === id);

  if (!notificacao) {
    return res.status(404).json({
      mensagem: "Notificação não encontrada",
    });
  }

  notificacao.lida = true;

  res.json({
    mensagem: "Notificação marcada como lida",
  });
};