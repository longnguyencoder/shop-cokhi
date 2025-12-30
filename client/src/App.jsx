import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, LogIn, User, Search, Package, Factory, Menu, Phone, ChevronRight, LayoutGrid, LogOut } from 'lucide-react'
import api from './api/axios'
import { getMe, logout } from './api/auth'
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from './api/cart'
import AuthModal from './components/AuthModal'
import CartDrawer from './components/CartDrawer'
import DynamicMegaMenu from './components/DynamicMegaMenu'
import SITE_CONFIG from './config/site'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminOrders from './pages/Admin/AdminOrders'
import { Navigate, Route, Routes } from 'react-router-dom'
import { io } from 'socket.io-client' // Import socket
import config from './config' // Import config

// The structure is Main.jsx -> Router -> App.jsx.
// But usually App.jsx defines routes. Let's check Main.jsx content again.

function App() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  // Auth state
  const [user, setUser] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Cart state
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedBrand, setSelectedBrand] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (searchTerm) params.q = searchTerm
      if (selectedCategory) params.category_id = selectedCategory
      if (selectedBrand) params.brand_id = selectedBrand

      const res = await api.get('/products/', { params })
      setProducts(res.data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, selectedCategory, selectedBrand])

  const fetchUser = async (isLogin = false) => {
    try {
      if (localStorage.getItem('token')) {
        const userData = await getMe()
        setUser(userData)
        await syncCartWithServer(isLogin)
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      localStorage.removeItem('token')
      setUser(null)
    }
  }

  const syncCartWithServer = async (isLogin = false) => {
    try {
      const serverCart = await getCart()
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]')

      if (isLogin && localCart.length > 0) {
        // Merge local cart into server cart only on login
        for (const item of localCart) {
          await addToCart(item.id, item.quantity)
        }
        // Fetch again after merging
        const finalServerCart = await getCart()
        const mergedCart = finalServerCart.map(item => ({
          ...item.product,
          quantity: item.quantity
        }))
        setCartItems(mergedCart)
      } else {
        // Just sync from server (server is source of truth)
        const serverMergedCart = serverCart.map(item => ({
          ...item.product,
          quantity: item.quantity
        }))
        setCartItems(serverMergedCart)
      }
    } catch (error) {
      console.error("Error syncing cart:", error)
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get('/categories/'),
          api.get('/brands/')
        ])
        setCategories(catRes.data)
        setBrands(brandRes.data)
      } catch (error) {
        console.error("Error fetching initial data:", error)
      }
    }
    fetchInitialData()
    fetchUser()

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Socket.IO for Realtime Cart
  useEffect(() => {
    if (!user) return; // Only connect if user is logged in

    const socket = io(config.apiUrl, {
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('App connected to socket for cart sync');
    });

    socket.on('cart_updated', (data) => {
      console.log('Cart update received:', data);
      if (data.user_id === user.id) {
        console.log('Refetching cart for user:', user.id);
        syncCartWithServer(false); // Refetch cart
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]); // Re-run when user changes (login/logout)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const handleAddToCart = async (product) => {
    if (user) {
      try {
        await addToCart(product.id, 1)
      } catch (error) {
        console.error("Error adding to server cart:", error)
      }
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const handleUpdateCartQuantity = async (id, quantity) => {
    if (user) {
      try {
        await updateCartItem(id, quantity)
      } catch (error) {
        console.error("Error updating server cart:", error)
      }
    }
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ))
  }

  const handleRemoveCartItem = async (id) => {
    if (user) {
      try {
        await removeFromCart(id)
      } catch (error) {
        console.error("Error removing from server cart:", error)
      }
    }
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const handleLogout = async () => {
    logout()
    localStorage.removeItem('cart')
    setCartItems([])
    setUser(null)
  }

  const resetFilters = () => {
    setSelectedCategory(null)
    setSelectedBrand(null)
    setSearchTerm('')
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Search state
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)

  // Live Search Effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        try {
          const res = await api.get('/products/', { params: { q: searchTerm, limit: 5 } })
          setSearchResults(res.data)
          setShowResults(true)
        } catch (error) {
          console.error("Search error:", error)
        }
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  return (
    <div className="min-h-screen bg-bg text-gray-800 font-sans">
      {/* ... (Auth & Cart Modals code preserved) ... */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => fetchUser(true)}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
      />

      {/* Top Bar */}
      <div className="bg-gray-100 border-b border-gray-200 py-1 text-sm hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-gray-600">
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary">Giới thiệu</a>
            <a href="#" className="hover:text-primary">Videos</a>
            <a href="#" className="hover:text-primary">Downloads</a>
          </div>
          <div className="flex items-center text-accent font-bold">
            <Phone className="h-4 w-4 mr-1" />
            HOTLINE: {SITE_CONFIG.contact.hotline.replace(/\s/g, '.')}
          </div>
        </div>
      </div>

      {/* Middle Header */}
      <header className="bg-white py-4 shadow-sm relative z-40">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={resetFilters}>
            <div className="bg-navy p-2 rounded">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black text-navy tracking-tighter uppercase">TEKKO</span>
              <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Precision Mechanical Tools</span>
            </div>
          </div>

          <div className="flex-1 w-full max-w-2xl relative">
            <div className="flex overflow-hidden rounded-md border-2 border-primary relative z-10 bg-white">
              <input
                type="text"
                placeholder="Tìm kiếm dụng cụ, máy móc..."
                className="flex-1 py-3 px-4 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setShowResults(true) }}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
              />
              <button className="bg-primary hover:bg-primary-dark text-navy px-8 transition-colors">
                <Search className="h-6 w-6 font-bold" />
              </button>
            </div>

            {/* Live Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl rounded-b-lg overflow-hidden z-0 mt-[-2px] pt-2">
                {searchResults.map(product => (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    onClick={() => setShowResults(false)}
                  >
                    <img
                      src={product.image_url?.startsWith('http') ? product.image_url : `${config.apiUrl}${product.image_url}`}
                      alt={product.name}
                      className="w-12 h-12 object-contain border border-gray-100 rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-navy line-clamp-1">{product.name}</h4>
                      <div className="text-xs text-gray-400 font-bold">SKU: {product.sku}</div>
                    </div>
                    <div className="text-sm font-black text-accent whitespace-nowrap">
                      {product.price ? product.price.toLocaleString() : 'Liên hệ'} <span className="text-[10px] uppercase text-gray-400">₫</span>
                    </div>
                  </Link>
                ))}
                <div className="p-2 bg-gray-50 text-center">
                  <button onClick={() => { fetchProducts(); setShowResults(false); }} className="text-xs font-black text-navy uppercase tracking-widest hover:text-primary">
                    Xem tất cả kết quả ({searchResults.length}+)
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-6">
            {user ? (
              <div className="group relative">
                <button className="flex flex-col items-center text-navy hover:text-primary transition-colors">
                  <User className="h-6 w-6" />
                  <span className="text-[10px] font-black uppercase mt-1 max-w-[80px] truncate">{user.full_name}</span>
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white shadow-xl border border-gray-100 rounded p-2 w-48">
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 p-2 text-sm font-bold text-gray-600 hover:text-accent hover:bg-red-50 rounded transition-colors uppercase italic tracking-tighter">
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex flex-col items-center text-navy hover:text-primary transition-colors"
              >
                <User className="h-6 w-6" />
                <span className="text-[10px] font-black uppercase mt-1">Tài khoản</span>
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex flex-col items-center text-navy hover:text-primary transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="text-[10px] font-black uppercase mt-1 font-bold">Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Nav - Dynamic Mega Menu */}
      <DynamicMegaMenu />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-80 flex-shrink-0">
            <div className="bg-white rounded shadow-sm overflow-hidden mb-8 border border-gray-200">
              <div className="bg-navy text-white px-5 py-4 font-black border-b border-gray-100 flex items-center justify-between uppercase tracking-widest text-xs">
                <span>PHÂN LOẠI</span>
                <LayoutGrid className="h-4 w-4 text-primary" />
              </div>
              <ul className="divide-y divide-gray-50">
                <li
                  className={`px-5 py-3.5 cursor-pointer flex items-center justify-between group transition-colors ${!selectedCategory ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  <span className="text-sm font-black uppercase tracking-tight">Tất cả sản phẩm</span>
                  <ChevronRight className="h-4 w-4 text-primary" />
                </li>
                {categories.map(cat => (
                  <li
                    key={cat.id}
                    className={`px-5 py-3.5 cursor-pointer flex items-center justify-between group transition-colors ${selectedCategory === cat.id ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span className="text-sm font-bold uppercase tracking-tight">{cat.name}</span>
                    <ChevronRight className={`h-4 w-4 transition-all ${selectedCategory === cat.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'} text-primary`} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded shadow-sm overflow-hidden border border-gray-200">
              <div className="bg-navy text-white px-5 py-4 font-black border-b border-gray-100 flex items-center justify-between uppercase tracking-widest text-xs">
                <span>THƯƠNG HIỆU</span>
                <Factory className="h-4 w-4 text-primary" />
              </div>
              <div className="p-5 grid grid-cols-2 gap-3">
                {brands.map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(selectedBrand === brand.id ? null : brand.id)}
                    className={`h-11 text-[10px] font-black border transition-all flex items-center justify-center p-2 uppercase tracking-tighter
                      ${selectedBrand === brand.id ? 'border-primary bg-primary/20 text-navy shadow-inner' : 'border-gray-100 bg-gray-50 hover:border-primary text-gray-500'}`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <section className="flex-1">
            <div className="bg-white px-6 py-5 border-b-4 border-primary shadow-sm mb-8 flex justify-between items-center rounded-t">
              <h2 className="text-2xl font-black text-navy uppercase tracking-tighter">SẢN PHẨM MỚI NHẤT</h2>
              <div className="text-[10px] text-gray-400 font-extrabold tracking-widest uppercase">
                {loading ? 'Hệ thống đang tải...' : `${products.length} KẾT QUẢ`}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded border border-gray-100 p-6 shadow-sm animate-pulse h-96"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-24 text-center rounded border border-gray-100 shadow-sm flex flex-col items-center">
                <Package className="h-20 w-20 text-gray-100 mb-6" />
                <p className="text-xl text-gray-400 font-black uppercase tracking-widest italic">Không có sản phẩm nào</p>
                <button onClick={resetFilters} className="mt-6 text-primary font-black uppercase tracking-tighter hover:underline text-sm border-2 border-primary px-6 py-2 rounded">Khôi phục tìm kiếm</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                  <div key={product.id} className="bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex flex-col relative translate-y-0 hover:-translate-y-2">
                    {/* Sale Ribbon */}
                    <div className="absolute top-0 right-0 bg-primary text-navy text-[11px] font-black px-4 py-2 rounded-bl-xl shadow z-10 uppercase tracking-tighter skew-x-[-10deg]">
                      SALE
                    </div>

                    <Link to={`/product/${product.slug}`} className="h-64 bg-white relative overflow-hidden flex items-center justify-center p-10 border-b border-gray-50 text-gray-300 block">
                      <Package className="h-32 w-32 group-hover:scale-125 group-hover:text-primary/10 transition-all duration-700 ease-out" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-accent text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest rounded-sm">
                          {product.in_stock ? 'Mới về' : 'Hết hàng'}
                        </span>
                      </div>
                    </Link>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">{product.sku}</span>
                        <span className="text-[10px] text-primary font-black uppercase tracking-widest">In Stock</span>
                      </div>
                      <Link to={`/product/${product.slug}`} className="font-black text-navy group-hover:text-primary transition-colors mb-4 line-clamp-2 min-h-[3rem] leading-tight uppercase text-sm tracking-tight italic block">
                        {product.name}
                      </Link>
                      <div className="mt-auto">
                        <div className="text-2xl font-black text-accent mb-6 pt-4 border-t border-gray-50">
                          {product.price > 0 ? `${product.price.toLocaleString()} VNĐ` : 'LIÊN HỆ'}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 bg-primary hover:bg-primary-dark text-navy py-3 rounded-sm font-black text-[11px] transition-all flex items-center justify-center gap-2 transform active:scale-90 shadow-md uppercase tracking-tighter"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            LIÊN HỆ MUA
                          </button>
                          <button className="w-12 bg-navy hover:bg-navy-light text-white rounded-sm flex items-center justify-center transition-all transform active:scale-90 shadow-md">
                            <Search className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-navy text-white mt-32 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="space-y-8">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-primary shadow-primary/20" />
                <span className="text-2xl font-black tracking-tighter uppercase italic">TEKKO</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                Dẫn đầu trong việc cung cấp các thiết bị gia công cơ khí chính xác. Hợp tác cùng các tập đoàn công cụ hàng đầu thế giới.
              </p>
              <div className="flex space-x-5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-10 w-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-navy cursor-pointer transition-all hover:-translate-y-1 group">
                    <span className="text-gray-400 group-hover:text-navy">f</span>
                  </div>
                ))}
              </div>
            </div>

            {[
              { title: 'Sản phẩm chủ lực', items: ['Dụng cụ cắt gọt', 'Hệ thống kẹp dao', 'Đầu gá máy tiện', 'Phụ kiện máy phay'] },
              { title: 'Dịch vụ khách hàng', items: ['Chính sách đổi trả', 'Vận chuyển tận xưởng', 'Hỗ trợ kỹ thuật 24/7', 'Báo giá dự án'] },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-black text-white mb-8 uppercase tracking-widest text-xs border-b-2 border-primary pb-2 w-max">{col.title}</h4>
                <ul className="text-gray-500 text-sm space-y-4 font-bold">
                  {col.items.map(item => (
                    <li key={item} className="hover:text-primary hover:translate-x-2 cursor-pointer transition-all flex items-center gap-2 group">
                      <div className="h-1.5 w-1.5 bg-gray-700/50 rounded-full group-hover:bg-primary transition-colors"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="font-black text-white mb-8 uppercase tracking-widest text-xs border-b-2 border-primary pb-2 w-max">Tư vấn kỹ thuật</h4>
              <div className="text-3xl font-black text-primary mb-4 tracking-tighter">{SITE_CONFIG.contact.phone.replace(/\s/g, '.')}</div>
              <div className="space-y-4">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Thời gian làm việc:</p>
                <p className="text-gray-400 text-sm font-medium">Thứ 2 - Thứ 7: 08:00 - 17:30</p>
                <p className="text-primary text-sm font-black underline italic">Email: {SITE_CONFIG.contact.email}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-10 text-center flex flex-col items-center gap-4">
            <div className="text-[10px] text-gray-700 font-black tracking-[0.3em] uppercase">
              © 2025 TEKKO. ALL RIGHTS RESERVED.
            </div>
            <div className="text-[8px] text-gray-800 font-bold uppercase tracking-widest">
              Design by Google Deepmind Team - Advanced Agentic Coding
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
