const categoriaService = require('../services/categoriaService');
const { formatSuccess } = require('../utils/responseFormatter');

class CategoriaController {
  async getAll(req, res, next) {
    try {
      const activoOnly = req.query.activo !== 'false';
      const categorias = await categoriaService.getAll(activoOnly);
      res.status(200).json(formatSuccess('Categorías obtenidas exitosamente', categorias));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const categoria = await categoriaService.getById(req.params.id);
      res.status(200).json(formatSuccess('Categoría obtenida exitosamente', categoria));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const categoria = await categoriaService.create(req.body);
      res.status(201).json(formatSuccess('Categoría creada exitosamente', categoria));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const categoria = await categoriaService.update(req.params.id, req.body);
      res.status(200).json(formatSuccess('Categoría actualizada exitosamente', categoria));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoriaController();
