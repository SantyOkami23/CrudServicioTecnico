const authService = require('../services/authService');
const { formatSuccess, formatError } = require('../utils/responseFormatter');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json(formatError('Email y contraseña son requeridos.'));
      }

      const result = await authService.login(email, password);
      res.status(200).json(formatSuccess('Inicio de sesión exitoso', result));
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const { nombre, email, password, rol } = req.body;

      if (!nombre || !email || !password) {
        return res.status(400).json(formatError('Nombre, email y contraseña son requeridos.'));
      }

      const user = await authService.register({ nombre, email, password, rol });
      res.status(201).json(formatSuccess('Usuario registrado exitosamente', user));
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res) {
    res.status(200).json(formatSuccess('Sesión cerrada exitosamente.'));
  }
}

module.exports = new AuthController();