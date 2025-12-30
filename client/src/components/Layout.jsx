import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { ShoppingCart, User, Search, Package, Menu, Phone, LogOut, ChevronRight, LayoutGrid, X } from 'lucide-react';
import api from '../api/axios';
import { getMe, logout } from '../api/auth';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';
import Footer from './Footer';
import FloatingContact from './FloatingContact';
import SITE_CONFIG from '../config/site';
import zaloIcon from '../assets/zalo.png';

const Layout = ({ cartItems, onUpdateQuantity, onRemoveItem, user, onAuthSuccess, onLogout }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [menus, setMenus] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (searchTerm.length < 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await api.get('/products/', {
                    params: { q: searchTerm, limit: 10 }
                });
                setSuggestions(res.data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const catRes = await api.get('/categories/');
                setCategories(catRes.data);

                // Fetch all menus with their items
                const fetchMenus = async () => {
                    try {
                        const menusRes = await api.get('/menus/');
                        if (menusRes.data) {
                            const activeMenus = menusRes.data.filter(m => m.is_active);

                            // Fetch items for each menu
                            const menusWithItems = await Promise.all(
                                activeMenus.map(async (menu) => {
                                    try {
                                        const menuDetail = await api.get(`/menus/${menu.code}`);
                                        return menuDetail.data;
                                    } catch (err) {
                                        return menu;
                                    }
                                })
                            );

                            console.log('Menus updated:', menusWithItems);
                            setMenus(menusWithItems);
                        }
                    } catch (err) {
                        console.log('No menus found');
                    }
                };

                await fetchMenus();

                // Set up polling for menu updates every 30 seconds
                const interval = setInterval(fetchMenus, 30000);
                return () => clearInterval(interval);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?q=${encodeURIComponent(searchTerm)}`);
        } else {
            navigate('/');
        }
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-[#F4F4F4] text-gray-800 font-sans">
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onAuthSuccess={onAuthSuccess}
            />
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
            />

            {/* Top Bar */}
            <div className="bg-[#1B2631] text-white/70 py-2 text-[10px] sm:text-xs hidden md:block border-b border-white/5">
                <div className="container mx-auto px-4 flex justify-between items-center font-bold tracking-widest uppercase">
                    <div className="flex space-x-6">
                        <Link to="#" className="hover:text-primary transition-colors">VỀ TEKKO</Link>
                        <Link to="#" className="hover:text-primary transition-colors">VIDEO KỸ THUẬT</Link>
                        <Link to="#" className="hover:text-primary transition-colors">TÀI LIỆU (DOWNLOAD)</Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        {user && user.is_superuser && (
                            <Link to="/admin" className="flex items-center gap-1.5 text-primary font-black hover:underline">
                                <LayoutGrid className="h-3.5 w-3.5" />
                                QUẢN TRỊ VIÊN
                            </Link>
                        )}
                        <span className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-primary" />
                            HOTLINE: {SITE_CONFIG.contact.phone}
                        </span>
                    </div>
                </div>
            </div>

            {/* Header */}
            <header className="glass-header sticky top-0 z-[60] py-3 md:py-4 transition-all duration-300">
                <div className="container mx-auto px-4 flex justify-between items-center gap-4 lg:gap-8">
                    {/* Mobile Menu Trigger */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-navy"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
                        <div className="bg-navy p-2 md:p-2.5 rounded-xl md:rounded-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow">
                            <Package className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-lg md:text-2xl font-black tracking-tighter text-navy uppercase italic">TEKKO</span>
                            <span className="text-[7px] md:text-[9px] text-gray-400 font-bold tracking-[0.3em] uppercase">Engineering Solutions</span>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden sm:block relative">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Tìm kiếm dụng cụ phay, khoan, tiện..."
                                className="w-full pl-6 pr-14 py-3 bg-gray-50 border-2 border-gray-100 rounded-full focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => searchTerm.length >= 2 && setSuggestions(prev => prev)}
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-navy text-primary p-2 rounded-full hover:scale-110 active:scale-95 transition-all shadow-md group-hover:bg-primary group-hover:text-navy"
                            >
                                <Search className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Search Suggestions */}
                        {searchTerm.length >= 2 && (suggestions.length > 0 || isSearching) && (
                            <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                {isSearching ? (
                                    <div className="p-4 flex items-center justify-center gap-3">
                                        <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Đang tìm kiếm...</span>
                                    </div>
                                ) : (
                                    <div className="max-h-[400px] overflow-y-auto pt-2">
                                        <div className="px-4 py-2 border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sản phẩm gợi ý</div>
                                        {suggestions.map((p) => (
                                            <Link
                                                key={p.id}
                                                to={`/product/${p.slug}`}
                                                className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors group/item"
                                                onClick={() => {
                                                    setSuggestions([]);
                                                    setSearchTerm('');
                                                }}
                                            >
                                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100 p-1">
                                                    {p.image_url ? (
                                                        <img src={p.image_url.startsWith('http') ? p.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${p.image_url}`} alt="" className="h-full w-full object-contain" />
                                                    ) : (
                                                        <Package className="h-6 w-6 text-gray-200" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-black text-navy uppercase truncate group-hover/item:text-primary transition-colors italic">{p.name}</div>
                                                    <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{p.sku} | {p.price?.toLocaleString()} ₫</div>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-gray-300 group-hover/item:translate-x-1 transition-transform" />
                                            </Link>
                                        ))}
                                        <button
                                            onClick={handleSearch}
                                            className="w-full p-4 bg-gray-50 text-center text-xs font-black text-navy uppercase tracking-widest hover:bg-primary transition-colors"
                                        >
                                            Xem tất cả kết quả
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </form>

                    <div className="flex items-center space-x-2 md:space-x-4">
                        {user ? (
                            <div className="relative group">
                                <button className="flex flex-col items-center text-navy hover:text-primary transition-all duration-300">
                                    <div className="p-1.5 rounded-full hover:bg-gray-100 mb-1">
                                        <User className="h-6 w-6 md:h-7 md:w-7" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-tighter max-w-[70px] md:max-w-[100px] truncate">{user.full_name}</span>
                                </button>
                                <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-[70]">
                                    <div className="bg-white shadow-2xl border border-gray-100 rounded-xl p-2 w-52 font-bold overflow-hidden origin-top-right">
                                        <Link to="/profile" className="w-full flex items-center gap-3 p-3 text-sm text-gray-600 hover:text-navy hover:bg-primary/10 rounded-lg transition-colors uppercase tracking-tight">
                                            <User className="h-4 w-4 text-primary" />
                                            Thông tin cá nhân
                                        </Link>
                                        {user.is_superuser && (
                                            <Link to="/admin" className="w-full flex items-center gap-3 p-3 text-sm text-gray-600 hover:text-navy hover:bg-primary/10 rounded-lg transition-colors uppercase tracking-tight">
                                                <LayoutGrid className="h-4 w-4 text-primary" />
                                                Quản trị viên
                                            </Link>
                                        )}
                                        <div className="border-t border-gray-50 my-1"></div>
                                        <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors uppercase tracking-tight italic">
                                            <LogOut className="h-4 w-4" />
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="flex flex-col items-center text-navy hover:text-primary transition-all duration-300"
                            >
                                <div className="p-1.5 rounded-full hover:bg-gray-100 mb-1">
                                    <User className="h-6 w-6 md:h-7 md:w-7" />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-tighter">ĐĂNG NHẬP</span>
                            </button>
                        )}

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="flex flex-col items-center text-navy hover:text-primary transition-all duration-300 relative group"
                        >
                            <div className="p-1.5 rounded-full hover:bg-gray-100 mb-1 relative leading-none">
                                <ShoppingCart className="h-6 w-6 md:h-7 md:w-7" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tighter">GIỎ HÀNG</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Nav (Desktop) */}
            <nav className="bg-navy text-white hidden md:block border-t border-white/5 sticky top-[72px] z-50 shadow-lg">
                <div className="container mx-auto px-4 flex">
                    <div className="bg-primary text-navy font-black px-8 py-3.5 flex items-center gap-2 cursor-pointer group">
                        <Menu className="h-5 w-5" />
                        DANH MỤC SẢN PHẨM
                    </div>
                    <div className="flex space-x-1 ml-4">
                        {menus.length === 0 && <div className="px-6 py-3.5 text-xs text-gray-400">Đang tải danh mục...</div>}
                        {menus.map((menu) => {
                            const hasItems = menu.items && menu.items.length > 0;

                            return (
                                <div
                                    key={menu.id}
                                    className="relative"
                                    onMouseEnter={() => setActiveDropdown(menu.id)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <div className="px-6 py-3.5 text-xs font-black hover:bg-navy-light transition-colors whitespace-nowrap uppercase tracking-wider cursor-pointer">
                                        {menu.name}
                                    </div>

                                    {/* Dropdown */}
                                    {activeDropdown === menu.id && hasItems && (
                                        <div className="absolute top-full left-0 bg-white text-gray-800 shadow-2xl min-w-[240px] z-[100] border border-gray-100 rounded-b-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                            {menu.items.map((item, index) => {
                                                const category = item.category;
                                                if (!category) return null;
                                                return (
                                                    <Link
                                                        key={index}
                                                        to={`/products?category_id=${category.id}`}
                                                        className="block px-6 py-4 hover:bg-primary hover:text-navy transition-all text-sm font-bold border-b border-gray-50 last:border-b-0 uppercase tracking-tight"
                                                        onClick={() => setActiveDropdown(null)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span>{category.name}</span>
                                                            <span className="text-[10px] text-gray-400 group-hover:text-navy underline underline-offset-4 decoration-primary/30">
                                                                {category.product_count || 0} SP
                                                            </span>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[1000] flex">
                    <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="relative w-full max-w-[300px] bg-white h-full shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
                        <div className="p-6 bg-navy text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Package className="h-6 w-6 text-primary" />
                                <span className="font-black tracking-tighter uppercase italic">TEKKO</span>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Danh mục dụng cụ</h4>
                                <div className="space-y-1">
                                    {menus.map((menu) => (
                                        <div key={menu.id} className="space-y-2">
                                            <div className="text-xs font-black text-navy uppercase py-2 flex items-center justify-between">
                                                {menu.name}
                                            </div>
                                            <div className="pl-4 space-y-1 border-l-2 border-gray-50">
                                                {menu.items?.map((item, i) => (
                                                    <Link
                                                        key={i}
                                                        to={`/products?category_id=${item.category?.id}`}
                                                        className="block py-2 text-sm text-gray-500 font-bold hover:text-primary transition-colors"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span>{item.category?.name}</span>
                                                            <span className="text-[10px] text-gray-400">({item.category?.product_count || 0})</span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Thông tin TEKKO</h4>
                                <div className="space-y-4">
                                    <Link to="#" className="block text-sm font-bold text-navy hover:text-primary transition-colors">VỀ CHÚNG TÔI</Link>
                                    <Link to="#" className="block text-sm font-bold text-navy hover:text-primary transition-colors">HỖ TRỢ KỸ THUẬT</Link>
                                    <Link to="#" className="block text-sm font-bold text-navy hover:text-primary transition-colors">TÀI LIỆU DOWNLOAD</Link>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                            <a href={`tel:${SITE_CONFIG.contact.phoneRaw}`} className="flex items-center gap-3 text-navy font-black text-sm p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <Phone className="h-4 w-4 text-primary" />
                                {SITE_CONFIG.contact.phone}
                            </a>
                            <p className="text-[9px] text-gray-400 font-bold text-center uppercase tracking-widest leading-relaxed">
                                Giao hàng toàn quốc - Hỗ trợ 24/7
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Outlet />

            <FloatingContact />
            <Footer categories={categories} />
        </div>
    );
};

export default Layout;
