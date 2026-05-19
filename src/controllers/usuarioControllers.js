const usuarioService = require("../services/usuarioService");
const jwt = require("jsonwebtoken");

//Import Hugo - Redefinir e Recuperar Senha
const Usuario = require("../models/Usuario");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


function esconderSenha(user) {
  const userObject = user.toObject ? user.toObject() : user;
  delete userObject.password;

  //Hugo - Para esconder os campos de recuperação
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;

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
        // Hugo - Aparentemente o alert buga a redefinição de senha.
        // alert: "valide sua sessao novamente"
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

// Hugo - Funções de redefinir e recuperar senha
async function recuperarSenha(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Informe o e-mail cadastrado.",
      });
    }

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(200).json({
        message:
          "Se o e-mail estiver cadastrado, enviaremos instruções para redefinir a senha.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    usuario.resetPasswordToken = resetTokenHash;
    usuario.resetPasswordExpires = Date.now() + 1000 * 60 * 30;

    await usuario.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/redefinir-senha/${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: usuario.email,
      subject: "Redefinição de senha - Nami Online",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Redefinição de senha</h2>

          <p>Olá, ${usuario.name || "usuário"}.</p>

          <p>Recebemos uma solicitação para redefinir sua senha.</p>

          <p>Clique no link abaixo para criar uma nova senha:</p>

          <p>
            <a href="${resetUrl}" target="_blank">
              Redefinir minha senha
            </a>
          </p>

          <p>Este link é válido por 30 minutos.</p>

          <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
        </div>
      `,
    });

    return res.status(200).json({
      message:
        "Se o e-mail estiver cadastrado, enviaremos instruções para redefinir a senha.",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao solicitar recuperação de senha.",
      details: error.message,
    });
  }
}

async function redefinirSenha(req, res) {
  try {
    const { token } = req.params;
    const { password, confirmarPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        error: "Token de redefinição não informado.",
      });
    }

    if (!password || !confirmarPassword) {
      return res.status(400).json({
        error: "Informe e confirme a nova senha.",
      });
    }

    if (password !== confirmarPassword) {
      return res.status(400).json({
        error: "As senhas não conferem.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "A senha deve ter pelo menos 6 caracteres.",
      });
    }

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const usuario = await Usuario.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!usuario) {
      return res.status(400).json({
        error: "Token inválido ou expirado.",
      });
    }

    await usuarioService.putUsuarios(usuario._id, {
      password,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return res.status(200).json({
      message: "Senha redefinida com sucesso.",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao redefinir senha.",
      details: error.message,
    });
  }
}

//Hugo - Função para buscar usuário por CPF

async function buscarUsuarioPorCpf(req, res) {
  try {
    const { cpf } = req.params;

    if (!cpf) {
      return res.status(400).json({
        error: "CPF não informado.",
      });
    }

    const cpfLimpo = cpf.replace(/\D/g, "");

    const usuario = await Usuario.findOne({ cpf: cpfLimpo });

    if (!usuario) {
      return res.status(404).json({
        error: "Paciente não encontrado.",
      });
    }

    if (usuario.tipo !== "usuario") {
      return res.status(400).json({
        error: "O CPF informado não pertence a um paciente.",
      });
    }

    return res.status(200).json(esconderSenha(usuario));
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar paciente por CPF.",
      details: error.message,
    });
  }
}

module.exports = {
  create,
  index,
  login,
  me,
  put,
  destroy,
  //Hugo - Export das duas funções Recuperar Senha e Redefinir Senha
  recuperarSenha,
  redefinirSenha,
  //Hugo - Export da função de buscar usuário por CPF
  buscarUsuarioPorCpf,
};
