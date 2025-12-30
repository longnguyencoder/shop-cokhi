import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, logout as apiLogout } from '../api/auth';
import { getCart, addToCart, clearCart as apiClearCart } from '../api/cart';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);

    const fetchUser = useCallback(async (isLogin = false) => {
        try {
            if (localStorage.getItem('token')) {
                const userData = await getMe();
                setUser(userData);

                // Sync cart logic
                const serverCart = await getCart();
                const localCart = JSON.parse(localStorage.getItem('cart') || '[]');

                if (isLogin && localCart.length > 0) {
                    for (const item of localCart) {
                        await addToCart(item.id, item.quantity);
                    }
                    localStorage.removeItem('cart');
                }

                const finalCart = await getCart();
                setCartItems(finalCart.map(item => ({ ...item.product, quantity: item.quantity })));
            } else {
                setUser(null);
                // Load local cart
                const savedCart = localStorage.getItem('cart');
                if (savedCart) setCartItems(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error("Auth error", error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const logout = () => {
        apiLogout();
        localStorage.removeItem('token');
        localStorage.removeItem('cart');
        setUser(null);
        setCartItems([]);
    };

    const value = {
        user,
        loading,
        cartItems,
        setCartItems,
        fetchUser,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
