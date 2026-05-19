const CategoriaExame = require("../models/categoriaExameModel");
const TipoExame = require("../models/tipoExameModel");

async function cadastrarCategoriaExame(req, res) {
  try {
    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
      return res.status(400).json({
        mensagem: "Nome e descrição são obrigatórios.",
      });
    }

    const categoriaExistente = await CategoriaExame.findOne({
      nome: nome.trim(),
    });

    if (categoriaExistente) {
      return res.status(409).json({
        mensagem: "Já existe uma categoria de exame com esse nome.",
      });
    }

    const novaCategoria = await CategoriaExame.create({
      nome: nome.trim(),
      descricao: descricao.trim(),
    });

    return res.status(201).json(novaCategoria);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao cadastrar categoria de exame.",
      erro: error.message,
    });
  }
}

async function listarCategoriasExame(req, res) {
  try {
    const categorias = await CategoriaExame.find().sort({ createdAt: -1 });

    return res.status(200).json(categorias);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar categorias de exame.",
      erro: error.message,
    });
  }
}

async function buscarCategoriaExamePorId(req, res) {
  try {
    const { id } = req.params;

    const categoria = await CategoriaExame.findById(id);

    if (!categoria) {
      return res.status(404).json({
        mensagem: "Categoria de exame não encontrada.",
      });
    }

    return res.status(200).json(categoria);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar categoria de exame.",
      erro: error.message,
    });
  }
}

async function atualizarCategoriaExame(req, res) {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
      return res.status(400).json({
        mensagem: "Nome e descrição são obrigatórios.",
      });
    }

    const categoria = await CategoriaExame.findById(id);

    if (!categoria) {
      return res.status(404).json({
        mensagem: "Categoria de exame não encontrada.",
      });
    }

    const categoriaComMesmoNome = await CategoriaExame.findOne({
      nome: nome.trim(),
      _id: { $ne: id },
    });

    if (categoriaComMesmoNome) {
      return res.status(409).json({
        mensagem: "Já existe outra categoria de exame com esse nome.",
      });
    }

    categoria.nome = nome.trim();
    categoria.descricao = descricao.trim();

    await categoria.save();

    return res.status(200).json(categoria);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar categoria de exame.",
      erro: error.message,
    });
  }
}

async function excluirCategoriaExame(req, res) {
  try {
    const { id } = req.params;

    const categoria = await CategoriaExame.findById(id);

    if (!categoria) {
      return res.status(404).json({
        mensagem: "Categoria de exame não encontrada.",
      });
    }

    const quantidadeTiposVinculados = await TipoExame.countDocuments({
      categoriaExameId: id,
    });

    if (quantidadeTiposVinculados > 0) {
      return res.status(400).json({
        mensagem:
          "Não é possível excluir esta categoria, pois existem tipos de exame vinculados a ela.",
      });
    }

    await CategoriaExame.findByIdAndDelete(id);

    return res.status(200).json({
      mensagem: "Categoria de exame excluída com sucesso.",
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao excluir categoria de exame.",
      erro: error.message,
    });
  }
}


module.exports = {
  cadastrarCategoriaExame,
  listarCategoriasExame,
  buscarCategoriaExamePorId,
  atualizarCategoriaExame,
  excluirCategoriaExame,
};