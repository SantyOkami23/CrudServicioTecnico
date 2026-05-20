const clienteService = require('../services/clienteService');
const { formatSuccess } = require('../utils/responseFormatter');

class ClienteController {
  async getAll(req, res, next) {
    try {
      const filters = { search: req.query.search };
      const clientes = await clienteService.getAll(filters);
      res.status(200).json(formatSuccess('Clientes obtenidos exitosamente', clientes));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const cliente = await clienteService.getById(req.params.id);
      res.status(200).json(formatSuccess('Cliente obtenido exitosamente', cliente));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const cliente = await clienteService.create(req.body);
      res.status(201).json(formatSuccess('Cliente creado exitosamente', cliente));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const cliente = await clienteService.update(req.params.id, req.body);
      res.status(200).json(formatSuccess('Cliente actualizado exitosamente', cliente));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await clienteService.delete(req.params.id);
      res.status(200).json(formatSuccess('Cliente eliminado exitosamente'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ClienteController();