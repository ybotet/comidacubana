const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authenticate } = require('../../auth/middleware/auth.middleware');

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.get('/stats', notificationController.getNotificationStats);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
