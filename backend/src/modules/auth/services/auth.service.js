const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const logger = require('../../../shared/logging/logger');

class AuthService {
  constructor() {
    this.User = User;
  }

  async register(userData) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.User.findOne({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Crear nuevo usuario
      const user = await this.User.create({
        email: userData.email,
        password_hash: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        role: userData.role || 'customer',
        language: userData.language || 'es'
      });

      // Generar token JWT
      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      logger.info(`Nuevo usuario registrado: ${user.email}`);

      return {
        user: user.getSafeData(),
        token,
        refreshToken
      };
    } catch (error) {
      logger.error('Error en registro:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      // Buscar usuario por email
      const user = await this.User.findOne({
        where: { email, is_active: true }
      });

      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar contraseña
      const isValidPassword = await user.verifyPassword(password);
      if (!isValidPassword) {
        throw new Error('Credenciales inválidas');
      }

      // Actualizar último login
      user.last_login = new Date();
      await user.save();

      // Generar tokens
      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      logger.info(`Usuario logueado: ${user.email}`);

      return {
        user: user.getSafeData(),
        token,
        refreshToken
      };
    } catch (error) {
      logger.error('Error en login:', error);
      throw error;
    }
  }

  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        language: user.language
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user.id,
        type: 'refresh'
      },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await this.User.findByPk(decoded.id);
      
      if (!user || !user.is_active) {
        throw new Error('Usuario no válido');
      }

      return user.getSafeData();
    } catch (error) {
      logger.error('Error verificando token:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
      
      if (decoded.type !== 'refresh') {
        throw new Error('Token inválido');
      }

      const user = await this.User.findByPk(decoded.id);
      
      if (!user || !user.is_active) {
        throw new Error('Usuario no válido');
      }

      // Generar nuevo token de acceso
      const newToken = this.generateToken(user);

      return {
        user: user.getSafeData(),
        token: newToken
      };
    } catch (error) {
      logger.error('Error refrescando token:', error);
      throw error;
    }
  }

  async getProfile(userId) {
    try {
      const user = await this.User.findByPk(userId);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user.getSafeData();
    } catch (error) {
      logger.error('Error obteniendo perfil:', error);
      throw error;
    }
  }

  async updateProfile(userId, updateData) {
    try {
      const user = await this.User.findByPk(userId);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // No permitir cambiar email o role directamente
      const { email, role, password_hash, ...safeUpdates } = updateData;
      
      // Si se quiere cambiar la contraseña
      if (updateData.password) {
        safeUpdates.password_hash = updateData.password;
      }

      await user.update(safeUpdates);

      logger.info(`Perfil actualizado: ${user.email}`);

      return user.getSafeData();
    } catch (error) {
      logger.error('Error actualizando perfil:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
