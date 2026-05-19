const Paciente = require("../models/Paciente");
const Usuario = require("../models/Usuario");

function gerarProntuario(usuarioId) {
  return `PAC-${usuarioId.toString().slice(-6).toUpperCase()}-${Date.now().toString().slice(-6)}`;
}

async function createPaciente(data) {
  return Paciente.create(data);
}

async function listPacientes() {
  return Paciente.find().populate("user");
}

async function findPacienteByCpf(cpf) {
  const cpfInformado = String(cpf || "").trim();
  const cpfNumerico = cpfInformado.replace(/\D/g, "");

  if (!cpfInformado) {
    throw new Error("Informe o CPF do paciente.");
  }

  const possibilidadesCpf = [...new Set([cpfInformado, cpfNumerico].filter(Boolean))];
  const filtrosCpf = [{ cpf: { $in: possibilidadesCpf } }];

  if (cpfNumerico) {
    const regexCpfComOuSemMascara = new RegExp(
      `^\\D*${cpfNumerico.split("").join("\\D*")}\\D*$`
    );

    filtrosCpf.push({ cpf: regexCpfComOuSemMascara });
  }

  const usuario = await Usuario.findOne({ $or: filtrosCpf });

  if (!usuario) {
    return null;
  }

  let paciente = await Paciente.findOne({ user: usuario._id }).populate("user");

  if (!paciente) {
    paciente = await Paciente.create({
      user: usuario._id,
      prontuario: gerarProntuario(usuario._id),
    });

    paciente = await paciente.populate("user");
  }

  return paciente;
}

module.exports = {
  createPaciente,
  listPacientes,
  findPacienteByCpf,
};
