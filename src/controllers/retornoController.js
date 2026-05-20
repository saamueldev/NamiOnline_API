const Retorno = require("../models/Retorno");

// =========================
// LISTAR RETORNOS
// =========================
exports.listarRetornos = async (req, res) => {
  try {
    const retornos = await Retorno.find().sort({
      createdAt: -1,
    });

    res.status(200).json(retornos);
  } catch (error) {
    console.error("Erro ao listar retornos:", error);

    res.status(500).json({
      message: "Erro ao listar retornos",
    });
  }
};

// =========================
// CRIAR RETORNO
// =========================
exports.criarRetorno = async (req, res) => {
  try {
    const {
      especialidade,
      medico,
      data,
      horario,
      observacoes,
      usuarioId,
      usuarioNome,
    } = req.body;

    // =========================
    // VALIDAÇÕES
    // =========================
    if (
      !especialidade ||
      !medico ||
      !data ||
      !horario ||
      !usuarioId
    ) {
      return res.status(400).json({
        message: "Preencha todos os campos obrigatórios",
      });
    }

    const novoRetorno = new Retorno({
      especialidade,
      medico,
      data,
      horario,
      observacoes,
      usuarioId,
      usuarioNome,
    });

    await novoRetorno.save();

    res.status(201).json(novoRetorno);

  } catch (error) {
    console.error("Erro ao criar retorno:", error);

    res.status(500).json({
      message: "Erro ao criar retorno",
      error: error.message,
    });
  }
};

// =========================
// DELETAR RETORNO
// =========================
exports.deletarRetorno = async (req, res) => {
  try {
    const { id } = req.params;

    await Retorno.findByIdAndDelete(id);

    res.status(200).json({
      message: "Retorno deletado com sucesso",
    });

  } catch (error) {
    console.error("Erro ao deletar retorno:", error);

    res.status(500).json({
      message: "Erro ao deletar retorno",
    });
  }
};