// Cargar modelos primero para establecer relaciones
require('./shared/database/models');

const App = require('./app');
const logger = require('./shared/logging/logger');

// Manejo de excepciones no capturadas
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Iniciar aplicación
try {
  const app = new App();
  app.listen();
} catch (error) {
  logger.error('Failed to start application:', error);
  process.exit(1);
}
