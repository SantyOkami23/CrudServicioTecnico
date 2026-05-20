const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { formatError } = require('../utils/responseFormatter');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(formatError('Token no proporcionado. Inicie sesión.'));
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, jwtConfig.secret);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(formatError('Sesión expirada. Inicie sesión nuevamente.'));
    }
    return res.status(401).json(formatError('Token inválido. Inicie sesión.'));
  }
};

module.exports = authMiddleware;