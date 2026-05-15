const TipoExame = require("../models/tipoExameModel");

async function cadastrarTipoExame(req, res) {
  try {
    const { categoriaPrincipal, nome, descricao } = req.body;

    if (!categoriaPrincipal || !nome || !descricao) {
      return res.status(400).json({
        mensagem: "Categoria principal, nome e descrição são obrigatórios.",
      });
    }

    const tipoExameExistente = await TipoExame.findOne({ nome });

    if (tipoExameExistente) {
      return res.status(409).json({
        mensagem: "Já existe um tipo de exame com esse nome.",
      });
    }

    const novoTipoExame = await TipoExame.create({
      categoriaPrincipal,
      nome,
      descricao,
    });

    return res.status(201).json(novoTipoExame);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao cadastrar tipo de exame.",
      erro: error.message,
    });
  }
}

async function listarTiposExame(req, res) {
  try {
    const tiposExame = await TipoExame.find().sort({ createdAt: -1 });

    return res.status(200).json(tiposExame);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar tipos de exame.",
      erro: error.message,
    });
  }
}

async function excluirTipoExame(req, res) {
  try {
    const { id } = req.params;

    const tipoExame = await TipoExame.findById(id);

    if (!tipoExame) {
      return res.status(404).json({
        mensagem: "Tipo de exame não encontrado.",
      });
    }

    if (tipoExame.quantidadeExames > 0) {
      return res.status(400).json({
        mensagem: "Não é possível excluir um tipo de exame com exames vinculados.",
      });
    }

    await TipoExame.findByIdAndDelete(id);

    return res.status(200).json({
      mensagem: "Tipo de exame excluído com sucesso.",
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao excluir tipo de exame.",
      erro: error.message,
    });
  }
}

module.exports = {
  cadastrarTipoExame,
  listarTiposExame,
  excluirTipoExame,
};