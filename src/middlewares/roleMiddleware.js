function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.tipo)) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    return next();
  };
}

module.exports = requireRole;
