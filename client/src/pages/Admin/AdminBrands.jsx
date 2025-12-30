import React, { useState, useEffect } from 'react';
import { Factory, ChevronRight, Edit, Trash2, Plus, X, Upload } from 'lucide-react';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';

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

export default AdminBrands;
