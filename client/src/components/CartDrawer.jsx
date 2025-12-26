import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) => {
    if (!isOpen) return null;

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="fixed inset-0 z-[110] flex justify-end overflow-hidden">
            <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-navy text-white">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                        <h2 className="text-xl font-black uppercase tracking-tighter italic">Giỏ hàng của bạn</h2>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <ShoppingBag className="h-12 w-12 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-black text-navy uppercase mb-2">Giỏ hàng đang trống</h3>
                            <p className="text-gray-400 font-medium text-sm mb-8 leading-relaxed">Bạn chưa chọn dụng cụ nào. Hãy lướt xem các sản phẩm của chúng tôi nhé!</p>
                            <button
                                onClick={onClose}
                                className="bg-primary text-navy font-black py-3 px-8 rounded-xl shadow-lg border-2 border-transparent hover:border-navy transition-all uppercase text-xs tracking-widest"
                            >
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-primary transition-all shadow-sm group">
                                <div className="h-20 w-20 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100">
                                    {item.image_url ? (
                                        <img src={item.image_url.startsWith('http') ? item.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${item.image_url}`} alt={item.name} className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <div className="text-[10px] font-black text-gray-200 uppercase tracking-tighter">No Image</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{item.sku}</p>
                                        <button
                                            onClick={() => onRemoveItem(item.id)}
                                            className="text-gray-300 hover:text-accent transition-colors p-1"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <h3 className="text-xs font-black text-navy uppercase line-clamp-2 mb-3 leading-snug group-hover:text-primary transition-colors">{item.name}</h3>
                                    <div className="mt-auto flex items-center justify-between gap-4">
                                        <p className="text-sm font-black text-accent">{item.price?.toLocaleString()} ₫</p>
                                        <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg overflow-hidden shrink-0">
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="px-2.5 py-1.5 hover:bg-gray-200 transition-colors text-navy"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="px-3 py-1.5 text-xs font-black text-navy bg-white min-w-[32px] text-center border-x border-gray-100">{item.quantity}</span>
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                className="px-2.5 py-1.5 hover:bg-gray-200 transition-colors text-navy"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-8 bg-white border-t border-gray-100 space-y-6 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">Tổng tiền tạm tính:</span>
                                <span className="text-2xl font-black text-navy tracking-tighter">{total.toLocaleString()} <span className="text-xs">₫</span></span>
                            </div>
                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <p className="text-[10px] text-navy/70 font-bold italic leading-relaxed">
                                    * Giá chưa bao gồm VAT và phí vận chuyển. Đội ngũ TEKKO sẽ liên hệ lại để báo giá chính xác nhất sau khi bạn gửi yêu cầu.
                                </p>
                            </div>
                        </div>
                        <Link to="/contact" onClick={onClose} className="w-full bg-navy hover:bg-navy-light text-white font-black py-4 rounded-xl shadow-lg hover:shadow-glow transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs group">
                            GỬI YÊU CẦU BÁO GIÁ
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
