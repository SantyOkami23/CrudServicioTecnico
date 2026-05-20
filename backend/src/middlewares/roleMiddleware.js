const { formatError } = require('../utils/responseFormatter');

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(formatError('Usuario no autenticado'));
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json(
        formatError('No tiene permisos para acceder a este recurso')
      );
    }

    next();
  };
};

module.exports = { requireRole };