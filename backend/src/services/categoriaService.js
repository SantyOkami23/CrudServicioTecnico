const categoriaRepository = require('../repositories/categoriaRepository');
const { NotFoundError, ValidationError } = require('../utils/errors');

class CategoriaService {
  async getAll(activoOnly = false) {
    return await categoriaRepository.findAll(activoOnly);
  }

  async getById(id) {
    const categoria = await categoriaRepository.findById(id);
    if (!categoria) throw new NotFoundError('Categoría');
    return categoria;
  }

  async create(categoriaData) {
    if (!categoriaData.nombre || categoriaData.nombre.trim().length < 2) {
      throw new ValidationError('El nombre de la categoría debe tener al menos 2 caracteres.');
    }
    const id = await categoriaRepository.create(categoriaData);
    return await categoriaRepository.findById(id);
  }

  async update(id, categoriaData) {
    const categoria = await categoriaRepository.findById(id);
    if (!categoria) throw new NotFoundError('Categoría');

    await categoriaRepository.update(id, categoriaData);
    return await categoriaRepository.findById(id);
  }
}

module.exports = new CategoriaService();