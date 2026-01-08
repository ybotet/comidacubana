const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config');
const logger = require('./shared/logging/logger');
const errorHandler = require('./middleware/errorHandler');
const { testConnection } = require('./shared/database/config');

class App {
  constructor() {
    this.app = express();
    this.port = config.port;
    
    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  async initializeDatabase() {
    const isConnected = await testConnection();
    if (!isConnected) {
      logger.warn('âš ï¸  No se pudo conectar a la base de datos. Algunas funciones pueden no estar disponibles.');
    }
  }

  initializeMiddlewares() {
    // Security headers
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://tudominio.com'] 
        : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
      credentials: true,
    }));

    // Body parser
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // HTTP request logging
    this.app.use(morgan('combined', { stream: logger.stream }));

    // Static files
    this.app.use('/uploads', express.static('uploads'));

    // Health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'restaurante-backend',
        version: process.env.npm_package_version || '1.0.0',
      });
    });
  }

  initializeRoutes() {
    // Importar rutas de mÃ³dulos
    const authRoutes = require('./modules/auth/routes/auth.routes');
    
    // Registrar rutas
    this.app.use(`${config.apiPrefix}/auth`, authRoutes);
    
    // Ruta principal de API
    this.app.get(config.apiPrefix, (req, res) => {
      res.status(200).json({
        message: 'API del Restaurante funcionando',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        endpoints: {
          auth: {
            register: 'POST /api/v1/auth/register',
            login: 'POST /api/v1/auth/login',
            profile: 'GET /api/v1/auth/profile',
            refreshToken: 'POST /api/v1/auth/refresh-token'
          },
          health: 'GET /health'
        }
      });
    });

    // 404 handler para rutas de API no encontradas
    this.app.use(`${config.apiPrefix}/*`, (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint de API no encontrado',
        path: req.originalUrl
      });
    });

    // 404 handler para todas las demÃ¡s rutas
    this.app.use('(.*)', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        availableRoutes: [
          `${config.apiPrefix}`,
          '/health',
          `${config.apiPrefix}/auth/register`,
          `${config.apiPrefix}/auth/login`
        ]
      });
    });
  }

  initializeErrorHandling() {
    this.app.use(errorHandler);
  }

  listen() {
    this.server = this.app.listen(this.port, () => {
      logger.info(`
        íº€ Servidor ejecutÃ¡ndose en modo ${config.nodeEnv}
        í³¡ Escuchando en puerto ${this.port}
        í¼ API: http://localhost:${this.port}${config.apiPrefix}
        í³Š Health: http://localhost:${this.port}/health
        í´ Auth: http://localhost:${this.port}${config.apiPrefix}/auth
        í³š DocumentaciÃ³n: http://localhost:${this.port}${config.apiPrefix}
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SeÃ±al SIGTERM recibida: cerrando servidor HTTP');
      this.server.close(() => {
        logger.info('Servidor HTTP cerrado');
        process.exit(0);
      });
    });
  }
}

module.exports = App;
