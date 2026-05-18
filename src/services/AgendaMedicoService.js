const AgendaMedico = require("../models/AgendaMedico");

class AgendaMedicoService {
  async create(dados) {
    const agenda = await AgendaMedico.create(dados);
    return agenda;
  }

  async gerarAgendaDoDia({
    medicoId,
    especialidadeId,
    data,
    horaInicio,
    horaFim,
    duracaoConsulta
  }) {
    if (!medicoId || !especialidadeId || !data || !horaInicio || !horaFim || !duracaoConsulta) {
      throw new Error("Todos os campos são obrigatórios.");
    }

    const horarios = [];

    const [inicioHora, inicioMinuto] = horaInicio.split(":").map(Number);
    const [fimHora, fimMinuto] = horaFim.split(":").map(Number);

    const inicio = new Date(data);
    inicio.setHours(inicioHora, inicioMinuto, 0, 0);

    const fim = new Date(data);
    fim.setHours(fimHora, fimMinuto, 0, 0);

    let atual = new Date(inicio);

    while (atual < fim) {
      const proximo = new Date(atual);
      proximo.setMinutes(proximo.getMinutes() + Number(duracaoConsulta));

      if (proximo > fim) break;

      const horaInicioFormatada = atual.toTimeString().slice(0, 5);
      const horaFimFormatada = proximo.toTimeString().slice(0, 5);

      horarios.push({
        medicoId,
        especialidadeId,
        data,
        horaInicio: horaInicioFormatada,
        horaFim: horaFimFormatada,
        disponivel: true
      });

      atual = proximo;
    }

    if (horarios.length === 0) {
      throw new Error("Nenhum horário foi gerado. Verifique o intervalo informado.");
    }

    const agendaCriada = await AgendaMedico.insertMany(horarios);

    return agendaCriada;
  }

  async list() {
    const agendas = await AgendaMedico.find()
      .populate("medicoId")
      .populate("especialidadeId")
      .sort({ data: 1, horaInicio: 1 });

    return agendas;
  }

  async listarPorMedico(medicoId) {
    const agendas = await AgendaMedico.find({ medicoId })
      .populate("medicoId")
      .populate("especialidadeId")
      .sort({ data: 1, horaInicio: 1 });

    return agendas;
  }

  async listarDisponiveis(filtros) {
    const query = {
      disponivel: true
    };

    if (filtros.medicoId) {
      query.medicoId = filtros.medicoId;
    }

    if (filtros.especialidadeId) {
      query.especialidadeId = filtros.especialidadeId;
    }

    if (filtros.data) {
      const inicioDia = new Date(filtros.data);
      inicioDia.setHours(0, 0, 0, 0);

      const fimDia = new Date(filtros.data);
      fimDia.setHours(23, 59, 59, 999);

      query.data = {
        $gte: inicioDia,
        $lte: fimDia
      };
    }

    const agendas = await AgendaMedico.find(query)
      .populate("medicoId")
      .populate("especialidadeId")
      .sort({ data: 1, horaInicio: 1 });

    return agendas;
  }

  async atualizarDisponibilidade(id, disponivel) {
    const agenda = await AgendaMedico.findById(id);

    if (!agenda) {
      throw new Error("Horário da agenda não encontrado.");
    }

    agenda.disponivel = disponivel;

    await agenda.save();

    return agenda;
  }

  async delete(id) {
    const agenda = await AgendaMedico.findById(id);

    if (!agenda) {
      throw new Error("Horário da agenda não encontrado.");
    }

    await AgendaMedico.findByIdAndDelete(id);

    return true;
  }
}

module.exports = new AgendaMedicoService();