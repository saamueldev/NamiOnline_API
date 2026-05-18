const Medico = require("../models/Medico");
const Especialidade = require("../models/Especialidade");
const mongoose = require("mongoose");

class MedicoService {
  formatStatusError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
  }

  normalizeDados(dados) {
    const especialidadeId = dados.especialidadeId || dados.especialidadeID || dados.especilidadeID;
    const name = dados.name || dados.nome;

    return {
      name: typeof name === "string" ? name.trim() : name,
      crm: typeof dados.crm === "string" ? dados.crm.trim().toUpperCase() : dados.crm,
      especialidadeId,
    };
  }

  async validateDados(dados, medicoId = null) {
    const dadosNormalizados = this.normalizeDados(dados);

    if (!dadosNormalizados.name || !dadosNormalizados.crm || !dadosNormalizados.especialidadeId) {
      throw this.formatStatusError("name, crm e especialidadeId sao obrigatorios", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(dadosNormalizados.especialidadeId)) {
      throw this.formatStatusError("especialidadeId invalido", 400);
    }

    const especialidade = await Especialidade.findById(dadosNormalizados.especialidadeId);

    if (!especialidade) {
      throw this.formatStatusError("Especialidade nao encontrada", 404);
    }

    const medicoComMesmoCrm = await Medico.findOne({
      crm: dadosNormalizados.crm,
      ...(medicoId ? { _id: { $ne: medicoId } } : {}),
    });

    if (medicoComMesmoCrm) {
      throw this.formatStatusError("Ja existe um medico cadastrado com esse CRM", 409);
    }

    return dadosNormalizados;
  }

  async create(dados) {
    const dadosNormalizados = await this.validateDados(dados);
    return await Medico.create(dadosNormalizados);
  }

  async list() {
    return await Medico.find()
      .populate("especialidadeId")
      .sort({ createdAt: -1 });
  }

  async searchId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw this.formatStatusError("id do medico invalido", 400);
    }

    return await Medico.findById(id).populate("especialidadeId");
  }

  async put(id, dados) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw this.formatStatusError("id do medico invalido", 400);
    }

    const dadosNormalizados = await this.validateDados(dados, id);

    return await Medico.findByIdAndUpdate(id, dadosNormalizados, {
      new: true,
      runValidators: true,
    }).populate("especialidadeId");
  }

  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw this.formatStatusError("id do medico invalido", 400);
    }

    return await Medico.findByIdAndDelete(id);
  }
}

module.exports = new MedicoService();
