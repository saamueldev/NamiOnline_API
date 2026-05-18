const especialidadeService = require("../services/especialidadeService");

class EspecialidadeController {
  async create(req, res) {
    try {
      const { name, requerGuia } = req.body;

      if (!name) {
        return res.status(400).json({
          mensagem: "Nome da especialidade é obrigatório."
        });
      }

      const especialidade = await especialidadeService.createEspecialidade({
        name,
        requerGuia: requerGuia || false
      });

      return res.status(201).json({
        mensagem: "Especialidade criada com sucesso.",
        especialidade
      });

    } catch (error) {
      return res.status(500).json({
        mensagem: "Erro ao criar especialidade.",
        erro: error.message
      });
    }
  }

  async index(req, res) {
    try {
      const especialidades = await especialidadeService.listEspecialidades();
      return res.status(200).json(especialidades);

    } catch (error) {
      return res.status(500).json({
        mensagem: "Erro ao listar especialidades.",
        erro: error.message
      });
    }
  }
}

module.exports = new EspecialidadeController();
