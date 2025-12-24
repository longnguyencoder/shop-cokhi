import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, MapPin, Loader2 } from 'lucide-react';
import { login, register } from '../api/auth';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        phone_number: '',
        address: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register({
                    email: formData.email,
                    password: formData.password,
                    full_name: formData.full_name,
                    phone_number: formData.phone_number,
                    address: formData.address
                });
                // Auto login after register or switch to login
                setIsLogin(true);
                setError('Đăng ký thành công! Vui lòng đăng nhập.');
                setLoading(false);
                return;
            }
            onAuthSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.detail || 'Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-navy transition-colors">
                        <X className="h-6 w-6" />
                    </button>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-navy uppercase tracking-tighter">
                            {isLogin ? 'Đăng nhập tài khoản' : 'Đăng ký thành viên'}
                        </h2>
                        <p className="text-gray-400 text-xs font-bold mt-2 uppercase tracking-widest">
                            {isLogin ? 'Chào mừng bạn quay trở lại' : 'Trở thành đối tác của Shop Cơ Khí'}
                        </p>
                    </div>

                    {error && (
                        <div className={`mb-6 p-3 rounded text-sm font-bold border ${error.includes('thành công') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="full_name"
                                        placeholder="Họ và tên"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-100 rounded focus:border-primary focus:outline-none transition-colors"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="phone_number"
                                        placeholder="Số điện thoại"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-100 rounded focus:border-primary focus:outline-none transition-colors"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Địa chỉ Email"
                                required
                                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-100 rounded focus:border-primary focus:outline-none transition-colors"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Mật khẩu"
                                required
                                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-100 rounded focus:border-primary focus:outline-none transition-colors"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {!isLogin && (
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <textarea
                                    name="address"
                                    placeholder="Địa chỉ giao hàng"
                                    required
                                    rows="2"
                                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-100 rounded focus:border-primary focus:outline-none transition-colors"
                                    value={formData.address}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-dark text-navy font-black py-3 rounded shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-tighter disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isLogin ? 'Đăng nhập ngay' : 'Tạo tài khoản')}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 text-primary font-black hover:underline uppercase text-xs"
                            >
                                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
