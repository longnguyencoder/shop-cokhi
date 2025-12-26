import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { ShoppingCart, User, Search, Package, Menu, Phone, LogOut, ChevronRight, LayoutGrid } from 'lucide-react';
import api from '../api/axios';
import { getMe, logout } from '../api/auth';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';
import SITE_CONFIG from '../config/site';
import zaloIcon from '../assets/zalo.png';

const Layout = ({ cartItems, onUpdateQuantity, onRemoveItem, user, onAuthSuccess, onLogout }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [menus, setMenus] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const catRes = await api.get('/categories/');
                setCategories(catRes.data);

                // Fetch all menus with their items
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

                        console.log('Menus with items:', menusWithItems);
                        setMenus(menusWithItems);
                    }
                } catch (err) {
                    console.log('No menus found');
                }
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
            <header className="glass-header py-4 sticky top-0 md:relative md:top-auto z-[60] shadow-premium">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
                    <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
                        <div className="bg-[#1B2631] p-2.5 rounded">
                            <Package className="h-9 w-9 text-[#EDB917]" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-2xl font-black text-[#1B2631] tracking-tighter uppercase">TEKKO</span>
                            <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Precision Mechanical Tools</span>
                        </div>
                    </Link>

                    <form onSubmit={handleSearch} className="flex-1 w-full max-w-xl">
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

                    <div className="flex items-center space-x-8 flex-shrink-0">
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
                                <span className="text-[10px] font-black uppercase mt-1">ADMIN UPDA...</span>
                            </button>
                        )}

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="flex flex-col items-center text-[#1B2631] hover:text-[#EDB917] transition-colors relative"
                        >
                            <ShoppingCart className="h-6 w-6" />
                            <span className="text-[10px] font-black uppercase mt-1">GIỎ HÀNG</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#E31837] text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Nav */}
            <nav className="bg-[#1B2631] text-white hidden md:block border-t border-white/5 sticky top-[84px] md:top-0 z-50 shadow-lg">
                <div className="container mx-auto px-4 flex">
                    <div className="bg-[#EDB917] text-[#1B2631] font-black px-8 py-3.5 flex items-center gap-2 cursor-pointer group">
                        <Menu className="h-5 w-5" />
                        DANH MỤC SẢN PHẨM
                    </div>
                    <div className="flex space-x-1 ml-4">
                        {menus.length === 0 && <div className="px-6 py-3.5 text-xs text-gray-400">Đang tải menu...</div>}
                        {menus.map((menu) => {
                            const hasItems = menu.items && menu.items.length > 0;

                            return (
                                <div
                                    key={menu.id}
                                    className="relative"
                                    onMouseEnter={() => setActiveDropdown(menu.id)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <div className="px-6 py-3.5 text-xs font-black hover:bg-[#2c3e50] transition-colors whitespace-nowrap uppercase tracking-wider cursor-pointer">
                                        {menu.name}
                                    </div>

                                    {/* Dropdown */}
                                    {activeDropdown === menu.id && hasItems && (
                                        <div className="absolute top-full left-0 bg-white text-gray-800 shadow-2xl min-w-[220px] z-[100] border border-gray-200 rounded-b-md overflow-hidden">
                                            {menu.items.map((item, index) => {
                                                const category = item.category;
                                                if (!category) return null;
                                                return (
                                                    <Link
                                                        key={index}
                                                        to={`/?category_id=${category.id}`}
                                                        className="block px-5 py-3 hover:bg-[#EDB917] hover:text-[#1B2631] transition-all text-sm font-bold border-b border-gray-100 last:border-b-0"
                                                        onClick={() => setActiveDropdown(null)}
                                                    >
                                                        {category.name}
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

            <Outlet />

            {/* Floating Contact Buttons */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-4 animate-fade-in-up">
                <a
                    href={`https://zalo.me/${SITE_CONFIG.contact.phoneRaw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-[#0068FF] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group relative"
                >
                    <img src={zaloIcon} alt="Zalo" className="w-8 h-8 object-contain" />
                    <span className="absolute right-full mr-4 bg-white text-[#0068FF] px-3 py-1 rounded-lg text-xs font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-premium pointer-events-none">
                        Chat Zalo Ngay
                    </span>
                </a>
                <a
                    href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                    className="w-14 h-14 bg-[#E31837] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group relative animate-bounce"
                    style={{ animationDuration: '3s' }}
                >
                    <Phone className="h-6 w-6" />
                    <span className="absolute right-full mr-4 bg-white text-[#E31837] px-3 py-1 rounded-lg text-xs font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-premium pointer-events-none">
                        {SITE_CONFIG.contact.phone}
                    </span>
                </a>
            </div>

            {/* Final Footer */}
            <footer className="bg-navy text-white pt-24 pb-12 border-t border-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                        <div className="space-y-8">
                            <Link to="/" className="flex items-center space-x-3 group">
                                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 group-hover:border-primary transition-colors">
                                    <Package className="h-8 w-8 text-primary" />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-xl font-black tracking-tighter uppercase italic">CÔNG TY TNHH TEKKO VIỆT NAM</span>
                                    <span className="text-[9px] text-gray-500 font-bold tracking-[0.3em] uppercase">Mã số thuế: {SITE_CONFIG.contact.mst}</span>
                                </div>
                            </Link>
                            <p className="text-gray-400 text-sm leading-relaxed font-medium max-w-xs">
                                {SITE_CONFIG.contact.address}
                            </p>
                            <div className="flex gap-4">
                                {['fb', 'yt', 'li'].map(social => (
                                    <div key={social} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-navy hover:-translate-y-1 transition-all cursor-pointer">
                                        <span className="text-xs font-black uppercase tracking-tighter">{social}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-black text-white mb-8 uppercase tracking-[0.3em] text-[11px] flex items-center gap-3">
                                <span className="h-1 w-6 bg-primary"></span>
                                Danh Mục Chính
                            </h4>
                            <ul className="space-y-4">
                                {categories.filter(c => !c.parent_id).slice(0, 4).map(cat => (
                                    <li key={cat.id}>
                                        <Link to={`/?category_id=${cat.id}`} className="text-gray-400 hover:text-primary transition-colors text-sm font-bold flex items-center gap-2 group">
                                            <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black text-white mb-8 uppercase tracking-[0.3em] text-[11px] flex items-center gap-3">
                                <span className="h-1 w-6 bg-primary"></span>
                                Hỗ Trợ Đội Ngũ
                            </h4>
                            <ul className="space-y-4">
                                {['Chính sách bảo hành', 'Vận chuyển hỏa tốc', 'Hỗ trợ kỹ thuật 24/7', 'Báo giá dự án xưởng'].map(item => (
                                    <li key={item}>
                                        <Link to="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-bold flex items-center gap-2 group">
                                            <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                            <h4 className="font-black text-white mb-6 uppercase tracking-[0.3em] text-[11px]">Hotline Tư Vấn</h4>
                            <a href={`tel:${SITE_CONFIG.contact.phoneRaw}`} className="text-2xl font-black text-primary hover:scale-105 block transition-transform origin-left tracking-tighter mb-4">
                                {SITE_CONFIG.contact.phone}
                            </a>
                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none">Email: {SITE_CONFIG.contact.email}</p>
                                <p className="text-xs text-gray-300 font-medium">Giao hàng toàn quốc</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-[10px] text-gray-600 font-black tracking-[0.4em] uppercase">
                            © 2025 TEKKO. ALL RIGHTS RESERVED.
                        </div>
                        <div className="flex gap-8 text-[9px] text-gray-500 font-black uppercase tracking-widest">
                            <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
                            <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
