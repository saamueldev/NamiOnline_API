const TipoExame = require("../models/tipoExameModel");
const CategoriaExame = require("../models/categoriaExameModel");
const AgendamentoExame = require("../models/AgendamentoExame");

function normalizarGuiaNecessaria(valor) {
  if (valor === true || valor === "true") {
    return true;
  }

  if (valor === false || valor === "false") {
    return false;
  }

  return false;
}

function normalizarTempoMedioMinutos(valor) {
  const tempo = Number(valor);

  if (!Number.isInteger(tempo) || tempo < 5) {
    return null;
  }

  return tempo;
}

async function cadastrarTipoExame(req, res) {
  try {
    const {
      categoriaExameId,
      nome,
      descricao,
      tempoMedioMinutos,
      guiaNecessaria,
    } = req.body;

    const tempoNormalizado = normalizarTempoMedioMinutos(tempoMedioMinutos);

    if (!categoriaExameId || !nome || !descricao || !tempoNormalizado) {
      return res.status(400).json({
        mensagem:
          "Categoria, nome, descrição e tempo médio do exame são obrigatórios.",
      });
    }

    const categoriaExiste = await CategoriaExame.findById(categoriaExameId);

    if (!categoriaExiste) {
      return res.status(404).json({
        mensagem: "Categoria de exame não encontrada.",
      });
    }

    const tipoExameExistente = await TipoExame.findOne({
      nome: nome.trim(),
      categoriaExameId,
    });

    if (tipoExameExistente) {
      return res.status(409).json({
        mensagem: "Já existe um tipo de exame com esse nome nesta categoria.",
      });
    }

    const novoTipoExame = await TipoExame.create({
      categoriaExameId,
      nome: nome.trim(),
      descricao: descricao.trim(),
      tempoMedioMinutos: tempoNormalizado,
      guiaNecessaria: normalizarGuiaNecessaria(guiaNecessaria),
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
    const filtro = {};

    if (req.query.categoriaExameId) {
      filtro.categoriaExameId = req.query.categoriaExameId;
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

    const {
      categoriaExameId,
      nome,
      descricao,
      tempoMedioMinutos,
      guiaNecessaria,
    } = req.body;

    const tempoNormalizado = normalizarTempoMedioMinutos(tempoMedioMinutos);

    if (!categoriaExameId || !nome || !descricao || !tempoNormalizado) {
      return res.status(400).json({
        mensagem:
          "Categoria, nome, descrição e tempo médio do exame são obrigatórios.",
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
      nome: nome.trim(),
      categoriaExameId,
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
    tipoExame.tempoMedioMinutos = tempoNormalizado;
    tipoExame.guiaNecessaria = normalizarGuiaNecessaria(guiaNecessaria);

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

    const possuiAgendamentos = await AgendamentoExame.exists({
      tipoExameId: id,
      status: { $ne: "cancelado" },
    });

    if (possuiAgendamentos) {
      return res.status(409).json({
        mensagem:
          "Este exame possui agendamentos vinculados e nao pode ser excluido.",
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
