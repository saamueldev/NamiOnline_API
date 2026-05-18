const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

function getTokenFromHeader(authorizationHeader) {
  if (!authorizationHeader) {
    return null;
  }

  const [type, token] = authorizationHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return null;
  }

  return token;
}

async function authMiddleware(req, res, next) {
  const token = getTokenFromHeader(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ error: "Token nao informado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(decoded.sub)
      .select("_id email tipo");

    if (!usuario) {
      return res.status(401).json({
        error: "Usuario do token nao encontrado"
      });
    }

    req.user = {
      id: usuario._id.toString(),
      email: usuario.email,
      tipo: usuario.tipo,
    };

    return next();

  } catch (error) {

    return res.status(401).json({
      error: "Token invalido ou expirado"
    });

  }
}

module.exports = authMiddleware;