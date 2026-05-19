const Retorno = require("../models/Retorno");

// LISTAR
async function listarRetornos(req, res) {
  try {
    const retornos = await Retorno.find();
    return res.json(retornos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// CRIAR
async function criarRetorno(req, res) {
  try {
    const retorno = await Retorno.create(req.body);
    return res.status(201).json(retorno);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// DELETAR
async function deletarRetorno(req, res) {
  try {
    const retorno = await Retorno.findByIdAndDelete(req.params.id);

    if (!retorno) {
      return res.status(404).json({ error: "Retorno não encontrado" });
    }

    return res.json({ message: "Deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  listarRetornos,
  criarRetorno,
  deletarRetorno,
};