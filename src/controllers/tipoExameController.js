const TipoExame = require("../models/tipoExameModel");
const CategoriaExame = require("../models/categoriaExameModel");

async function cadastrarTipoExame(req, res) {
  try {
    const { categoriaExameId, nome, descricao } = req.body;

    if (!categoriaExameId || !nome || !descricao) {
      return res.status(400).json({
        mensagem: "Categoria, nome e descrição são obrigatórios.",
      });
    }

    const categoriaExiste = await CategoriaExame.findById(categoriaExameId);

    if (!categoriaExiste) {
      return res.status(404).json({
        mensagem: "Categoria de exame não encontrada.",
      });
    }

    const tipoExistente = await TipoExame.findOne({
      categoriaExameId,
      nome: nome.trim(),
    });

    if (tipoExistente) {
      return res.status(409).json({
        mensagem: "Já existe um tipo de exame com esse nome nesta categoria.",
      });
    }

    const novoTipoExame = await TipoExame.create({
      categoriaExameId,
      nome: nome.trim(),
      descricao: descricao.trim(),
    });

    const tipoComCategoria = await TipoExame.findById(novoTipoExame._id).populate(
      "categoriaExameId",
      "nome descricao"
    );

    return res.status(201).json(tipoComCategoria);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao cadastrar tipo de exame.",
      erro: error.message,
    });
  }
}

async function listarTiposExame(req, res) {
  try {
    const { categoriaExameId } = req.query;

    const filtro = {};

    if (categoriaExameId) {
      filtro.categoriaExameId = categoriaExameId;
    }

    const tiposExame = await TipoExame.find(filtro)
      .populate("categoriaExameId", "nome descricao")
      .sort({ createdAt: -1 });

    return res.status(200).json(tiposExame);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar tipos de exame.",
      erro: error.message,
    });
  }
}

async function buscarTipoExamePorId(req, res) {
  try {
    const { id } = req.params;

    const tipoExame = await TipoExame.findById(id).populate(
      "categoriaExameId",
      "nome descricao"
    );

    if (!tipoExame) {
      return res.status(404).json({
        mensagem: "Tipo de exame não encontrado.",
      });
    }

    return res.status(200).json(tipoExame);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar tipo de exame.",
      erro: error.message,
    });
  }
}

async function atualizarTipoExame(req, res) {
  try {
    const { id } = req.params;
    const { categoriaExameId, nome, descricao } = req.body;

    if (!categoriaExameId || !nome || !descricao) {
      return res.status(400).json({
        mensagem: "Categoria, nome e descrição são obrigatórios.",
      });
    }

    const tipoExame = await TipoExame.findById(id);

    if (!tipoExame) {
      return res.status(404).json({
        mensagem: "Tipo de exame não encontrado.",
      });
    }

    const categoriaExiste = await CategoriaExame.findById(categoriaExameId);

    if (!categoriaExiste) {
      return res.status(404).json({
        mensagem: "Categoria de exame não encontrada.",
      });
    }

    const tipoComMesmoNome = await TipoExame.findOne({
      categoriaExameId,
      nome: nome.trim(),
      _id: { $ne: id },
    });

    if (tipoComMesmoNome) {
      return res.status(409).json({
        mensagem: "Já existe outro tipo de exame com esse nome nesta categoria.",
      });
    }

    tipoExame.categoriaExameId = categoriaExameId;
    tipoExame.nome = nome.trim();
    tipoExame.descricao = descricao.trim();

    await tipoExame.save();

    const tipoAtualizado = await TipoExame.findById(id).populate(
      "categoriaExameId",
      "nome descricao"
    );

    return res.status(200).json(tipoAtualizado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar tipo de exame.",
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
  buscarTipoExamePorId,
  atualizarTipoExame,
  excluirTipoExame,
};