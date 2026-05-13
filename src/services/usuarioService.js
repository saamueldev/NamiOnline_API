const Usuario = require("../models/Usuario");

async function createUsuarios(data) {
  return Usuario.create(data);
}

async function listUsuarios() {
  return Usuario.find();
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
  putUsuarios,
  destroyUsuarios
};