const Configuracao = require("../models/Configuracao");

// buscar config
exports.buscarConfiguracoes = async (req, res) => {
  try {
    const config = await Configuracao.findOne();

    if (!config) {
      const novaConfig = await Configuracao.create({});
      return res.json(novaConfig);
    }

    res.json(config);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar configurações",
      erro: error.message,
    });
  }
};

// salvar tema
exports.salvarTema = async (req, res) => {
  try {
    const { tema } = req.body;

    const config = await Configuracao.findOneAndUpdate(
      {},
      { tema },
      { new: true, upsert: true }
    );

    res.json({
      sucesso: true,
      mensagem: "Tema salvo com sucesso",
      configuracoes: config,
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao salvar tema",
      erro: error.message,
    });
  }
};