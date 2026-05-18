const Guia = require("../models/Guia");

class GuiaService {

  async create(dados) {
    const guia = await Guia.create(dados);

    return guia;
  }

  async list() {
    const guias = await Guia.find()
      .populate("pacienteId")
      .populate("especialidadeId")
      .populate("analisadoPor");

    return guias;
  }

  async listByPaciente(pacienteId) {
    const guias = await Guia.find({ pacienteId })
      .populate("pacienteId")
      .populate("especialidadeId")
      .populate("analisadoPor");

    return guias;
  }

  async updateStatus(id, status, motivoRecusa = null, analisadoPor = null) {

    const guia = await Guia.findById(id);

    if (!guia) {
      throw new Error("Guia não encontrada.");
    }

    guia.status = status;

    if (motivoRecusa) {
      guia.motivoRecusa = motivoRecusa;
    }

    if (analisadoPor) {
      guia.analisadoPor = analisadoPor;
    }

    guia.dataAnalise = new Date();

    await guia.save();

    return guia;
  }

  async delete(id) {

    const guia = await Guia.findById(id);

    if (!guia) {
      throw new Error("Guia não encontrada.");
    }

    await Guia.findByIdAndDelete(id);

    return true;
  }

}

module.exports = new GuiaService();