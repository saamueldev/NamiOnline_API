const Consulta = require("../models/Consulta");
// const Exame = require("../models/Exame");
// const Retorno = require("../models/Retorno");

class MeusAgendamentosService {
  async listarPorPaciente(pacienteId) {
    const consultas = await Consulta.find({ pacienteId })
      .populate("pacienteId")
      .populate("medicoId")
      .populate("especialidadeId")
      .populate("guiaId")


    // const exames = await Exame.find({ pacienteId })
    //   .populate("pacienteId");

    // const retornos = await Retorno.find({ pacienteId })
    //   .populate("pacienteId")
    //   .populate("medicoId")
    //   .populate("especialidadeId");

    const agendamentos = [
      ...consultas.map((consulta) => ({
        ...consulta.toObject(),
        tipoAgendamento: "CONSULTA"
      }))

      // ...exames.map((exame) => ({
      //   ...exame.toObject(),
      //   tipoAgendamento: "EXAME"
      // })),

      // ...retornos.map((retorno) => ({
      //   ...retorno.toObject(),
      //   tipoAgendamento: "RETORNO"
      // }))
    ];

    agendamentos.sort((a, b) => {
      const dataA = new Date(a.dataConsulta || a.dataExame || a.dataRetorno || a.createdAt);
      const dataB = new Date(b.dataConsulta || b.dataExame || b.dataRetorno || b.createdAt);

      return dataB - dataA;
    });

    return agendamentos;
  }
}

module.exports = new MeusAgendamentosService();