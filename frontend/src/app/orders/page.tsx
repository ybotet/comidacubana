'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Clock, MapPin, Phone, DollarSign, ShoppingBag } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import apiService from '@/services/api.service';

interface Order {
    id: string;
    status: string;
    date?: string;
    createdAt?: string;
    total: number;
    items: any[];
    estimatedTime?: string;
    address?: string;
    deliveryAddress?: string;
    phone?: string;
}

export default function OrdersPage() {
    const { t } = useTranslation();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar órdenes del usuario
    useEffect(() => {
        const loadOrders = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Verificar si hay token
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Por favor inicia sesión para ver tus órdenes');
                    setOrders([]);
                    setIsLoading(false);
                    return;
                }

                // Obtener órdenes del usuario
                const response = await apiService.getOrders();
                setOrders(response.data || []);
            } catch (err) {
                console.error('Error loading orders:', err);
                setError('No se pudieron cargar tus órdenes');

                // Datos de fallback para desarrollo
                setOrders([
                    {
                        id: '#ORD-001',
                        status: 'ready',
                        date: '2024-01-19',
                        total: 42.97,
                        items: ['Ropa Vieja', 'Mofongo', 'Arroz con Pollo'],
                        estimatedTime: '5 min',
                        address: '123 Calle Principal, La Habana',
                    },
                    {
                        id: '#ORD-002',
                        status: 'preparing',
                        date: '2024-01-18',
                        total: 35.98,
                        items: ['Picadillo', 'Tostones'],
                        estimatedTime: '20 min',
                        address: '456 Avenida Central, La Habana',
                    },
                    {
                        id: '#ORD-003',
                        status: 'delivered',
                        date: '2024-01-17',
                        total: 28.99,
                        items: ['Flan', 'Bebida'],
                        estimatedTime: 'Entregado',
                        address: '789 Paseo Cubano, La Habana',
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        loadOrders();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'preparing':
                return <Clock className="w-5 h-5 text-orange-500" />;
            case 'ready':
                return <Package className="w-5 h-5 text-blue-500" />;
            case 'delivered':
                return <MapPin className="w-5 h-5 text-green-500" />;
            default:
                return <Package className="w-5 h-5" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'preparing':
                return 'Preparando';
            case 'ready':
                return 'Listo para recoger';
            case 'delivered':
                return 'Entregado';
            default:
                return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'preparing':
                return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
            case 'ready':
                return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
            case 'delivered':
                return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
        }
    };

    if (orders.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <h1 className="text-3xl font-bold mb-2">Sin pedidos</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Aún no has realizado ningún pedido
                </p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">{t('common.orders')}</h1>

            <div className="space-y-6">
                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            {t('common.noOrders')}
                        </p>
                    </div>
                ) : (
                    orders.map((order) => {
                        const itemsList = (order.items || []).map((item: any) => {
                            if (typeof item === 'string') return item;
                            return `${item.dishName || item.name} x${item.quantity || 1}`;
                        });

                        return (
                            <div
                                key={order.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                            Pedido #{order.id}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(order.createdAt || order.date || new Date()).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>

                                    <div
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${getStatusColor(
                                            order.status
                                        )}`}
                                    >
                                        {getStatusIcon(order.status)}
                                        {getStatusLabel(order.status)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    {/* Items */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            Artículos
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {order.items.map((item, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Grid Layout for Address and Time */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                        {/* Address */}
                                        <div className="flex gap-3">
                                            <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Dirección
                                                </p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {order.address}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Time */}
                                        <div className="flex gap-3">
                                            <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Tiempo estimado
                                                </p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {order.estimatedTime}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {t('common.total')}
                                        </span>
                                        <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                            ${typeof order.total === 'number' ? order.total.toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="p-6 bg-gray-50 dark:bg-gray-700">
                                    <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 rounded-lg transition-colors">
                                        {t('common.trackOrder')}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
