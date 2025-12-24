import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Package, ShoppingCart } from 'lucide-react';

const ProductCarousel = ({ title, products = [], viewAllLink }) => {
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
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-[#1B2631] uppercase tracking-tight flex items-center gap-3">
                    <span className="h-1 w-12 bg-[#EDB917]"></span>
                    {title}
                </h2>
                {viewAllLink && (
                    <Link
                        to={viewAllLink}
                        className="text-sm font-black text-[#EDB917] hover:text-[#d4a615] uppercase tracking-widest transition-colors"
                    >
                        Xem tất cả →
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
                            className="flex-none w-64 bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all group/card"
                        >
                            <Link to={`/product/${product.slug}`} className="block">
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
                                <div className="p-4">
                                    <h3 className="font-bold text-[#1B2631] group-hover/card:text-[#EDB917] transition-colors mb-2 line-clamp-2 min-h-[3rem] text-sm">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-baseline gap-2 mb-3">
                                        {product.on_sale && product.sale_price ? (
                                            <>
                                                <span className="text-lg font-black text-[#E31837]">
                                                    {product.sale_price.toLocaleString()} VNĐ
                                                </span>
                                                <span className="text-sm text-gray-400 line-through">
                                                    {product.price.toLocaleString()} VNĐ
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-lg font-black text-[#E31837]">
                                                {product.price > 0 ? `${product.price.toLocaleString()} VNĐ` : 'LIÊN HỆ'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductCarousel;
