const pool = require('../config/database');

class SolicitudRepository {
  async create(solicitudData) {
    const query = `
      INSERT INTO solicitudes (titulo, descripcion, cliente_id, categoria_id, prioridad, estado, fecha_creacion)
      VALUES (?, ?, ?, ?, ?, 'pendiente', NOW())
    `;
    const [result] = await pool.execute(query, [
      solicitudData.titulo,
      solicitudData.descripcion,
      solicitudData.cliente_id,
      solicitudData.categoria_id,
      solicitudData.prioridad || 'media'
    ]);
    return result.insertId;
  }

  async findById(id) {
    const query = `
      SELECT s.*,
             c.nombre as cliente_nombre, c.empresa as cliente_empresa, c.email as cliente_email, c.telefono as cliente_telefono,
             cat.nombre as categoria_nombre, cat.descripcion as categoria_descripcion,
             u.nombre as tecnico_nombre, u.email as tecnico_email
      FROM solicitudes s
      JOIN clientes c ON s.cliente_id = c.id
      JOIN categorias cat ON s.categoria_id = cat.id
      LEFT JOIN usuarios u ON s.tecnico_id = u.id
      WHERE s.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  async findAll(filters = {}, userRole = null, userId = null) {
    let query = `
      SELECT s.*,
             c.nombre as cliente_nombre, c.empresa as cliente_empresa,
             cat.nombre as categoria_nombre,
             u.nombre as tecnico_nombre
      FROM solicitudes s
      JOIN clientes c ON s.cliente_id = c.id
      JOIN categorias cat ON s.categoria_id = cat.id
      LEFT JOIN usuarios u ON s.tecnico_id = u.id
      WHERE 1=1
    `;
    const params = [];

    // Filtrado por rol
    if (userRole === 'cliente') {
      query += ` AND c.id IN (SELECT id FROM clientes WHERE email = (SELECT email FROM usuarios WHERE id = ?) OR nombre = (SELECT nombre FROM usuarios WHERE id = ?))`;
      params.push(userId, userId);
    } else if (userRole === 'tecnico') {
      query += ` AND (s.tecnico_id = ? OR s.estado = 'pendiente')`;
      params.push(userId);
    }

    if (filters.estado) {
      query += ' AND s.estado = ?';
      params.push(filters.estado);
    }
    if (filters.prioridad) {
      query += ' AND s.prioridad = ?';
      params.push(filters.prioridad);
    }
    if (filters.categoria_id) {
      query += ' AND s.categoria_id = ?';
      params.push(filters.categoria_id);
    }
    if (filters.tecnico_id) {
      query += ' AND s.tecnico_id = ?';
      params.push(filters.tecnico_id);
    }
    if (filters.fecha_inicio) {
      query += ' AND s.fecha_creacion >= ?';
      params.push(filters.fecha_inicio);
    }
    if (filters.fecha_fin) {
      query += ' AND s.fecha_creacion <= ?';
      params.push(filters.fecha_fin + ' 23:59:59');
    }
    if (filters.search) {
      query += ' AND (s.titulo LIKE ? OR s.descripcion LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY s.fecha_creacion DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  async updateEstado(id, estado, comentario = null) {
    const query = `
      UPDATE solicitudes
      SET estado = ?,
          comentario_resolucion = ?,
          fecha_resolucion = IF(? IN ('resuelto', 'cancelado'), NOW(), fecha_resolucion),
          updated_at = NOW()
      WHERE id = ?
    `;
    const [result] = await pool.execute(query, [estado, comentario, estado, id]);
    return result.affectedRows > 0;
  }

  async asignarTecnico(id, tecnicoId) {
    const query = `
      UPDATE solicitudes
      SET tecnico_id = ?, estado = 'en_proceso', fecha_asignacion = NOW(), updated_at = NOW()
      WHERE id = ?
    `;
    const [result] = await pool.execute(query, [tecnicoId, id]);
    return result.affectedRows > 0;
  }

  async delete(id) {
    const query = 'DELETE FROM solicitudes WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }

  async getEstadisticas(filters = {}) {
    let query = `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
        SUM(CASE WHEN estado = 'en_proceso' THEN 1 ELSE 0 END) as en_proceso,
        SUM(CASE WHEN estado = 'resuelto' THEN 1 ELSE 0 END) as resueltas,
        SUM(CASE WHEN estado = 'cancelado' THEN 1 ELSE 0 END) as canceladas
      FROM solicitudes WHERE 1=1
    `;
    const params = [];

    if (filters.tecnico_id) {
      query += ' AND tecnico_id = ?';
      params.push(filters.tecnico_id);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0];
  }
}

module.exports = new SolicitudRepository();