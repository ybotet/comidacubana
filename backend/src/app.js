const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

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
      logger.warn('⚠️  No se pudo conectar a la base de datos. Algunas funciones pueden no estar disponibles.');
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
        : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
      credentials: true,
    }));

    // Body parser
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Cookie parser
    this.app.use(cookieParser());

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
    // Importar rutas de módulos
    const authRoutes = require('./modules/auth/routes/auth.routes');
    const categoryRoutes = require('./modules/dishes/routes/category.routes');
    const ingredientRoutes = require('./modules/dishes/routes/ingredient.routes');
    const dishRoutes = require('./modules/dishes/routes/dish.routes');
    const cartRoutes = require('./modules/orders/routes/cart.routes');
    const orderRoutes = require('./modules/orders/routes/order.routes');
    const addressRoutes = require('./modules/orders/routes/address.routes');
    const notificationRoutes = require('./modules/orders/routes/notification.routes');

    // Registrar rutas
    this.app.use(`${config.apiPrefix}/auth`, authRoutes);
    this.app.use(`${config.apiPrefix}/categories`, categoryRoutes);
    this.app.use(`${config.apiPrefix}/ingredients`, ingredientRoutes);
    this.app.use(`${config.apiPrefix}/dishes`, dishRoutes);
    this.app.use(`${config.apiPrefix}/cart`, cartRoutes);
    this.app.use(`${config.apiPrefix}/orders`, orderRoutes);
    this.app.use(`${config.apiPrefix}/addresses`, addressRoutes);
    this.app.use(`${config.apiPrefix}/notifications`, notificationRoutes);

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
            profile: 'GET /api/v1/auth/profile'
          },
          categories: 'GET /api/v1/categories',
          ingredients: 'GET /api/v1/ingredients',
          dishes: {
            list: 'GET /api/v1/dishes',
            get: 'GET /api/v1/dishes/:id',
            search: 'GET /api/v1/dishes/search/:query',
            customize: 'POST /api/v1/dishes/:id/customize'
          },
          cart: {
            get: 'GET /api/v1/cart',
            add: 'POST /api/v1/cart/items',
            remove: 'DELETE /api/v1/cart/items/:index',
            clear: 'DELETE /api/v1/cart'
          },
          orders: {
            create: 'POST /api/v1/orders',
            list: 'GET /api/v1/orders',
            get: 'GET /api/v1/orders/:id',
            update_status: 'PUT /api/v1/orders/:id/status'
          },
          addresses: 'GET /api/v1/addresses',
          notifications: 'GET /api/v1/notifications',
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

    // 404 handler para todas las demás rutas
    this.app.use('(.*)', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        availableRoutes: [
          `${config.apiPrefix}`,
          '/health',
          `${config.apiPrefix}/auth/register`,
          `${config.apiPrefix}/auth/login`,
          `${config.apiPrefix}/categories`,
          `${config.apiPrefix}/ingredients`,
          `${config.apiPrefix}/dishes`,
          `${config.apiPrefix}/cart`,
          `${config.apiPrefix}/orders`
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
        🚀 Servidor ejecutándose en modo ${config.nodeEnv}
        📡 Escuchando en puerto ${this.port}
        🌐 API: http://localhost:${this.port}${config.apiPrefix}
        📊 Health: http://localhost:${this.port}/health
        🔐 Auth: http://localhost:${this.port}${config.apiPrefix}/auth
        🍽️  Platos: http://localhost:${this.port}${config.apiPrefix}/dishes
        🛒 Carrito: http://localhost:${this.port}${config.apiPrefix}/cart
        📦 Pedidos: http://localhost:${this.port}${config.apiPrefix}/orders
        📚 Documentación: http://localhost:${this.port}${config.apiPrefix}
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('Señal SIGTERM recibida: cerrando servidor HTTP');
      this.server.close(() => {
        logger.info('Servidor HTTP cerrado');
        process.exit(0);
      });
    });
  }
}

module.exports = App;
