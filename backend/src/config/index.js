const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Validar variables críticas
const requiredEnvVars = ['JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar] && process.env.NODE_ENV === 'production') {
    console.error(`❌ Variable de entorno requerida faltante: ${envVar}`);
    process.exit(1);
  }
}

module.exports = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',

  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'restaurante_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    url: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'restaurante_db'}`
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRE || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_in_production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  },

  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10),
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },

  // Internationalization
  i18n: {
    defaultLanguage: process.env.DEFAULT_LANGUAGE || 'es',
    supportedLanguages: (process.env.SUPPORTED_LANGUAGES || 'es,ru').split(','),
  },

  // File Upload
  upload: {
    maxFileSize: process.env.MAX_FILE_SIZE || '5MB',
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
  },

  // WebSocket
  websocket: {
    port: parseInt(process.env.WS_PORT || '3001', 10),
  },

  // Paths
  paths: {
    locales: path.join(__dirname, '../locales'),
    logs: path.join(__dirname, '../../logs'),
    uploads: path.join(__dirname, '../../uploads'),
  },
};
