const notificationService = require('../services/notification.service');
const logger = require('../../../shared/logging/logger');

class NotificationController {
    async getNotifications(req, res, next) {
        try {
            const userId = req.user.id;
            const filters = req.query;

            const result = await notificationService.getUserNotifications(userId, filters);

            res.json({
                success: true,
                data: result.notifications,
                meta: result.meta
            });
        } catch (error) {
            logger.error('Error obteniendo notificaciones:', error);
            next(error);
        }
    }

    async markAsRead(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const notification = await notificationService.markAsRead(id, userId);

            res.json({
                success: true,
                message: 'Notificación marcada como leída',
                data: notification
            });
        } catch (error) {
            logger.error('Error marcando notificación como leída:', error);
            next(error);
        }
    }

    async markAllAsRead(req, res, next) {
        try {
            const userId = req.user.id;

            const result = await notificationService.markAllAsRead(userId);

            res.json(result);
        } catch (error) {
            logger.error('Error marcando todas las notificaciones como leídas:', error);
            next(error);
        }
    }

    async deleteNotification(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const result = await notificationService.deleteNotification(id, userId);

            res.json(result);
        } catch (error) {
            logger.error('Error eliminando notificación:', error);
            next(error);
        }
    }

    async getNotificationStats(req, res, next) {
        try {
            const userId = req.user.id;

            const stats = await notificationService.getNotificationStats(userId);

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            logger.error('Error obteniendo estadísticas de notificaciones:', error);
            next(error);
        }
    }
}

module.exports = new NotificationController();
