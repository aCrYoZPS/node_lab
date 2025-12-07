import React, { createContext, useContext, useState, useMemo } from 'react';
import { type Service } from '../types';

interface CartItem extends Service {
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    total: number;
    addItemToCart: (service: Service) => void;
    removeItemFromCart: (serviceId: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addItemToCart = (service: Service) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === service.id);

            if (existingItem) {
                return prevItems.map(item =>
                    item.id === service.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { ...service, quantity: 1 }];
            }
        });
    };

    const removeItemFromCart = (serviceId: string) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === serviceId);

            if (!existingItem) return prevItems; // Item not found

            if (existingItem.quantity === 1) {
                return prevItems.filter(item => item.id !== serviceId);
            } else {
                return prevItems.map(item =>
                    item.id === serviceId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            }
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const total = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }, [cartItems]);

    const contextValue = useMemo(() => ({
        cartItems,
        total,
        addItemToCart,
        removeItemFromCart,
        clearCart,
    }), [cartItems, total]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
