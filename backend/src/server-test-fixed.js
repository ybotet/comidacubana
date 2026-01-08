const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

// API route
app.get('/api/v1/test', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando'
    });
});

// 404 handler - USAR (.*) en lugar de *
app.use('(.*)', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    console.log(`📡 Health check: http://localhost:${port}/health`);
    console.log(`🧪 API Test: http://localhost:${port}/api/v1/test`);
});