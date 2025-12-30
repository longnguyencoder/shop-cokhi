import React, { useState, useEffect } from 'react';
import { FolderTree, Edit, Trash2, Plus, X, Upload } from 'lucide-react';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';

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
        <div className="space-y-6 animate-in fade-in duration-500">
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

export default AdminCategories;
