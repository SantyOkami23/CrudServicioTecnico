const pool = require('../config/database');

class ClienteRepository {
  async create(clienteData) {
    const query = `
      INSERT INTO clientes (nombre, empresa, email, telefono, direccion, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await pool.execute(query, [
      clienteData.nombre,
      clienteData.empresa || null,
      clienteData.email,
      clienteData.telefono || null,
      clienteData.direccion || null
    ]);
    return result.insertId;
  }

  async findById(id) {
    const query = 'SELECT * FROM clientes WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  async findAll(filters = {}) {
    let query = 'SELECT * FROM clientes WHERE 1=1';
    const params = [];

    if (filters.search) {
      query += ' AND (nombre LIKE ? OR empresa LIKE ? OR email LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  async update(id, clienteData) {
    const fields = [];
    const params = [];

    if (clienteData.nombre !== undefined) {
      fields.push('nombre = ?');
      params.push(clienteData.nombre);
    }
    if (clienteData.empresa !== undefined) {
      fields.push('empresa = ?');
      params.push(clienteData.empresa);
    }
    if (clienteData.email !== undefined) {
      fields.push('email = ?');
      params.push(clienteData.email);
    }
    if (clienteData.telefono !== undefined) {
      fields.push('telefono = ?');
      params.push(clienteData.telefono);
    }
    if (clienteData.direccion !== undefined) {
      fields.push('direccion = ?');
      params.push(clienteData.direccion);
    }

    if (fields.length === 0) return false;

    fields.push('updated_at = NOW()');
    params.push(id);

    const query = `UPDATE clientes SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.execute(query, params);
    return result.affectedRows > 0;
  }

  async delete(id) {
    const query = 'DELETE FROM clientes WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }

  async hasSolicitudes(id) {
    const query = 'SELECT COUNT(*) as count FROM solicitudes WHERE cliente_id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0].count > 0;
  }

  async getSolicitudesCount(id) {
    const query = 'SELECT COUNT(*) as count FROM solicitudes WHERE cliente_id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0].count;
  }

  async getSolicitudesActivasCount(id) {
    const query = `SELECT COUNT(*) as count FROM solicitudes WHERE cliente_id = ? AND estado IN ('pendiente', 'en_proceso')`;
    const [rows] = await pool.execute(query, [id]);
    return rows[0].count;
  }
}

module.exports = new ClienteRepository();