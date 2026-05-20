const pool = require('../config/database');

class UserRepository {
  async create(userData) {
    const query = `
      INSERT INTO usuarios (nombre, email, password_hash, rol, foto_perfil, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await pool.execute(query, [
      userData.nombre,
      userData.email,
      userData.password_hash,
      userData.rol,
      userData.foto_perfil || null
    ]);
    return result.insertId;
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    const [rows] = await pool.execute(query, [email]);
    return rows[0] || null;
  }

  async findById(id) {
    const query = 'SELECT id, nombre, email, rol, foto_perfil, created_at, updated_at FROM usuarios WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  async findAll(filters = {}) {
    let query = 'SELECT id, nombre, email, rol, foto_perfil, created_at FROM usuarios WHERE 1=1';
    const params = [];

    if (filters.rol) {
      query += ' AND rol = ?';
      params.push(filters.rol);
    }

    if (filters.search) {
      query += ' AND (nombre LIKE ? OR email LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  async update(id, userData) {
    const fields = [];
    const params = [];

    if (userData.nombre !== undefined) {
      fields.push('nombre = ?');
      params.push(userData.nombre);
    }
    if (userData.rol !== undefined) {
      fields.push('rol = ?');
      params.push(userData.rol);
    }
    if (userData.foto_perfil !== undefined) {
      fields.push('foto_perfil = ?');
      params.push(userData.foto_perfil);
    }

    if (fields.length === 0) return false;

    fields.push('updated_at = NOW()');
    params.push(id);

    const query = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.execute(query, params);
    return result.affectedRows > 0;
  }

  async delete(id) {
    const query = 'DELETE FROM usuarios WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }

  async hasActiveSolicitudes(id) {
    const query = `
      SELECT COUNT(*) as count
      FROM solicitudes
      WHERE tecnico_id = ? AND estado IN ('pendiente', 'en_proceso')
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0].count > 0;
  }
}

module.exports = new UserRepository();