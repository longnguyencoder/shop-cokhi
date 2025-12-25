import React, { useState } from 'react';
import { Package, FolderTree, Factory, LayoutGrid, ChevronRight, BarChart3, Settings, Users } from 'lucide-react';
import { AdminProducts, AdminCategories, AdminUsers, AdminBrands } from './Components';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');

    const menuItems = [
        { id: 'products', name: 'Sản phẩm', icon: Package },
        { id: 'categories', name: 'Danh mục', icon: FolderTree },
        { id: 'users', name: 'Người dùng', icon: Users },
        { id: 'brands', name: 'Thương hiệu', icon: Factory },
        { id: 'stats', name: 'Thống kê', icon: BarChart3 },
        { id: 'settings', name: 'Cài đặt', icon: Settings },
    ];

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Admin Sidebar */}
                <aside className="w-full lg:w-72 flex-shrink-0">
                    <div className="bg-[#1B2631] rounded-xl shadow-2xl overflow-hidden border border-white/5">
                        <div className="p-8 border-b border-white/5">
                            <h1 className="text-xl font-black text-[#EDB917] uppercase tracking-tighter italic flex items-center gap-3">
                                <LayoutGrid className="h-6 w-6" /> Quản trị
                            </h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Control Panel v1.0</p>
                        </div>
                        <nav className="p-4 space-y-1">
                            {menuItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-lg transition-all group ${activeTab === item.id
                                        ? 'bg-[#EDB917] text-[#1B2631]'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-[#1B2631]' : 'text-[#EDB917]'}`} />
                                        <span className="text-sm font-black uppercase tracking-tight">{item.name}</span>
                                    </div>
                                    <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === item.id ? 'opacity-100 rotate-90' : 'opacity-0'}`} />
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3 text-navy font-black text-xs uppercase mb-4">
                            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div> Hệ thống ổn định
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed">Dữ liệu được đồng bộ hóa thời gian thực với SQL Server.</p>
                    </div>
                </aside>

                {/* Admin Content Area */}
                <main className="flex-1 min-w-0">
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-2 min-h-[70vh]">
                        {activeTab === 'products' && <AdminProducts />}
                        {activeTab === 'categories' && <AdminCategories />}
                        {activeTab === 'users' && <AdminUsers />}
                        {activeTab === 'brands' && <AdminBrands />}
                        {['stats', 'settings'].includes(activeTab) && (
                            <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-4">
                                <div className="bg-white p-8 rounded-full shadow-xl">
                                    <BarChart3 className="h-20 w-20 text-gray-100" />
                                </div>
                                <h3 className="text-2xl font-black text-navy uppercase tracking-tighter">Tính năng đang phát triển</h3>
                                <p className="text-gray-400 font-bold text-sm italic">Hệ thống quản lý {menuItems.find(m => m.id === activeTab)?.name} sẽ sớm ra mắt.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
