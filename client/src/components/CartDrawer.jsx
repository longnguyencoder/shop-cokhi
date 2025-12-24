import React from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) => {
    if (!isOpen) return null;

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="fixed inset-0 z-[110] flex justify-end overflow-hidden">
            <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-navy text-white">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                        <h2 className="text-xl font-black uppercase tracking-tighter">Giỏ hàng của bạn</h2>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <ShoppingBag className="h-16 w-16 text-gray-100 mb-4" />
                            <p className="text-gray-400 font-bold italic">Giỏ hàng đang trống.</p>
                            <button onClick={onClose} className="mt-4 text-primary font-black uppercase text-xs hover:underline">Tiếp tục mua sắm</button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 border border-gray-50 rounded-lg hover:border-gray-100 transition-all shadow-sm">
                                <div className="h-20 w-20 bg-gray-50 rounded flex items-center justify-center flex-shrink-0">
                                    <div className="text-[10px] font-black text-gray-200 uppercase tracking-tighter">Product</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] text-gray-400 font-black mb-1 uppercase tracking-widest">{item.sku}</p>
                                    <h3 className="text-sm font-black text-navy uppercase truncate mb-2">{item.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-black text-accent">{item.price?.toLocaleString()} VNĐ</p>
                                        <div className="flex items-center border-2 border-gray-100 rounded overflow-hidden">
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="px-2 py-1 hover:bg-gray-50 transition-colors"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="px-3 py-1 text-xs font-black bg-gray-50">{item.quantity}</span>
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                className="px-2 py-1 hover:bg-gray-50 transition-colors"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onRemoveItem(item.id)}
                                    className="text-gray-300 hover:text-red-500 transition-colors h-max p-1"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Tạm tính:</span>
                            <span className="text-2xl font-black text-navy">{total.toLocaleString()} VNĐ</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium italic">Chưa bao gồm phí vận chuyển và VAT.</p>
                        <button className="w-full bg-primary hover:bg-primary-dark text-navy font-black py-4 rounded shadow-lg transition-all flex items-center justify-center gap-3 uppercase tracking-tighter">
                            TIẾN HÀNH ĐẶT HÀNG
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
