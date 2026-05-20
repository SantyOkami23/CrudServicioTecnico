require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'clave-secreta-desarrollo-local',
  expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  algorithm: 'HS256'
};