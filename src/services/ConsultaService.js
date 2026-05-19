const Consulta = require("../models/Consulta");

class ConsultaService {
  async create(dados) {
    const novaConsulta = await Consulta.create(dados);
    return novaConsulta;
  }

  async list() {
    const consultas = await Consulta.find()
      .populate({
        path: "pacienteId",
        populate: {
          path: "user",
          select: "name nome cpf telefone email"
        }
      })
      .populate("medicoId")
      .populate("especialidadeId")
      .populate("guiaId");

    return consultas;
  }

  async update(id, dados) {
    const consulta = await Consulta.findById(id);

    if (!consulta) {
      throw new Error("Consulta nao encontrada.");
    }

    if (dados.dataConsulta) {
      consulta.dataConsulta = dados.dataConsulta;
    }

    if (dados.status) {
      consulta.status = dados.status;
    }

    await consulta.save();

    return Consulta.findById(id)
      .populate({
        path: "pacienteId",
        populate: {
          path: "user",
          select: "name nome cpf telefone email"
        }
      })
      .populate("medicoId")
      .populate("especialidadeId")
      .populate("guiaId");
  }

  async updateStatus(id, status) {
    const consulta = await Consulta.findById(id);

    if (!consulta) {
      throw new Error("Consulta não encontrada.");
    }

    consulta.status = status;
    await consulta.save();

    return consulta;
  }

  async delete(id) {
    const consulta = await Consulta.findById(id);

    if (!consulta) {
      throw new Error("Consulta não encontrada.");
    }

    await Consulta.findByIdAndDelete(id);

    return true;
  }
}

module.exports = new ConsultaService();
