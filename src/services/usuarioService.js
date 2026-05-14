const Usuario = require("../models/Usuario");

async function createUsuarios(data) {
  return Usuario.create(data);
}

async function listUsuarios() {
  return Usuario.find();
}

async function loginUsuario({ identificador, password }) {
  if (!identificador || !password) {
    throw new Error("Informe email/CPF e senha");
  }

  const usuario = await Usuario.findOne({
    $or: [{ email: identificador }, { cpf: identificador }],
  });

  if (!usuario || usuario.password !== password) {
    throw new Error("Email/CPF ou senha invalidos");
  }

  return usuario;
}

async function putUsuarios(id, data) {
  return Usuario.findByIdAndUpdate(
    id, 
    data,
    { new: true}
  );
}

async function destroyUsuarios(id, data) {
  return Usuario.findByIdAndDelete(id);
}

module.exports = {
  createUsuarios,
  listUsuarios,
  loginUsuario,
  putUsuarios,
  destroyUsuarios
};
