import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Save, ShieldCheck } from 'lucide-react';
import { updateMe } from '../api/auth';

const Profile = ({ user, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        address: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                phone_number: user.phone_number || '',
                address: user.address || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const updated = await updateMe(formData);
            onUpdateSuccess(updated);
            setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.detail || 'Có lỗi xảy ra khi cập nhật.' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="w-full md:w-80 bg-[#1B2631] p-10 text-white flex flex-col items-center text-center">
                    <div className="h-24 w-24 bg-[#EDB917] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#EDB917]/20">
                        <User className="h-12 w-12 text-[#1B2631]" />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tighter italic mb-2">{user.full_name}</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">
                        {user.is_superuser ? 'Quản trị viên' : 'Thành viên'}
                    </p>
                    <div className="w-full pt-6 border-t border-white/10 space-y-4">
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-300">
                            <Mail className="h-4 w-4 text-[#EDB917]" /> {user.email}
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-300">
                            <ShieldCheck className="h-4 w-4 text-[#EDB917]" /> Tài khoản đã xác thực
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 p-10 md:p-16">
                    <h3 className="text-2xl font-black text-[#1B2631] uppercase tracking-tighter mb-10 border-b-4 border-[#EDB917] pb-4 flex items-center gap-3 italic">
                        CHỈNH SỬA HỒ SƠ
                    </h3>

                    {message.text && (
                        <div className={`mb-8 p-4 rounded font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Họ và tên</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-300" />
                                    <input
                                        required
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-50 rounded-lg focus:border-[#EDB917] focus:outline-none transition-all font-bold text-sm"
                                        value={formData.full_name}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Số điện thoại</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-300" />
                                    <input
                                        required
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-50 rounded-lg focus:border-[#EDB917] focus:outline-none transition-all font-bold text-sm"
                                        value={formData.phone_number}
                                        onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Địa chỉ giao hàng</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-300" />
                                <textarea
                                    required
                                    rows="3"
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-50 rounded-lg focus:border-[#EDB917] focus:outline-none transition-all font-bold text-sm"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1B2631] hover:bg-[#1B2631]/90 text-[#EDB917] py-4 rounded-lg shadow-xl font-black uppercase text-sm tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
                        >
                            {loading ? 'ĐANG LƯU...' : (
                                <>LƯU THAY ĐỔI <Save className="h-5 w-5" /></>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
