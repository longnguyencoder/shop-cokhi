import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { ShoppingCart, User, Search, Package, Menu, Phone, LogOut, ChevronRight, LayoutGrid } from 'lucide-react';
import api from '../api/axios';
import { getMe, logout } from '../api/auth';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';
import SITE_CONFIG from '../config/site';

const Layout = ({ cartItems, onUpdateQuantity, onRemoveItem, user, onAuthSuccess, onLogout }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories/');
                setCategories(res.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
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
            <div className="bg-gray-100 border-b border-gray-200 py-1 text-sm hidden md:block">
                <div className="container mx-auto px-4 flex justify-between items-center text-gray-600">
                    <div className="flex space-x-4">
                        <Link to="#" className="hover:text-[#EDB917]">Giới thiệu</Link>
                        <Link to="#" className="hover:text-[#EDB917]">Videos</Link>
                        <Link to="#" className="hover:text-[#EDB917]">Downloads</Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user && user.is_superuser && (
                            <Link to="/admin" className="flex items-center gap-1 text-[#EDB917] font-black hover:underline uppercase text-[11px]">
                                <LayoutGrid className="h-3 w-3" />
                                QUẢN TRỊ HỆ THỐNG
                            </Link>
                        )}
                        {user && (
                            <button onClick={onLogout} className="flex items-center gap-1 text-gray-500 hover:text-[#E31837] font-bold uppercase text-[11px]">
                                <LogOut className="h-3 w-3" />
                                Đăng xuất
                            </button>
                        )}
                        <div className="flex items-center gap-2 text-[#E31837] font-black">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${SITE_CONFIG.contact.phoneRaw}`} className="hover:underline">
                                {SITE_CONFIG.contact.hotline}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Header */}
            <header className="bg-white py-4 shadow-sm relative z-[60]">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-4">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-[#1B2631] p-2 rounded">
                            <Package className="h-8 w-8 text-[#EDB917]" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-2xl font-black text-[#1B2631] tracking-tighter uppercase">SHOP CO KHI</span>
                            <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Professional Tools</span>
                        </div>
                    </Link>

                    <form onSubmit={handleSearch} className="flex-1 w-full max-w-2xl">
                        <div className="flex overflow-hidden rounded-md border-2 border-[#EDB917]">
                            <input
                                type="text"
                                placeholder="Tìm kiếm dụng cụ, máy móc..."
                                className="flex-1 py-3 px-4 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="bg-[#EDB917] hover:bg-[#d4a615] text-[#1B2631] px-8 transition-colors">
                                <Search className="h-6 w-6 font-bold" />
                            </button>
                        </div>
                    </form>

                    <div className="flex items-center space-x-6">
                        {user ? (
                            <div className="group relative">
                                <button className="flex flex-col items-center text-[#1B2631] hover:text-[#EDB917] transition-colors">
                                    <User className="h-6 w-6" />
                                    <span className="text-[10px] font-black uppercase mt-1 max-w-[80px] truncate">{user.full_name}</span>
                                </button>
                                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <div className="bg-white shadow-xl border border-gray-100 rounded p-2 w-48 font-bold">
                                        <Link to="/profile" className="w-full flex items-center gap-2 p-2 text-sm text-gray-600 hover:text-[#EDB917] hover:bg-gray-50 rounded transition-colors uppercase tracking-tighter">
                                            <User className="h-4 w-4" />
                                            Hồ sơ cá nhân
                                        </Link>
                                        {user.is_superuser && (
                                            <Link to="/admin" className="w-full flex items-center gap-2 p-2 text-sm text-gray-600 hover:text-[#EDB917] hover:bg-gray-50 rounded transition-colors uppercase tracking-tighter">
                                                <LayoutGrid className="h-4 w-4" />
                                                Quản trị hệ thống
                                            </Link>
                                        )}
                                        <button onClick={onLogout} className="w-full flex items-center gap-2 p-2 text-sm text-gray-600 hover:text-[#E31837] hover:bg-red-50 rounded transition-colors uppercase tracking-tighter italic">
                                            <LogOut className="h-4 w-4" />
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="flex flex-col items-center text-[#1B2631] hover:text-[#EDB917] transition-colors"
                            >
                                <User className="h-6 w-6" />
                                <span className="text-[10px] font-black uppercase mt-1">Tài khoản</span>
                            </button>
                        )}

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex flex-col items-center text-[#1B2631] hover:text-[#EDB917] transition-colors"
                        >
                            <ShoppingCart className="h-6 w-6" />
                            <span className="text-[10px] font-black uppercase mt-1">Giỏ hàng</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#E31837] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Nav */}
            <nav className="bg-[#1B2631] text-white hidden md:block border-t border-[#2c3e50] sticky top-0 z-50">
                <div className="container mx-auto px-4 flex">
                    <div className="bg-[#EDB917] text-[#1B2631] font-black px-8 py-3.5 flex items-center gap-2 cursor-pointer group">
                        <Menu className="h-5 w-5" />
                        DANH MỤC SẢN PHẨM
                    </div>
                    <div className="flex space-x-1 ml-4 overflow-x-auto no-scrollbar">
                        {categories.filter(c => !c.parent_id).slice(0, 5).map(cat => (
                            <Link
                                key={cat.id}
                                to={`/?category_id=${cat.id}`}
                                className="px-6 py-3.5 text-xs font-black hover:bg-[#2c3e50] transition-colors whitespace-nowrap uppercase tracking-wider"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            <Outlet />

            {/* Footer */}
            <footer className="bg-[#1B2631] text-white mt-32 pt-20 pb-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                        <div className="space-y-8">
                            <div className="flex items-center space-x-2">
                                <Package className="h-8 w-8 text-[#EDB917]" />
                                <span className="text-2xl font-black tracking-tighter uppercase italic">SHOP CO KHI</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                Dẫn đầu trong việc cung cấp các thiết bị gia công cơ khí chính xác.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-black text-white mb-8 uppercase tracking-widest text-xs border-b-2 border-[#EDB917] pb-2 w-max">Sản phẩm</h4>
                            <ul className="text-gray-500 text-sm space-y-4 font-bold">
                                {['Dụng cụ cắt gọt', 'Hệ thống kẹp dao', 'Đầu gá máy tiện'].map(item => (
                                    <li key={item} className="hover:text-[#EDB917] cursor-pointer transition-all">{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black text-white mb-8 uppercase tracking-widest text-xs border-b-2 border-[#EDB917] pb-2 w-max">Hỗ trợ</h4>
                            <ul className="text-gray-500 text-sm space-y-4 font-bold">
                                {['Chính sách bảo hành', 'Vận chuyển', 'Liên hệ'].map(item => (
                                    <li key={item} className="hover:text-[#EDB917] cursor-pointer transition-all">{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black text-white mb-8 uppercase tracking-widest text-xs border-b-2 border-[#EDB917] pb-2 w-max">Liên hệ</h4>
                            <div className="text-3xl font-black text-[#EDB917] mb-4 tracking-tighter">0903.867.467</div>
                            <p className="text-gray-500 text-sm">Email: sales@shopcokhi.vn</p>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-10 text-center text-[10px] text-gray-700 font-black tracking-widest uppercase">
                        © 2025 SHOP CO KHI. DESIGNED BY ANTIGRAVITY
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
