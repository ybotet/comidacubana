const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;
const apiPrefix = process.env.API_PREFIX || '/api/v1';

// Middlewares básicos
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'restaurante-backend'
    });
});

// Ruta principal de API
app.get(apiPrefix, (req, res) => {
    res.json({
        message: 'API del Restaurante',
        version: '1.0.0',
        endpoints: [
            `${apiPrefix}/health`,
            `${apiPrefix}/test`
        ]
    });
});

// Ruta de prueba
app.get(`${apiPrefix}/test`, (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando correctamente',
        data: {
            timestamp: new Date().toISOString()
        }
    });
});

// 404 handler - Usar regex para evitar problemas con *
app.use('(.*)', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
    });
});

app.listen(port, () => {
    console.log(`
    🚀 Servidor ejecutándose en modo ${process.env.NODE_ENV || 'development'}
    📡 Escuchando en puerto ${port}
    🌐 API: http://localhost:${port}${apiPrefix}
    📊 Health: http://localhost:${port}/health
    🧪 Test: http://localhost:${port}${apiPrefix}/test
  `);
});
