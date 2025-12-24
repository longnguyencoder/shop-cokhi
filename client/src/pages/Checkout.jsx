import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, CreditCard, Truck, ShieldCheck, MapPin, User, Phone, Mail } from 'lucide-react';
import api from '../api/axios';

const Checkout = ({ cartItems, user, onOrderSuccess }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [orderInfo, setOrderInfo] = useState({
        full_name: user?.full_name || '',
        phone_number: user?.phone_number || '',
        email: user?.email || '',
        address: user?.address || '',
        notes: ''
    });

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return;

        setLoading(true);
        setError('');

        try {
            // Logic for creating order in backend
            const res = await api.post('/orders/', {
                items: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                ...orderInfo,
                total_amount: total
            });

            onOrderSuccess();
            navigate('/');
            alert("ĐẶT HÀNG THÀNH CÔNG! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
        } catch (err) {
            setError(err.response?.data?.detail || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <ShoppingBag className="h-20 w-20 text-gray-100 mx-auto mb-6" />
                <h2 className="text-2xl font-black text-navy uppercase mb-4">Giỏ hàng của bạn đang trống</h2>
                <Link to="/" className="text-primary font-bold hover:underline uppercase text-sm">Quay lại mua sắm ngay</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Form Section */}
                <div className="flex-1">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                        <h2 className="text-2xl font-black text-navy uppercase tracking-tighter mb-8 border-b-4 border-primary pb-4 flex items-center gap-3">
                            <Truck className="h-6 w-6" /> THÔNG TIN GIAO HÀNG
                        </h2>

                        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-bold border border-red-200 rounded">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Họ và tên người nhận</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
                                        <input
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-50 rounded focus:border-primary focus:outline-none transition-all font-bold"
                                            value={orderInfo.full_name}
                                            onChange={(e) => setOrderInfo({ ...orderInfo, full_name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Số điện thoại</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
                                        <input
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-50 rounded focus:border-primary focus:outline-none transition-all font-bold"
                                            value={orderInfo.phone_number}
                                            onChange={(e) => setOrderInfo({ ...orderInfo, phone_number: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Địa chỉ Email (Nhận hóa đơn)</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
                                    <input
                                        required
                                        type="email"
                                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-50 rounded focus:border-primary focus:outline-none transition-all font-bold"
                                        value={orderInfo.email}
                                        onChange={(e) => setOrderInfo({ ...orderInfo, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Địa chỉ nhận hàng chi tiết</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
                                    <textarea
                                        required
                                        rows="3"
                                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-50 rounded focus:border-primary focus:outline-none transition-all font-bold"
                                        value={orderInfo.address}
                                        onChange={(e) => setOrderInfo({ ...orderInfo, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Ghi chú đơn hàng (Tùy chọn)</label>
                                <textarea
                                    rows="2"
                                    className="w-full px-4 py-2.5 border-2 border-gray-50 rounded focus:border-primary focus:outline-none transition-all font-bold"
                                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                                    value={orderInfo.notes}
                                    onChange={(e) => setOrderInfo({ ...orderInfo, notes: e.target.value })}
                                />
                            </div>

                            <div className="p-6 bg-navy text-white rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/20 p-2 rounded">
                                        <ShieldCheck className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-black uppercase text-sm tracking-tighter">Thanh toán An toàn</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Chúng tôi sẽ gọi xác nhận trước khi giao</p>
                                    </div>
                                </div>
                                <div className="hidden md:flex gap-2">
                                    <div className="h-8 w-12 bg-white/5 rounded border border-white/10 flex items-center justify-center font-black text-[8px]">COD</div>
                                    <div className="h-8 w-12 bg-white/5 rounded border border-white/10 flex items-center justify-center font-black text-[8px]">BANK</div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#EDB917] hover:bg-[#d4a615] text-[#1B2631] py-5 rounded-lg shadow-xl font-black uppercase text-lg tracking-tighter transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                            >
                                {loading ? 'ĐANG XỬ LÝ...' : (
                                    <>XÁC NHẬN ĐẶT HÀNG <CreditCard className="h-6 w-6" /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="w-full lg:w-96">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 sticky top-24">
                        <h3 className="text-xl font-black text-navy uppercase tracking-tighter mb-6">Tóm tắt đơn hàng</h3>
                        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar mb-6">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex gap-4 items-center p-3 rounded-lg border border-gray-50">
                                    <div className="h-12 w-12 bg-gray-50 rounded flex items-center justify-center flex-shrink-0">
                                        <Package className="h-6 w-6 text-gray-200" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-black text-navy uppercase truncate">{item.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold">SL: {item.quantity} x {item.price?.toLocaleString()} VNĐ</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Tạm tính:</span>
                                <span className="font-black text-navy">{total.toLocaleString()} VNĐ</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Vận chuyển:</span>
                                <span className="font-black text-navy text-[10px]">TÍNH KHI GIAO</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t-2 border-navy">
                                <span className="font-black text-navy uppercase tracking-tighter text-sm">TỔNG CỘNG:</span>
                                <span className="text-2xl font-black text-accent tracking-tighter">{total.toLocaleString()} VNĐ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
