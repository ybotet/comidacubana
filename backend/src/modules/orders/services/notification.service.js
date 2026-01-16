const Notification = require('../models/Notification');
const logger = require('../../../shared/logging/logger');
const { Op } = require('sequelize');

class NotificationService {
    constructor() {
        this.Notification = Notification;
        this.logger = logger;
        this.Op = Op;
    }

    async getUserNotifications(userId, filters = {}) {
        try {
            const whereCondition = { user_id: userId };

            if (filters.is_read !== undefined) {
                whereCondition.is_read = filters.is_read;
            }

            if (filters.type) {
                whereCondition.type = filters.type;
            }

            if (filters.priority) {
                whereCondition.priority = filters.priority;
            }

            if (filters.start_date) {
                whereCondition.created_at = {
                    [this.Op.gte]: new Date(filters.start_date)
                };
            }

            const notifications = await this.Notification.findAll({
                where: whereCondition,
                order: [['created_at', 'DESC']],
                limit: filters.limit || 50,
                offset: filters.offset || 0
            });

            const unreadCount = await this.Notification.count({
                where: {
                    user_id: userId,
                    is_read: false
                }
            });

            return {
                notifications: notifications.map(notification => notification.getPublicData()),
                meta: {
                    total: notifications.length,
                    unread_count: unreadCount,
                    has_unread: unreadCount > 0
                }
            };
        } catch (error) {
            this.logger.error('Error obteniendo notificaciones:', error);
            throw error;
        }
    }

    async markAsRead(notificationId, userId) {
        try {
            const notification = await this.Notification.findOne({
                where: {
                    id: notificationId,
                    user_id: userId
                }
            });

            if (!notification) {
                throw new Error('Notificación no encontrada');
            }

            await notification.markAsRead();

            this.logger.info(`Notificación marcada como leída: ${notificationId}`);

            return notification.getPublicData();
        } catch (error) {
            this.logger.error('Error marcando notificación como leída:', error);
            throw error;
        }
    }

    async markAllAsRead(userId) {
        try {
            const result = await this.Notification.update(
                {
                    is_read: true,
                    read_at: new Date()
                },
                {
                    where: {
                        user_id: userId,
                        is_read: false
                    }
                }
            );

            this.logger.info(`${result[0]} notificaciones marcadas como leídas para usuario ${userId}`);

            return {
                success: true,
                message: `${result[0]} notificaciones marcadas como leídas`,
                count: result[0]
            };
        } catch (error) {
            this.logger.error('Error marcando todas las notificaciones como leídas:', error);
            throw error;
        }
    }

    async createNotification(userId, notificationData) {
        try {
            const notification = await this.Notification.create({
                user_id: userId,
                ...notificationData
            });

            this.logger.info(`Notificación creada para usuario ${userId}: ${notification.title}`);

            // Aquí se integraría con sistemas de notificación push/email
            await this.sendExternalNotification(notification);

            return notification.getPublicData();
        } catch (error) {
            this.logger.error('Error creando notificación:', error);
            throw error;
        }
    }

    async sendExternalNotification(notification) {
        try {
            // Implementación de envío a diferentes canales
            const channels = notification.channel ? [notification.channel] : ['in_app'];

            for (const channel of channels) {
                switch (channel) {
                    case 'email':
                        await this.sendEmailNotification(notification);
                        break;
                    case 'push':
                        await this.sendPushNotification(notification);
                        break;
                    case 'sms':
                        await this.sendSMSNotification(notification);
                        break;
                    // 'in_app' ya está cubierto
                }
            }
        } catch (error) {
            this.logger.error('Error enviando notificación externa:', error);
            // No lanzar error para no afectar el flujo principal
        }
    }

    async sendEmailNotification(notification) {
        // Implementación de envío de email
        this.logger.info(`Email enviado para notificación: ${notification.id}`);
    }

    async sendPushNotification(notification) {
        // Implementación de notificación push
        this.logger.info(`Push notification enviada: ${notification.id}`);
    }

    async sendSMSNotification(notification) {
        // Implementación de SMS
        this.logger.info(`SMS enviado para notificación: ${notification.id}`);
    }

    async deleteNotification(notificationId, userId) {
        try {
            const notification = await this.Notification.findOne({
                where: {
                    id: notificationId,
                    user_id: userId
                }
            });

            if (!notification) {
                throw new Error('Notificación no encontrada');
            }

            await notification.destroy();

            this.logger.info(`Notificación eliminada: ${notificationId}`);

            return { success: true, message: 'Notificación eliminada correctamente' };
        } catch (error) {
            this.logger.error('Error eliminando notificación:', error);
            throw error;
        }
    }

    async cleanupOldNotifications(days = 30) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);

            const result = await this.Notification.destroy({
                where: {
                    created_at: {
                        [this.Op.lt]: cutoffDate
                    },
                    is_read: true // Solo eliminar notificaciones leídas
                }
            });

            if (result > 0) {
                this.logger.info(`${result} notificaciones antiguas eliminadas (más de ${days} días)`);
            }

            return result;
        } catch (error) {
            this.logger.error('Error limpiando notificaciones antiguas:', error);
            throw error;
        }
    }

    async getNotificationStats(userId) {
        try {
            const total = await this.Notification.count({ where: { user_id: userId } });
            const unread = await this.Notification.count({
                where: {
                    user_id: userId,
                    is_read: false
                }
            });

            const byType = await this.Notification.findAll({
                where: { user_id: userId },
                attributes: [
                    'type',
                    [this.Notification.sequelize.fn('COUNT', this.Notification.sequelize.col('id')), 'count']
                ],
                group: ['type']
            });

            const byPriority = await this.Notification.findAll({
                where: { user_id: userId },
                attributes: [
                    'priority',
                    [this.Notification.sequelize.fn('COUNT', this.Notification.sequelize.col('id')), 'count']
                ],
                group: ['priority']
            });

            return {
                total,
                unread,
                read: total - unread,
                by_type: byType.reduce((acc, item) => {
                    acc[item.type] = parseInt(item.get('count'));
                    return acc;
                }, {}),
                by_priority: byPriority.reduce((acc, item) => {
                    acc[item.priority] = parseInt(item.get('count'));
                    return acc;
                }, {})
            };
        } catch (error) {
            this.logger.error('Error obteniendo estadísticas de notificaciones:', error);
            throw error;
        }
    }
}

module.exports = new NotificationService();
