const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const { NotFoundError, ConflictError, ValidationError } = require('../utils/errors');

class UserService {
  async getAll(filters = {}) {
    return await userRepository.findAll(filters);
  }

  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('Usuario');
    return user;
  }

  async update(id, userData, currentUser) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('Usuario');

    // Solo admin puede cambiar roles
    if (userData.rol && currentUser.rol !== 'administrador') {
      throw new ValidationError('Solo el administrador puede cambiar roles.');
    }

    // No permitir cambiar email
    const updateData = { ...userData };
    delete updateData.email;
    delete updateData.password;

    if (userData.password) {
      if (userData.password.length < 6) {
        throw new ValidationError('La contraseña debe tener al menos 6 caracteres.');
      }
      updateData.password_hash = await bcrypt.hash(userData.password, 10);
    }

    await userRepository.update(id, updateData);
    return await userRepository.findById(id);
  }

  async delete(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('Usuario');

    const hasActiveSolicitudes = await userRepository.hasActiveSolicitudes(id);
    if (hasActiveSolicitudes) {
      throw new ConflictError('No se puede eliminar el usuario porque tiene solicitudes activas asignadas.');
    }

    return await userRepository.delete(id);
  }

  async updatePhoto(id, fotoPerfil) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('Usuario');

    await userRepository.update(id, { foto_perfil: fotoPerfil });
    return await userRepository.findById(id);
  }
}

module.exports = new UserService();