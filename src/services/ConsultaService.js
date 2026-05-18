const Agendamento = require("../models/Consulta");

class ConsultaService {

  async create(dados) {
    const novaConsulta = await Consulta.create(dados);

    return novaConsulta;
  }

  async list() {
    const consultas = await Consulta.find()
      .populate("pacienteId")
      .populate("medicoId")
      .populate("especialidadeId")
      .populate("guiaId");

    return consultas;
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