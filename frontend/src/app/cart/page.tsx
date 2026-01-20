'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import apiService from '@/services/api.service';

interface CheckoutData {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    notes: string;
}

export default function CartPage() {
    const { t } = useTranslation();
    const { items, removeItem, updateQuantity, total, clearCart } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkoutData, setCheckoutData] = useState<CheckoutData>({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        notes: '',
    });
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const handleCheckoutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCheckoutData(prev => ({
            ...prev,
            [name]: value
        }));
        setSubmitError(null);
    };

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar datos
        if (!checkoutData.name || !checkoutData.email || !checkoutData.phone || !checkoutData.address) {
            setSubmitError('Por favor completa todos los campos requeridos');
            return;
        }

        setIsSubmitting(true);
        try {
            const orderPayload = {
                user_id: null, // Para órdenes anónimas
                items: items.map(item => ({
                    dishId: item.dishId,
                    quantity: item.quantity,
                    price: Number(item.price)
                })),
                totalPrice: total,
                customerName: checkoutData.name,
                customerEmail: checkoutData.email,
                customerPhone: checkoutData.phone,
                deliveryAddress: checkoutData.address,
                deliveryCity: checkoutData.city,
                notes: checkoutData.notes,
            };

            const response = await apiService.createOrder(orderPayload);

            if (response.success || response.data) {
                setOrderSuccess(true);
                clearCart();
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                setSubmitError(response.message || 'Error al procesar la orden');
            }
        } catch (error: any) {
            console.error('Error creating order:', error);
            setSubmitError(error.message || 'Error al procesar la orden. Intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0 && !isCheckingOut) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">🛒</div>
                <h1 className="text-3xl font-bold mb-2">{t('common.emptyCart')}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Añade algunos platos deliciosos a tu carrito
                </p>
                <Link
                    href="/menu"
                    className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
                >
                    {t('common.continueShopping')}
                </Link>
            </div>
        );
    }

    // Pantalla de éxito
    if (orderSuccess) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">✅</div>
                <h1 className="text-3xl font-bold mb-2">¡Orden confirmada!</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Tu pedido ha sido registrado exitosamente. Te redirigiremos al inicio...
                </p>
            </div>
        );
    }

    // Formulario de checkout
    if (isCheckingOut) {
        return (
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => setIsCheckingOut(false)}
                    className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 mb-6"
                >
                    <ArrowLeft size={20} />
                    Volver al carrito
                </button>

                <h1 className="text-3xl font-bold mb-6">Completar compra</h1>

                <form onSubmit={handleSubmitOrder} className="space-y-6">
                    {/* Error Message */}
                    {submitError && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                            {submitError}
                        </div>
                    )}

                    {/* Personal Info */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Información personal</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Nombre completo *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={checkoutData.name}
                                    onChange={handleCheckoutChange}
                                    placeholder="Juan Pérez"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={checkoutData.email}
                                        onChange={handleCheckoutChange}
                                        placeholder="juan@example.com"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Teléfono *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={checkoutData.phone}
                                        onChange={handleCheckoutChange}
                                        placeholder="+34 123 456 789"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Dirección de entrega</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Dirección *
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={checkoutData.address}
                                    onChange={handleCheckoutChange}
                                    placeholder="Calle Principal 123, Apt 4B"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Ciudad
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={checkoutData.city}
                                    onChange={handleCheckoutChange}
                                    placeholder="Madrid"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Notas especiales (opcional)
                                </label>
                                <textarea
                                    name="notes"
                                    value={checkoutData.notes}
                                    onChange={handleCheckoutChange}
                                    placeholder="Ej: Llamar antes de llegar, no pulsar timbre..."
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>
                        <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                            {items.map(item => (
                                <div key={item.dishId} className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xl font-bold">
                            <span>Total:</span>
                            <span className="text-primary-600 dark:text-primary-400">
                                ${total.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        {isSubmitting ? 'Procesando...' : 'Confirmar orden'}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold mb-6">{t('common.cart')}</h1>

                <div className="space-y-4">
                    {items.map((item: any) => (
                        <div
                            key={item.dishId}
                            className="bg-white dark:bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                        >
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                    {item.name}
                                </h3>
                                <p className="text-primary-600 dark:text-primary-400 font-semibold">
                                    ${Number(item.price).toFixed(2)} {t('common.each')}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <button
                                        onClick={() => updateQuantity(item.dishId, item.quantity - 1)}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="px-4 font-bold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.dishId, item.quantity + 1)}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {/* Subtotal */}
                                <div className="font-bold text-lg text-gray-900 dark:text-white w-20 text-right">
                                    ${(Number(item.price) * item.quantity).toFixed(2)}
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={() => removeItem(item.dishId)}
                                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Clear Cart Button */}
                {items.length > 0 && (
                    <button
                        onClick={clearCart}
                        className="mt-6 text-red-500 hover:text-red-600 font-semibold transition-colors"
                    >
                        Vaciar carrito
                    </button>
                )}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg sticky top-20">
                    <h2 className="text-2xl font-bold mb-6">{t('common.total')}</h2>

                    <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>{items.length} platos</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Entrega</span>
                            <span>$0.00</span>
                        </div>
                    </div>

                    <div className="flex justify-between text-xl font-bold mb-6">
                        <span>Total:</span>
                        <span className="text-primary-600 dark:text-primary-400">
                            ${total.toFixed(2)}
                        </span>
                    </div>

                    <button
                        onClick={() => setIsCheckingOut(true)}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-lg transition-colors mb-3"
                    >
                        {t('common.checkout')}
                    </button>

                    <Link
                        href="/menu"
                        className="block w-full text-center border border-primary-500 text-primary-600 dark:text-primary-400 font-bold py-3 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        {t('common.continueShopping')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
