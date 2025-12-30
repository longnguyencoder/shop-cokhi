import { StrictMode, useEffect, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Settings } from 'lucide-react'
import './index.css'

import { AuthProvider, useAuth } from './context/AuthContext'
import { addToCart, updateCartItem as apiUpdateCartItem, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart, getCart } from './api/cart'
import Layout from './components/Layout'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Products from './pages/Products'
import Promotions from './pages/Promotions'
import Checkout from './pages/Checkout'
import Contact from './pages/Contact'
import AdminDashboard from './pages/Admin/Dashboard'
import Profile from './pages/Profile'
import ScrollToTop from './components/ScrollToTop'

// Lazy load Admin components
const AdminOrders = lazy(() => import('./pages/Admin/AdminOrders'));
const AdminProducts = lazy(() => import('./pages/Admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/Admin/AdminCategories'));
const AdminMenus = lazy(() => import('./pages/Admin/AdminMenus'));
const AdminUsers = lazy(() => import('./pages/Admin/AdminUsers'));
const AdminBrands = lazy(() => import('./pages/Admin/AdminBrands'));
const AdminStats = lazy(() => import('./pages/Admin/AdminStats'));

// Helper component to handle side effects inside Router context
const CartSync = ({ cartItems }) => {
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems]);
  return null;
}

function AppRoutes() {
  const { user, loading, cartItems, setCartItems, fetchUser, logout } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#1B2631] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-[#EDB917] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-white font-black uppercase tracking-[0.3em] text-[10px]">TEKKO</span>
      </div>
    </div>
  );

  const handleAddToCart = async (product) => {
    const qtyToAdd = product.quantity || 1
    if (user) {
      try {
        await addToCart(product.id, qtyToAdd);
        const serverCart = await getCart();
        setCartItems(serverCart.map(item => ({ ...item.product, quantity: item.quantity })));
      } catch (error) {
        console.error("Error adding to server cart:", error);
      }
    } else {
      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id)
        if (existing) {
          return prev.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + qtyToAdd } : item
          )
        }
        return [...prev, { ...product, quantity: qtyToAdd }]
      })
    }
  }

  const handleUpdateCartQuantity = async (id, quantity) => {
    if (user) {
      try {
        await apiUpdateCartItem(id, quantity);
        const serverCart = await getCart();
        setCartItems(serverCart.map(item => ({ ...item.product, quantity: item.quantity })));
      } catch (error) {
        console.error("Error updating server cart:", error);
      }
    } else {
      setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item))
    }
  }

  const handleRemoveCartItem = async (id) => {
    if (user) {
      try {
        await apiRemoveFromCart(id);
        const serverCart = await getCart();
        setCartItems(serverCart.map(item => ({ ...item.product, quantity: item.quantity })));
      } catch (error) {
        console.error("Error removing from server cart:", error);
      }
    } else {
      setCartItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const handleOrderSuccess = async () => {
    if (user) {
      try {
        await apiClearCart();
      } catch (error) {
        console.error("Error clearing server cart:", error);
      }
    }
    setCartItems([])
    localStorage.removeItem('cart')
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <CartSync cartItems={cartItems} />
      <Routes>
        <Route path="/" element={
          <Layout
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            user={user}
            onAuthSuccess={() => fetchUser(true)}
            onLogout={logout}
          />
        }>
          <Route index element={<Home onAddToCart={handleAddToCart} />} />
          <Route path="products" element={<Products onAddToCart={handleAddToCart} />} />
          <Route path="promotions" element={<Promotions onAddToCart={handleAddToCart} />} />
          <Route path="product/:slug" element={<ProductDetail onAddToCart={handleAddToCart} />} />
          <Route path="checkout" element={<Checkout cartItems={cartItems} user={user} onOrderSuccess={handleOrderSuccess} />} />
          <Route path="contact" element={<Contact />} />
          <Route path="profile" element={<Profile user={user} onUpdateSuccess={(updated) => fetchUser()} />} />

          {/* Admin Protected Route */}
          <Route path="admin" element={user?.is_superuser ? <AdminDashboard /> : <Navigate to="/" />}>
            <Route index element={<Navigate to="orders" replace />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="menus" element={<AdminMenus />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="stats" element={<AdminStats />} />
            <Route path="settings" element={
              <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="bg-white p-8 rounded-full shadow-xl">
                  <Settings className="h-20 w-20 text-gray-100" />
                </div>
                <h3 className="text-2xl font-black text-navy uppercase tracking-tighter">Tính năng đang phát triển</h3>
                <p className="text-gray-400 font-bold text-sm italic">Hệ thống quản lý Cài đặt sẽ sớm ra mắt.</p>
              </div>
            } />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function Root() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
