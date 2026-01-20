'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CartItem {
    id: string;
    dishId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    customizations?: {
        [key: string]: string;
    };
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (dishId: string) => void;
    updateQuantity: (dishId: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = useCallback((item: CartItem) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.dishId === item.dishId);
            if (existing) {
                return prev.map((i) =>
                    i.dishId === item.dishId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prev, item];
        });
    }, []);

    const removeItem = useCallback((dishId: string) => {
        setItems((prev) => prev.filter((i) => i.dishId !== dishId));
    }, []);

    const updateQuantity = useCallback((dishId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(dishId);
            return;
        }
        setItems((prev) =>
            prev.map((i) => (i.dishId === dishId ? { ...i, quantity } : i))
        );
    }, [removeItem]);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                total,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
}
