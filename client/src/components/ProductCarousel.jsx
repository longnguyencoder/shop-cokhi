import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Package, ShoppingCart } from 'lucide-react';

const ProductCarousel = ({ title, products = [], viewAllLink, onAddToCart }) => {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = 300;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="py-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex flex-col gap-2">
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Bộ Sưu Tập</h3>
                    <h2 className="text-3xl md:text-4xl font-black text-navy uppercase italic tracking-tighter flex items-center gap-4">
                        {title}
                    </h2>
                </div>
                {viewAllLink && (
                    <Link
                        to={viewAllLink}
                        className="group self-start md:self-auto flex items-center gap-2 text-[10px] md:text-xs font-black text-navy hover:text-primary uppercase tracking-widest transition-all border-2 border-navy/5 hover:border-primary px-5 md:px-6 py-2.5 md:py-3 rounded-full shadow-sm whitespace-nowrap"
                    >
                        Khám Phá Sản Phẩm
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                )}
            </div>

            {/* Carousel Container */}
            <div className="relative group">
                {/* Navigation Buttons */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-[#EDB917] text-[#1B2631] p-3 rounded-full shadow-xl transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-[#EDB917] text-[#1B2631] p-3 rounded-full shadow-xl transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>

                {/* Products Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex-none w-[75vw] sm:w-72 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-premium transition-all group/card border border-gray-100 flex flex-col"
                        >
                            <Link to={`/product/${product.slug}`} className="block flex-1">
                                {/* Image */}
                                <div className="h-48 bg-gray-50 relative overflow-hidden flex items-center justify-center p-4">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url.startsWith('http') ? product.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${product.image_url}`}
                                            alt={product.name}
                                            className="h-full w-full object-contain group-hover/card:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <Package className="h-24 w-24 text-gray-200" />
                                    )}
                                    {product.on_sale && (
                                        <div className="absolute top-2 left-2">
                                            <span className="bg-[#E31837] text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest rounded-sm">
                                                SALE
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{product.sku}</span>
                                        {product.on_sale && product.sale_price && (
                                            <span className="text-[10px] font-black text-[#E31837] bg-red-50 px-2 py-0.5 rounded">
                                                -{Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-black text-navy group-hover/card:text-primary transition-colors mb-4 line-clamp-2 min-h-[2.5rem] text-[15px] uppercase italic tracking-tighter">
                                        {product.name}
                                    </h3>
                                    <div className="flex flex-col gap-1 mb-2">
                                        {product.on_sale && product.sale_price ? (
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl font-black text-[#E31837] tracking-tighter">
                                                    {product.sale_price.toLocaleString()} <span className="text-[10px] uppercase">VNĐ</span>
                                                </span>
                                                <span className="text-xs text-gray-400 line-through font-bold">
                                                    {product.price.toLocaleString()}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xl font-black text-navy tracking-tighter">
                                                {product.price > 0 ? (
                                                    <>{product.price.toLocaleString()} <span className="text-[10px] uppercase text-gray-400">VNĐ</span></>
                                                ) : 'LIÊN HỆ'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>

                            {/* Add to Cart Button */}
                            <div className="px-6 pb-6">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (onAddToCart) onAddToCart(product);
                                    }}
                                    className="w-full bg-navy hover:bg-navy-light text-white py-3 rounded-xl font-black text-[10px] transition-all flex items-center justify-center gap-2 transform active:scale-95 shadow-sm uppercase tracking-widest border border-white/5"
                                >
                                    <ShoppingCart className="h-4 w-4 text-primary" />
                                    Thêm vào giỏ
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductCarousel;
