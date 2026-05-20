const solicitudRepository = require('../repositories/solicitudRepository');
const historialRepository = require('../repositories/historialRepository');
const clienteRepository = require('../repositories/clienteRepository');
const { NotFoundError, ValidationError, AuthorizationError } = require('../utils/errors');

class SolicitudService {
  async getAll(filters = {}, userRole, userId) {
    return await solicitudRepository.findAll(filters, userRole, userId);
  }

  async getById(id) {
    const solicitud = await solicitudRepository.findById(id);
    if (!solicitud) throw new NotFoundError('Solicitud');

    const historial = await historialRepository.findBySolicitudId(id);

    return {
      ...solicitud,
      historial
    };
  }

  async create(solicitudData, userId, userRole) {
    // Validaciones
    if (!solicitudData.titulo || solicitudData.titulo.trim().length < 5) {
      throw new ValidationError('El título debe tener al menos 5 caracteres.');
    }

    if (!solicitudData.descripcion || solicitudData.descripcion.trim().length < 10) {
      throw new ValidationError('La descripción debe tener al menos 10 caracteres.');
    }

    if (!solicitudData.categoria_id) {
      throw new ValidationError('La categoría es requerida.');
    }

    // Si es cliente, asociar a su propio cliente_id
    if (userRole === 'cliente') {
      // Buscar cliente por email del usuario o usar el cliente_id proporcionado
      if (!solicitudData.cliente_id) {
        throw new ValidationError('Cliente no especificado.');
      }
    }

    const id = await solicitudRepository.create(solicitudData);

    // Registrar historial
    await historialRepository.create({
      solicitud_id: id,
      estado_nuevo: 'pendiente',
      usuario_id: userId,
      comentario: 'Solicitud creada'
    });

    return await solicitudRepository.findById(id);
  }

  async asignarTecnico(id, tecnicoId, userId) {
    const solicitud = await solicitudRepository.findById(id);
    if (!solicitud) throw new NotFoundError('Solicitud');

    if (solicitud.estado !== 'pendiente') {
      throw new ValidationError('Solo se pueden asignar solicitudes en estado pendiente.');
    }

    await solicitudRepository.asignarTecnico(id, tecnicoId);

    // Registrar historial
    await historialRepository.create({
      solicitud_id: id,
      estado_anterior: 'pendiente',
      estado_nuevo: 'en_proceso',
      usuario_id: userId,
      comentario: `Asignada a técnico ID: ${tecnicoId}`
    });

    return await solicitudRepository.findById(id);
  }

  async updateEstado(id, nuevoEstado, comentario, userId, userRole) {
    const solicitud = await solicitudRepository.findById(id);
    if (!solicitud) throw new NotFoundError('Solicitud');

    const estadoActual = solicitud.estado;

    // Validar transiciones
    const transicionesValidas = {
      'pendiente': ['en_proceso', 'cancelado'],
      'en_proceso': ['resuelto', 'cancelado', 'pendiente'],
      'resuelto': [],
      'cancelado': []
    };

    if (!transicionesValidas[estadoActual].includes(nuevoEstado)) {
      throw new ValidationError(`No se puede cambiar de "${estadoActual}" a "${nuevoEstado}".`);
    }

    // Validar permisos por rol
    if (nuevoEstado === 'resuelto') {
      if (userRole === 'cliente') {
        throw new AuthorizationError('Los clientes no pueden marcar solicitudes como resueltas.');
      }
      if (userRole === 'tecnico' && solicitud.tecnico_id !== userId) {
        throw new AuthorizationError('Solo el técnico asignado puede resolver esta solicitud.');
      }
      if (!comentario || comentario.trim().length < 10) {
        throw new ValidationError('Se requiere un comentario de resolución de al menos 10 caracteres.');
      }
    }

    if (nuevoEstado === 'cancelado') {
      if (userRole === 'cliente' && solicitud.cliente_id !== userId) {
        throw new AuthorizationError('Solo puedes cancelar tus propias solicitudes.');
      }
      if (!comentario || comentario.trim().length < 5) {
        throw new ValidationError('Se requiere un motivo de cancelación de al menos 5 caracteres.');
      }
    }

    await solicitudRepository.updateEstado(id, nuevoEstado, comentario);

    // Registrar historial
    await historialRepository.create({
      solicitud_id: id,
      estado_anterior: estadoActual,
      estado_nuevo: nuevoEstado,
      usuario_id: userId,
      comentario: comentario
    });

    return await solicitudRepository.findById(id);
  }

  async getEstadisticas(filters = {}) {
    return await solicitudRepository.getEstadisticas(filters);
  }
}

module.exports = new SolicitudService();