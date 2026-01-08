const winston = require('winston');
const path = require('path');
require('dotenv').config();

// Definir niveles personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Definir colores para cada nivel
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Añadir colores a winston
winston.addColors(colors);

// Formato para logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Transportes (destinos de log)
const transports = [
  // Consola
  new winston.transports.Console(),
  
  // Archivo para errores
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // Archivo para todos los logs
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/combined.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Crear logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format,
  transports,
  // No salir en excepciones manejadas
  exitOnError: false,
});

// Stream para morgan (HTTP logging)
logger.stream = {
  write: (message) => logger.http(message.trim()),
};

module.exports = logger;
