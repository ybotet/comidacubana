'use client';

import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { useState } from 'react';

interface DishCardProps {
    id: string;
    name: string;
    description: string;
    base_price?: number;
    price?: number;
    image?: string;
    category?: string | { id: string; name: string; description: string; icon: string; color: string };
    rating?: number;
}

interface CategoryObject {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
}

export function DishCard({ id, name, description, base_price, price, image, category, rating }: DishCardProps) {
    const { t } = useTranslation();
    const { addItem } = useCart();
    const [isFavorite, setIsFavorite] = useState(false);

    // Handle both base_price and price properties
    const dishPrice = base_price || price || 0;

    // Handle category as string or object
    const categoryName = typeof category === 'string' ? category : category?.name;

    const handleAddToCart = () => {
        addItem({
            id,
            dishId: id,
            name,
            price: dishPrice,
            quantity: 1,
            image,
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            {/* Image */}
            <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                        🍲
                    </div>
                )}
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:scale-110 transition-transform"
                >
                    <Heart
                        size={20}
                        className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                    />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {name}
                    </h3>
                    {categoryName && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {categoryName}
                        </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                        {description}
                    </p>

                    {/* Rating */}
                    {rating && (
                        <div className="flex items-center gap-1 mb-3">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {rating.toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        ${dishPrice}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
