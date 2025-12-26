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
                            {isLogin ? 'Đăng nhập hệ thống' : 'Đăng ký tài khoản'}
                        </h2>
                        <p className="text-gray-400 text-xs font-bold mt-2 uppercase tracking-widest leading-relaxed px-4">
                            {isLogin ? 'Chào mừng bạn quay trở lại với TEKKO' : 'Gia nhập cộng đồng cơ khí chính xác'}
                        </p>
                    </div>

                    {error && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-bold border-2 animate-in fade-in slide-in-from-top-1 duration-300 ${error.includes('thành công') ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        name="full_name"
                                        placeholder="Họ và tên của bạn"
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:border-primary focus:bg-white focus:outline-none transition-all font-bold text-sm"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        name="phone_number"
                                        placeholder="Số điện thoại liên hệ"
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:border-primary focus:bg-white focus:outline-none transition-all font-bold text-sm"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Địa chỉ Email"
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:border-primary focus:bg-white focus:outline-none transition-all font-bold text-sm"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Mật khẩu bảo mật"
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:border-primary focus:bg-white focus:outline-none transition-all font-bold text-sm"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {!isLogin && (
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <textarea
                                    name="address"
                                    placeholder="Địa chỉ giao hàng (Số nhà, Tên đường...)"
                                    required
                                    rows="2"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:border-primary focus:bg-white focus:outline-none transition-all font-bold text-sm"
                                    value={formData.address}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-navy hover:bg-navy-light text-white font-black py-4 rounded-xl shadow-lg hover:shadow-glow transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs disabled:opacity-50 mt-6"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isLogin ? 'Đăng nhập ngay' : 'Xác nhận đăng ký')}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">
                            {isLogin ? 'Bạn chưa có tài khoản?' : 'Bạn đã có tài khoản?'}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 text-primary font-black hover:underline uppercase text-xs tracking-widest"
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
