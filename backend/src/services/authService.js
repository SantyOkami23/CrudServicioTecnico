const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const jwtConfig = require('../config/jwt');
const { AuthenticationError, ValidationError, ConflictError } = require('../utils/errors');

class AuthService {
  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AuthenticationError('Credenciales inválidas. Verifique email y contraseña.');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      throw new AuthenticationError('Credenciales inválidas. Verifique email y contraseña.');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return {
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        foto_perfil: user.foto_perfil
      }
    };
  }

  async register(userData) {
    // Validar email único
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('El email ya está registrado en el sistema.');
    }

    // Validar formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new ValidationError('Formato de email inválido.');
    }

    // Validar longitud de contraseña
    if (!userData.password || userData.password.length < 6) {
      throw new ValidationError('La contraseña debe tener al menos 6 caracteres.');
    }

    const password_hash = await bcrypt.hash(userData.password, 10);

    const userId = await userRepository.create({
      ...userData,
      password_hash,
      rol: userData.rol || 'cliente'
    });

    const user = await userRepository.findById(userId);
    return user;
  }
}

module.exports = new AuthService();