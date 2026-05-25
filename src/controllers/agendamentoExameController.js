const AgendamentoExame = require("../models/AgendamentoExame");
const TipoExame = require("../models/tipoExameModel");
const Usuario = require("../models/Usuario");

const INICIO_FUNCIONAMENTO = "07:00";
const FIM_FUNCIONAMENTO = "17:00";
const MARGEM_AGENDAMENTO_MINUTOS = 30;
const STATUS_ATIVOS = ["pendente", "confirmado"];
const TIPO_ATENDIMENTO_PADRAO = "Particular";

function converterHorarioParaMinutos(horario) {
  const [horas, minutos] = horario.split(":").map(Number);
  return horas * 60 + minutos;
}

function converterMinutosParaHorario(totalMinutos) {
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(
    2,
    "0"
  )}`;
}

function gerarHorariosPorPeriodo(inicio, fim, intervaloMinutos) {
  const horarios = [];

  const inicioMinutos = converterHorarioParaMinutos(inicio);
  const fimMinutos = converterHorarioParaMinutos(fim);

  for (
    let horarioAtual = inicioMinutos;
    horarioAtual + intervaloMinutos <= fimMinutos;
    horarioAtual += intervaloMinutos
  ) {
    horarios.push(converterMinutosParaHorario(horarioAtual));
  }

  return horarios;
}

function gerarHorariosPossiveis(tempoMedioMinutos) {
  return gerarHorariosPorPeriodo(
    INICIO_FUNCIONAMENTO,
    FIM_FUNCIONAMENTO,
    tempoMedioMinutos
  );
}

function criarIntervaloDaData(data) {
  const inicio = new Date(`${data}T00:00:00.000Z`);
  const fim = new Date(`${data}T23:59:59.999Z`);

  return { inicio, fim };
}

function formatarDataLocal(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function obterMinutosAtuaisComMargem() {
  const agora = new Date();

  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

  return minutosAgora + MARGEM_AGENDAMENTO_MINUTOS;
}

function filtrarHorariosPassadosDoDia(horarios, data) {
  const hoje = formatarDataLocal(new Date());

  if (data !== hoje) {
    return {
      horariosFiltrados: horarios,
      horariosRemovidosPorHorarioAtual: [],
    };
  }

  const limiteMinutos = obterMinutosAtuaisComMargem();

  const horariosFiltrados = horarios.filter((horario) => {
    const horarioMinutos = converterHorarioParaMinutos(horario);
    return horarioMinutos >= limiteMinutos;
  });

  const horariosRemovidosPorHorarioAtual = horarios.filter((horario) => {
    const horarioMinutos = converterHorarioParaMinutos(horario);
    return horarioMinutos < limiteMinutos;
  });

  return {
    horariosFiltrados,
    horariosRemovidosPorHorarioAtual,
  };
}

function statusInicialDoAgendamento(tipoExame) {
  return tipoExame.guiaNecessaria ? "pendente" : "confirmado";
}

function normalizarStatusAgendamento(status) {
  const statusNormalizado = String(status || "").toLowerCase();
  const statusPermitidos = ["pendente", "confirmado", "cancelado", "realizado"];

  return statusPermitidos.includes(statusNormalizado) ? statusNormalizado : null;
}

async function buscarHorariosOcupados(tipoExameId, data) {
  const { inicio, fim } = criarIntervaloDaData(data);

  const agendamentosOcupados = await AgendamentoExame.find({
    tipoExameId,
    data: {
      $gte: inicio,
      $lte: fim,
    },
    status: {
      $in: STATUS_ATIVOS,
    },
  });

  return agendamentosOcupados.map((agendamento) => agendamento.horario);
}

async function cadastrarAgendamentoExame(req, res) {
  try {
    const usuarioId = req.user.id;

    const {
      tipoExameId,
      data,
      horario,
      observacoes,
      guiaArquivoNome,
    } = req.body;

    if (!tipoExameId || !data || !horario) {
      return res.status(400).json({
        mensagem: "Tipo de exame, data e horário são obrigatórios.",
      });
    }

    const tipoExame = await TipoExame.findById(tipoExameId);

    if (!tipoExame) {
      return res.status(404).json({
        mensagem: "Tipo de exame não encontrado.",
      });
    }

    if (!tipoExame.tempoMedioMinutos) {
      return res.status(400).json({
        mensagem: "Tempo médio do exame não informado.",
      });
    }

    if (tipoExame.guiaNecessaria && !guiaArquivoNome) {
      return res.status(400).json({
        mensagem: "Este exame exige guia médica. Anexe a guia para continuar.",
      });
    }

    const horariosPossiveis = gerarHorariosPossiveis(
      tipoExame.tempoMedioMinutos
    );

    const { horariosFiltrados } = filtrarHorariosPassadosDoDia(
      horariosPossiveis,
      data
    );

    if (!horariosFiltrados.includes(horario)) {
      return res.status(400).json({
        mensagem:
          "Horário inválido ou indisponível para este exame. Escolha um horário disponível.",
      });
    }

    const horariosOcupados = await buscarHorariosOcupados(tipoExameId, data);

    if (horariosOcupados.includes(horario)) {
      return res.status(409).json({
        mensagem: "Este horário já está reservado para este exame.",
      });
    }

    const novoAgendamento = await AgendamentoExame.create({
      usuarioId,
      tipoExameId,
      data: new Date(`${data}T00:00:00.000Z`),
      horario,
      tipoAtendimento: TIPO_ATENDIMENTO_PADRAO,
      observacoes: observacoes || "",
      guiaArquivoNome: guiaArquivoNome || "",
      status: statusInicialDoAgendamento(tipoExame),
    });

    const agendamentoPopulado = await AgendamentoExame.findById(
      novoAgendamento._id
    )
      .populate("usuarioId", "name email cpf telefone")
      .populate({
        path: "tipoExameId",
        populate: {
          path: "categoriaExameId",
          select: "nome descricao",
        },
      });

    return res.status(201).json({
      mensagem: "Agendamento de exame criado com sucesso.",
      agendamento: agendamentoPopulado,
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao cadastrar agendamento de exame.",
      erro: error.message,
    });
  }
}

async function listarHorariosDisponiveis(req, res) {
  try {
    const { tipoExameId, data } = req.query;

    if (!tipoExameId || !data) {
      return res.status(400).json({
        mensagem: "Tipo de exame e data são obrigatórios.",
      });
    }

    const tipoExame = await TipoExame.findById(tipoExameId);

    if (!tipoExame) {
      return res.status(404).json({
        mensagem: "Tipo de exame não encontrado.",
      });
    }

    const tempoMedioMinutos = tipoExame.tempoMedioMinutos;

    if (!tempoMedioMinutos) {
      return res.status(400).json({
        mensagem: "Tempo médio do exame não informado.",
      });
    }

    const horariosPossiveis = gerarHorariosPossiveis(tempoMedioMinutos);

    const {
      horariosFiltrados,
      horariosRemovidosPorHorarioAtual,
    } = filtrarHorariosPassadosDoDia(horariosPossiveis, data);

    const horariosOcupados = await buscarHorariosOcupados(tipoExameId, data);

    const horariosDisponiveis = horariosFiltrados.filter(
      (horario) => !horariosOcupados.includes(horario)
    );

    return res.status(200).json({
      tipoExameId,
      data,
      inicioFuncionamento: INICIO_FUNCIONAMENTO,
      fimFuncionamento: FIM_FUNCIONAMENTO,
      tempoMedioMinutos,
      margemAgendamentoMinutos: MARGEM_AGENDAMENTO_MINUTOS,
      horariosDisponiveis,
      horariosOcupados,
      horariosIndisponiveisPorHorarioAtual: horariosRemovidosPorHorarioAtual,
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar horários disponíveis.",
      erro: error.message,
    });
  }
}

async function listarDisponibilidadeMensal(req, res) {
  try {
    const { tipoExameId, mes } = req.query;

    if (!tipoExameId || !mes) {
      return res.status(400).json({
        mensagem: "Tipo de exame e mês são obrigatórios.",
      });
    }

    const tipoExame = await TipoExame.findById(tipoExameId);

    if (!tipoExame) {
      return res.status(404).json({
        mensagem: "Tipo de exame não encontrado.",
      });
    }

    const tempoMedioMinutos = tipoExame.tempoMedioMinutos;

    if (!tempoMedioMinutos) {
      return res.status(400).json({
        mensagem: "Tempo médio do exame não informado.",
      });
    }

    const [ano, mesNumero] = mes.split("-").map(Number);

    if (!ano || !mesNumero || mesNumero < 1 || mesNumero > 12) {
      return res.status(400).json({
        mensagem: "Mês inválido. Use o formato YYYY-MM.",
      });
    }

    const quantidadeDias = new Date(ano, mesNumero, 0).getDate();

    const horariosPossiveis = gerarHorariosPossiveis(tempoMedioMinutos);

    const diasDisponiveis = [];
    const diasLotados = [];
    const diasPassados = [];

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    for (let dia = 1; dia <= quantidadeDias; dia += 1) {
      const dataFormatada = `${ano}-${String(mesNumero).padStart(
        2,
        "0"
      )}-${String(dia).padStart(2, "0")}`;

      const dataComparada = new Date(
        ano,
        mesNumero - 1,
        dia,
        0,
        0,
        0,
        0
      );

      if (dataComparada < hoje) {
        diasPassados.push(dataFormatada);
        continue;
      }

      const {
        horariosFiltrados,
      } = filtrarHorariosPassadosDoDia(horariosPossiveis, dataFormatada);

      const horariosOcupados = await buscarHorariosOcupados(
        tipoExameId,
        dataFormatada
      );

      const horariosDisponiveis = horariosFiltrados.filter(
        (horario) => !horariosOcupados.includes(horario)
      );

      if (horariosDisponiveis.length > 0) {
        diasDisponiveis.push(dataFormatada);
      } else {
        diasLotados.push(dataFormatada);
      }
    }

    return res.status(200).json({
      tipoExameId,
      mes,
      inicioFuncionamento: INICIO_FUNCIONAMENTO,
      fimFuncionamento: FIM_FUNCIONAMENTO,
      tempoMedioMinutos,
      margemAgendamentoMinutos: MARGEM_AGENDAMENTO_MINUTOS,
      diasDisponiveis,
      diasLotados,
      diasPassados,
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar disponibilidade mensal.",
      erro: error.message,
    });
  }
}

async function listarMeusAgendamentosExame(req, res) {
  try {
    const usuarioId = req.user.id;

    const agendamentos = await AgendamentoExame.find({ usuarioId })
      .populate({
        path: "tipoExameId",
        populate: {
          path: "categoriaExameId",
          select: "nome descricao",
        },
      })
      .sort({ data: 1, horario: 1 });

    return res.status(200).json(agendamentos);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar seus agendamentos de exame.",
      erro: error.message,
    });
  }
}

async function listarTodosAgendamentosExame(req, res) {
  try {
    if (req.user.tipo !== "admin") {
      return res.status(403).json({
        mensagem: "Acesso negado.",
      });
    }

    const agendamentos = await AgendamentoExame.find()
      .populate("usuarioId", "name email cpf telefone")
      .populate({
        path: "tipoExameId",
        populate: {
          path: "categoriaExameId",
          select: "nome descricao",
        },
      })
      .sort({ data: 1, horario: 1 });

    return res.status(200).json(agendamentos);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar agendamentos de exame.",
      erro: error.message,
    });
  }
}

async function cancelarAgendamentoExame(req, res) {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;

    const agendamento = await AgendamentoExame.findById(id);

    if (!agendamento) {
      return res.status(404).json({
        mensagem: "Agendamento não encontrado.",
      });
    }

    const usuarioDono = agendamento.usuarioId.toString() === usuarioId;
    const usuarioAdmin = req.user.tipo === "admin";

    if (!usuarioDono && !usuarioAdmin) {
      return res.status(403).json({
        mensagem: "Você não tem permissão para cancelar este agendamento.",
      });
    }

    agendamento.status = "cancelado";
    await agendamento.save();

    return res.status(200).json({
      mensagem: "Agendamento cancelado com sucesso.",
      agendamento,
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao cancelar agendamento.",
      erro: error.message,
    });
  }
}

async function atualizarAgendamentoExame(req, res) {
  try {
    const { id } = req.params;
    const { data, horario, status, observacoes } = req.body;

    const agendamento = await AgendamentoExame.findById(id);

    if (!agendamento) {
      return res.status(404).json({
        mensagem: "Agendamento nao encontrado.",
      });
    }

    if (req.user.tipo !== "admin") {
      return res.status(403).json({
        mensagem: "Acesso negado.",
      });
    }

    if (data) {
      agendamento.data = new Date(`${data}T00:00:00.000Z`);
    }

    if (horario) {
      agendamento.horario = horario;
    }

    if (status) {
      const statusNormalizado = normalizarStatusAgendamento(status);

      if (!statusNormalizado) {
        return res.status(400).json({
          mensagem: "Status de agendamento invalido.",
        });
      }

      agendamento.status = statusNormalizado;
    }

    if (observacoes !== undefined) {
      agendamento.observacoes = observacoes;
    }

    await agendamento.save();

    const agendamentoPopulado = await AgendamentoExame.findById(id)
      .populate("usuarioId", "name email cpf telefone")
      .populate({
        path: "tipoExameId",
        populate: {
          path: "categoriaExameId",
          select: "nome descricao",
        },
      });

    return res.status(200).json(agendamentoPopulado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar agendamento.",
      erro: error.message,
    });
  }
}

async function cadastrarAgendamentoExameAdmin(req, res) {
  try {
    if (req.user.tipo !== "admin") {
      return res.status(403).json({
        mensagem: "Acesso negado.",
      });
    }

    const {
      usuarioId,
      tipoExameId,
      data,
      horario,
      observacoes,
      guiaArquivoNome,
    } = req.body;

    if (!usuarioId || !tipoExameId || !data || !horario) {
      return res.status(400).json({
        mensagem: "Paciente, tipo de exame, data e horário são obrigatórios.",
      });
    }

    const paciente = await Usuario.findById(usuarioId);

    if (!paciente) {
      return res.status(404).json({
        mensagem: "Paciente não encontrado.",
      });
    }

    if (paciente.tipo !== "usuario") {
      return res.status(400).json({
        mensagem: "O usuário informado não é um paciente.",
      });
    }

    const tipoExame = await TipoExame.findById(tipoExameId);

    if (!tipoExame) {
      return res.status(404).json({
        mensagem: "Tipo de exame não encontrado.",
      });
    }

    if (!tipoExame.tempoMedioMinutos) {
      return res.status(400).json({
        mensagem: "Tempo médio do exame não informado.",
      });
    }

    if (tipoExame.guiaNecessaria && !guiaArquivoNome) {
      return res.status(400).json({
        mensagem: "Este exame exige guia médica. Anexe a guia para continuar.",
      });
    }

    const horariosPossiveis = gerarHorariosPossiveis(
      tipoExame.tempoMedioMinutos
    );

    const { horariosFiltrados } = filtrarHorariosPassadosDoDia(
      horariosPossiveis,
      data
    );

    if (!horariosFiltrados.includes(horario)) {
      return res.status(400).json({
        mensagem:
          "Horário inválido ou indisponível para este exame. Escolha um horário disponível.",
      });
    }

    const horariosOcupados = await buscarHorariosOcupados(tipoExameId, data);

    if (horariosOcupados.includes(horario)) {
      return res.status(409).json({
        mensagem: "Este horário já está reservado para este exame.",
      });
    }

    const novoAgendamento = await AgendamentoExame.create({
      usuarioId,
      tipoExameId,
      data: new Date(`${data}T00:00:00.000Z`),
      horario,
      tipoAtendimento: TIPO_ATENDIMENTO_PADRAO,
      observacoes: observacoes || "",
      guiaArquivoNome: guiaArquivoNome || "",
      status: statusInicialDoAgendamento(tipoExame),
    });

    const agendamentoPopulado = await AgendamentoExame.findById(
      novoAgendamento._id
    )
      .populate("usuarioId", "name email cpf telefone data_nasc sexo")
      .populate({
        path: "tipoExameId",
        populate: {
          path: "categoriaExameId",
          select: "nome descricao",
        },
      });

    return res.status(201).json({
      mensagem: "Agendamento de exame criado com sucesso pelo funcionário.",
      agendamento: agendamentoPopulado,
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao cadastrar agendamento de exame pelo funcionário.",
      erro: error.message,
    });
  }
}

module.exports = {
  cadastrarAgendamentoExame,
  cadastrarAgendamentoExameAdmin,
  listarHorariosDisponiveis,
  listarDisponibilidadeMensal,
  listarMeusAgendamentosExame,
  listarTodosAgendamentosExame,
  cancelarAgendamentoExame,
  atualizarAgendamentoExame,
};