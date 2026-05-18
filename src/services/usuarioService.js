const Usuario = require("../models/Usuario");
const Paciente = require("../models/Paciente");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

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
  const usuarioData = {
    ...data,
    password: await criptografarSenha(data.password),
    tipo: "usuario",
  };

  const usuario = await Usuario.create(usuarioData);

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

  const usuario = await Usuario.findOne({
    $or: [{ email: identificador }, { cpf: identificador }],
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
  const dadosAtualizados = { ...data };

  if (dadosAtualizados.password) {
    dadosAtualizados.password = await criptografarSenha(dadosAtualizados.password);
  }

  return Usuario.findByIdAndUpdate(
    id, 
    dadosAtualizados,
    { new: true}
  );
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
