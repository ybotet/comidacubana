const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../shared/database/config');
const User = require('../../auth/models/User');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM(
            'order_created',
            'order_accepted',
            'order_rejected',
            'order_status_changed',
            'order_ready',
            'order_delivered',
            'order_cancelled',
            'new_message',
            'system'
        ),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    data: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Datos adicionales (ej: order_id, provider_id, etc.)'
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    read_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    channel: {
        type: DataTypes.ENUM('in_app', 'email', 'push', 'sms'),
        defaultValue: 'in_app',
        allowNull: false,
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
        defaultValue: 'medium',
    }
}, {
    tableName: 'notifications',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['user_id', 'is_read']
        },
        {
            fields: ['type']
        },
        {
            fields: ['created_at']
        }
    ]
});


// Hooks
Notification.addHook('beforeUpdate', async (notification) => {
    if (notification.changed('is_read') && notification.is_read && !notification.read_at) {
        notification.read_at = new Date();
    }
});

// Métodos de instancia
Notification.prototype.markAsRead = async function () {
    this.is_read = true;
    this.read_at = new Date();
    await this.save();
    return this;
};

Notification.prototype.getPublicData = function () {
    return {
        id: this.id,
        type: this.type,
        title: this.title,
        message: this.message,
        data: this.data,
        is_read: this.is_read,
        read_at: this.read_at,
        channel: this.channel,
        priority: this.priority,
        created_at: this.created_at
    };
};

// Métodos estáticos para crear notificaciones comunes
Notification.createOrderNotification = async function (userId, orderId, type, extraData = {}) {
    const notifications = {
        order_created: {
            title: 'Nuevo pedido recibido',
            message: 'Tienes un nuevo pedido pendiente de aceptación'
        },
        order_accepted: {
            title: 'Pedido aceptado',
            message: 'Tu pedido ha sido aceptado y está en preparación'
        },
        order_rejected: {
            title: 'Pedido rechazado',
            message: 'Lamentablemente tu pedido ha sido rechazado'
        },
        order_status_changed: {
            title: 'Estado del pedido actualizado',
            message: 'El estado de tu pedido ha cambiado'
        },
        order_ready: {
            title: 'Pedido listo',
            message: 'Tu pedido está listo para ser entregado/recogido'
        },
        order_delivered: {
            title: 'Pedido entregado',
            message: 'Tu pedido ha sido entregado satisfactoriamente'
        },
        order_cancelled: {
            title: 'Pedido cancelado',
            message: 'Tu pedido ha sido cancelado'
        }
    };

    const notificationConfig = notifications[type] || {
        title: 'Notificación del sistema',
        message: 'Tienes una nueva notificación'
    };

    return await Notification.create({
        user_id: userId,
        type: type,
        title: notificationConfig.title,
        message: notificationConfig.message,
        data: {
            order_id: orderId,
            ...extraData
        },
        priority: type.includes('cancelled') || type.includes('rejected') ? 'high' : 'medium'
    });
};

module.exports = Notification;
