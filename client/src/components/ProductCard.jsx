import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Package, Info } from 'lucide-react';
import SITE_CONFIG from '../config/site';
import QuickViewModal from './QuickViewModal';

const ProductCard = ({ product, onAddToCart }) => {
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-premium transition-all group flex flex-col relative translate-y-0 hover:-translate-y-2 h-full">
            <Link to={`/product/${product.slug}`} className="absolute inset-0 z-10"></Link>

            <div className="absolute top-4 right-4 z-20 pointer-events-none flex flex-col items-end gap-2">
                {product.on_sale && product.price > 0 && product.sale_price > 0 && (
                    <div className="bg-accent text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-tighter animate-pulse">
                        -{Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                    </div>
                )}
                <div className="bg-navy text-primary text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest border border-primary/20">
                    {product.brand?.name || 'CHÍNH HÃNG'}
                </div>
            </div>

            <div className="h-48 sm:h-56 md:h-64 bg-white relative overflow-hidden flex items-center justify-center transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent group-hover:opacity-0 transition-opacity"></div>
                {product.image_url ? (
                    <img
                        src={(product.image_url && typeof product.image_url === 'string' && product.image_url.startsWith('http')) ? product.image_url : `${SITE_CONFIG.api.baseUrl}${product.image_url}`}
                        alt={product.name}
                        className="h-full w-full object-contain p-6 sm:p-8 md:p-10 group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <Package className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 text-gray-100 group-hover:scale-110 group-hover:text-primary/20 transition-all duration-700 ease-out" />
                )}

                {/* Quick View Button */}
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsQuickViewOpen(true); }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md text-navy px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.1em] shadow-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20 flex items-center gap-2 border border-gray-100 hover:bg-primary transition-colors italic"
                >
                    <Info className="h-4 w-4 text-primary group-hover:text-navy" />
                    XEM NHANH
                </button>
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col relative bg-white border-t border-gray-50">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{product.sku}</span>
                    {product.in_stock ? (
                        <span className="flex items-center gap-1.5 text-[9px] text-green-600 font-black uppercase tracking-widest bg-green-50 px-2.5 py-1 rounded-md">
                            <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-bounce"></span>
                            CÒN HÀNG
                        </span>
                    ) : (
                        <span className="text-[9px] text-red-500 font-black uppercase tracking-widest bg-red-50 px-2.5 py-1 rounded-md">
                            LIÊN HỆ
                        </span>
                    )}
                </div>

                <h3 className="font-black text-navy group-hover:text-primary transition-colors mb-6 line-clamp-2 min-h-[3rem] leading-tight uppercase text-[15px] tracking-tight italic">
                    {product.name}
                </h3>

                <div className="mt-auto">
                    <div className="flex flex-col mb-6">
                        {product.on_sale && product.sale_price ? (
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-accent tracking-tighter">
                                    {product.sale_price.toLocaleString()} <span className="text-xs uppercase">₫</span>
                                </span>
                                <span className="text-xs text-gray-400 line-through font-bold">
                                    {product.price.toLocaleString()}
                                </span>
                            </div>
                        ) : (
                            <div className="text-2xl font-black text-navy tracking-tighter">
                                {product.price > 0 ? (
                                    <>
                                        {product.price.toLocaleString()} <span className="text-xs uppercase text-gray-400">₫</span>
                                    </>
                                ) : 'LIÊN HỆ BÁO GIÁ'}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 relative z-20">
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(product); }}
                            className="flex-1 bg-navy hover:bg-navy-light text-white py-3.5 rounded-xl font-black text-[10px] transition-all flex items-center justify-center gap-2 transform active:scale-95 shadow-lg group/btn hover:shadow-glow uppercase tracking-widest border border-white/5"
                        >
                            <ShoppingCart className="h-4 w-4 text-primary group-hover/btn:animate-bounce" />
                            THÊM VÀO GIỎ
                        </button>
                    </div>
                </div>
            </div>

            <QuickViewModal
                product={product}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
                onAddToCart={onAddToCart}
            />
        </div>
    );
};

export default ProductCard;

