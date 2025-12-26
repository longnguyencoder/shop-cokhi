import React from 'react';
import { X, ShoppingCart, Check, Truck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }) => {
    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#1B2631]/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col md:flex-row max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-20 p-2 bg-white rounded-full shadow-lg text-navy hover:text-red-500 transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Left: Image */}
                <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 md:p-12 relative min-h-[300px]">
                    <img
                        src={product.image_url?.startsWith('http') ? product.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${product.image_url}`}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain drop-shadow-2xl"
                    />
                    {product.in_stock && (
                        <div className="absolute top-4 left-4 bg-green-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                            <Check className="h-3 w-3" /> Còn hàng
                        </div>
                    )}
                </div>

                {/* Right: Info */}
                <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                    <div className="mb-6">
                        <span className="text-[10px] bg-navy text-primary px-3 py-1 rounded font-black uppercase tracking-widest">{product.category?.name}</span>
                        <h2 className="text-2xl md:text-3xl font-black text-navy uppercase italic tracking-tighter mt-4 mb-2">{product.name}</h2>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU: {product.sku} | Thương hiệu: {product.brand?.name}</div>
                    </div>

                    <div className="flex items-baseline gap-2 mb-8">
                        <span className="text-4xl font-black text-[#E31837] tracking-tighter">
                            {product.price ? product.price.toLocaleString() : 'Liên hệ'}
                        </span>
                        {product.price && <span className="text-sm font-black text-gray-400 uppercase">VND</span>}
                    </div>

                    <div className="space-y-4 mb-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-navy border-b border-gray-100 pb-2">Ưu điểm nổi bật</h4>
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 italic">
                            {product.description || "Dụng cụ cơ khí chính xác chất lượng cao, giúp tối ưu hóa hiệu suất gia công và kéo dài tuổi thọ thiết bị."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                onAddToCart(product);
                                onClose();
                            }}
                            className="bg-navy text-white h-14 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-navy-light transition-all active:scale-95 shadow-lg"
                        >
                            <ShoppingCart className="h-5 w-5 text-primary" />
                            Thêm vào giỏ
                        </button>
                        <Link
                            to={`/product/${product.slug}`}
                            className="bg-primary text-navy h-14 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-primary-dark transition-all active:scale-95 shadow-lg"
                        >
                            Xem chi tiết
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                            <Check className="h-4 w-4 text-green-500" />
                            Cam kết chính hãng
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                            <Truck className="h-4 w-4 text-primary" />
                            Giao hàng siêu tốc
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;
