const Usuario = require("../models/Usuario");
const Paciente = require("../models/Paciente");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

function somenteNumeros(valor) {
  return String(valor || "").replace(/\D/g, "");
}

function normalizarEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : email;
}

function escaparRegex(valor) {
  return String(valor).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizarDadosUsuario(data) {
  const dados = { ...data };

  if (dados.name === undefined && dados.nome !== undefined) {
    dados.name = dados.nome;
  }

  if (dados.password === undefined && dados.senha !== undefined) {
    dados.password = dados.senha;
  }

  if (dados.data_nasc === undefined) {
    dados.data_nasc = dados.dataNascimento ?? dados.data_nascimento;
  }

  if (dados.cpf !== undefined) {
    dados.cpf = somenteNumeros(dados.cpf);
  }

  if (dados.telefone !== undefined) {
    dados.telefone = somenteNumeros(dados.telefone);

    if (!dados.telefone) {
      dados.telefone = undefined;
    }
  }

  if (dados.email !== undefined) {
    dados.email = normalizarEmail(dados.email);
  }

  return dados;
}

function validarCpfETelefone({ cpf, telefone }) {
  if (cpf !== undefined && cpf.length !== 11) {
    throw new Error("CPF deve conter 11 numeros");
  }

  if (telefone !== undefined && telefone && ![10, 11].includes(telefone.length)) {
    throw new Error("Telefone deve conter 10 ou 11 numeros");
  }
}

async function validarDuplicidade({ cpf, email }, usuarioIdIgnorado = null) {
  const filtros = [];

  if (cpf) {
    filtros.push({ cpf });
    filtros.push({
      cpf: new RegExp(`^\\D*${cpf.split("").join("\\D*")}\\D*$`),
    });
  }

  if (email) {
    filtros.push({ email });
    filtros.push({ email: new RegExp(`^${escaparRegex(email)}$`, "i") });
  }

  if (!filtros.length) {
    return;
  }

  const consulta = { $or: filtros };

  if (usuarioIdIgnorado) {
    consulta._id = { $ne: usuarioIdIgnorado };
  }

  const usuarioExistente = await Usuario.findOne(consulta).select("cpf email");

  if (!usuarioExistente) {
    return;
  }

  if (cpf && somenteNumeros(usuarioExistente.cpf) === cpf) {
    throw new Error("CPF ja cadastrado");
  }

  if (email && normalizarEmail(usuarioExistente.email) === email) {
    throw new Error("Email ja cadastrado");
  }
}

function tratarErroDuplicado(error) {
  if (error?.code !== 11000) {
    throw error;
  }

  if (error.keyPattern?.cpf || error.keyValue?.cpf) {
    throw new Error("CPF ja cadastrado");
  }

  if (error.keyPattern?.email || error.keyValue?.email) {
    throw new Error("Email ja cadastrado");
  }

  throw new Error("Dados ja cadastrados");
}

function senhaEstaCriptografada(password) {
  return typeof password === "string" && /^\$2[aby]\$/.test(password);
}

async function criptografarSenha(password) {
  if (!password) {
    throw new Error("Informe uma senha");
  }

  if (senhaEstaCriptografada(password)) {
    return password;
  }

  return bcrypt.hash(password, SALT_ROUNDS);
}

async function createUsuarios(data) {
  const dadosNormalizados = normalizarDadosUsuario(data);
  validarCpfETelefone(dadosNormalizados);
  await validarDuplicidade({
    cpf: dadosNormalizados.cpf,
    email: dadosNormalizados.email,
  });

  const usuarioData = {
    ...dadosNormalizados,
    password: await criptografarSenha(dadosNormalizados.password),
    tipo: "usuario",
  };

  let usuario;

  try {
    usuario = await Usuario.create(usuarioData);
  } catch (error) {
    tratarErroDuplicado(error);
  }

  await Paciente.create({
    user: usuario._id,
    prontuario: gerarProntuario(usuario._id),
  });

  return usuario;
}

function gerarProntuario(usuarioId) {
  return `PAC-${usuarioId.toString().slice(-6).toUpperCase()}-${Date.now().toString().slice(-6)}`;
}

async function listUsuarios() {
  return Usuario.find();
}

async function findUsuarioById(id) {
  return Usuario.findById(id);
}

async function loginUsuario({ identificador, password }) {
  if (!identificador || !password) {
    throw new Error("Informe email/CPF e senha");
  }

  const identificadorNormalizado = String(identificador).trim();
  const identificadorNumerico = somenteNumeros(identificadorNormalizado);
  const filtrosIdentificador = [
    { email: normalizarEmail(identificadorNormalizado) },
    { cpf: identificadorNormalizado },
  ];

  if (identificadorNumerico) {
    filtrosIdentificador.push({ cpf: identificadorNumerico });
  }

  const usuario = await Usuario.findOne({
    $or: filtrosIdentificador,
  });

  if (!usuario) {
    throw new Error("Email/CPF ou senha invalidos");
  }

  const senhaValida = senhaEstaCriptografada(usuario.password)
    ? await bcrypt.compare(password, usuario.password)
    : usuario.password === password;

  if (!senhaValida) {
    throw new Error("Email/CPF ou senha invalidos");
  }

  if (!senhaEstaCriptografada(usuario.password)) {
    usuario.password = await criptografarSenha(password);
    await usuario.save();
  }

  return usuario;
}

async function putUsuarios(id, data) {
  const dadosAtualizados = normalizarDadosUsuario(data);
  validarCpfETelefone(dadosAtualizados);

  await validarDuplicidade(
    {
      cpf: dadosAtualizados.cpf,
      email: dadosAtualizados.email,
    },
    id
  );

  if (dadosAtualizados.password) {
    dadosAtualizados.password = await criptografarSenha(dadosAtualizados.password);
  }

  try {
    return await Usuario.findByIdAndUpdate(
      id,
      dadosAtualizados,
      { new: true, runValidators: true }
    );
  } catch (error) {
    tratarErroDuplicado(error);
  }
}

async function destroyUsuarios(id, data) {
  return Usuario.findByIdAndDelete(id);
}

module.exports = {
  createUsuarios,
  listUsuarios,
  findUsuarioById,
  loginUsuario,
  putUsuarios,
  destroyUsuarios
};
