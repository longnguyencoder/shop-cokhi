import React, { useState, useEffect } from 'react';
import { Package, FolderTree, Factory, Users, Plus, Edit, Trash2, ChevronDown, ChevronRight, Save, X, Upload } from 'lucide-react';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'sale'
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
                api.get('/categories/', { params: { flat: true } }),
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
    const filteredProducts = activeTab === 'sale'
        ? products.filter(p => p.on_sale)
        : products;

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const displayedProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();

        // Prepare data for submission with correct types
        const submitData = {
            ...formData,
            category_id: parseInt(formData.category_id) || 0,
            brand_id: parseInt(formData.brand_id) || 0,
            price: formData.price === '' ? null : parseFloat(formData.price),
            sale_price: (formData.on_sale && formData.sale_price !== null && formData.sale_price !== '') ? parseFloat(formData.sale_price) : null,
            discount_percent: (formData.on_sale && formData.discount_percent !== null && formData.discount_percent !== '') ? parseFloat(formData.discount_percent) : null,
        };

        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, submitData);
            } else {
                await api.post('/products/', submitData);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            let errorMsg = "Lỗi khi lưu sản phẩm";
            if (err.response?.data?.detail) {
                const detail = err.response.data.detail;
                if (Array.isArray(detail)) {
                    // Format Pydantic validation errors
                    errorMsg = detail.map(d => {
                        const field = d.loc[d.loc.length - 1];
                        return `${field}: ${d.msg}`;
                    }).join('\n');
                } else {
                    errorMsg = detail;
                }
            }
            alert(errorMsg);
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
                    onClick={() => {
                        setEditingProduct(null);
                        setFormData({
                            name: '', sku: '', slug: '', description: '', price: '', in_stock: true,
                            category_id: '', brand_id: '', image_url: '',
                            diameter: '', length: '', material: '', flutes: '', hardness: '', coating: '',
                            on_sale: false, sale_price: null, discount_percent: null
                        });
                        setIsModalOpen(true);
                    }}
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
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
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
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({ name: '', slug: '', description: '', parent_id: null, image_url: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchCats = async () => {
        try {
            const res = await api.get('/categories/', { params: { flat: true } });
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

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        try {
            const res = await api.post(`/categories/upload-image`, uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ ...formData, image_url: res.data.image_url });
            // alert("Tải ảnh danh mục thành công!");
            fetchCats();
        } catch (err) {
            alert('Lỗi khi upload ảnh');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory.id}`, formData);
                alert("Cập nhật danh mục thành công!");
            } else {
                await api.post('/categories/', formData);
                alert("Tạo danh mục mới thành công!");
            }
            setIsModalOpen(false);
            resetForm();
            fetchCats();
        } catch (err) {
            alert("Lỗi khi lưu danh mục. Vui lòng kiểm tra lại slug hoặc kết nối.");
        }
    };

    // Pagination logic for Categories
    const indexOfLastCat = currentPage * itemsPerPage;
    const indexOfFirstCat = indexOfLastCat - itemsPerPage;
    const currentCategories = categories.slice(indexOfFirstCat, indexOfLastCat);
    const totalCatPages = Math.ceil(categories.length / itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-[#1B2631] uppercase tracking-tighter border-b-4 border-[#EDB917] pb-1">Quản lý Danh mục</h2>
                <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#EDB917] hover:bg-[#1B2631] hover:text-[#EDB917] text-[#1B2631] px-6 py-3 rounded-lg font-black transition-all flex items-center gap-2 shadow-lg hover:shadow-[#EDB917]/20 uppercase text-xs tracking-widest">
                    <Plus className="h-4 w-4" /> Thêm danh mục
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-[#1B2631] text-white uppercase text-[10px] tracking-widest font-black">
                        <tr>
                            <th className="px-6 py-4">Hình ảnh</th>
                            <th className="px-6 py-4">Tên danh mục</th>
                            <th className="px-6 py-4 text-center">Số sản phẩm</th>
                            <th className="px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {currentCategories.map(cat => (
                            <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="h-12 w-12 bg-gray-50 rounded border flex items-center justify-center overflow-hidden">
                                        {cat.image_url ? (
                                            <img src={cat.image_url.startsWith('http') ? cat.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${cat.image_url}`} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <FolderTree className="h-6 w-6 text-gray-200" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-[#1B2631] uppercase tracking-tighter">{cat.name}</div>
                                    <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{cat.slug}</div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-[#1B2631]/5 text-[#1B2631] px-3 py-1 rounded-full text-xs font-black">
                                        {cat.product_count || 0}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-3">
                                        <button onClick={() => handleEdit(cat)} className="p-2.5 text-[#1B2631] hover:bg-[#EDB917]/20 rounded-full transition-all"><Edit className="h-4 w-4" /></button>
                                        <button onClick={() => handleDelete(cat.id)} className="p-2.5 text-[#E31837] hover:bg-[#E31837]/10 rounded-full transition-all"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalCatPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
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
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ảnh đại diện</label>
                                    <div className="flex gap-4 items-end">
                                        <input
                                            placeholder="https://example.com/image.jpg hoặc upload"
                                            className="flex-1 p-3 border-2 border-gray-50 rounded font-bold text-sm focus:border-[#EDB917] outline-none transition-all"
                                            value={formData.image_url}
                                            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                        />
                                        <label className="bg-[#1B2631] hover:bg-[#2c3e50] text-white px-4 py-3 rounded font-black text-xs uppercase cursor-pointer transition-all flex items-center gap-2">
                                            {uploadingImage ? (
                                                <>
                                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Đang tải...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="h-4 w-4" />
                                                    Tải lên
                                                </>
                                            )}
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                                        </label>
                                    </div>
                                    <p className="text-[9px] text-gray-400 mt-1 italic">
                                        Nhập URL hoặc click "Tải lên" để chọn ảnh từ máy
                                    </p>
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

                                {editingCategory && !formData.image_url && (
                                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                                        <p className="text-green-700 font-bold text-sm">
                                            ✓ Danh mục đã được tạo! Bạn có thể upload ảnh ngay bây giờ.
                                        </p>
                                    </div>
                                )}

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

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [formData, setFormData] = useState({ email: '', password: '', full_name: '', phone_number: '', address: '', is_superuser: false });

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users/');
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    useEffect(() => { fetchUsers() }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await api.put(`/users/${editingUser.id}`, formData);
            } else {
                await api.post('/auth/register', formData);
            }
            setIsModalOpen(false);
            resetForm();
            fetchUsers();
        } catch (err) {
            alert("Lỗi khi lưu người dùng.");
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ email: user.email, full_name: user.full_name, phone_number: user.phone_number, address: user.address, is_superuser: user.is_superuser, password: '' });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;
        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (err) {
            alert("Lỗi khi xóa.");
        }
    };

    const handleToggleActive = async (id) => {
        try {
            await api.post(`/users/${id}/toggle-active`);
            fetchUsers();
        } catch (err) {
            alert("Lỗi khi thay đổi trạng thái.");
        }
    };

    const resetForm = () => {
        setEditingUser(null);
        setFormData({ email: '', password: '', full_name: '', phone_number: '', address: '', is_superuser: false });
    };

    // Pagination logic for Users
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalUserPages = Math.ceil(users.length / itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-[#1B2631] uppercase tracking-tighter border-b-4 border-[#EDB917] pb-1">Quản lý người dùng</h2>
                <button onClick={() => { setEditingUser(null); setFormData({ email: '', password: '', full_name: '', phone_number: '', address: '', is_superuser: false }); setIsModalOpen(true); }} className="bg-[#EDB917] hover:bg-[#1B2631] hover:text-[#EDB917] text-[#1B2631] px-6 py-3 rounded-lg font-black transition-all flex items-center gap-2 shadow-lg hover:shadow-[#EDB917]/20 uppercase text-xs tracking-widest">
                    <Plus className="h-4 w-4" /> Thêm người dùng
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-[#1B2631] text-white uppercase text-[10px] tracking-widest font-black">
                        <tr>
                            <th className="px-6 py-4">Họ và tên</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Thứ tự quản trị</th>
                            <th className="px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {currentUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-[#1B2631] uppercase tracking-tighter">{user.full_name}</td>
                                <td className="px-6 py-4 text-xs font-black text-gray-400">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.is_superuser ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                        {user.is_superuser ? 'Quản trị viên' : 'Khách hàng'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-3">
                                        <button onClick={() => { setEditingUser(user); setFormData({ ...user, password: '' }); setIsModalOpen(true); }} className="p-2.5 text-[#1B2631] hover:bg-[#EDB917]/20 rounded-full transition-all"><Edit className="h-4 w-4" /></button>
                                        <button onClick={() => handleDelete(user.id)} className="p-2.5 text-[#E31837] hover:bg-[#E31837]/10 rounded-full transition-all"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalUserPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center">
                            <h3 className="text-xl font-black text-[#1B2631] uppercase tracking-tighter italic">{editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-[#1B2631] transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</label>
                                    <input required type="email" className="w-full p-3 border-2 border-gray-50 rounded font-bold text-sm focus:border-[#EDB917] outline-none transition-all" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mật khẩu {editingUser && '(để trống nếu không đổi)'}</label>
                                    <input type="password" className="w-full p-3 border-2 border-gray-50 rounded font-bold text-sm focus:border-[#EDB917] outline-none transition-all" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required={!editingUser} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Họ tên</label>
                                <input required className="w-full p-3 border-2 border-gray-50 rounded font-bold text-sm focus:border-[#EDB917] outline-none transition-all" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Số điện thoại</label>
                                    <input required className="w-full p-3 border-2 border-gray-50 rounded font-bold text-sm focus:border-[#EDB917] outline-none transition-all" value={formData.phone_number} onChange={e => setFormData({ ...formData, phone_number: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vai trò</label>
                                    <select className="w-full p-3 border-2 border-gray-50 rounded font-bold text-sm focus:border-[#EDB917] outline-none transition-all" value={formData.is_superuser} onChange={e => setFormData({ ...formData, is_superuser: e.target.value === 'true' })}>
                                        <option value="false">Khách hàng</option>
                                        <option value="true">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Địa chỉ</label>
                                <textarea required rows="3" className="w-full p-3 border-2 border-gray-50 rounded font-bold text-sm focus:border-[#EDB917] outline-none transition-all" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 bg-[#EDB917] hover:bg-[#d4a615] text-[#1B2631] py-3 rounded font-black uppercase text-sm tracking-widest shadow-lg transition-all">
                                    {editingUser ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 rounded font-black uppercase text-sm tracking-widest transition-all">
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminBrands = () => {
    const [brands, setBrands] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [formData, setFormData] = useState({ name: '', code: '', logo_url: '', description: '' });

    const fetchBrands = async () => {
        try {
            const res = await api.get('/brands/');
            setBrands(res.data);
        } catch (err) {
            console.error("Error fetching brands:", err);
        }
    };

    useEffect(() => { fetchBrands() }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBrand) {
                await api.put(`/brands/${editingBrand.id}`, formData);
                alert("Cập nhật thương hiệu thành công!");
            } else {
                await api.post('/brands/', formData);
                alert("Tạo thương hiệu mới thành công!");
            }
            setIsModalOpen(false);
            resetForm();
            fetchBrands();
        } catch (err) {
            alert("Lỗi khi lưu thương hiệu.");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await api.post(`/brands/upload-logo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, logo_url: res.data.logo_url }));
            // alert("Tải logo thành công!");
            fetchBrands();
        } catch (err) {
            alert("Lỗi khi upload logo.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleEdit = (brand) => {
        setEditingBrand(brand);
        setFormData({ name: brand.name, code: brand.code || '', logo_url: brand.logo_url || '', description: brand.description || '' });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa thương hiệu này?')) return;
        try {
            await api.delete(`/brands/${id}`);
            fetchBrands();
        } catch (err) {
            alert("Lỗi khi xóa thương hiệu.");
        }
    };

    const resetForm = () => {
        setEditingBrand(null);
        setFormData({ name: '', code: '', logo_url: '', description: '' });
    };

    // Pagination logic for Brands
    const indexOfLastBrand = currentPage * itemsPerPage;
    const indexOfFirstBrand = indexOfLastBrand - itemsPerPage;
    const currentBrands = brands.slice(indexOfFirstBrand, indexOfLastBrand);
    const totalBrandPages = Math.ceil(brands.length / itemsPerPage);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-[#1B2631] uppercase tracking-tighter border-b-8 border-[#EDB917] pb-1">Thương hiệu đối tác</h2>
                <button onClick={() => { setEditingBrand(null); setFormData({ name: '', code: '', logo_url: '', description: '' }); setIsModalOpen(true); }} className="bg-[#EDB917] hover:bg-[#1B2631] hover:text-[#EDB917] text-[#1B2631] px-8 py-4 rounded-xl font-black transition-all flex items-center gap-3 shadow-xl hover:shadow-[#EDB917]/20 uppercase text-sm tracking-widest group">
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" /> Thêm thương hiệu
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentBrands.map(brand => (
                    <div key={brand.id} className="group relative bg-white rounded-2xl shadow-premium hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:-translate-y-2 flex flex-col h-full">
                        <div className="aspect-[16/9] bg-gray-50 flex items-center justify-center p-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1B2631]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            {brand.logo_url ? (
                                <img src={brand.logo_url.startsWith('http') ? brand.logo_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${brand.logo_url}`} alt={brand.name} className="max-h-full max-w-full object-contain filter group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <Factory className="h-16 w-16 text-gray-200" />
                            )}
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-black text-[#1B2631] uppercase tracking-tighter">{brand.name}</h3>
                                    <span className="text-[10px] font-black text-[#EDB917] bg-[#EDB917]/10 px-2 py-0.5 rounded uppercase tracking-widest">{brand.code}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditingBrand(brand); setFormData(brand); setIsModalOpen(true); }} className="p-2.5 bg-gray-50 text-[#1B2631] hover:bg-[#EDB917] hover:text-[#1B2631] rounded-xl transition-all shadow-sm"><Edit className="h-4 w-4" /></button>
                                    <button onClick={() => handleDelete(brand.id)} className="p-2.5 bg-gray-50 text-[#E31837] hover:bg-[#E31837] hover:text-white rounded-xl transition-all shadow-sm"><Trash2 className="h-4 w-4" /></button>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm font-medium line-clamp-3 leading-relaxed mb-4 flex-1">{brand.description || 'Không có mô tả cho thương hiệu này.'}</p>
                            <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <span>ID: #{brand.id}</span>
                                <span className="flex items-center gap-1">Xem chi tiết <ChevronRight className="h-3 w-3" /></span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalBrandPages}
                onPageChange={(page) => setCurrentPage(page)}
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center">
                            <h3 className="text-xl font-black text-[#1B2631] uppercase tracking-tighter italic">{editingBrand ? 'Sửa thương hiệu' : 'Thêm thương hiệu mới'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-[#1B2631] transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên thương hiệu *</label>
                                    <input required className="w-full p-3 border-2 border-gray-50 rounded font-bold text-sm focus:border-[#EDB917] outline-none transition-all" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã thương hiệu</label>
                                    <input className="w-full p-3 border-2 border-gray-50 rounded font-bold text-sm focus:border-[#EDB917] outline-none transition-all" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logo</label>
                                <div className="flex gap-4 items-end">
                                    <input placeholder="https://example.com/logo.png hoặc upload" className="flex-1 p-3 border-2 border-gray-50 rounded font-bold text-sm focus:border-[#EDB917] outline-none transition-all" value={formData.logo_url} onChange={e => setFormData({ ...formData, logo_url: e.target.value })} />
                                    <label className="bg-[#1B2631] hover:bg-[#2c3e50] text-white px-4 py-3 rounded font-black text-xs uppercase cursor-pointer transition-all flex items-center gap-2">
                                        {uploadingImage ? (
                                            <>
                                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Đang tải...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4" />
                                                Tải lên
                                            </>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                                    </label>
                                </div>
                                <p className="text-[9px] text-gray-400 mt-1 italic">
                                    Nhập URL hoặc click "Tải lên" để chọn logo từ máy
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mô tả</label>
                                <textarea rows="3" className="w-full p-3 border-2 border-gray-50 rounded font-bold text-sm focus:border-[#EDB917] outline-none transition-all" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 bg-[#EDB917] hover:bg-[#d4a615] text-[#1B2631] py-3 rounded font-black uppercase text-sm tracking-widest shadow-lg transition-all">
                                    {editingBrand ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 rounded font-black uppercase text-sm tracking-widest transition-all">
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export { AdminProducts, AdminCategories, AdminUsers, AdminBrands };
