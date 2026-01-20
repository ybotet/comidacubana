'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DishCard } from '@/components/DishCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import apiService from '@/services/api.service';

interface Category {
    id: string;
    name: string;
}

interface Dish {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string | { id: string; name: string; description: string; icon: string; color: string; };
    rating?: number;
    image?: string;
}

export default function MenuPage() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Cargar categorías
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Cargar categorías
                const categoriesData = await apiService.getCategories();
                setCategories(categoriesData.data || []);

                // Cargar platos
                const dishesData = await apiService.getDishes();
                setDishes(dishesData.data || []);
            } catch (err) {
                console.error('Error loading menu:', err);
                setError('No se pudieron cargar los platos. Intenta más tarde.');

                // Datos de fallback para desarrollo
                setCategories([
                    { id: 'starters', name: 'Entradas' },
                    { id: 'mains', name: 'Platos Principales' },
                    { id: 'sides', name: 'Acompañamientos' },
                    { id: 'desserts', name: 'Postres' },
                    { id: 'drinks', name: 'Bebidas' },
                ]);


            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold mb-2">{t('common.menu')}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('common.menu_description')}
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Category Filter */}
            {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === null
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                    >
                        Todos
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === cat.id
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Dishes Grid */}
            {isLoading ? (
                <LoadingSpinner />
            ) : dishes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {(selectedCategory
                        ? dishes.filter((d) => {
                            const catId = typeof d.category === 'string' ? d.category : d.category?.id;
                            return catId === selectedCategory;
                        })
                        : dishes
                    ).map((dish) => (
                        <DishCard key={dish.id} {...dish} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        No se encontraron platos
                    </p>
                </div>
            )}
        </div>
    );
}
