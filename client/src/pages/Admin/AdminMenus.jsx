import React, { useState, useEffect } from 'react';
import { Menu, Plus, Edit, Trash2, Save, X, ChevronRight, GripVertical, Check } from 'lucide-react';
import { getMenus, createMenu, updateMenu, deleteMenu, updateMenuItems } from '../../api/menu';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';

const AdminMenus = () => {
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);

    // State for Menu Editing
    const [editingMenu, setEditingMenu] = useState(null);
    const [menuFormData, setMenuFormData] = useState({ name: '', code: '', is_active: true });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // State for Items Editing
    const [activeMenuForItems, setActiveMenuForItems] = useState(null);
    const [menuItems, setMenuItems] = useState([]); // List of current items in the modal

    const fetchData = async () => {
        try {
            const [menusRes, catsRes] = await Promise.all([
                getMenus(),
                api.get('/categories/')
            ]);
            setMenus(menusRes.data);
            setCategories(catsRes.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => { fetchData() }, []);

    // --- Menu CRUD ---

    const handleCreateOrUpdateMenu = async (e) => {
        e.preventDefault();
        try {
            if (editingMenu) {
                await updateMenu(editingMenu.id, menuFormData);
            } else {
                await createMenu(menuFormData);
            }
            setIsMenuModalOpen(false);
            fetchData();
        } catch (err) {
            alert("Lỗi khi lưu menu: " + (err.response?.data?.detail || err.message));
        }
    };

    const handleDeleteMenu = async (id) => {
        if (window.confirm("Xóa menu này?")) {
            await deleteMenu(id);
            fetchData();
        }
    };

    const openMenuModal = (menu) => {
        if (menu) {
            setEditingMenu(menu);
            setMenuFormData({ name: menu.name, code: menu.code, is_active: menu.is_active });
        } else {
            setEditingMenu(null);
            setMenuFormData({ name: '', code: '', is_active: true });
        }
        setIsMenuModalOpen(true);
    };

    // --- Menu Items Management ---

    const openItemsModal = (menu) => {
        setActiveMenuForItems(menu);
        // Deep copy items to avoid mutating state directly and allow cancellation
        // Map items to include category name for display
        const items = menu.items.map(item => ({
            ...item,
            tempId: Math.random(), // For key
        }));
        setMenuItems(items);
        setIsItemsModalOpen(true);
    };

    const handleAddItem = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;

        // Check if already exists
        if (menuItems.some(item => item.category_id === categoryId)) return;

        setMenuItems([...menuItems, {
            category_id: categoryId,
            sort_order: menuItems.length,
            tempId: Math.random(),
            category: category // store full category object for display
        }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = [...menuItems];
        newItems.splice(index, 1);
        setMenuItems(newItems);
    };

    const handleMoveItem = (index, direction) => {
        if (direction === 'up' && index > 0) {
            const newItems = [...menuItems];
            [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
            setMenuItems(newItems);
        } else if (direction === 'down' && index < menuItems.length - 1) {
            const newItems = [...menuItems];
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
            setMenuItems(newItems);
        }
    };

    const handleSaveItems = async () => {
        try {
            // Clean up data for API
            const itemsPayload = menuItems.map((item, index) => ({
                category_id: item.category_id,
                sort_order: index, // Update sort order based on current list position
                custom_title: item.custom_title || null,
                custom_url: item.custom_url || null
            }));

            await updateMenuItems(activeMenuForItems.id, itemsPayload);
            setIsItemsModalOpen(false);
            fetchData(); // Refresh to get updated structure
        } catch (err) {
            alert("Lỗi khi lưu danh sách mục: " + (err.response?.data?.detail || err.message));
        }
    };

    // Filter available categories (exclude ones already in the menu)
    const availableCategories = categories.filter(c => !menuItems.some(i => i.category_id === c.id));

    // Pagination logic
    const indexOfLastMenu = currentPage * itemsPerPage;
    const indexOfFirstMenu = indexOfLastMenu - itemsPerPage;
    const displayedMenus = menus.slice(indexOfFirstMenu, indexOfLastMenu);
    const totalPages = Math.ceil(menus.length / itemsPerPage);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-[#1B2631] uppercase tracking-tighter border-b-4 border-[#EDB917] pb-1">Quản lý Menu</h2>
                <button
                    onClick={() => openMenuModal(null)}
                    className="bg-[#EDB917] hover:bg-[#d4a615] text-[#1B2631] px-6 py-2.5 rounded font-black flex items-center gap-2 uppercase text-xs tracking-widest shadow-lg"
                >
                    <Plus className="h-4 w-4" /> Tạo Menu Mới
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-[#1B2631] text-white uppercase text-[10px] tracking-widest font-black">
                        <tr>
                            <th className="px-6 py-4">Tên Menu</th>
                            <th className="px-6 py-4">Mã (Code)</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4 text-center">Số mục</th>
                            <th className="px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {displayedMenus.map(menu => (
                            <tr key={menu.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-[#1B2631]">{menu.name}</td>
                                <td className="px-6 py-4 text-xs font-mono bg-gray-50 rounded px-2 py-1 w-max">{menu.code}</td>
                                <td className="px-6 py-4">
                                    {menu.is_active ? (
                                        <span className="text-green-600 text-xs font-black uppercase bg-green-50 px-2 py-1 rounded">Hoạt động</span>
                                    ) : (
                                        <span className="text-gray-400 text-xs font-black uppercase bg-gray-100 px-2 py-1 rounded">Ẩn</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center font-bold text-gray-500">{menu.items?.length || 0}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => openItemsModal(menu)} className="p-2 text-[#EDB917] hover:bg-[#EDB917]/20 rounded-full transition-all" title="Quản lý mục con"><Menu className="h-4 w-4" /></button>
                                        <button onClick={() => openMenuModal(menu)} className="p-2 text-[#1B2631] hover:bg-gray-100 rounded-full transition-all" title="Sửa thông tin"><Edit className="h-4 w-4" /></button>
                                        <button onClick={() => handleDeleteMenu(menu.id)} className="p-2 text-[#E31837] hover:bg-[#E31837]/10 rounded-full transition-all" title="Xóa"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>

            {/* Menu Create/Edit Modal */}
            {isMenuModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#1B2631]/90 backdrop-blur-md" onClick={() => setIsMenuModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <form onSubmit={handleCreateOrUpdateMenu} className="p-8">
                            <h3 className="text-xl font-black text-[#1B2631] uppercase mb-6 border-b-4 border-[#EDB917] pb-2">{editingMenu ? 'Cập nhật Menu' : 'Tạo Menu Mới'}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Tên Menu</label>
                                    <input required className="w-full p-3 border-2 border-gray-50 rounded font-bold outline-none focus:border-[#EDB917]" value={menuFormData.name} onChange={e => setMenuFormData({ ...menuFormData, name: e.target.value })} placeholder="VD: Menu Chính" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Mã (Code - Duy nhất)</label>
                                    <input required className="w-full p-3 border-2 border-gray-50 rounded font-bold font-mono outline-none focus:border-[#EDB917]" value={menuFormData.code} onChange={e => setMenuFormData({ ...menuFormData, code: e.target.value })} placeholder="VD: main_nav" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="is_active" className="w-5 h-5 accent-[#EDB917] rounded cursor-pointer" checked={menuFormData.is_active} onChange={e => setMenuFormData({ ...menuFormData, is_active: e.target.checked })} />
                                    <label htmlFor="is_active" className="text-sm font-bold text-[#1B2631] cursor-pointer">Kích hoạt</label>
                                </div>
                                <button type="submit" className="w-full bg-[#1B2631] text-white font-black uppercase py-4 rounded hover:bg-[#2c3e50] transition-colors mt-4">Lưu Menu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Items Management Modal */}
            {isItemsModalOpen && activeMenuForItems && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#1B2631]/90 backdrop-blur-md" onClick={() => setIsItemsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-4xl h-[80vh] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#f8f9fa]">
                            <div>
                                <h3 className="text-xl font-black text-[#1B2631] uppercase tracking-tighter italic">Cấu hình: {activeMenuForItems.name}</h3>
                                <p className="text-xs text-gray-400 font-bold">Kéo thả hoặc sử dụng nút để sắp xếp</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleSaveItems} className="bg-[#EDB917] hover:bg-[#d4a615] text-[#1B2631] px-6 py-2 rounded font-black uppercase text-xs tracking-widest shadow flex items-center gap-2"><Save className="h-4 w-4" /> Lưu thay đổi</button>
                                <button onClick={() => setIsItemsModalOpen(false)} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 px-4 py-2 rounded font-black uppercase text-xs tracking-widest"><X className="h-4 w-4" /></button>
                            </div>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Available Categories */}
                            <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50">
                                <div className="p-4 bg-white border-b border-gray-100 font-black text-xs uppercase tracking-widest text-gray-400">Danh mục có sẵn</div>
                                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                    {availableCategories.map(cat => (
                                        <div key={cat.id} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded hover:border-primary/50 transition-colors group">
                                            <span className="text-sm font-bold text-gray-600">{cat.name}</span>
                                            <button onClick={() => handleAddItem(cat.id)} className="text-primary hover:scale-110 transition-transform"><Plus className="h-5 w-5" /></button>
                                        </div>
                                    ))}
                                    {availableCategories.length === 0 && <p className="text-center text-xs text-gray-400 p-4">Đã thêm hết danh mục</p>}
                                </div>
                            </div>

                            {/* Selected Items */}
                            <div className="flex-1 flex flex-col bg-white">
                                <div className="p-4 border-b border-gray-100 font-black text-xs uppercase tracking-widest text-gray-400">Mục đã chọn ({menuItems.length})</div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                    {menuItems.map((item, index) => (
                                        <div key={item.tempId} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition-shadow">
                                            <span className="text-gray-300 font-black text-lg w-6 text-center">{index + 1}</span>

                                            <div className="flex-1">
                                                <div className="font-bold text-[#1B2631]">{item.category?.name || item.custom_title || 'Mục tùy chỉnh'}</div>
                                                <div className="text-[10px] text-gray-400 uppercase tracking-wider">{item.category ? 'Danh mục' : 'Liên kết'}</div>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <div className="flex flex-col gap-1 mr-4">
                                                    <button onClick={() => handleMoveItem(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><ChevronRight className="h-4 w-4 -rotate-90" /></button>
                                                    <button onClick={() => handleMoveItem(index, 'down')} disabled={index === menuItems.length - 1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><ChevronRight className="h-4 w-4 rotate-90" /></button>
                                                </div>
                                                <button onClick={() => handleRemoveItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="h-5 w-5" /></button>
                                            </div>
                                        </div>
                                    ))}
                                    {menuItems.length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-300">
                                            <Menu className="h-16 w-16 mb-4 opacity-50" />
                                            <p className="font-bold uppercase text-xs">Menu này chưa có mục nào</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMenus;
