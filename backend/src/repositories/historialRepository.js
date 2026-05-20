const pool = require('../config/database');

class HistorialRepository {
  async create(historialData) {
    const query = `
      INSERT INTO historial_estados (solicitud_id, estado_anterior, estado_nuevo, usuario_id, comentario, fecha_cambio)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await pool.execute(query, [
      historialData.solicitud_id,
      historialData.estado_anterior || null,
      historialData.estado_nuevo,
      historialData.usuario_id,
      historialData.comentario || null
    ]);
    return result.insertId;
  }

  async findBySolicitudId(solicitudId) {
    const query = `
      SELECT h.*, u.nombre as usuario_nombre
      FROM historial_estados h
      JOIN usuarios u ON h.usuario_id = u.id
      WHERE h.solicitud_id = ?
      ORDER BY h.fecha_cambio ASC
    `;
    const [rows] = await pool.execute(query, [solicitudId]);
    return rows;
  }
}

module.exports = new HistorialRepository();