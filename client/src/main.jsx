import { StrictMode, useState, useEffect, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

import { getMe } from './api/auth'
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

function Root() {
  const [user, setUser] = useState(null)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
      return []
    }
  })
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      if (localStorage.getItem('token')) {
        const userData = await getMe()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Auth error:", error)
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      const qtyToAdd = product.quantity || 1
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + qtyToAdd } : item
        )
      }
      return [...prev, { ...product, quantity: qtyToAdd }]
    })
  }

  const handleUpdateCartQuantity = (id, quantity) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item))
  }

  const handleRemoveCartItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const handleOrderSuccess = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#1B2631] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-[#EDB917] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-white font-black uppercase tracking-[0.3em] text-[10px]">TEKKO</span>
      </div>
    </div>
  )

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <Layout
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            user={user}
            onAuthSuccess={fetchUser}
            onLogout={() => { localStorage.removeItem('token'); setUser(null); }}
          />
        }>
          <Route index element={<Home onAddToCart={handleAddToCart} />} />
          <Route path="products" element={<Products onAddToCart={handleAddToCart} />} />
          <Route path="promotions" element={<Promotions onAddToCart={handleAddToCart} />} />
          <Route path="product/:slug" element={<ProductDetail onAddToCart={handleAddToCart} />} />
          <Route path="checkout" element={<Checkout cartItems={cartItems} user={user} onOrderSuccess={handleOrderSuccess} />} />
          <Route path="contact" element={<Contact />} />
          <Route path="profile" element={<Profile user={user} onUpdateSuccess={(updated) => setUser(updated)} />} />

          {/* Admin Protected Route */}
          <Route path="admin" element={user?.is_superuser ? <AdminDashboard /> : <Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
