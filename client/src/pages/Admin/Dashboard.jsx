import React, { Suspense } from 'react';
import { Package, FolderTree, Factory, LayoutGrid, ChevronRight, BarChart3, Settings, Users, Menu, ShoppingCart } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminDashboard = () => {
    const menuItems = [
        { id: 'orders', name: 'Đơn hàng', icon: ShoppingCart, path: 'orders' },
        { id: 'products', name: 'Sản phẩm', icon: Package, path: 'products' },
        { id: 'categories', name: 'Danh mục', icon: FolderTree, path: 'categories' },
        { id: 'menus', name: 'Menu', icon: Menu, path: 'menus' },
        { id: 'users', name: 'Người dùng', icon: Users, path: 'users' },
        { id: 'brands', name: 'Thương hiệu', icon: Factory, path: 'brands' },
        { id: 'stats', name: 'Thống kê', icon: BarChart3, path: 'stats' },
        // Settings can be a separate route or just a placeholder for now
        { id: 'settings', name: 'Cài đặt', icon: Settings, path: 'settings' },
    ];

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Admin Sidebar */}
                <aside className="w-full lg:w-72 flex-shrink-0">
                    <div className="bg-[#1B2631] rounded-xl shadow-2xl overflow-hidden border border-white/5 sticky top-24">
                        <div className="p-8 border-b border-white/5">
                            <h1 className="text-xl font-black text-[#EDB917] uppercase tracking-tighter italic flex items-center gap-3">
                                <LayoutGrid className="h-6 w-6" /> Quản trị
                            </h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Control Panel v1.0</p>
                        </div>
                        <nav className="p-4 space-y-1">
                            {menuItems.map(item => (
                                <NavLink
                                    key={item.id}
                                    to={item.path}
                                    className={({ isActive }) => `w-full flex items-center justify-between p-4 rounded-lg transition-all group ${isActive
                                        ? 'bg-[#EDB917] text-[#1B2631]'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <div className="flex items-center gap-4">
                                                <item.icon className={`h-5 w-5 ${isActive ? 'text-[#1B2631]' : 'text-[#EDB917]'}`} />
                                                <span className="text-sm font-black uppercase tracking-tight">{item.name}</span>
                                            </div>
                                            <ChevronRight className={`h-4 w-4 transition-transform ${isActive ? 'opacity-100 rotate-90' : 'opacity-0'}`} />
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100 sticky top-[500px]">
                        <div className="flex items-center gap-3 text-navy font-black text-xs uppercase mb-4">
                            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div> Hệ thống ổn định
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed">Dữ liệu được đồng bộ hóa thời gian thực với SQL Server.</p>
                    </div>
                </aside>

                {/* Admin Content Area */}
                <main className="flex-1 min-w-0">
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-2 min-h-[70vh]">
                        <Suspense fallback={
                            <div className="h-full w-full flex items-center justify-center min-h-[400px]">
                                <div className="h-10 w-10 border-4 border-[#EDB917] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        }>
                            <Outlet />
                        </Suspense>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
