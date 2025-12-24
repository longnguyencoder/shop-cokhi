import React, { useState, useEffect } from 'react';
import { Package, FolderTree, Factory, Users, Plus, Edit, Trash2, ChevronDown, ChevronRight, Save, X } from 'lucide-react';
import api from '../../api/axios';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'sale'

    const [formData, setFormData] = useState({
        name: '', sku: '', slug: '', description: '', price: '', in_stock: true,
        category_id: '', brand_id: '', image_url: '',
        diameter: '', length: '', material: '', flutes: '', hardness: '', coating: '',
        on_sale: false, sale_price: null, discount_percent: null, created_at: null
    });

    const fetchData = async () => {
        try {
            const [p, c, b] = await Promise.all([
                api.get('/products/'),
                api.get('/categories/'),
                api.get('/brands/')
            ]);
            setProducts(p.data);
            setCategories(c.data);
            setBrands(b.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => { fetchData() }, []);

    // Filter products based on active tab
    const displayedProducts = activeTab === 'sale'
        ? products.filter(p => p.on_sale)
        : products;

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, formData);
            } else {
                await api.post('/products/', formData);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.detail || "Error saving product");
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm("Xóa sản phẩm này?")) {
            await api.delete(`/products/${id}`);
            fetchData();
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-[#1B2631] uppercase tracking-tighter italic">Quản lý Sản phẩm</h2>
                <button
                    onClick={() => { setEditingProduct(null); setFormData({ name: '', sku: '', slug: '', description: '', price: 0, in_stock: true, category_id: '', brand_id: '', specs: [] }); setIsModalOpen(true); }}
                    className="bg-[#EDB917] hover:bg-[#d4a615] text-[#1B2631] px-6 py-2.5 rounded font-black flex items-center gap-2 uppercase text-xs tracking-widest shadow-lg"
                >
                    <Plus className="h-4 w-4" /> Thêm sản phẩm mới
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-6 py-3 font-black uppercase text-xs tracking-widest transition-all ${activeTab === 'all'
                        ? 'text-[#EDB917] border-b-4 border-[#EDB917]'
                        : 'text-gray-400 hover:text-[#1B2631]'
                        }`}
                >
                    Tất cả sản phẩm ({products.length})
                </button>
                <button
                    onClick={() => setActiveTab('sale')}
                    className={`px-6 py-3 font-black uppercase text-xs tracking-widest transition-all flex items-center gap-2 ${activeTab === 'sale'
                        ? 'text-[#E31837] border-b-4 border-[#E31837]'
                        : 'text-gray-400 hover:text-[#1B2631]'
                        }`}
                >
                    🔥 Sản phẩm khuyến mãi ({products.filter(p => p.on_sale).length})
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-[#1B2631] text-white uppercase text-[10px] tracking-widest font-black">
                        <tr>
                            <th className="px-6 py-4">Sản phẩm</th>
                            <th className="px-6 py-4">SKU</th>
                            <th className="px-6 py-4">Danh mục</th>
                            <th className="px-6 py-4">Giá</th>
                            <th className="px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {displayedProducts.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-gray-50 rounded border flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            {p.image_url ? (
                                                <img src={p.image_url.startsWith('http') ? p.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${p.image_url}`} alt="" className="h-full w-full object-cover rounded" />
                                            ) : (
                                                <Package className="h-5 w-5 text-gray-200" />
                                            )}
                                        </div>
                                        <span className="font-bold text-[#1B2631] truncate max-w-[150px]">{p.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs font-black text-gray-400">{p.sku}</td>
                                <td className="px-6 py-4 text-xs font-bold uppercase">{p.category?.name}</td>
                                <td className="px-6 py-4 font-black text-[#E31837]">{p.price?.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => { setEditingProduct(p); setFormData({ ...p, category_id: p.category_id, brand_id: p.brand_id }); setIsModalOpen(true); }} className="p-2 text-[#1B2631] hover:bg-[#EDB917]/20 rounded-full transition-all"><Edit className="h-4 w-4" /></button>
                                        <button onClick={() => deleteProduct(p.id)} className="p-2 text-[#E31837] hover:bg-[#E31837]/10 rounded-full transition-all"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#1B2631]/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
                        <div className="p-8 overflow-y-auto">
                            <h3 className="text-xl font-black text-[#1B2631] uppercase mb-8 border-b-4 border-[#EDB917] pb-2 sticky top-0 bg-white z-10">{editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                            <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-2 gap-6">
                                <div className="col-span-2"><input placeholder="Tên sản phẩm" required className="w-full p-3 border-2 border-gray-50 rounded font-bold" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>

                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hình ảnh sản phẩm</label>
                                    <div className="flex gap-4 items-end">
                                        <div className="h-24 w-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded flex items-center justify-center overflow-hidden">
                                            {formData.image_url ? (
                                                <img src={formData.image_url.startsWith('http') ? formData.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${formData.image_url}`} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <Package className="h-8 w-8 text-gray-200" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;

                                                    const uploadFormData = new FormData();
                                                    uploadFormData.append('file', file);

                                                    try {
                                                        const res = await api.post('/products/upload-image', uploadFormData, {
                                                            headers: { 'Content-Type': 'multipart/form-data' }
                                                        });
                                                        setFormData({ ...formData, image_url: res.data.image_url });
                                                    } catch (err) {
                                                        alert("Lỗi tải ảnh");
                                                    }
                                                }}
                                                className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#EDB917]/10 file:text-[#1B2631] hover:file:bg-[#EDB917]/20"
                                            />
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">PNG, JPG, WEBP (MAX 2MB)</p>
                                        </div>
                                    </div>
                                </div>



                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#1B2631] flex flex-col gap-1">
                                        Mã sản phẩm
                                        <span className="text-[10px] font-normal text-gray-400">Mã số riêng để phân biệt sản phẩm (ví dụ: A002-10, HSS-001)</span>
                                    </label>
                                    <input placeholder="Nhập mã sản phẩm" required className="w-full p-3 border-2 border-gray-50 rounded font-black text-sm uppercase" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#1B2631] flex flex-col gap-1">
                                        Tên đường dẫn
                                        <span className="text-[10px] font-normal text-gray-400">Tên hiển thị trên thanh địa chỉ web (ví dụ: mui-khoan-hss-a002-10)</span>
                                    </label>
                                    <input placeholder="Nhập tên đường dẫn (chỉ dùng chữ thường, số và dấu gạch ngang)" required className="w-full p-3 border-2 border-gray-50 rounded font-bold text-sm" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} />
                                </div>
                                <div>
                                    <select className="w-full p-3 border-2 border-gray-50 rounded font-bold" value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                                        <option value="">Chọn danh mục</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <select className="w-full p-3 border-2 border-gray-50 rounded font-bold" value={formData.brand_id} onChange={e => setFormData({ ...formData, brand_id: e.target.value })}>
                                        <option value="">Chọn thương hiệu</option>
                                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div><input type="number" placeholder="Giá" className="w-full p-3 border-2 border-gray-50 rounded font-black text-[#E31837]" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} /></div>

                                {/* Sale Section */}
                                <div className="col-span-2 space-y-3 p-4 bg-gradient-to-br from-[#E31837]/5 to-[#E31837]/10 rounded-lg border-2 border-[#E31837]/20">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="on_sale"
                                            checked={formData.on_sale}
                                            onChange={e => {
                                                const isOnSale = e.target.checked;
                                                setFormData({
                                                    ...formData,
                                                    on_sale: isOnSale,
                                                    sale_price: isOnSale && formData.discount_percent ?
                                                        (formData.price * (1 - formData.discount_percent / 100)).toFixed(0) :
                                                        null
                                                });
                                            }}
                                            className="w-4 h-4 accent-[#E31837]"
                                        />
                                        <label htmlFor="on_sale" className="font-black text-[#E31837] uppercase text-sm">
                                            🔥 Sản phẩm khuyến mãi
                                        </label>
                                    </div>

                                    {formData.on_sale && (
                                        <div className="grid grid-cols-2 gap-4 mt-3">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-[#1B2631]">Mức giảm giá</label>
                                                <select
                                                    className="w-full p-3 border-2 border-gray-200 rounded font-bold text-[#E31837]"
                                                    value={formData.discount_percent || ''}
                                                    onChange={e => {
                                                        const discount = parseFloat(e.target.value);
                                                        const salePrice = formData.price ? (formData.price * (1 - discount / 100)).toFixed(0) : null;
                                                        setFormData({
                                                            ...formData,
                                                            discount_percent: discount,
                                                            sale_price: salePrice
                                                        });
                                                    }}
                                                >
                                                    <option value="">Chọn mức giảm</option>
                                                    <option value="10">Giảm 10%</option>
                                                    <option value="15">Giảm 15%</option>
                                                    <option value="30">Giảm 30%</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-[#1B2631]">Giá sau giảm</label>
                                                <input
                                                    type="number"
                                                    placeholder="Tự động tính"
                                                    className="w-full p-3 border-2 border-gray-200 rounded font-black text-[#E31837] bg-gray-50"
                                                    value={formData.sale_price || ''}
                                                    readOnly
                                                />
                                            </div>
                                            {formData.price && formData.sale_price && (
                                                <div className="col-span-2 text-center p-3 bg-white rounded border-2 border-[#EDB917]">
                                                    <p className="text-xs text-gray-500 mb-1">Khách hàng tiết kiệm:</p>
                                                    <p className="text-xl font-black text-[#EDB917]">
                                                        {(formData.price - formData.sale_price).toLocaleString()} VNĐ
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 font-bold text-[#1B2631]"><input type="checkbox" checked={formData.in_stock} onChange={e => setFormData({ ...formData, in_stock: e.target.checked })} /> Còn hàng</div>

                                {/* Technical Specifications - Structured Inputs */}
                                <div className="col-span-2 space-y-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-100">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-[#1B2631] mb-3">Thông số kỹ thuật</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase">Đường kính (mm)</label>
                                            <input
                                                type="text"
                                                placeholder="VD: 10"
                                                className="w-full p-2 border border-gray-200 rounded text-sm font-medium"
                                                value={formData.diameter || ''}
                                                onChange={e => setFormData({ ...formData, diameter: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase">Chiều dài (mm)</label>
                                            <input
                                                type="text"
                                                placeholder="VD: 100"
                                                className="w-full p-2 border border-gray-200 rounded text-sm font-medium"
                                                value={formData.length || ''}
                                                onChange={e => setFormData({ ...formData, length: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase">Vật liệu</label>
                                            <input
                                                type="text"
                                                placeholder="VD: HSS, Carbide"
                                                className="w-full p-2 border border-gray-200 rounded text-sm font-medium"
                                                value={formData.material || ''}
                                                onChange={e => setFormData({ ...formData, material: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase">Số răng</label>
                                            <input
                                                type="text"
                                                placeholder="VD: 4"
                                                className="w-full p-2 border border-gray-200 rounded text-sm font-medium"
                                                value={formData.flutes || ''}
                                                onChange={e => setFormData({ ...formData, flutes: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase">Độ cứng (HRC)</label>
                                            <input
                                                type="text"
                                                placeholder="VD: 60-62"
                                                className="w-full p-2 border border-gray-200 rounded text-sm font-medium"
                                                value={formData.hardness || ''}
                                                onChange={e => setFormData({ ...formData, hardness: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase">Lớp phủ</label>
                                            <input
                                                type="text"
                                                placeholder="VD: TiN, TiAlN"
                                                className="w-full p-2 border border-gray-200 rounded text-sm font-medium"
                                                value={formData.coating || ''}
                                                onChange={e => setFormData({ ...formData, coating: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-[#1B2631] flex flex-col gap-1">
                                        Mô tả sản phẩm
                                        <span className="text-[10px] font-normal text-gray-400">Mô tả chi tiết về sản phẩm, ứng dụng, ưu điểm</span>
                                    </label>
                                    <textarea
                                        placeholder="Nhập mô tả chi tiết về sản phẩm..."
                                        className="w-full p-3 border-2 border-gray-50 rounded font-medium text-sm"
                                        rows="4"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <button type="submit" className="col-span-2 bg-[#EDB917] text-[#1B2631] py-4 font-black uppercase shadow-lg hover:shadow-[#EDB917]/20 transition-all active:scale-95">Lưu thông tin</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', slug: '', description: '', parent_id: null, image_url: '' });

    const fetchCats = async () => {
        try {
            const res = await api.get('/categories/');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchCats() }, []);

    const resetForm = () => {
        setFormData({ name: '', slug: '', description: '', parent_id: null, image_url: '' });
        setEditingCategory(null);
    };

    const handleEdit = (cat) => {
        setEditingCategory(cat);
        setFormData({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            parent_id: cat.parent_id,
            image_url: cat.image_url || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa danh mục này? Tất cả danh mục con cũng sẽ bị ảnh hưởng.")) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCats();
            } catch (err) {
                alert("Lỗi khi xóa danh mục. Có thể danh mục này đang chứa sản phẩm.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory.id}`, formData);
            } else {
                await api.post('/categories/', formData);
            }
            setIsModalOpen(false);
            resetForm();
            fetchCats();
        } catch (err) {
            alert("Lỗi khi lưu danh mục. Vui lòng kiểm tra lại slug hoặc kết nối.");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-[#1B2631] uppercase tracking-tighter italic">Quản lý Danh mục</h2>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-[#1B2631] text-[#EDB917] px-6 py-2.5 rounded font-black flex items-center gap-2 uppercase text-xs tracking-widest shadow-lg"
                >
                    <Plus className="h-4 w-4" /> Thêm danh mục
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-xl p-8 border border-gray-100 overflow-y-auto max-h-[70vh]">
                    <h3 className="font-black text-[#1B2631] uppercase mb-6 flex items-center gap-2">
                        <FolderTree className="h-5 w-5 text-[#EDB917]" />
                        Cấu trúc danh mục ({categories.length})
                    </h3>
                    <div className="space-y-4">
                        {categories.filter(c => !c.parent_id).length === 0 && (
                            <p className="text-center py-8 text-gray-400 font-medium italic">Chưa có danh mục nào</p>
                        )}
                        {categories.filter(c => !c.parent_id).map(root => (
                            <div key={root.id} className="space-y-2">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-[#EDB917] group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-white rounded border flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            {root.image_url ? (
                                                <img src={root.image_url} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <Package className="h-5 w-5 text-gray-200" />
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-black text-[#1B2631] uppercase text-sm italic">{root.name}</span>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{root.slug}</p>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button onClick={() => handleEdit(root)} className="p-2 bg-white border border-gray-100 rounded-lg text-[#1B2631] hover:text-[#EDB917] hover:shadow-md transition-all">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDelete(root.id)} className="p-2 bg-white border border-gray-100 rounded-lg text-[#E31837] hover:text-red-600 hover:shadow-md transition-all">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="pl-12 space-y-2">
                                    {categories.filter(c => c.parent_id === root.id).map(child => (
                                        <div key={child.id} className="flex items-center justify-between p-3 pl-4 bg-white border border-gray-100 rounded-lg group hover:border-[#EDB917]/30 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-gray-50 rounded border flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                    {child.image_url ? (
                                                        <img src={child.image_url} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <Package className="h-4 w-4 text-gray-200" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-600 text-sm">{child.name}</span>
                                                    <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">{child.slug}</p>
                                                </div>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                <button onClick={() => handleEdit(child)} className="text-[#1B2631] hover:text-[#EDB917]">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(child.id)} className="text-[#E31837] hover:text-red-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#1B2631] p-8 rounded-xl shadow-2xl text-white self-start sticky top-8">
                    <h3 className="font-black text-[#EDB917] uppercase mb-6 italic border-b border-[#EDB917]/20 pb-4 flex items-center gap-2">
                        <Upload className="h-5 w-5" /> Ghi chú vận hành
                    </h3>
                    <ul className="space-y-6 text-sm">
                        <li className="flex gap-4">
                            <div className="h-6 w-6 bg-[#EDB917]/20 rounded flex-shrink-0 flex items-center justify-center font-black text-[#EDB917] text-xs">1</div>
                            <p className="font-medium text-gray-400">Ảnh danh mục sẽ hiển thị trên trang chủ (lưới danh mục).</p>
                        </li>
                        <li className="flex gap-4">
                            <div className="h-6 w-6 bg-[#EDB917]/20 rounded flex-shrink-0 flex items-center justify-center font-black text-[#EDB917] text-xs">2</div>
                            <p className="font-medium text-gray-400">Xóa danh mục cha sẽ xóa các danh mục con liên quan (cascade).</p>
                        </li>
                        <li className="flex gap-4">
                            <div className="h-6 w-6 bg-[#EDB917]/20 rounded flex-shrink-0 flex items-center justify-center font-black text-[#EDB917] text-xs">3</div>
                            <p className="font-medium text-gray-400">Nên dùng ảnh tỷ lệ 1:1 hoặc 4:3 để hiển thị đẹp nhất.</p>
                        </li>
                    </ul>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#1B2631]/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-black text-[#1B2631] uppercase tracking-tighter italic">
                                    {editingCategory ? 'Chỉnh sửa Danh mục' : 'Thêm danh mục mới'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên danh mục</label>
                                        <input
                                            placeholder="VD: Dao phay"
                                            required
                                            className="w-full p-3 border-2 border-gray-50 rounded font-black text-[#1B2631] focus:border-[#EDB917] outline-none transition-all"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Slug</label>
                                        <input
                                            placeholder="vd: dao-phay"
                                            required
                                            className="w-full p-3 border-2 border-gray-50 rounded font-bold text-sm focus:border-[#EDB917] outline-none transition-all"
                                            value={formData.slug}
                                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Danh mục cha</label>
                                    <select
                                        className="w-full p-3 border-2 border-gray-50 rounded font-bold focus:border-[#EDB917] outline-none transition-all"
                                        value={formData.parent_id || ''}
                                        onChange={e => setFormData({ ...formData, parent_id: e.target.value ? parseInt(e.target.value) : null })}
                                    >
                                        <option value="">Không có danh mục cha (Root)</option>
                                        {categories.filter(c => !c.parent_id && c.id !== editingCategory?.id).map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Link ảnh đại diện</label>
                                    <input
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full p-3 border-2 border-gray-50 rounded font-bold text-sm focus:border-[#EDB917] outline-none transition-all"
                                        value={formData.image_url}
                                        onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                    />
                                    <p className="text-[9px] text-gray-400 mt-1 italic italic">Dùng link ảnh hoặc tải lên phần sản phẩm rồi copy link.</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mô tả (Ngắn)</label>
                                    <textarea
                                        placeholder="Mô tả ngắn gọn về danh mục..."
                                        rows="2"
                                        className="w-full p-3 border-2 border-gray-50 rounded font-medium text-sm focus:border-[#EDB917] outline-none transition-all"
                                        value={formData.description || ''}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#EDB917] hover:bg-[#d4a615] text-[#1B2631] py-4 font-black uppercase shadow-xl hover:shadow-[#EDB917]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {editingCategory ? 'Cập nhật danh mục' : 'Tạo danh mục mới'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { AdminProducts, AdminCategories };
