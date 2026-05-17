const retornos = [];

exports.listarRetornos = (req, res) => {
  res.json(retornos);
};

exports.criarRetorno = (req, res) => {
  const novoRetorno = {
    id: Date.now(),
    medico: req.body.medico,
    especialidade: req.body.especialidade,
    data: req.body.data,
    horario: req.body.horario,
  };

  retornos.push(novoRetorno);

  res.status(201).json({
    mensagem: "Retorno agendado com sucesso",
    retorno: novoRetorno,
  });
};

exports.deletarRetorno = (req, res) => {
  const id = Number(req.params.id);

  const index = retornos.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({
      mensagem: "Retorno não encontrado",
    });
  }

  retornos.splice(index, 1);

  res.json({
    mensagem: "Retorno removido",
  });
};