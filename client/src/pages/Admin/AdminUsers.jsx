import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';

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
        <div className="space-y-6 animate-in fade-in duration-500">
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

export default AdminUsers;
