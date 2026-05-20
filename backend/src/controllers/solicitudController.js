const solicitudService = require('../services/solicitudService');
const { formatSuccess } = require('../utils/responseFormatter');

class SolicitudController {
  async getAll(req, res, next) {
    try {
      const filters = {
        estado: req.query.estado,
        prioridad: req.query.prioridad,
        categoria_id: req.query.categoria_id,
        tecnico_id: req.query.tecnico_id,
        fecha_inicio: req.query.fecha_inicio,
        fecha_fin: req.query.fecha_fin,
        search: req.query.search
      };
      const solicitudes = await solicitudService.getAll(filters, req.user.rol, req.user.id);
      res.status(200).json(formatSuccess('Solicitudes obtenidas exitosamente', solicitudes));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const solicitud = await solicitudService.getById(req.params.id);
      res.status(200).json(formatSuccess('Solicitud obtenida exitosamente', solicitud));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const solicitud = await solicitudService.create(req.body, req.user.id, req.user.rol);
      res.status(201).json(formatSuccess('Solicitud creada exitosamente', solicitud));
    } catch (error) {
      next(error);
    }
  }

  async asignarTecnico(req, res, next) {
    try {
      const { tecnico_id } = req.body;
      if (!tecnico_id) {
        return res.status(400).json({ success: false, message: 'Debe especificar el ID del técnico.' });
      }
      const solicitud = await solicitudService.asignarTecnico(req.params.id, tecnico_id, req.user.id);
      res.status(200).json(formatSuccess('Solicitud asignada exitosamente', solicitud));
    } catch (error) {
      next(error);
    }
  }

  async updateEstado(req, res, next) {
    try {
      const { estado, comentario } = req.body;
      if (!estado) {
        return res.status(400).json({ success: false, message: 'Debe especificar el nuevo estado.' });
      }
      const solicitud = await solicitudService.updateEstado(
        req.params.id, estado, comentario, req.user.id, req.user.rol
      );
      res.status(200).json(formatSuccess('Estado actualizado exitosamente', solicitud));
    } catch (error) {
      next(error);
    }
  }

  async getEstadisticas(req, res, next) {
    try {
      const filters = {
        tecnico_id: req.query.tecnico_id,
        fecha_inicio: req.query.fecha_inicio,
        fecha_fin: req.query.fecha_fin
      };
      const stats = await solicitudService.getEstadisticas(filters);
      res.status(200).json(formatSuccess('Estadísticas obtenidas exitosamente', stats));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SolicitudController();