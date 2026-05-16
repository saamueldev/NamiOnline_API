let configuracoes = {
  tema: "claro",
  notificacoes: true,
};

exports.buscarConfiguracoes = (req, res) => {
  res.json(configuracoes);
};

exports.salvarTema = (req, res) => {
  configuracoes.tema = req.body.tema;

  res.json({
    mensagem: "Tema atualizado",
    configuracoes,
  });
};

exports.alterarNotificacoes = (req, res) => {
  configuracoes.notificacoes = req.body.notificacoes;

  res.json({
    mensagem: "Configuração alterada",
    configuracoes,
  });
};