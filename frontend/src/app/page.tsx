'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DishCard } from '@/components/DishCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ChefHat, Clock, MapPin } from 'lucide-react';

export default function Home() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simular carga de datos
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const featuredDishes = [
        {
            id: '1',
            name: 'Ropa Vieja',
            description: 'Carne desmenuzada en salsa de tomate con especias cubanas',
            price: 12.99,
            category: 'Platos Principales',
            rating: 4.8,
            image: undefined,
        },
        {
            id: '2',
            name: 'Mofongo',
            description: 'Plátano verde frito acompañado con caldo y proteína',
            price: 10.99,
            category: 'Acompañamientos',
            rating: 4.7,
            image: undefined,
        },
        {
            id: '3',
            name: 'Picadillo',
            description: 'Carne molida con papas, aceitunas y pasas',
            price: 11.99,
            category: 'Platos Principales',
            rating: 4.6,
            image: undefined,
        },
        {
            id: '4',
            name: 'Arroz con Pollo',
            description: 'Pollo tierno con arroz amarillo y vegetales',
            price: 13.99,
            category: 'Platos Principales',
            rating: 4.9,
            image: undefined,
        },
    ];

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-orange-400 to-red-600 text-white p-8 sm:p-12 md:p-16">
                <div className="max-w-2xl">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                        {t('common.appName')}
                    </h1>
                    <p className="text-lg sm:text-xl mb-8 opacity-90">
                        Disfruta de auténtica cocina cubana entregada directamente en tu puerta
                    </p>
                    <a
                        href="/menu"
                        className="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {t('common.menu')}
                    </a>
                </div>

                {/* Decorative emoji */}
                <div className="absolute bottom-0 right-0 text-9xl opacity-20">🍲</div>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <ChefHat className="w-12 h-12 text-primary-600 dark:text-primary-400 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Cocina Auténtica</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Recetas tradicionales cubanas preparadas por chefs expertos
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <Clock className="w-12 h-12 text-primary-600 dark:text-primary-400 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Entrega Rápida</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Recibe tu pedido caliente en 30-45 minutos
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <MapPin className="w-12 h-12 text-primary-600 dark:text-primary-400 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Cobertura Amplia</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Disponible en toda la ciudad con rastreo en tiempo real
                    </p>
                </div>
            </section>

            {/* Featured Dishes */}
            <section>
                <h2 className="text-3xl font-bold mb-8">{t('common.menu')} Destacado</h2>
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredDishes.map((dish) => (
                            <DishCard key={dish.id} {...dish} />
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl p-8 sm:p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">¿Listo para probar?</h2>
                <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
                    Haz tu primer pedido hoy y disfruta de la auténtica comida cubana
                </p>
                <a
                    href="/menu"
                    className="inline-block bg-white text-primary-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    Ordenar Ahora
                </a>
            </section>
        </div>
    );
}
