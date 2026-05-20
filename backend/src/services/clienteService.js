const clienteRepository = require('../repositories/clienteRepository');
const { NotFoundError, ConflictError, ValidationError } = require('../utils/errors');

class ClienteService {
  async getAll(filters = {}) {
    return await clienteRepository.findAll(filters);
  }

  async getById(id) {
    const cliente = await clienteRepository.findById(id);
    if (!cliente) throw new NotFoundError('Cliente');

    const solicitudesCount = await clienteRepository.getSolicitudesCount(id);
    const activasCount = await clienteRepository.getSolicitudesActivasCount(id);

    return {
      ...cliente,
      solicitudes_count: solicitudesCount,
      solicitudes_activas: activasCount
    };
  }

  async create(clienteData) {
    if (!clienteData.nombre || !clienteData.email) {
      throw new ValidationError('Nombre y email son requeridos.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clienteData.email)) {
      throw new ValidationError('Formato de email inválido.');
    }

    const id = await clienteRepository.create(clienteData);
    return await clienteRepository.findById(id);
  }

  async update(id, clienteData) {
    const cliente = await clienteRepository.findById(id);
    if (!cliente) throw new NotFoundError('Cliente');

    await clienteRepository.update(id, clienteData);
    return await clienteRepository.findById(id);
  }

  async delete(id) {
    const cliente = await clienteRepository.findById(id);
    if (!cliente) throw new NotFoundError('Cliente');

    const hasSolicitudes = await clienteRepository.hasSolicitudes(id);
    if (hasSolicitudes) {
      throw new ConflictError('No se puede eliminar el cliente porque tiene solicitudes asociadas.');
    }

    return await clienteRepository.delete(id);
  }
}

module.exports = new ClienteService();