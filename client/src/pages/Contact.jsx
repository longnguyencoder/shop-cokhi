import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import SITE_CONFIG from '../config/site';
import api from '../api/axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/contact/send', formData);
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', phone: '', message: '' });
            }, 5000);
        } catch (err) {
            console.error('Error sending contact form:', err);
            setError('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-[#1B2631] uppercase tracking-tight mb-4">
                        Liên hệ với chúng tôi
                    </h1>
                    <p className="text-lg text-gray-600 font-bold">
                        Chúng tôi sẵn sàng hỗ trợ bạn 24/7
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-black text-[#1B2631] uppercase tracking-tight mb-6 flex items-center gap-3">
                            <span className="h-1 w-12 bg-[#EDB917]"></span>
                            Gửi tin nhắn
                        </h2>

                        {submitted && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-700 font-bold text-sm">
                                    ✓ Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 font-bold text-sm">
                                    ✗ {error}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2">
                                    Họ và tên *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-[#EDB917] outline-none transition-all font-bold"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nguyễn Văn A"
                                    disabled={loading}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-[#EDB917] outline-none transition-all font-bold"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="email@example.com"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2">
                                        Số điện thoại *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-[#EDB917] outline-none transition-all font-bold"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder={SITE_CONFIG.contact.phone}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2">
                                    Nội dung *
                                </label>
                                <textarea
                                    required
                                    rows="6"
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:border-[#EDB917] outline-none transition-all font-bold resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Tôi muốn tư vấn về..."
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#EDB917] hover:bg-[#d4a615] text-[#1B2631] py-4 rounded-lg font-black uppercase tracking-wider text-sm transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-5 w-5 border-2 border-[#1B2631] border-t-transparent rounded-full animate-spin"></div>
                                        Đang gửi...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" />
                                        Gửi tin nhắn
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        {/* Company Info Card */}
                        <div className="bg-gradient-to-br from-[#1B2631] to-[#2c3e50] rounded-2xl shadow-xl p-8 text-white">
                            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-[#EDB917]">
                                Thông tin liên hệ
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-[#EDB917] p-3 rounded-lg">
                                        <MapPin className="h-6 w-6 text-[#1B2631]" />
                                    </div>
                                    <div>
                                        <h3 className="font-black uppercase text-sm tracking-wider mb-1 text-[#EDB917]">Địa chỉ</h3>
                                        <p className="text-gray-300 font-bold">{SITE_CONFIG.contact.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-[#EDB917] p-3 rounded-lg">
                                        <Phone className="h-6 w-6 text-[#1B2631]" />
                                    </div>
                                    <div>
                                        <h3 className="font-black uppercase text-sm tracking-wider mb-1 text-[#EDB917]">Điện thoại</h3>
                                        <a href={`tel:${SITE_CONFIG.contact.phoneRaw}`} className="text-gray-300 font-bold hover:text-[#EDB917] transition-colors">
                                            {SITE_CONFIG.contact.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-[#EDB917] p-3 rounded-lg">
                                        <Mail className="h-6 w-6 text-[#1B2631]" />
                                    </div>
                                    <div>
                                        <h3 className="font-black uppercase text-sm tracking-wider mb-1 text-[#EDB917]">Email</h3>
                                        <a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-gray-300 font-bold hover:text-[#EDB917] transition-colors">
                                            {SITE_CONFIG.contact.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-[#EDB917] p-3 rounded-lg">
                                        <Clock className="h-6 w-6 text-[#1B2631]" />
                                    </div>
                                    <div>
                                        <h3 className="font-black uppercase text-sm tracking-wider mb-1 text-[#EDB917]">Giờ làm việc</h3>
                                        <p className="text-gray-300 font-bold">Thứ 2 - Thứ 7: 8:00 - 18:00</p>
                                        <p className="text-gray-300 font-bold">Chủ nhật: 8:00 - 12:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Contact Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <h3 className="text-xl font-black text-[#1B2631] uppercase tracking-tight mb-4">
                                Liên hệ nhanh
                            </h3>
                            <p className="text-gray-600 font-bold mb-6">
                                Gọi ngay để được tư vấn miễn phí
                            </p>
                            <a
                                href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                                className="block w-full bg-[#E31837] hover:bg-red-700 text-white py-4 rounded-lg font-black uppercase tracking-wider text-sm transition-all transform hover:scale-105 shadow-lg text-center"
                            >
                                <Phone className="inline h-5 w-5 mr-2" />
                                {SITE_CONFIG.contact.phone}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
