import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Percent, TrendingDown } from 'lucide-react';
import api from '../api/axios';

const Promotions = ({ onAddToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromotions = async () => {
            setLoading(true);
            try {
                const res = await api.get('/products/?limit=1000');
                // Filter only products on sale
                const onSaleProducts = res.data.filter(p => p.on_sale && p.sale_price);
                setProducts(onSaleProducts);
            } catch (error) {
                console.error('Error fetching promotions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPromotions();
    }, []);

    const calculateDiscount = (originalPrice, salePrice) => {
        return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#E31837] to-[#ff6b6b] text-white px-8 py-4 rounded-full shadow-2xl mb-6">
                        <Percent className="h-8 w-8 animate-pulse" />
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                            Khuyến mãi đặc biệt
                        </h1>
                        <TrendingDown className="h-8 w-8 animate-bounce" />
                    </div>
                    <p className="text-xl font-bold text-gray-700">
                        🔥 {products.length} sản phẩm đang giảm giá sốc!
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="inline-block h-12 w-12 border-4 border-[#E31837] border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600 font-bold">Đang tải khuyến mãi...</p>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => {
                            const discountPercent = calculateDiscount(product.price, product.sale_price);

                            return (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-[#E31837] overflow-hidden transition-all group hover:shadow-2xl hover:-translate-y-2 relative flex flex-col"
                                >
                                    <Link
                                        to={`/product/${product.slug}`}
                                        className="block flex-1 relative"
                                    >
                                        {/* Discount Badge */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <div className="bg-gradient-to-r from-[#E31837] to-[#ff6b6b] text-white px-4 py-2 rounded-full shadow-xl transform rotate-12 group-hover:rotate-0 transition-transform">
                                                <span className="font-black text-lg">-{discountPercent}%</span>
                                            </div>
                                        </div>

                                        {/* Sale Badge */}
                                        <div className="absolute top-3 left-3 z-10">
                                            <div className="bg-[#EDB917] text-[#1B2631] px-3 py-1 rounded-full shadow-lg">
                                                <span className="font-black text-xs uppercase">Sale</span>
                                            </div>
                                        </div>

                                        {/* Product Image */}
                                        <div className="aspect-square bg-gray-50 overflow-hidden relative">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url.startsWith('http') ? product.image_url : `http://localhost:8000${product.image_url}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="h-20 w-20 text-gray-200" />
                                                </div>
                                            )}
                                            {/* Overlay on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                                <span className="text-white font-black uppercase text-sm">Xem chi tiết →</span>
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-5">
                                            <h3 className="font-black text-[#1B2631] text-sm mb-2 line-clamp-2 group-hover:text-[#E31837] transition-colors min-h-[40px]">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs text-gray-400 font-bold mb-4">SKU: {product.sku}</p>

                                            {/* Price Section */}
                                            <div className="space-y-2">
                                                {/* Original Price */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-400 line-through font-bold">
                                                        {product.price.toLocaleString('vi-VN')}₫
                                                    </span>
                                                </div>

                                                {/* Sale Price */}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-2xl font-black text-[#E31837]">
                                                        {product.sale_price.toLocaleString('vi-VN')}₫
                                                    </span>
                                                    <div className="bg-green-100 text-green-700 px-2 py-1 rounded font-black text-xs">
                                                        Tiết kiệm {(product.price - product.sale_price).toLocaleString('vi-VN')}₫
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stock Status */}
                                            {!product.in_stock && (
                                                <div className="mt-3 text-center">
                                                    <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold text-xs">
                                                        Hết hàng
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <div className="px-5 pb-5">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (onAddToCart) onAddToCart(product);
                                            }}
                                            className="w-full bg-[#E31837] hover:bg-[#c0152f] text-white py-3 rounded-lg font-black uppercase text-xs transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform active:scale-95"
                                        >
                                            <ShoppingCart className="h-4 w-4" />
                                            Thêm ngay
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && products.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-100 rounded-full mb-6">
                            <Percent className="h-16 w-16 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-400 mb-3">Chưa có khuyến mãi</h3>
                        <p className="text-gray-500 font-bold mb-8">Hiện tại chưa có sản phẩm nào đang giảm giá</p>
                        <Link
                            to="/products"
                            className="inline-block bg-[#1B2631] hover:bg-[#2c3e50] text-white px-8 py-4 rounded-lg font-black uppercase text-sm transition-all"
                        >
                            Xem tất cả sản phẩm
                        </Link>
                    </div>
                )}

                {/* Promotion Info Banner */}
                {!loading && products.length > 0 && (
                    <div className="mt-12 bg-gradient-to-r from-[#1B2631] to-[#2c3e50] text-white rounded-2xl p-8 shadow-2xl">
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                            <div>
                                <div className="text-4xl font-black text-[#EDB917] mb-2">{products.length}</div>
                                <div className="text-sm font-bold uppercase tracking-wider">Sản phẩm khuyến mãi</div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-[#EDB917] mb-2">
                                    {Math.max(...products.map(p => calculateDiscount(p.price, p.sale_price)))}%
                                </div>
                                <div className="text-sm font-bold uppercase tracking-wider">Giảm giá tối đa</div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-[#EDB917] mb-2">24/7</div>
                                <div className="text-sm font-bold uppercase tracking-wider">Hỗ trợ mua hàng</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Promotions;
