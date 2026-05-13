const usuarioService = require("../services/usuarioService");

async function create(req, res) {
  try {
    const user = await usuarioService.createUsuarios(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function index(req, res) {
  try {
    const users = await usuarioService.listUsuarios();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function put(req, res) {
  try {
    const user = await usuarioService.putUsuarios(
      req.params.id,
      req.body
    );
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function destroy(req, res) {
  try {
    const user = await usuarioService.destroyUsuarios(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
     return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  create,
  index,
  put,
  destroy
};