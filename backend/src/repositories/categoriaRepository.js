const pool = require('../config/database');

class CategoriaRepository {
  async create(categoriaData) {
    const query = 'INSERT INTO categorias (nombre, descripcion, activo, created_at) VALUES (?, ?, ?, NOW())';
    const [result] = await pool.execute(query, [
      categoriaData.nombre,
      categoriaData.descripcion || null,
      categoriaData.activo !== undefined ? categoriaData.activo : true
    ]);
    return result.insertId;
  }

  async findById(id) {
    const query = 'SELECT * FROM categorias WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  async findAll(activoOnly = false) {
    let query = 'SELECT * FROM categorias';
    if (activoOnly) query += ' WHERE activo = TRUE';
    query += ' ORDER BY nombre ASC';
    const [rows] = await pool.execute(query);
    return rows;
  }

  async update(id, categoriaData) {
    const fields = [];
    const params = [];

    if (categoriaData.nombre !== undefined) {
      fields.push('nombre = ?');
      params.push(categoriaData.nombre);
    }
    if (categoriaData.descripcion !== undefined) {
      fields.push('descripcion = ?');
      params.push(categoriaData.descripcion);
    }
    if (categoriaData.activo !== undefined) {
      fields.push('activo = ?');
      params.push(categoriaData.activo);
    }

    if (fields.length === 0) return false;

    params.push(id);
    const query = `UPDATE categorias SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.execute(query, params);
    return result.affectedRows > 0;
  }
}

module.exports = new CategoriaRepository();