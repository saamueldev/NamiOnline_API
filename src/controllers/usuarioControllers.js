const usuarioService = require("../services/usuarioService");
const jwt = require("jsonwebtoken");

function esconderSenha(user) {
  const userObject = user.toObject ? user.toObject() : user;
  delete userObject.password;
  return userObject;
}

function usuarioPodeGerenciar(req, userId) {
  return req.user?.tipo === "admin" || req.user?.id === userId;
}

async function create(req, res) {
  try {
    const user = await usuarioService.createUsuarios(req.body);
    return res.status(201).json(esconderSenha(user));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function index(req, res) {
  try {
    if (req.user?.tipo !== "admin") {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const users = await usuarioService.listUsuarios();
    return res.json(users.map(esconderSenha));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { identificador, password } = req.body;
    const user = await usuarioService.loginUsuario({ identificador, password });
    const token = jwt.sign(
      {
        email: user.email,
        tipo: user.tipo,
      },
      process.env.JWT_SECRET,
      {
        subject: user._id.toString(),
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
        alert: "valide sua sessao novamente"
      }
    );

    return res.status(200).json({
      message: "Login realizado com sucesso",
      token,
      user: esconderSenha(user),
    });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}

async function me(req, res) {
  try {
    const user = await usuarioService.findUsuarioById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Usuario nao encontrado" });
    }

    return res.status(200).json(esconderSenha(user));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function put(req, res) {
  try {
    if (!usuarioPodeGerenciar(req, req.params.id)) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const dadosAtualizados = { ...req.body };

    if (req.user?.tipo !== "admin") {
      delete dadosAtualizados.tipo;
    }

    const user = await usuarioService.putUsuarios(
      req.params.id,
      dadosAtualizados
    );

    if (!user) {
      return res.status(404).json({ error: "Usuario nao encontrado" });
    }

    return res.status(200).json(esconderSenha(user));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function destroy(req, res) {
  try {
    if (!usuarioPodeGerenciar(req, req.params.id)) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const user = await usuarioService.destroyUsuarios(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "Usuario nao encontrado" });
    }

    return res.status(200).json(esconderSenha(user));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  create,
  index,
  login,
  me,
  put,
  destroy
};
