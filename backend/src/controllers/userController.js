const userService = require('../services/userService');
const { formatSuccess } = require('../utils/responseFormatter');

class UserController {
  async getAll(req, res, next) {
    try {
      const filters = {
        rol: req.query.rol,
        search: req.query.search
      };
      const users = await userService.getAll(filters);
      res.status(200).json(formatSuccess('Usuarios obtenidos exitosamente', users));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await userService.getById(req.params.id);
      res.status(200).json(formatSuccess('Usuario obtenido exitosamente', user));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const user = await userService.update(req.params.id, req.body, req.user);
      res.status(200).json(formatSuccess('Usuario actualizado exitosamente', user));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await userService.delete(req.params.id);
      res.status(200).json(formatSuccess('Usuario eliminado exitosamente'));
    } catch (error) {
      next(error);
    }
  }

  async uploadPhoto(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Debe seleccionar una imagen.' });
      }
      const fotoPerfil = `/uploads/profiles/${req.file.filename}`;
      const user = await userService.updatePhoto(req.params.id, fotoPerfil);
      res.status(200).json(formatSuccess('Foto de perfil actualizada exitosamente', user));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();