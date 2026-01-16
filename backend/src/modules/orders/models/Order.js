const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../shared/database/config');
const User = require('../../auth/models/User');
const Address = require('./Address');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    order_number: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    provider_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM(
            'pending',      // Pendiente de aceptación por el proveedor
            'accepted',     // Aceptado por el proveedor
            'preparing',    // En preparación
            'ready',        // Listo para entrega/recoger
            'on_delivery',  // En camino
            'delivered',    // Entregado
            'cancelled',    // Cancelado
            'rejected'      // Rechazado por el proveedor
        ),
        defaultValue: 'pending',
        allowNull: false,
    },
    status_history: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: 'El total no puede ser negativo'
            }
        }
    },
    delivery_type: {
        type: DataTypes.ENUM('delivery', 'pickup'),
        defaultValue: 'delivery',
        allowNull: false,
    },
    address_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'addresses',
            key: 'id'
        }
    },
    delivery_address: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    scheduled_for: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    estimated_delivery_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    actual_delivery_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    special_instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    payment_method: {
        type: DataTypes.ENUM('cash', 'card', 'transfer'),
        defaultValue: 'cash',
        allowNull: false,
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'paid', 'failed'),
        defaultValue: 'pending',
        allowNull: false,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    cancellation_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    preparation_time: {
        type: DataTypes.INTEGER, // en minutos
        allowNull: true,
    },
    items_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: 'El conteo de items no puede ser negativo'
            }
        }
    }
}, {
    tableName: 'orders',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['user_id']
        },
        {
            fields: ['provider_id']
        },
        {
            fields: ['status']
        },
        {
            fields: ['order_number']
        },
        {
            fields: ['created_at']
        }
    ]
});

// Hooks
Order.addHook('beforeCreate', async (order) => {
    // Generar número de pedido secuencial de 6 cifras en base de datos
    if (!order.order_number) {
        // Asegurar que la secuencia exista (Postgres: CREATE SEQUENCE IF NOT EXISTS)
        try {
            await Order.sequelize.query(`CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1`);
            const [[{ nextval }]] = await Order.sequelize.query(`SELECT nextval('order_number_seq')`);
            const seq = typeof nextval === 'bigint' || typeof nextval === 'number' ? nextval : parseInt(nextval, 10);
            order.order_number = String(seq).padStart(6, '0');
        } catch (err) {
            // Fallback: generar un código basado en timestamp + random si la secuencia falla
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            order.order_number = `ORD-${timestamp}-${random}`;
        }
    }

    // Inicializar historial de estado
    if (!order.status_history || order.status_history.length === 0) {
        order.status_history = [{
            status: 'pending',
            timestamp: new Date().toISOString(),
            note: 'Pedido creado'
        }];
    }
});

// After create: ensure order_number is set (useful if DB or hook failed earlier)
Order.addHook('afterCreate', async (orderInstance) => {
    if (!orderInstance.order_number) {
        try {
            await Order.sequelize.query("CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1");
            const [res] = await Order.sequelize.query("SELECT nextval('order_number_seq') as nextval");
            const nextval = res && res[0] && (res[0].nextval || res[0].nextval === 0) ? res[0].nextval : null;
            const seq = nextval !== null ? (typeof nextval === 'bigint' || typeof nextval === 'number' ? nextval : parseInt(nextval, 10)) : null;
            if (seq !== null && !Number.isNaN(seq)) {
                const code = String(seq).padStart(6, '0');
                await orderInstance.update({ order_number: code });
            }
        } catch (err) {
            // ignore: best-effort fallback
        }
    }
});

Order.addHook('beforeUpdate', async (order) => {
    // Si cambia el estado, agregar al historial
    if (order.changed('status') && order.previous('status') !== order.status) {
        const statusHistory = order.status_history || [];
        statusHistory.push({
            status: order.status,
            timestamp: new Date().toISOString(),
            note: `Estado cambiado de ${order.previous('status')} a ${order.status}`
        });
        order.status_history = statusHistory;
    }
});

// Métodos de instancia
Order.prototype.updateStatus = async function (newStatus, note = null) {
    const oldStatus = this.status;
    this.status = newStatus;

    // Agregar al historial
    const statusHistory = this.status_history || [];
    statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: note || `Estado cambiado de ${oldStatus} a ${newStatus}`
    });
    this.status_history = statusHistory;

    await this.save();
    return this;
};

Order.prototype.canBeCancelled = function () {
    const cancellableStatuses = ['pending', 'accepted', 'preparing'];
    return cancellableStatuses.includes(this.status);
};

Order.prototype.canBeAccepted = function () {
    return this.status === 'pending';
};

Order.prototype.canBeRejected = function () {
    return this.status === 'pending';
};

Order.prototype.getStatusLabel = function (lang = 'es') {
    const labels = {
        es: {
            pending: 'Pendiente',
            accepted: 'Aceptado',
            preparing: 'En preparación',
            ready: 'Listo',
            on_delivery: 'En camino',
            delivered: 'Entregado',
            cancelled: 'Cancelado',
            rejected: 'Rechazado'
        },
        ru: {
            pending: 'В ожидании',
            accepted: 'Принято',
            preparing: 'В приготовлении',
            ready: 'Готово',
            on_delivery: 'В пути',
            delivered: 'Доставлено',
            cancelled: 'Отменено',
            rejected: 'Отклонено'
        }
    };

    return labels[lang]?.[this.status] || this.status;
};

Order.prototype.getDeliveryTypeLabel = function (lang = 'es') {
    const labels = {
        es: {
            delivery: 'Domicilio',
            pickup: 'Recoger'
        },
        ru: {
            delivery: 'Доставка',
            pickup: 'Самовывоз'
        }
    };

    return labels[lang]?.[this.delivery_type] || this.delivery_type;
};

Order.prototype.getPublicData = async function (lang = 'es') {
    const data = {
        id: this.id,
        order_number: this.order_number,
        status: this.status,
        status_label: this.getStatusLabel(lang),
        total_amount: this.total_amount,
        delivery_type: this.delivery_type,
        delivery_type_label: this.getDeliveryTypeLabel(lang),
        special_instructions: this.special_instructions,
        payment_method: this.payment_method,
        payment_status: this.payment_status,
        scheduled_for: this.scheduled_for,
        estimated_delivery_time: this.estimated_delivery_time,
        actual_delivery_time: this.actual_delivery_time,
        preparation_time: this.preparation_time,
        items_count: this.items_count,
        created_at: this.created_at,
        updated_at: this.updated_at,
        status_history: this.status_history
    };

    // Cargar relaciones si no están cargadas
    if (this.customer) {
        data.customer = {
            id: this.customer.id,
            name: `${this.customer.first_name} ${this.customer.last_name}`,
            email: this.customer.email,
            phone: this.customer.phone
        };
    }

    if (this.provider) {
        data.provider = {
            id: this.provider.id,
            name: `${this.provider.first_name} ${this.provider.last_name}`,
            email: this.provider.email,
            phone: this.provider.phone
        };
    }

    if (this.address) {
        data.address = {
            id: this.address.id,
            formatted_address: this.address.getFormattedAddress(),
            instructions: this.address.instructions
        };
    } else if (this.delivery_address) {
        data.address = this.delivery_address;
    }

    return data;
};

module.exports = Order;
